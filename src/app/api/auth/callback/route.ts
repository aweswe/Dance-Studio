import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/types';

export async function GET(request: Request) {
  const { searchParams, origin: reqOrigin } = new URL(request.url);
  const code = searchParams.get('code');

  // Accurately resolve public origin behind reverse proxies / Vercel
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const origin = host ? `${proto}://${host}` : reqOrigin;

  if (code) {
    const cookieStore = await cookies();
    const cookiesToSet: { name: string; value: string; options: any }[] = [];

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-for-build-prerendering',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(items) {
            items.forEach(({ name, value, options }) => {
              try {
                cookieStore.set(name, value, options);
              } catch {}
              cookiesToSet.push({ name, value, options });
            });
          },
        },
      }
    );

    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session) {
      const { createAdminSupabase } = await import('@/lib/supabase/server');
      const admin = createAdminSupabase();

      // Ensure user role exists in public.users
      const { data: userRow } = await (admin as any)
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      let role = (userRow as any)?.role;
      if (!role) {
        role = 'student';
        await (admin as any).from('users').upsert({ id: session.user.id, role: 'student' });
      }

      let redirectTarget = `${origin}/student`;

      if (role === 'admin') {
        redirectTarget = `${origin}/admin`;
      } else if (role === 'instructor') {
        redirectTarget = `${origin}/instructor`;
      } else {
        // Check if student profile has phone number
        const { data: student } = await (admin as any)
          .from('students')
          .select('id, phone')
          .or(`auth_id.eq.${session.user.id},email.ilike.${session.user.email || 'none'}`)
          .maybeSingle();

        if (!student?.phone) {
          redirectTarget = `${origin}/login?step=phone`;
        }
      }

      const response = NextResponse.redirect(redirectTarget);
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Invalid code`);
}

