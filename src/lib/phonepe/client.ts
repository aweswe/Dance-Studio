import crypto from 'crypto';
import {
  PhonePeConfig,
  BuildPayPayloadParams,
  PhonePePayRequest,
  PhonePePayResponse,
  PhonePeCallbackResponse,
  PhonePeStatusResponse,
  PhonePeV2TokenResponse,
  PhonePeV2PayRequest,
  PhonePeV2PayResponse,
  PhonePeV2OrderStatusResponse,
} from './types';

/**
 * Standard PhonePe v1 UAT / Sandbox fallback credentials.
 * Used when neither v2 OAuth credentials nor custom v1 keys are supplied.
 */
export const PHONEPE_SANDBOX_DEFAULTS = {
  merchantId: 'PGTESTPAYUAT86',
  saltKey: '96434309-7796-489d-8924-ab56988a6076',
  saltIndex: '1',
  hostUrl: 'https://api-preprod.phonepe.com/apis/pg-sandbox',
};

// In-memory cache for PhonePe v2 OAuth access tokens (per environment + clientId)
const tokenCache = new Map<string, { token: string; expiresAtMs: number }>();

/**
 * Retrieve active PhonePe configuration from environment or fallback to sandbox.
 */
export function getPhonePeConfig(): PhonePeConfig {
  const clientId = process.env.PHONEPE_CLIENT_ID?.trim() || undefined;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET?.trim() || undefined;
  const clientVersion = process.env.PHONEPE_CLIENT_VERSION?.trim() || '1';
  const webhookUsername = process.env.PHONEPE_WEBHOOK_USERNAME?.trim() || undefined;
  const webhookPassword = process.env.PHONEPE_WEBHOOK_PASSWORD?.trim() || undefined;

  const merchantId = process.env.PHONEPE_MERCHANT_ID?.trim() || PHONEPE_SANDBOX_DEFAULTS.merchantId;
  const saltKey = process.env.PHONEPE_SALT_KEY?.trim() || PHONEPE_SANDBOX_DEFAULTS.saltKey;
  const saltIndex = process.env.PHONEPE_SALT_INDEX?.trim() || PHONEPE_SANDBOX_DEFAULTS.saltIndex;

  // Determine environment ('production' vs 'sandbox')
  const explicitEnv = process.env.PHONEPE_ENV?.trim().toLowerCase();
  let env: 'production' | 'sandbox';
  if (explicitEnv === 'production' || explicitEnv === 'prod') {
    env = 'production';
  } else if (explicitEnv === 'sandbox' || explicitEnv === 'uat' || explicitEnv === 'test') {
    env = 'sandbox';
  } else if (clientId && !clientId.toUpperCase().includes('TEST') && !clientId.toUpperCase().includes('UAT')) {
    env = 'production';
  } else if (!clientId && !merchantId.includes('TEST') && !merchantId.includes('UAT')) {
    env = 'production';
  } else {
    env = 'sandbox';
  }

  const hostUrl = (
    process.env.PHONEPE_HOST_URL ||
    (env === 'sandbox'
      ? PHONEPE_SANDBOX_DEFAULTS.hostUrl
      : 'https://api.phonepe.com/apis/pg')
  ).replace(/\/+$/, '');

  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:4000')
  ).replace(/\/+$/, '');

  const isSandbox = env === 'sandbox';

  return {
    env,
    isSandbox,
    baseUrl,
    merchantId,
    clientId,
    clientSecret,
    clientVersion,
    webhookUsername,
    webhookPassword,
    saltKey,
    saltIndex,
    hostUrl,
  };
}

/**
 * Returns true if PhonePe PG v2 OAuth credentials are configured.
 */
export function usesV2OAuth(config: PhonePeConfig): boolean {
  return Boolean(config.clientId && config.clientSecret);
}

/**
 * Return official PhonePe PG v2 endpoints for the selected environment.
 */
export function getPhonePeV2Endpoints(env: 'production' | 'sandbox') {
  if (env === 'production') {
    return {
      tokenUrl: 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token',
      payUrl: 'https://api.phonepe.com/apis/pg/checkout/v2/pay',
      statusUrl: (merchantOrderId: string) =>
        `https://api.phonepe.com/apis/pg/checkout/v2/order/${encodeURIComponent(merchantOrderId)}/status?details=false`,
    };
  }
  return {
    tokenUrl: 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
    payUrl: 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay',
    statusUrl: (merchantOrderId: string) =>
      `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${encodeURIComponent(merchantOrderId)}/status?details=false`,
  };
}

/**
 * Fetch and cache an OAuth Bearer access token for PhonePe PG v2.
 */
