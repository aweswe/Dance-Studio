import { createAdminSupabase } from '@/lib/supabase/server';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';
import { SITE_URL } from '@/lib/utils/constants';
import { coverageMonths } from '@/lib/fees/ledger';

export interface FulfillOrderParams {
  razorpayOrderId: string;
  paymentId?: string | null;
  webhookPayload?: unknown;
}

export interface FulfillOrderResult {
  fulfilled: boolean;
  alreadyProcessed?: boolean;
  reason?: 'ORDER_NOT_FOUND';
}

function digitsPhone(value: string | null | undefined): string {
  return (value || '').replace(/\D/g, '').slice(-10);
}

/**
 * Claim the order first (status → webhook_processed), then provision.
 * Concurrent verify + webhook cannot double-insert fees.
 */
export async function provisionStudentFromOrder(
  params: FulfillOrderParams,
): Promise<FulfillOrderResult> {
  const { razorpayOrderId, paymentId = null, webhookPayload = null } = params;
  const supabase = createAdminSupabase();

  const { data: claimed } = await (supabase as any)
    .from('payment_orders')
    .update({
      status: 'webhook_processed',
      webhook_payload: webhookPayload,
    })
    .eq('razorpay_order_id', razorpayOrderId)
    .neq('status', 'webhook_processed')
    .select('*')
    .maybeSingle();

  if (!claimed) {
    const { data: existing } = await supabase
      .from('payment_orders')
      .select('status')
      .eq('razorpay_order_id', razorpayOrderId)
      .maybeSingle();
    if ((existing as any)?.status === 'webhook_processed') {
      return { fulfilled: true, alreadyProcessed: true };
    }
    return { fulfilled: false, reason: 'ORDER_NOT_FOUND' };
  }

  const order = claimed as any;
  const plan: 'monthly' | 'quarterly' = order.plan === 'quarterly' ? 'quarterly' : 'monthly';
  const months = coverageMonths(plan);

  let student: any = null;
  if (order.student_id) {
    const { data } = await supabase.from('students').select('*').eq('id', order.student_id).maybeSingle();
    student = data;
  } else {
    const phone = digitsPhone(order.student_phone);
    const orParts = [
      order.programme_id && phone ? `and(phone.eq.${phone},programme_id.eq.${order.programme_id})` : null,
      phone ? `phone.eq.${phone}` : null,
      order.student_email ? `email.ilike.${order.student_email}` : null,
    ].filter(Boolean);
    if (orParts.length) {
      const { data } = await supabase
        .from('students')
        .select('*')
        .or(orParts.join(','))
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      student = data;
    }
  }

  if (student && (order.programme_id || order.batch_id)) {
    await (supabase as any).from('students').update({
      programme_id: order.programme_id || student.programme_id,
      batch_id: order.batch_id || student.batch_id,
      status: 'active',
    }).eq('id', student.id);
  }

  if (!student) {
    let authUserId: string | null = null;
    const e164 = order.student_phone ? `+91${digitsPhone(order.student_phone)}` : undefined;
    try {
      const { data: authUser, error } = await supabase.auth.admin.createUser({
        phone: e164,
        email: order.student_email || undefined,
        phone_confirm: Boolean(e164),
        email_confirm: Boolean(order.student_email),
      });
      if (!error) authUserId = authUser?.user?.id ?? null;
    } catch {
      // already registered — try lookup by phone
    }

    if (!authUserId && e164) {
      const { data: existing } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
      const found = existing?.users?.find((u) => u.phone === e164 || u.email === order.student_email);
      authUserId = found?.id ?? null;
    }

    if (authUserId) {
      await (supabase as any).from('users').upsert({ id: authUserId, role: 'student' });
    }

    const { data: newStudent } = await (supabase as any).from('students').insert({
      auth_id: authUserId,
      name: order.student_name || 'New Student',
      phone: digitsPhone(order.student_phone) || order.student_phone,
      email: order.student_email || null,
      programme_id: order.programme_id,
      batch_id: order.batch_id,
      status: 'active',
    }).select().single();

    student = newStudent;
  }

  if (student) {
    const perMonth = Math.round(Number(order.amount) / months.length);
    for (const for_month of months) {
      const { error: feeErr } = await (supabase as any).from('fee_payments').insert({
        student_id: student.id,
        amount: perMonth,
        source: 'razorpay',
        razorpay_payment_id: paymentId,
        payment_order_id: order.id,
        for_month,
        status: 'confirmed',
      });
      if (feeErr && feeErr.code !== '23505') {
        console.error('fee insert failed', feeErr);
      }
    }

    const { data: progData } = await supabase.from('programmes').select('name').eq('id', order.programme_id).maybeSingle();
    const progName = (progData as any)?.name || 'Dance Class';
    const waPhone = order.student_phone || student.phone;
    if (waPhone) {
      await sendWhatsAppTemplate({
        phone: waPhone,
        templateName: WHATSAPP_TEMPLATES.welcome.name,
        variables: WHATSAPP_TEMPLATES.welcome.variables({
          studentName: order.student_name || student.name || 'Student',
          programmeName: progName,
          loginUrl: `${SITE_URL}/login`,
        }),
      });
      if (paymentId) {
        await sendWhatsAppTemplate({
          phone: waPhone,
          templateName: WHATSAPP_TEMPLATES.paymentReceipt.name,
          variables: WHATSAPP_TEMPLATES.paymentReceipt.variables({
            studentName: order.student_name || student.name || 'Student',
            amount: String(order.amount),
            date: new Date().toLocaleDateString('en-IN'),
            transactionId: paymentId,
          }),
        });
      }
    }
  }

  return { fulfilled: true };
}
