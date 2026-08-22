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
    
    const { phone, templateName, variables } = await req.json();
    
    const result = await sendWhatsAppTemplate({
      phone,
      templateName,
      variables: variables || {},
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
