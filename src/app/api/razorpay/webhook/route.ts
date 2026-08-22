import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay/verify';
import { createAdminSupabase } from '@/lib/supabase/server';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';

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

      const supabase = createAdminSupabase();
      
      const { data: orderData } = await supabase
        .from('payment_orders')
        .select('*')
        .eq('razorpay_order_id', orderId)
        .single();
        
      const order = orderData as any;
      if (!order || order.status === 'webhook_processed') {
        return NextResponse.json({ success: true }); // Idempotent
      }
      
      // Check if student exists
      let { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('phone', order.student_phone)
        .eq('programme_id', order.programme_id)
        .single();
        
      let student = studentData as any;

      if (!student) {
        // Create auth user if needed
        let authUserId: string | null = null;
        try {
          const { data: authUser } = await supabase.auth.admin.createUser({
            phone: order.student_phone ? `+91${order.student_phone.replace(/\D/g, '')}` : undefined,
            email: order.student_email || undefined,
            phone_confirm: true,
          });
          authUserId = authUser?.user?.id ?? null;
        } catch {
          // User may already exist in Auth
        }
        
        if (authUserId) {
          await (supabase as any).from('users').upsert({
            id: authUserId,
            role: 'student',
          });
        }
        
        const { data: newStudent } = await (supabase as any).from('students').insert({
          auth_id: authUserId,
          name: order.student_name || 'New Student',
          phone: order.student_phone,
          email: order.student_email || null,
          programme_id: order.programme_id,
          batch_id: order.batch_id,
          status: 'active',
        }).select().single();
        
        student = newStudent as any;
        
        // Increment batch
        if (order.batch_id) {
          await (supabase as any).rpc('increment_batch_enrollment', { p_batch_id: order.batch_id });
        }
      }
      
      if (student) {
        await (supabase as any).from('fee_payments').insert({
          student_id: student.id,
          amount: order.amount,
          source: 'razorpay',
          razorpay_payment_id: paymentEntity?.id || null,
          payment_order_id: order.id,
        });
        
        // Look up programme name for WhatsApp
        const { data: progData } = await supabase.from('programmes').select('name').eq('id', order.programme_id).single();
        const progName = (progData as any)?.name || 'Dance Class';

        if (order.student_phone) {
          await sendWhatsAppTemplate({
            phone: order.student_phone,
            templateName: WHATSAPP_TEMPLATES.welcome.name,
            variables: WHATSAPP_TEMPLATES.welcome.variables({
              studentName: order.student_name || 'Student',
              programmeName: progName,
              loginUrl: 'https://www.rhythmzzdance.com/login',
            }),
          });
        }
      }
      
      await (supabase as any).from('payment_orders').update({
        status: 'webhook_processed',
        webhook_payload: payload,
      }).eq('razorpay_order_id', orderId);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Razorpay Webhook Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
