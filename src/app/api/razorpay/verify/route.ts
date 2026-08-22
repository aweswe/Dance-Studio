import { NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay/verify';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    const supabase = await createServerSupabase();
    const { error } = await (supabase as any)
      .from('payment_orders')
      .update({ status: 'paid' })
      .eq('razorpay_order_id', razorpay_order_id);
      
    if (error) {
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
