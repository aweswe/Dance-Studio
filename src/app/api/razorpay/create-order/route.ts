import { NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay/client';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { programmeId, batchId, name, phone, email } = body;

    const razorpay = getRazorpay();
    if (!razorpay) {
      return NextResponse.json(
        { error: 'PAYMENTS_UNAVAILABLE', message: 'Online payments are not configured yet. Please book via WhatsApp.' },
        { status: 503 },
      );
    }

    const supabase = await createServerSupabase();

    // Look up programme fees
    const { data: programmeData, error: progError } = await supabase
      .from('programmes')
      .select('fees_monthly')
      .eq('id', programmeId)
      .single();

    const programme = programmeData as any;
    if (progError || !programme) {
      return NextResponse.json({ error: 'Programme not found' }, { status: 404 });
    }

    const feeAmount = programme.fees_monthly || 2500;
    const order = await razorpay.orders.create({
      amount: feeAmount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // Store in payment_orders
    const { error: insertError } = await (supabase as any)
      .from('payment_orders')
      .insert({
        razorpay_order_id: order.id,
        amount: feeAmount,
        status: 'created',
        student_phone: phone,
        student_name: name,
        student_email: email,
        programme_id: programmeId,
        batch_id: batchId,
      });

    if (insertError) {
      return NextResponse.json({ error: 'Failed to create order record' }, { status: 500 });
    }

    return NextResponse.json({ order_id: order.id, amount: feeAmount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
