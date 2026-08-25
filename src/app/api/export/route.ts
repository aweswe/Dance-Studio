import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { escapeCsv } from '@/lib/utils/csv';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    if (!rateLimit(`export:${clientIp(req.headers)}`, { limit: 10, windowMs: 60 * 1000 })) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: userRole } = await supabase.from('users').select('role').eq('id', user.id).single();
    if ((userRole as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    let csv = '';
    if (type === 'students') {
      const { data } = await supabase.from('students').select('*');
      if (data) {
        csv = 'id,name,phone,email,status\n' + (data as any[])
          .map((s: any) => [s.id, s.name, s.phone, s.email, s.status].map(escapeCsv).join(','))
          .join('\n');
      }
    } else if (type === 'attendance') {
      const { data } = await supabase.from('attendance').select('*, student:students(name)');
      if (data) {
        csv = 'date,student,status\n' + (data as any[])
          .map((a: any) => [a.date, a.student?.name, a.status].map(escapeCsv).join(','))
          .join('\n');
      }
    } else if (type === 'payments') {
      const { data } = await supabase.from('fee_payments').select('*, student:students(name)');
      if (data) {
        csv = 'id,student,amount,source,date\n' + (data as any[])
          .map((p: any) => [p.id, p.student?.name, p.amount, p.source, p.created_at].map(escapeCsv).join(','))
          .join('\n');
      }
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${type}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
