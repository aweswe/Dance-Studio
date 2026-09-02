import { NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay/client';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    if (!rateLimit(`order:${clientIp(req.headers)}`, { limit: 15, windowMs: 60 * 1000 })) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const { programmeId, batchId, name, phone, email } = body;

    const razorpay = getRazorpay();
    if (!razorpay) {
      return NextResponse.json(
        { error: 'PAYMENTS_UNAVAILABLE', message: 'Online payments are not configured yet. Please book via WhatsApp.' },
        { status: 503 },
      );
    }

    const supabase = await createServerSupabase();

    // Portal flow: a logged-in student pays their own month — everything is
    // derived server-side so the client can't forge another student's order.
    let studentId: string | null = null;
    let resolved = { programmeId, batchId, name, phone, email };
    let feeAmount = body.amount ? Number(body.amount) : 0;

    const { getCurrentStudent } = await import('@/lib/auth/student');
    const { student } = await getCurrentStudent();

    if (student) {
      studentId = student.id;
      const targetProgId = programmeId || student.programme_id || student.programme?.id || null;
      const targetBatchId = batchId || student.batch_id || student.batch?.id || null;

      resolved = {
        programmeId: targetProgId,
        batchId: targetBatchId,
        name: name || student.name,
        phone: phone || student.phone,
        email: email || student.email || null,
      };

      if (!feeAmount) {
        if (targetProgId) {
          const { data: prog } = await supabase
            .from('programmes')
            .select('fees_monthly')
            .eq('id', targetProgId)
            .maybeSingle();
          feeAmount = (prog as any)?.fees_monthly || student.programme?.fees_monthly || 2000;
        } else {
          feeAmount = student.programme?.fees_monthly || 2000;
        }
      }
    }

    // Enrol flow: anonymous visitor books a programme from the form body.
    if (studentId === null) {
      if (!programmeId) {
        return NextResponse.json({ error: 'Programme not found' }, { status: 404 });
      }
      const { data: programmeData, error: progError } = await supabase
        .from('programmes')
        .select('fees_monthly')
        .eq('id', programmeId)
        .single();

      const programme = programmeData as any;
      if (progError || !programme) {
        return NextResponse.json({ error: 'Programme not found' }, { status: 404 });
      }
      feeAmount = feeAmount || programme.fees_monthly || 2500;
    }

    const order = await razorpay.orders.create({
      amount: feeAmount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // Store in payment_orders using admin service client
    const adminSupabase = createAdminSupabase();
    const { error: insertError } = await (adminSupabase as any)
      .from('payment_orders')
      .insert({
        razorpay_order_id: order.id,
        amount: feeAmount,
        status: 'created',
        student_id: studentId,
        student_phone: resolved.phone,
        student_name: resolved.name,
        student_email: resolved.email,
        programme_id: resolved.programmeId,
        batch_id: resolved.batchId,
      });

    if (insertError) {
      console.error('Failed to create order record:', insertError);
      return NextResponse.json({ error: 'Failed to create order record' }, { status: 500 });
    }

    return NextResponse.json({ order_id: order.id, amount: feeAmount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
