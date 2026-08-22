import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const supabase = await createServerSupabase();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session) {
      const { data: userRow } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      const role = (userRow as any)?.role || 'student';
      if (role === 'admin') return NextResponse.redirect(`${origin}/admin`);
      if (role === 'instructor') return NextResponse.redirect(`${origin}/instructor`);
      return NextResponse.redirect(`${origin}/student`);
    }
  }
  
  return NextResponse.redirect(`${origin}/login?error=Invalid code`);
}
