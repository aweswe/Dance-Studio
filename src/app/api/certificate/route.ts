import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { buildCertificatePdf } from '@/lib/pdf/certificate';

export async function GET(req: Request) {
  try {
    if (!(await rateLimit(`certificate:${clientIp(req.headers)}`, { limit: 20, windowMs: 60 * 1000 }))) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const level = searchParams.get('level') || 'Completion';
    if (!studentId) return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: userRole } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle();
    const role = (userRole as any)?.role;
    if (role !== 'admin' && role !== 'instructor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: studentData } = await supabase
      .from('students')
      .select('name, programme:programmes(name)')
      .eq('id', studentId)
      .maybeSingle();
    const student = studentData as any;
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

    const pdf = buildCertificatePdf({
      studentName: student.name,
      programme: student.programme?.name || 'Classical Dance',
      level,
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rhythmzz-certificate.pdf"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
