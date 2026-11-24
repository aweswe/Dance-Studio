import { NextResponse } from 'next/server';
import { checkPhonePeStatus, getPhonePeConfig } from '@/lib/phonepe/client';
import { provisionStudentFromOrder } from '@/lib/payments/fulfill-order';

export const dynamic = 'force-dynamic';

async function handleRedirect(req: Request) {
  const config = getPhonePeConfig();
  const activeBaseUrl = (() => {
    if (process.env.NODE_ENV === 'development') {
      try {
        return new URL(req.url).origin;
      } catch {
        return config.baseUrl;
      }
    }
    return config.baseUrl;
  })();

  try {
    const url = new URL(req.url);
    let merchantTransactionId = url.searchParams.get('id');
    const nextParam = url.searchParams.get('next');
    const safeNext =
      nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
        ? nextParam
        : null;

    // PhonePe POST redirect may include form data or json
    if (!merchantTransactionId && req.method === 'POST') {
      try {
        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/x-www-form-urlencoded')) {
          const formData = await req.formData();
          merchantTransactionId =
            formData.get('transactionId')?.toString() ||
            formData.get('merchantTransactionId')?.toString() ||
            null;
        } else if (contentType.includes('application/json')) {
          const body = await req.json().catch(() => ({}));
          merchantTransactionId = body?.transactionId || body?.merchantTransactionId || null;
        }
      } catch {
        // Fallback to query param
      }
    }

    if (!merchantTransactionId) {
      console.warn('[PhonePe Redirect] Missing merchantTransactionId');
      return NextResponse.redirect(`${activeBaseUrl}${safeNext || '/enrol'}?payment_error=missing_transaction`, {
        status: 303,
      });
    }

    // Verify official status directly from PhonePe's Order Status API
    const statusResult = await checkPhonePeStatus(merchantTransactionId, config);

    if (statusResult.success && statusResult.code === 'PAYMENT_SUCCESS') {
      const transactionId = statusResult.data?.transactionId || null;

      // Fulfill order immediately so student gets instant access
      await provisionStudentFromOrder({
        orderId: merchantTransactionId,
        paymentId: transactionId,
        phonepeTransactionId: transactionId,
        gatewayProvider: 'phonepe',
        webhookPayload: statusResult,
      });

      if (safeNext) {
        const sep = safeNext.includes('?') ? '&' : '?';
        return NextResponse.redirect(
          `${activeBaseUrl}${safeNext}${sep}payment=success&txId=${encodeURIComponent(merchantTransactionId)}`,
          { status: 303 }
        );
      }

      return NextResponse.redirect(
        `${activeBaseUrl}/enrol/success?txId=${encodeURIComponent(merchantTransactionId)}&method=phonepe`,
        { status: 303 }
      );
    }

    console.warn(`[PhonePe Redirect] Payment verification code: ${statusResult.code}`);
    const failTarget = safeNext || '/enrol';
    const sep = failTarget.includes('?') ? '&' : '?';
    return NextResponse.redirect(
      `${activeBaseUrl}${failTarget}${sep}payment_error=${encodeURIComponent(statusResult.code || 'failed')}&txId=${encodeURIComponent(merchantTransactionId)}`,
      { status: 303 }
    );
  } catch (err) {
    console.error('[PhonePe Redirect Error]', err);
    return NextResponse.redirect(`${activeBaseUrl}/enrol?payment_error=system_error`, { status: 303 });
  }
}

export async function POST(req: Request) {
  return handleRedirect(req);
}

export async function GET(req: Request) {
  return handleRedirect(req);
}