export async function getPhonePeOAuthToken(config: PhonePeConfig): Promise<string> {
  if (!config.clientId || !config.clientSecret) {
    throw new Error('PhonePe v2 Client ID and Client Secret are required.');
  }

  const cacheKey = `${config.env}:${config.clientId}`;
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiresAtMs - 60_000 > Date.now()) {
    return cached.token;
  }

  const { tokenUrl } = getPhonePeV2Endpoints(config.env);
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    client_version: config.clientVersion || '1',
    grant_type: 'client_credentials',
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
    },
    body: body.toString(),
  });

  const data = (await res.json()) as PhonePeV2TokenResponse & { message?: string; code?: string };

  if (!res.ok || !data.access_token) {
    throw new Error(data.message || `PhonePe OAuth failed (${res.status})`);
  }

  const expiresAtMs = data.expires_at
    ? data.expires_at * 1000
    : Date.now() + (data.expires_in ? data.expires_in * 1000 : 3000 * 1000);

  tokenCache.set(cacheKey, { token: data.access_token, expiresAtMs });
  return data.access_token;
}

/**
 * Build request body for PhonePe PG v2 Standard Checkout (/checkout/v2/pay)
 */
export function buildV2PayPayload(params: BuildPayPayloadParams): PhonePeV2PayRequest {
  const amountInPaise = Math.round(Number(params.amountInRupees) * 100);
  return {
    merchantOrderId: params.merchantTransactionId,
    amount: amountInPaise,
    expireAfter: 1200, // 20 minutes
    paymentFlow: {
      type: 'PG_CHECKOUT',
      message: params.message || 'Dance Class Fee — Rhythmzz Academy',
      merchantUrls: {
        redirectUrl: params.redirectUrl,
      },
    },
    metaInfo: {
      udf1: params.merchantUserId,
    },
  };
}

/**
 * Verify PhonePe v2 Webhook SHA-256 Authorization header:
 * PhonePe computes SHA256(username:password) and sends it in the Authorization header.
 */
export function verifyPhonePeV2WebhookAuth(
  authHeader: string | null | undefined,
  username: string | undefined,
  password: string | undefined
): boolean {
  if (!authHeader || !username || !password) return false;

  const incoming = authHeader.replace(/^sha256\s+/i, '').trim().toLowerCase();
  const expected = crypto
    .createHash('sha256')
    .update(`${username}:${password}`)
    .digest('hex')
    .toLowerCase();

  try {
    return crypto.timingSafeEqual(
      Buffer.from(incoming, 'utf8'),
      Buffer.from(expected, 'utf8')
    );
  } catch {
    return false;
  }
}

/**
 * Check if PhonePe payments are active / configured.
 */
export function isPhonePeConfigured(): boolean {
  return Boolean(
    process.env.PHONEPE_CLIENT_ID ||
    process.env.PHONEPE_MERCHANT_ID ||
    process.env.NEXT_PUBLIC_PAYMENT_GATEWAY === 'phonepe'
  );
}

// ─── Legacy v1 Crypto Helpers (preserved for v1 sandbox / fallback) ──────────

export function generatePhonePeChecksum(
  payloadBase64: string,
  endpoint: string,
  saltKey: string,
  saltIndex: string
): string {
  const stringToHash = `${payloadBase64}${endpoint}${saltKey}`;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${sha256}###${saltIndex}`;
}

export function verifyPhonePeChecksum(
  responseBase64: string,
  xVerifyHeader: string,
  saltKey: string,
  saltIndex: string
): boolean {
  if (!responseBase64 || !xVerifyHeader) return false;
  const stringToHash = `${responseBase64}${saltKey}`;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  const expectedChecksum = `${sha256}###${saltIndex}`;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedChecksum, 'utf8'),
      Buffer.from(xVerifyHeader, 'utf8')
    );
  } catch {
    return false;
  }
}

export function generateStatusChecksum(
  endpointWithParams: string,
  saltKey: string,
  saltIndex: string
): string {
  const stringToHash = `${endpointWithParams}${saltKey}`;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${sha256}###${saltIndex}`;
}

export function buildPayPayload(
  params: BuildPayPayloadParams,
  config?: PhonePeConfig
) {
  const cfg = config || getPhonePeConfig();
  const amountInPaise = Math.round(Number(params.amountInRupees) * 100);

  const payload: PhonePePayRequest = {
    merchantId: cfg.merchantId,
    merchantTransactionId: params.merchantTransactionId,
    merchantUserId: params.merchantUserId,
    amount: amountInPaise,
    redirectUrl: params.redirectUrl,
    redirectMode: 'POST',
    callbackUrl: params.callbackUrl,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  };

  if (params.mobileNumber) {
    const cleanPhone = params.mobileNumber.replace(/\D/g, '').slice(-10);
    if (cleanPhone) {
      payload.mobileNumber = cleanPhone;
    }
  }

  const jsonStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonStr, 'utf8').toString('base64');
  const checksum = generatePhonePeChecksum(base64Payload, '/pg/v1/pay', cfg.saltKey, cfg.saltIndex);

  return {
    payload,
    base64Payload,
    checksum,
    requestBody: { request: base64Payload },
  };
}

