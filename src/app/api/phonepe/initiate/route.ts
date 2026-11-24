import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import {
  applySiblingDiscount,
  monthlyAmount,
  quarterlyAmount,
} from '@/lib/fees/ledger';
import { ACADEMY } from '@/lib/utils/constants';
import { getPhonePeConfig, initiatePhonePePay } from '@/lib/phonepe/client';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    if (!(await rateLimit(`phonepe-initiate:${clientIp(req.headers)}`, { limit: 20, windowMs: 60 * 1000 }))) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const { programmeId, batchId, name, phone, email } = body;
    const plan: 'monthly' | 'quarterly' = body.plan === 'quarterly' ? 'quarterly' : 'monthly';

    const supabase = await createServerSupabase();
    const { getCurrentStudent } = await import('@/lib/auth/student');
    const { student, siblings } = await getCurrentStudent();

    const studentId: string | null = student?.id ?? null;
    let resolved = { programmeId, batchId, name, phone, email };

    if (student) {
      resolved = {
        programmeId: programmeId || student.programme_id || student.programme?.id || null,
        batchId: batchId || student.batch_id || student.batch?.id || null,
        name: name || student.name,
        phone: phone || student.phone,
        email: email || student.email || null,
      };
    }

    const targetProgId = resolved.programmeId;
    const targetBatchId = resolved.batchId;
    if (!targetProgId) {
      return NextResponse.json({ error: 'Programme not found' }, { status: 404 });
    }
    if (!student?.batch_id && !targetBatchId) {
      return NextResponse.json({ error: 'Pick a batch before paying.' }, { status: 400 });
    }

    if (targetBatchId) {
      const admin = createAdminSupabase();
      const { data: batchRow } = await admin
        .from('batches')
        .select('id, status, capacity, enrolled_count')
        .eq('id', targetBatchId)
        .maybeSingle();
      const batch = batchRow as any;
      if (!batch) {
        return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
      }
      if (batch.status === 'full' || (batch.capacity > 0 && batch.enrolled_count >= batch.capacity)) {
        return NextResponse.json({ error: 'This batch is full.' }, { status: 409 });
      }
    }

    const { data: programmeData, error: progError } = await supabase
      .from('programmes')
      .select('id, name, fees_monthly, fees_quarterly')
      .eq('id', targetProgId)
      .maybeSingle();

    const programme = programmeData as any;
    if (progError || !programme) {
      return NextResponse.json({ error: 'Programme not found' }, { status: 404 });
    }

    let feeAmount =
      plan === 'quarterly'
        ? quarterlyAmount(programme.fees_quarterly, programme.fees_monthly)
        : monthlyAmount(programme.fees_monthly);

    const siblingCount = Math.max(siblings?.length ?? 0, student ? 1 : 0);
    feeAmount = applySiblingDiscount(feeAmount, siblingCount, ACADEMY.siblingDiscountPercent);

    // Generate unique merchantTransactionId: "PP_<timestamp>_<random>"
    const randomHex = crypto.randomBytes(4).toString('hex');
    const merchantTransactionId = `PP_${Date.now()}_${randomHex}`;
    const merchantUserId = studentId ? `STUDENT_${studentId.slice(0, 8)}` : `GUEST_${randomHex}`;

    const config = getPhonePeConfig();
    const requestOrigin = (() => {
      try {
        return new URL(req.url).origin;
      } catch {
        return config.baseUrl;
      }
    })();
    const activeBaseUrl = process.env.NODE_ENV === 'development' ? requestOrigin : config.baseUrl;

    const safeNext =
      typeof body.next === 'string' && body.next.startsWith('/') && !body.next.startsWith('//')
        ? body.next
        : '';
    const nextParam = safeNext ? `&next=${encodeURIComponent(safeNext)}` : '';

    const redirectUrl = `${activeBaseUrl}/api/phonepe/redirect?id=${merchantTransactionId}${nextParam}`;
    const callbackUrl = `${activeBaseUrl}/api/phonepe/callback`;

    // Persist order initiation in database
    const adminSupabase = createAdminSupabase();
    const { error: insertError } = await (adminSupabase as any)
      .from('payment_orders')
      .insert({
        razorpay_order_id: merchantTransactionId, // keep for backward compatibility with schema
        gateway_provider: 'phonepe',
        amount: feeAmount,
        status: 'created',
        plan,
        student_id: studentId,
        student_phone: resolved.phone,
        student_name: resolved.name,
        student_email: resolved.email,
        programme_id: resolved.programmeId,
        batch_id: resolved.batchId,
      });

    if (insertError) {
      console.error('[PhonePe] Failed to record payment order:', insertError);
      return NextResponse.json({ error: 'Failed to record payment order' }, { status: 500 });
    }

    // Call PhonePe Pay API (v2 OAuth or v1 fallback)
    const payResult = await initiatePhonePePay(
      {
        merchantTransactionId,
        merchantUserId,
        amountInRupees: feeAmount,
        redirectUrl,
        callbackUrl,
        mobileNumber: resolved.phone,
        message: `${programme.name || 'Dance Class'} (${plan}) — Rhythmzz Academy`,
      },
      config
    );

    if (!payResult.success || !payResult.redirectUrl) {
      console.error('[PhonePe] Pay initiation error:', payResult.error);
      return NextResponse.json(
        { error: payResult.error || 'Failed to initiate PhonePe payment' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      redirectUrl: payResult.redirectUrl,
      transactionId: merchantTransactionId,
      amount: feeAmount,
      plan,
    });
  } catch (error) {
    console.error('[PhonePe Initiation Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
