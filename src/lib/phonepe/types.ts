/**
 * Type definitions for PhonePe Standard Checkout Payment Gateway (v2 OAuth + legacy v1)
 */

export interface PhonePeConfig {
  // Mode & Base
  env: 'production' | 'sandbox';
  isSandbox: boolean;
  baseUrl: string;
  merchantId: string;

  // v2 OAuth Credentials (Preferred — PhonePe PG v2)
  clientId?: string;
  clientSecret?: string;
  clientVersion?: string;
  webhookUsername?: string;
  webhookPassword?: string;

  // v1 Salt Credentials (Legacy fallback)
  saltKey: string;
  saltIndex: string;
  hostUrl: string;
}

export interface BuildPayPayloadParams {
  merchantTransactionId: string;
  merchantUserId: string;
  amountInRupees: number;
  redirectUrl: string;
  callbackUrl: string;
  mobileNumber?: string;
  message?: string;
}

// ─── PhonePe v2 API Types ──────────────────────────────────────────────────

export interface PhonePeV2TokenResponse {
  access_token: string;
  encrypted_access_token?: string;
  expires_in?: number;
  issued_at?: number;
  expires_at: number; // epoch seconds
  token_type: string; // 'O-Bearer'
}

export interface PhonePeV2PayRequest {
  merchantOrderId: string;
  amount: number; // in paise
  expireAfter?: number;
  paymentFlow: {
    type: 'PG_CHECKOUT';
    message?: string;
    merchantUrls: {
      redirectUrl: string;
    };
  };
  metaInfo?: Record<string, string>;
}

export interface PhonePeV2PayResponse {
  orderId?: string;
  state?: 'PENDING' | 'COMPLETED' | 'FAILED' | string;
  expireAt?: number;
  redirectUrl?: string;
  code?: string;
  message?: string;
}

export interface PhonePeV2PaymentDetail {
  paymentMode?: string;
  transactionId?: string;
  timestamp?: number;
  amount?: number;
  state?: 'COMPLETED' | 'FAILED' | 'PENDING' | string;
}

export interface PhonePeV2OrderStatusResponse {
  orderId?: string;
  state?: 'COMPLETED' | 'FAILED' | 'PENDING' | string;
  amount?: number;
  expireAt?: number;
  paymentDetails?: PhonePeV2PaymentDetail[];
  code?: string;
  message?: string;
}

export interface PhonePeV2WebhookEvent {
  event: 'checkout.order.completed' | 'checkout.order.failed' | string;
  payload: {
    merchantId?: string;
    orderId?: string;
    merchantOrderId: string;
    state: 'COMPLETED' | 'FAILED' | 'PENDING' | string;
    amount: number;
    expireAt?: number;
    paymentDetails?: PhonePeV2PaymentDetail[];
    metaInfo?: Record<string, string>;
  };
}

// ─── PhonePe v1 Legacy Types ───────────────────────────────────────────────

export interface PhonePePayRequest {
  merchantId: string;
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number; // in paise
  redirectUrl: string;
  redirectMode: 'POST' | 'REDIRECT';
  callbackUrl: string;
  mobileNumber?: string;
  paymentInstrument: {
    type: 'PAY_PAGE';
  };
}

export interface PhonePePayResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId: string;
    merchantTransactionId: string;
    instrumentResponse: {
      type: string;
      redirectInfo?: {
        url: string;
        method: string;
      };
    };
  };
}

export interface PhonePeCallbackData {
  merchantId: string;
  merchantTransactionId: string;
  transactionId: string;
  amount: number;
  state: 'COMPLETED' | 'FAILED' | 'PENDING';
  responseCode: string;
  paymentInstrument?: Record<string, unknown>;
}

export interface PhonePeCallbackResponse {
  success: boolean;
  code: 'PAYMENT_SUCCESS' | 'PAYMENT_ERROR' | 'PAYMENT_PENDING' | 'PAYMENT_DECLINED' | string;
  message: string;
  data: PhonePeCallbackData;
}

export interface PhonePeStatusResponse {
  success: boolean;
  code: 'PAYMENT_SUCCESS' | 'PAYMENT_ERROR' | 'PAYMENT_PENDING' | 'PAYMENT_DECLINED' | string;
  message: string;
  data?: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: 'COMPLETED' | 'FAILED' | 'PENDING';
    responseCode: string;
    paymentInstrument?: Record<string, unknown>;
  };
}
