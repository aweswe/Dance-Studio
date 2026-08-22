'use server'

import { createServerSupabase } from '@/lib/supabase/server'

export async function getInstructorsAction() {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.from('instructors').select('*').order('name')
  if (error) return []
  return data
}
