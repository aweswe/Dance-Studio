import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { data: userRole } = await supabase.from('users').select('role').eq('id', user.id).single();
    if ((userRole as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    
    const { scope, scopeId, templateName, variables, message } = await req.json();
    
    let query = supabase.from('students').select('phone, name').eq('status', 'active');
    if (scope === 'programme') query = query.eq('programme_id', scopeId);
    if (scope === 'batch') query = query.eq('batch_id', scopeId);
    
    const { data: students } = await query;
    if (!students || students.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }
    
    let sentCount = 0;
    for (const student of students as any[]) {
      try {
        if (student.phone) {
          await sendWhatsAppTemplate({
            phone: student.phone,
            templateName,
            variables: { ...variables, student_name: student.name },
          });
          sentCount++;
        }
      } catch (err) {
        console.error('Failed to send to', student.phone, err);
      }
    }
    
    await (supabase as any).from('broadcast_logs').insert({
      message: message || templateName,
      template_name: templateName,
      recipients: { scope, scopeId, total: students.length },
      recipient_count: sentCount,
      sent_by: user.id,
    });
    
    return NextResponse.json({ success: true, count: sentCount });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
