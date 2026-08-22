import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { enrolFormSchema } from '@/lib/validators/enrol';
import { getRazorpay } from '@/lib/razorpay/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = enrolFormSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    
    const data = result.data;
    const supabase = await createServerSupabase();
    
    const { data: programmeData } = await supabase.from('programmes').select('fees_monthly').eq('id', data.programmeId).single();
    const programme = programmeData as any;
    if (!programme) return NextResponse.json({ error: 'Programme not found' }, { status: 404 });
    
    const feeAmount = programme.fees_monthly || 2500;
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: feeAmount * 100,
      currency: 'INR',
    });
    
    await (supabase as any).from('payment_orders').insert({
      razorpay_order_id: order.id,
      amount: feeAmount,
      status: 'created',
      student_phone: data.phone,
      student_name: data.name,
      student_email: data.email || null,
      programme_id: data.programmeId,
      batch_id: data.batchId,
    });
    
    return NextResponse.json({ order_id: order.id, amount: feeAmount });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
