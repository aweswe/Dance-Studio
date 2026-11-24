import { NextResponse } from 'next/server';
import {
  getPhonePeConfig,
  verifyPhonePeChecksum,
  parseCallbackResponse,
  verifyPhonePeV2WebhookAuth,
  checkPhonePeStatus,
} from '@/lib/phonepe/client';
import { provisionStudentFromOrder } from '@/lib/payments/fulfill-order';
import type { PhonePeV2WebhookEvent } from '@/lib/phonepe/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const config = getPhonePeConfig();

    // 1. PhonePe v2 Webhook Event ({ event: "checkout.order.completed", payload: { ... } })
    if (body && typeof body.event === 'string' && body.payload) {
      const v2Body = body as PhonePeV2WebhookEvent;
      const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');

      if (config.webhookUsername && config.webhookPassword) {
        const isValidAuth = verifyPhonePeV2WebhookAuth(
          authHeader,
          config.webhookUsername,
          config.webhookPassword
        );
        if (!isValidAuth) {
          console.error('[PhonePe v2 Webhook] Invalid Authorization SHA-256 signature');
          return NextResponse.json({ error: 'Unauthorized webhook' }, { status: 401 });
        }
      } else {
        // Fallback defense-in-depth: if webhook credentials aren't in env yet,
        // verify order status directly with PhonePe's API before trusting it.
        const verified = await checkPhonePeStatus(v2Body.payload.merchantOrderId, config);
        if (!verified.success || verified.code !== 'PAYMENT_SUCCESS') {
          console.warn('[PhonePe v2 Webhook] Unverified status check failed:', verified.code);
          return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
        }
      }

      const { merchantOrderId, state, orderId, paymentDetails } = v2Body.payload;
      const transactionId = paymentDetails?.[0]?.transactionId || orderId || null;

      if (
        (v2Body.event === 'checkout.order.completed' || state === 'COMPLETED') &&
        merchantOrderId
      ) {
        console.log(`[PhonePe v2 Webhook] Fulfilling order ${merchantOrderId} (txn: ${transactionId})`);
        await provisionStudentFromOrder({
          orderId: merchantOrderId,
          paymentId: transactionId,
          phonepeTransactionId: transactionId,
          gatewayProvider: 'phonepe',
          webhookPayload: v2Body,
        });
      } else {
        console.log(`[PhonePe v2 Webhook] Event ${v2Body.event} / state ${state} for ${merchantOrderId}`);
      }

      return NextResponse.json({ success: true });
    }

    // 2. Legacy PhonePe v1 S2S Callback ({ response: "<base64>" } + X-VERIFY header)
    const base64Response = body.response;
    const xVerify = req.headers.get('x-verify') || req.headers.get('X-VERIFY');

    if (!base64Response || !xVerify) {
      console.warn('[PhonePe Webhook] Missing payload or auth headers');
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const isValid = verifyPhonePeChecksum(base64Response, xVerify, config.saltKey, config.saltIndex);
    if (!isValid) {
      console.error('[PhonePe v1 Webhook] Invalid X-VERIFY checksum signature');
      return NextResponse.json({ error: 'Invalid checksum' }, { status: 400 });
    }

    const payload = parseCallbackResponse(base64Response);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid payload encoding' }, { status: 400 });
    }

    const { code, data } = payload;
    const { merchantTransactionId, transactionId } = data || {};

    if (code === 'PAYMENT_SUCCESS' && merchantTransactionId) {
      console.log(`[PhonePe v1 Webhook] Fulfilling order ${merchantTransactionId} with txn ${transactionId}`);
      await provisionStudentFromOrder({
        orderId: merchantTransactionId,
        paymentId: transactionId || null,
        phonepeTransactionId: transactionId || null,
        gatewayProvider: 'phonepe',
        webhookPayload: payload,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PhonePe Webhook Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
