'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { logOfflinePaymentSchema } from '@/lib/validators/fees';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';
import { formatCurrency } from '@/lib/utils/format';
import { SITE_URL } from '@/lib/utils/constants';
import { revalidatePath } from 'next/cache';

export async function logOfflinePayment(
  studentId: string,
  amount: number,
  source: string,
  notes: string,
  forMonth?: string,
) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const parsed = logOfflinePaymentSchema.safeParse({ studentId, amount, source, notes, forMonth });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid payment' };
  }

  // "YYYY-MM" → first of that month; default to the current month.
  const for_month = parsed.data.forMonth
    ? `${parsed.data.forMonth}-01`
    : new Date().toISOString().slice(0, 7) + '-01';

  const { data: inserted, error } = await supabase
    .from('fee_payments')
    .insert({
      student_id: parsed.data.studentId,
      amount: parsed.data.amount,
      source: parsed.data.source,
      notes: parsed.data.notes || null,
      for_month,
    })
    .select('id')
    .single();
  if (error) return { success: false, error: error.message };

  // Every payment gets a printable receipt — point offline receipts at it too.
  if (inserted) {
    await supabase
      .from('fee_payments')
      .update({ receipt_url: `${SITE_URL}/receipt/${inserted.id}` })
      .eq('id', inserted.id);
  }

  revalidatePath('/admin/fees');
  return { success: true };
}

export async function sendFeeReminder(studentId: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const { data: studentData, error } = await supabase
    .from('students')
    .select('name, phone, programme:programmes(fees_monthly)')
    .eq('id', studentId)
    .single();
  if (error) return { success: false, error: error.message };

  const student = studentData as any;
  if (!student || !student.phone) {
    return { success: false, error: 'Student has no phone number' };
  }

  const feeAmount = student.programme?.fees_monthly || 2500;
  const whatsapp = await sendWhatsAppTemplate({
    phone: student.phone,
    templateName: WHATSAPP_TEMPLATES.feeReminder.name,
    variables: WHATSAPP_TEMPLATES.feeReminder.variables({
      studentName: student.name,
      amount: formatCurrency(feeAmount),
      dueDate: '5th of this month',
      paymentLink: `${SITE_URL}/student/fees`,
    }),
  });

  revalidatePath('/admin/fees');
  return { success: true, whatsapp };
}

export async function bulkSendFeeReminders(studentIds: string[]) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  let sent = 0;
  let failed = 0;
  for (const id of studentIds) {
    const res = await sendFeeReminder(id);
    if (res.success) sent++;
    else failed++;
  }
  return { success: true, sent, failed };
}
