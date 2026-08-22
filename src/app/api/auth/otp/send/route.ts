import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const supabase = await createServerSupabase();
    
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { channel: 'whatsapp' },
    });
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
