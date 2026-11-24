import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import {
  generatePhonePeChecksum,
  verifyPhonePeChecksum,
  generateStatusChecksum,
  buildPayPayload,
  parseCallbackResponse,
  getPhonePeConfig,
  usesV2OAuth,
  getPhonePeV2Endpoints,
  buildV2PayPayload,
  verifyPhonePeV2WebhookAuth,
} from './client';
import type { PhonePeConfig } from './types';

describe('PhonePe Core Client & Crypto (TDD — v1 & v2)', () => {
  const mockSaltKey = '96434309-7796-489d-8924-ab56988a6076';
  const mockSaltIndex = '1';
  const mockMerchantId = 'PGTESTPAYUAT86';

  const mockV1SandboxConfig: PhonePeConfig = {
    env: 'sandbox',
    isSandbox: true,
    baseUrl: 'https://rhythmzz.in',
    merchantId: mockMerchantId,
    saltKey: mockSaltKey,
    saltIndex: mockSaltIndex,
    hostUrl: 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  };

  describe('PhonePe v2 OAuth & Webhook Verification', () => {
    it('detects v2 mode when clientId and clientSecret are provided', () => {
      const v2Config: PhonePeConfig = {
        ...mockV1SandboxConfig,
        env: 'production',
        isSandbox: false,
        clientId: 'SU2611121322531448209199',
        clientSecret: 'test-secret',
        clientVersion: '1',
      };
      expect(usesV2OAuth(v2Config)).toBe(true);
      expect(usesV2OAuth(mockV1SandboxConfig)).toBe(false);
    });

    it('returns correct production and sandbox v2 endpoints', () => {
      const prod = getPhonePeV2Endpoints('production');
      expect(prod.tokenUrl).toBe('https://api.phonepe.com/apis/identity-manager/v1/oauth/token');
      expect(prod.payUrl).toBe('https://api.phonepe.com/apis/pg/checkout/v2/pay');
      expect(prod.statusUrl('ORD_123')).toBe('https://api.phonepe.com/apis/pg/checkout/v2/order/ORD_123/status?details=false');

      const uat = getPhonePeV2Endpoints('sandbox');
      expect(uat.tokenUrl).toBe('https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token');
      expect(uat.payUrl).toBe('https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay');
      expect(uat.statusUrl('ORD_123')).toBe('https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/ORD_123/status?details=false');
    });

    it('builds v2 PG_CHECKOUT payload with amount in paise', () => {
      const body = buildV2PayPayload({
        merchantTransactionId: 'PP_ORD_999',
        merchantUserId: 'STU_1',
        amountInRupees: 2500,
        redirectUrl: 'https://rhythmzz.in/api/phonepe/redirect?id=PP_ORD_999',
        callbackUrl: 'https://rhythmzz.in/api/phonepe/callback',
        message: 'Monthly Fee — Kids Dance',
      });

      expect(body.merchantOrderId).toBe('PP_ORD_999');
      expect(body.amount).toBe(250000);
      expect(body.paymentFlow.type).toBe('PG_CHECKOUT');
      expect(body.paymentFlow.merchantUrls.redirectUrl).toBe(
        'https://rhythmzz.in/api/phonepe/redirect?id=PP_ORD_999'
      );
    });

    it('verifies v2 SHA-256 webhook Authorization header (username:password)', () => {
      const user = 'rhythmzz_hook';
      const pass = 'StrongPass123';
      const expectedHex = crypto
        .createHash('sha256')
        .update(`${user}:${pass}`)
        .digest('hex');

      expect(verifyPhonePeV2WebhookAuth(expectedHex, user, pass)).toBe(true);
      expect(verifyPhonePeV2WebhookAuth(`SHA256 ${expectedHex}`, user, pass)).toBe(true);
      expect(verifyPhonePeV2WebhookAuth('wrong-hash', user, pass)).toBe(false);
      expect(verifyPhonePeV2WebhookAuth(null, user, pass)).toBe(false);
    });
  });

  describe('Checksum Generation & Verification (v1 Fallback)', () => {
    it('generates correct SHA-256 checksum with salt key and index for payment initiation', () => {
      const payloadBase64 = Buffer.from(JSON.stringify({ test: 'hello' })).toString('base64');
      const endpoint = '/pg/v1/pay';

      const checksum = generatePhonePeChecksum(payloadBase64, endpoint, mockSaltKey, mockSaltIndex);

      expect(checksum).toContain(`###${mockSaltIndex}`);
      expect(checksum.split('###')).toHaveLength(2);
      expect(checksum.split('###')[0]).toHaveLength(64);
    });

    it('verifies valid callback checksum correctly', () => {
      const base64Data = Buffer.from(JSON.stringify({ code: 'PAYMENT_SUCCESS' })).toString('base64');
      const expectedHash = crypto
        .createHash('sha256')
        .update(base64Data + mockSaltKey)
        .digest('hex');
      const validXVerify = `${expectedHash}###${mockSaltIndex}`;

      const isValid = verifyPhonePeChecksum(base64Data, validXVerify, mockSaltKey, mockSaltIndex);
      expect(isValid).toBe(true);
    });

    it('rejects tampered payload or altered salt key', () => {
      const base64Data = Buffer.from(JSON.stringify({ code: 'PAYMENT_SUCCESS' })).toString('base64');
      const tamperedXVerify = `badhash1234567890abcdef1234567890abcdef1234567890abcdef1234567890###${mockSaltIndex}`;

      const isValid = verifyPhonePeChecksum(base64Data, tamperedXVerify, mockSaltKey, mockSaltIndex);
      expect(isValid).toBe(false);
    });

    it('generates correct checksum for order status API', () => {
      const transactionId = 'TXN_TEST_123';
      const endpoint = `/pg/v1/status/${mockMerchantId}/${transactionId}`;

      const checksum = generateStatusChecksum(endpoint, mockSaltKey, mockSaltIndex);

      expect(checksum).toContain(`###${mockSaltIndex}`);
      expect(checksum.split('###')[0]).toHaveLength(64);
    });
  });

  describe('Payload Builder (v1 Fallback)', () => {
    it('constructs correct payload converting rupees to paise and setting standard checkout parameters', () => {
      const { payload, base64Payload, checksum } = buildPayPayload(
        {
          merchantTransactionId: 'ORDER_12345',
          merchantUserId: 'USER_6789',
          amountInRupees: 2500,
          redirectUrl: 'https://rhythmzz.in/api/phonepe/redirect?id=ORDER_12345',
          callbackUrl: 'https://rhythmzz.in/api/phonepe/callback',
          mobileNumber: '9052980859',
        },
        mockV1SandboxConfig
      );

      expect(payload.amount).toBe(250000);
      expect(payload.merchantId).toBe(mockMerchantId);
      expect(payload.merchantTransactionId).toBe('ORDER_12345');
      expect(payload.paymentInstrument.type).toBe('PAY_PAGE');
      expect(payload.redirectMode).toBe('POST');
      expect(payload.mobileNumber).toBe('9052980859');

      const decoded = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'));
      expect(decoded.amount).toBe(250000);
      expect(decoded.merchantTransactionId).toBe('ORDER_12345');
      expect(checksum).toContain(`###${mockSaltIndex}`);
    });
  });

  describe('Callback Response Parsing', () => {
    it('decodes base64 callback response into structured JSON object', () => {
      const mockObj = {
        code: 'PAYMENT_SUCCESS',
        message: 'Payment completed',
        data: {
          merchantId: mockMerchantId,
          merchantTransactionId: 'TXN_999',
          transactionId: 'T260320145612345678',
          amount: 250000,
          state: 'COMPLETED',
          responseCode: 'SUCCESS',
        },
      };

      const base64Str = Buffer.from(JSON.stringify(mockObj)).toString('base64');
      const parsed = parseCallbackResponse(base64Str);

      expect(parsed).not.toBeNull();
      expect(parsed!.code).toBe('PAYMENT_SUCCESS');
      expect(parsed!.data.transactionId).toBe('T260320145612345678');
      expect(parsed!.data.amount).toBe(250000);
    });

    it('handles malformed base64 gracefully without throwing unhandled exceptions', () => {
      const result = parseCallbackResponse('not-valid-base64-json-%%%');
      expect(result).toBeNull();
    });
  });

  describe('Config Loader & Sandbox Defaults', () => {
    it('returns test sandbox defaults when environment variables are not set', () => {
      const oldEnv = process.env.PHONEPE_ENV;
      const oldCid = process.env.PHONEPE_CLIENT_ID;
      try {
        delete process.env.PHONEPE_ENV;
        delete process.env.PHONEPE_CLIENT_ID;
        const config = getPhonePeConfig();
        expect(config.merchantId).toBeTruthy();
        expect(config.saltKey).toBeTruthy();
        expect(config.saltIndex).toBeTruthy();
        expect(config.hostUrl).toContain('phonepe.com');
        expect(config.isSandbox).toBe(true);
      } finally {
        if (oldEnv) process.env.PHONEPE_ENV = oldEnv;
        if (oldCid) process.env.PHONEPE_CLIENT_ID = oldCid;
      }
    });

    it('normalizes formatted phone number to 10 digits', () => {
      const { payload } = buildPayPayload(
        {
          merchantTransactionId: 'ORDER_PHONE_TEST',
          merchantUserId: 'USER_1',
          amountInRupees: 1500,
          redirectUrl: 'https://rhythmzz.in/callback',
          callbackUrl: 'https://rhythmzz.in/webhook',
          mobileNumber: '+91 (905) 298-0859',
        },
        mockV1SandboxConfig
      );

      expect(payload.mobileNumber).toBe('9052980859');
    });

    it('detects production mode when PHONEPE_CLIENT_ID is set without sandbox override', () => {
      const oldEnv = process.env.PHONEPE_ENV;
      const oldCid = process.env.PHONEPE_CLIENT_ID;
      const oldSec = process.env.PHONEPE_CLIENT_SECRET;
      try {
        delete process.env.PHONEPE_ENV;
        process.env.PHONEPE_CLIENT_ID = 'SU2611121322531448209199';
        process.env.PHONEPE_CLIENT_SECRET = 'some-secret';
        const config = getPhonePeConfig();
        expect(config.env).toBe('production');
        expect(config.isSandbox).toBe(false);
        expect(usesV2OAuth(config)).toBe(true);
      } finally {
        if (oldEnv) process.env.PHONEPE_ENV = oldEnv;
        else delete process.env.PHONEPE_ENV;
        if (oldCid) process.env.PHONEPE_CLIENT_ID = oldCid;
        else delete process.env.PHONEPE_CLIENT_ID;
        if (oldSec) process.env.PHONEPE_CLIENT_SECRET = oldSec;
        else delete process.env.PHONEPE_CLIENT_SECRET;
      }
    });
  });
});
