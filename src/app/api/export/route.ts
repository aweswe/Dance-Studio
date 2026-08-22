import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
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
        csv = 'id,name,phone,email,status\n' + (data as any[]).map((s: any) => `${s.id},${s.name},${s.phone},${s.email || ''},${s.status}`).join('\n');
      }
    } else if (type === 'attendance') {
      const { data } = await supabase.from('attendance').select('*, students(name)');
      if (data) {
        csv = 'date,student,status\n' + (data as any[]).map((a: any) => `${a.date},${a.students?.name || ''},${a.status}`).join('\n');
      }
    } else if (type === 'payments') {
      const { data } = await supabase.from('fee_payments').select('*, students(name)');
      if (data) {
        csv = 'id,student,amount,source,date\n' + (data as any[]).map((p: any) => `${p.id},${p.students?.name || ''},${p.amount},${p.source},${p.created_at}`).join('\n');
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
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
