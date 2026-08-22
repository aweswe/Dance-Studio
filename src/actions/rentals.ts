'use server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function confirmRental(id: string) {
  const supabase = await createServerSupabase();
  await (supabase as any).from('studio_rentals').update({ status: 'confirmed' }).eq('id', id);
  return { success: true };
}

export async function cancelRental(id: string) {
  const supabase = await createServerSupabase();
  await (supabase as any).from('studio_rentals').update({ status: 'cancelled' }).eq('id', id);
  return { success: true };
}