export function parseCallbackResponse(base64Response: string): PhonePeCallbackResponse | null {
  try {
    const jsonStr = Buffer.from(base64Response, 'base64').toString('utf8');
    return JSON.parse(jsonStr) as PhonePeCallbackResponse;
  } catch {
    return null;
  }
}

// ─── Unified Payment Initiation (v2 OAuth first, v1 fallback) ───────────────

export async function initiatePhonePePay(
  params: BuildPayPayloadParams,
  config?: PhonePeConfig
): Promise<{ success: boolean; redirectUrl?: string; orderId?: string; error?: string; raw?: unknown }> {
  const cfg = config || getPhonePeConfig();

  // Preferred: PhonePe PG v2 OAuth flow
  if (usesV2OAuth(cfg)) {
    try {
      const token = await getPhonePeOAuthToken(cfg);
      const { payUrl } = getPhonePeV2Endpoints(cfg.env);
      const v2Body = buildV2PayPayload(params);

      const res = await fetch(payUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `O-Bearer ${token}`,
          accept: 'application/json',
        },
        body: JSON.stringify(v2Body),
      });

      const data = (await res.json()) as PhonePeV2PayResponse;

      if (res.ok && data.redirectUrl) {
        return {
          success: true,
          redirectUrl: data.redirectUrl,
          orderId: data.orderId,
          raw: data,
        };
      }

      return {
        success: false,
        error: data.message || `PhonePe v2 initiation failed (${res.status}: ${data.code || 'ERROR'})`,
        raw: data,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network error reaching PhonePe v2 Gateway',
      };
    }
  }

  // Fallback: PhonePe PG v1 X-VERIFY flow (used by default UAT sandbox)
  const { base64Payload, checksum } = buildPayPayload(params, cfg);
  const url = `${cfg.hostUrl}/pg/v1/pay`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        accept: 'application/json',
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const data = (await res.json()) as PhonePePayResponse;

    if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
      return {
        success: true,
        redirectUrl: data.data.instrumentResponse.redirectInfo.url,
        raw: data,
      };
    }

    return {
      success: false,
      error: data.message || `PhonePe payment initiation failed with code ${data.code}`,
      raw: data,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error reaching PhonePe Gateway',
    };
  }
}

// ─── Unified Status Verification (v2 OAuth first, v1 fallback) ──────────────

export async function checkPhonePeStatus(
  merchantTransactionId: string,
  config?: PhonePeConfig
): Promise<PhonePeStatusResponse> {
  const cfg = config || getPhonePeConfig();

  // Preferred: PhonePe PG v2 OAuth Status Check
  if (usesV2OAuth(cfg)) {
    try {
      const token = await getPhonePeOAuthToken(cfg);
      const { statusUrl } = getPhonePeV2Endpoints(cfg.env);

      const res = await fetch(statusUrl(merchantTransactionId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `O-Bearer ${token}`,
          accept: 'application/json',
        },
      });

      const data = (await res.json()) as PhonePeV2OrderStatusResponse;

      if (res.ok && data.state === 'COMPLETED') {
        const txnId = data.paymentDetails?.[0]?.transactionId || data.orderId || merchantTransactionId;
        return {
          success: true,
          code: 'PAYMENT_SUCCESS',
          message: 'Payment completed',
          data: {
            merchantId: cfg.merchantId,
            merchantTransactionId,
            transactionId: txnId,
            amount: data.amount || 0,
            state: 'COMPLETED',
            responseCode: 'SUCCESS',
            paymentInstrument: data.paymentDetails?.[0] as unknown as Record<string, unknown>,
          },
        };
      }

      const mappedCode =
        data.state === 'PENDING'
          ? 'PAYMENT_PENDING'
          : data.state === 'FAILED'
          ? 'PAYMENT_ERROR'
          : data.code || 'PAYMENT_ERROR';

      return {
        success: false,
        code: mappedCode,
        message: data.message || `Order state: ${data.state || 'UNKNOWN'}`,
      };
    } catch (err) {
      return {
        success: false,
        code: 'PAYMENT_ERROR',
        message: err instanceof Error ? err.message : 'Failed to query PhonePe v2 Status',
      };
    }
  }

  // Fallback: PhonePe PG v1 Status Check
  const endpoint = `/pg/v1/status/${cfg.merchantId}/${merchantTransactionId}`;
  const checksum = generateStatusChecksum(endpoint, cfg.saltKey, cfg.saltIndex);
  const url = `${cfg.hostUrl}${endpoint}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': cfg.merchantId,
        accept: 'application/json',
      },
    });

    const data = (await res.json()) as PhonePeStatusResponse;
    return data;
  } catch (err) {
    return {
      success: false,
      code: 'PAYMENT_ERROR',
      message: err instanceof Error ? err.message : 'Failed to query PhonePe Status',
    };
  }
}
