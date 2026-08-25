import { NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay/client';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
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
    let feeAmount = 0;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: studentData } = await supabase
        .from('students')
        .select('id, name, phone, email, batch_id, programme:programmes(id, fees_monthly)')
        .eq('auth_id', user.id)
        .single();

      const student = studentData as any;
      if (student) {
        studentId = student.id;
        resolved = {
          programmeId: student.programme?.id ?? null,
          batchId: student.batch_id ?? null,
          name: student.name,
          phone: student.phone,
          email: student.email ?? null,
        };
        feeAmount = student.programme?.fees_monthly || 2500;
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
      feeAmount = programme.fees_monthly || 2500;
    }

    const order = await razorpay.orders.create({
      amount: feeAmount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // Store in payment_orders. RLS: anon may insert only when student_id is
    // NULL; an authenticated student only for their own student_id.
    const { error: insertError } = await (supabase as any)
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
      return NextResponse.json({ error: 'Failed to create order record' }, { status: 500 });
    }

    return NextResponse.json({ order_id: order.id, amount: feeAmount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
