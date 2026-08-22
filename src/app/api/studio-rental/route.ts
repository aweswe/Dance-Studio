import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { rentalFormSchema } from '@/lib/validators/rental';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = rentalFormSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    
    const data = result.data;
    const supabase = await createServerSupabase();
    const { error } = await (supabase as any).from('studio_rentals').insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      preferred_date: data.preferredDate,
      preferred_time_start: data.preferredTimeStart,
      preferred_time_end: data.preferredTimeEnd,
      status: 'pending',
    });
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
