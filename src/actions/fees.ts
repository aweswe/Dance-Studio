'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';
import { formatCurrency } from '@/lib/utils/format';

export async function logOfflinePayment(studentId: string, amount: number, source: string, notes: string) {
  const supabase = await createServerSupabase();
  await (supabase as any).from('fee_payments').insert({
    student_id: studentId,
    amount,
    source: (source as any) || 'cash',
    notes,
  });
  return { success: true };
}

export async function sendFeeReminder(studentId: string) {
  const supabase = await createServerSupabase();
  const { data: studentData } = await supabase.from('students').select('phone, name, programmes(fees_monthly)').eq('id', studentId).single();
  const student = studentData as any;
  if (student && student.phone) {
    const feeAmount = student.programmes?.fees_monthly || 2500;
    await sendWhatsAppTemplate({
      phone: student.phone,
      templateName: WHATSAPP_TEMPLATES.feeReminder.name,
      variables: WHATSAPP_TEMPLATES.feeReminder.variables({
        studentName: student.name,
        amount: formatCurrency(feeAmount),
        dueDate: '5th of this month',
        paymentLink: 'https://www.rhythmzzdance.com/student/fees',
      }),
    });
  }
  return { success: true };
}

export async function bulkSendFeeReminders(studentIds: string[]) {
  for (const id of studentIds) {
    await sendFeeReminder(id);
  }
  return { success: true };
}
