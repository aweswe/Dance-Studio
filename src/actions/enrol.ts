'use server';
import { enrolFormSchema } from '@/lib/validators/enrol';
import { getRazorpay } from '@/lib/razorpay/client';
import { createServerSupabase } from '@/lib/supabase/server';

export async function processEnrolment(data: any) {
  const result = enrolFormSchema.safeParse(data);
  if (!result.success) throw new Error('Validation failed');
  
  const supabase = await createServerSupabase();
  const { data: programmeData } = await supabase.from('programmes').select('fees_monthly').eq('id', data.programmeId).single();
  const programme = programmeData as any;
  if (!programme) throw new Error('Programme not found');
  
  const feeAmount = programme.fees_monthly || 2500;
  const razorpay = getRazorpay();
  if (!razorpay) throw new Error('PAYMENTS_UNAVAILABLE');
  const order = await razorpay.orders.create({
    amount: feeAmount * 100,
    currency: 'INR',
  });
  
  return { orderId: order.id, amount: feeAmount };
}
