import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay/verify';
import { provisionStudentFromOrder } from '@/lib/payments/fulfill-order';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.event === 'payment.captured' || payload.event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id || payload.payload?.order?.entity?.id;

      if (!orderId) {
        return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
      }

      await provisionStudentFromOrder({
        razorpayOrderId: orderId,
        paymentId: paymentEntity?.id || null,
        webhookPayload: payload,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Razorpay Webhook Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
