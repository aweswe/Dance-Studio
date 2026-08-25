import { createAdminSupabase } from '@/lib/supabase/server';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';
import { SITE_URL } from '@/lib/utils/constants';

export interface FulfillOrderParams {
  razorpayOrderId: string;
  paymentId?: string | null;
  /** Full Razorpay event payload — stored on the order once processed. */
  webhookPayload?: unknown;
}

export interface FulfillOrderResult {
  fulfilled: boolean;
  /** True when the order was already provisioned by an earlier call. */
  alreadyProcessed?: boolean;
  reason?: 'ORDER_NOT_FOUND';
}

/**
 * Provision a student from a paid payment order: create the auth user +
 * student row (if missing), record the fee payment, increment the batch
 * counter and send the WhatsApp welcome.
 *
 * Idempotent via `payment_orders.status` — the first caller marks the order
 * `webhook_processed`, later calls (webhook after verify, or vice versa)
 * return `alreadyProcessed` without duplicating anything.
 */
export async function provisionStudentFromOrder(
  params: FulfillOrderParams,
): Promise<FulfillOrderResult> {
  const { razorpayOrderId, paymentId = null, webhookPayload = null } = params;
  const supabase = createAdminSupabase();

  const { data: orderData } = await supabase
    .from('payment_orders')
    .select('*')
    .eq('razorpay_order_id', razorpayOrderId)
    .single();

  const order = orderData as any;
  if (!order) return { fulfilled: false, reason: 'ORDER_NOT_FOUND' };
  if (order.status === 'webhook_processed') return { fulfilled: true, alreadyProcessed: true };

  // Check if student exists — portal flow links via student_id, enrol flow
  // matches on phone + programme.
  let student: any = null;
  if (order.student_id) {
    const { data } = await supabase.from('students').select('*').eq('id', order.student_id).single();
    student = data as any;
  } else {
    const { data } = await supabase
      .from('students')
      .select('*')
      .eq('phone', order.student_phone)
      .eq('programme_id', order.programme_id)
      .single();
    student = data as any;
  }

  if (!student) {
    // Create auth user if needed
    let authUserId: string | null = null;
    try {
      const { data: authUser } = await supabase.auth.admin.createUser({
        phone: order.student_phone ? `+91${order.student_phone.replace(/\D/g, '')}` : undefined,
        email: order.student_email || undefined,
        phone_confirm: true,
      });
      authUserId = authUser?.user?.id ?? null;
    } catch {
      // User may already exist in Auth
    }

    if (authUserId) {
      await (supabase as any).from('users').upsert({
        id: authUserId,
        role: 'student',
      });
    }

    const { data: newStudent } = await (supabase as any).from('students').insert({
      auth_id: authUserId,
      name: order.student_name || 'New Student',
      phone: order.student_phone,
      email: order.student_email || null,
      programme_id: order.programme_id,
      batch_id: order.batch_id,
      status: 'active',
    }).select().single();

    student = newStudent as any;

    // Increment batch
    if (order.batch_id) {
      await (supabase as any).rpc('increment_batch_enrollment', { p_batch_id: order.batch_id });
    }
  }

  if (student) {
    await (supabase as any).from('fee_payments').insert({
      student_id: student.id,
      amount: order.amount,
      source: 'razorpay',
      razorpay_payment_id: paymentId,
      payment_order_id: order.id,
      // The ledger keys off for_month — this payment covers the current month.
      for_month: new Date().toISOString().slice(0, 7) + '-01',
    });

    // Look up programme name for WhatsApp
    const { data: progData } = await supabase.from('programmes').select('name').eq('id', order.programme_id).single();
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
    }
  }

  await (supabase as any).from('payment_orders').update({
    status: 'webhook_processed',
    webhook_payload: webhookPayload,
  }).eq('razorpay_order_id', razorpayOrderId);

  return { fulfilled: true };
}
