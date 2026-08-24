'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/supabase/guards'
import { createProgrammeSchema, type CreateProgrammeData } from '@/lib/validators/programme'
import { createBatchSchema, type CreateBatchData } from '@/lib/validators/batch'
import { revalidatePath } from 'next/cache'

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

export async function createProgramme(data: CreateProgrammeData) {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const parsed = createProgrammeSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid programme' }
  }
  const d = parsed.data

  const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  if (!slug) return { success: false, error: 'Programme name has no valid characters' }

  const { data: existing } = await supabase.from('programmes').select('id').eq('slug', slug).maybeSingle()
  if (existing) return { success: false, error: `A programme with slug "${slug}" already exists` }

  const { data: last } = await supabase
    .from('programmes')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  const { error } = await supabase.from('programmes').insert({
    name: d.name,
    slug,
    description: d.description ?? null,
    includes: d.includes,
    fees_monthly: d.feesMonthly,
    fees_quarterly: d.feesQuarterly,
    age_group: d.ageGroup ?? null,
    is_active: d.isActive,
    sort_order: ((last?.[0] as { sort_order: number } | undefined)?.sort_order ?? 0) + 1,
  })
  if (error) return { success: false, error: error.message }

  revalidatePath('/programmes')
  revalidatePath('/')
  return { success: true }
}

export async function createBatch(data: CreateBatchData) {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const parsed = createBatchSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid batch' }
  }
  const d = parsed.data

  const { error } = await supabase.from('batches').insert({
    programme_id: d.programmeId,
    instructor_id: d.instructorId,
    name: d.name,
    days: d.days,
    time_start: d.timeStart,
    time_end: d.timeEnd,
    capacity: d.capacity,
    enrolled_count: 0,
    status: d.status,
  })
  if (error) return { success: false, error: error.message }

  revalidatePath('/programmes')
  revalidatePath('/')
  return { success: true }
}
