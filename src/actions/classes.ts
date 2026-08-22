'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

export async function getProgrammesAction() {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.from('programmes').select('*').order('name')
  if (error) return []
  return data
}

export async function getBatchesAction() {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase
    .from('batches')
    .select(`
      *,
      programme:programmes(name),
      instructor:instructors(name)
    `)
    .order('created_at', { ascending: false })
  
  if (error) return []
  return data
}
