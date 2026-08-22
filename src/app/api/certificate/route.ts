import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    if (!studentId) return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });
    
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { data: userRole } = await supabase.from('users').select('role').eq('id', user.id).single();
    if ((userRole as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    
    const { data: studentData } = await supabase.from('students').select('name, programmes(name)').eq('id', studentId).single();
    const student = studentData as any;
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate of Completion - Rhythmzz Academy</title>
          <style>
            body { font-family: 'Inter', sans-serif; text-align: center; padding: 60px; background: #fafafa; }
            .cert-box { border: 8px double #2BB4D8; padding: 40px; background: white; max-width: 700px; margin: auto; }
            h1 { font-size: 36px; color: #0F0F0F; margin-bottom: 20px; }
            h2 { font-size: 28px; color: #2BB4D8; }
            p { font-size: 16px; color: #555; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <h1>Rhythmzz Academy of Dance</h1>
            <p>Certificate of Completion</p>
            <p>This is proudly presented to</p>
            <h2>${student.name}</h2>
            <p>for successful completion and excellence in</p>
            <h3>${student.programmes?.name || 'Classical Dance'}</h3>
            <p style="margin-top: 40px; font-size: 12px; color: #888;">Secunderabad, Hyderabad &bull; www.rhythmzzdance.com</p>
          </div>
        </body>
      </html>
    `;
    
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
