'use server';
import { createServerSupabase } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/guards';
import { sendWhatsAppTemplate } from '@/lib/whatsapp/client';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';
import { formatTime } from '@/lib/utils/format';
import { revalidatePath } from 'next/cache';

export async function confirmRental(id: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const { data: rental, error: fetchErr } = await supabase
    .from('studio_rentals')
    .select('*')
    .eq('id', id)
    .single();
  if (fetchErr || !rental) return { success: false, error: 'Rental not found' };

  const { error } = await supabase
    .from('studio_rentals')
    .update({ status: 'confirmed' })
    .eq('id', id);
  if (error) return { success: false, error: error.message };

  const whatsapp = await sendWhatsAppTemplate({
    phone: rental.phone,
    templateName: WHATSAPP_TEMPLATES.rentalConfirmed.name,
    variables: WHATSAPP_TEMPLATES.rentalConfirmed.variables({
      name: rental.name,
      date: rental.preferred_date,
      time: `${formatTime(rental.preferred_time_start)} - ${formatTime(rental.preferred_time_end)}`,
    }),
  });

  revalidatePath('/admin/studio-rental');
  return { success: true, whatsapp };
}

export async function cancelRental(id: string) {
  const supabase = await createServerSupabase();
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' };

  const { data: rental, error: fetchErr } = await supabase
    .from('studio_rentals')
    .select('*')
    .eq('id', id)
    .single();
  if (fetchErr || !rental) return { success: false, error: 'Rental not found' };

  const { error } = await supabase
    .from('studio_rentals')
    .update({ status: 'cancelled' })
    .eq('id', id);
  if (error) return { success: false, error: error.message };

  // Tell the renter their slot was declined (mock-safe).
  const whatsapp = await sendWhatsAppTemplate({
    phone: rental.phone,
    templateName: WHATSAPP_TEMPLATES.rentalCancelled.name,
    variables: WHATSAPP_TEMPLATES.rentalCancelled.variables({
      name: rental.name,
      date: rental.preferred_date,
      time: `${formatTime(rental.preferred_time_start)} - ${formatTime(rental.preferred_time_end)}`,
    }),
  });

  revalidatePath('/admin/studio-rental');
  return { success: true, whatsapp };
}
