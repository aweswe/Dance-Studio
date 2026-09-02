import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // Accurately resolve public origin behind reverse proxies / Vercel
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  let origin = host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || 'https://rhythmzz-dance-academy.vercel.app');
  if (origin.includes('localhost') && process.env.NODE_ENV === 'production') {
    origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://rhythmzz-dance-academy.vercel.app';
  }
  
  if (code) {
    const supabase = await createServerSupabase();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session) {
      const { createAdminSupabase } = await import('@/lib/supabase/server');
      const admin = createAdminSupabase();

      // Ensure user role exists
      const { data: userRow } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      let role = (userRow as any)?.role;
      if (!role) {
        role = 'student';
        await (admin as any).from('users').upsert({ id: session.user.id, role: 'student' });
      }

      if (role === 'admin') return NextResponse.redirect(`${origin}/admin`);
      if (role === 'instructor') return NextResponse.redirect(`${origin}/instructor`);

      // Check if student profile has phone number
      const { data: student } = await (admin as any)
        .from('students')
        .select('id, phone')
        .or(`auth_id.eq.${session.user.id},email.ilike.${session.user.email || 'none'}`)
        .maybeSingle();

      if (!student?.phone) {
        return NextResponse.redirect(`${origin}/login?step=phone`);
      }

      return NextResponse.redirect(`${origin}/student`);
    }
  }
  
  return NextResponse.redirect(`${origin}/login?error=Invalid code`);
}
