'use server'

import { createAdminSupabase, createServerSupabase } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/supabase/guards'
import { createProgrammeSchema, updateProgrammeSchema, type CreateProgrammeData, type UpdateProgrammeData } from '@/lib/validators/programme'
import { createBatchSchema, updateBatchSchema, type CreateBatchData, type UpdateBatchData } from '@/lib/validators/batch'
import { revalidatePath } from 'next/cache'

const REVALIDATE_PATHS = ['/programmes', '/schedule', '/', '/admin/classes']

function revalidateClassPaths() {
  for (const path of REVALIDATE_PATHS) revalidatePath(path)
}

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

  revalidateClassPaths()
  return { success: true }
}

export async function updateProgramme(id: string, data: UpdateProgrammeData) {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const parsed = updateProgrammeSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid programme' }
  }
  const d = parsed.data

  const { data: existing } = await supabase.from('programmes').select('slug').eq('id', id).maybeSingle()
  if (!existing) return { success: false, error: 'Programme not found' }

  const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  if (!slug) return { success: false, error: 'Programme name has no valid characters' }

  const { data: slugConflict } = await supabase
    .from('programmes')
    .select('id')
    .eq('slug', slug)
    .neq('id', id)
    .maybeSingle()
  if (slugConflict) return { success: false, error: `Another programme already uses slug "${slug}"` }

  const { error } = await supabase
    .from('programmes')
    .update({
      name: d.name,
      slug,
      description: d.description ?? null,
      includes: d.includes,
      fees_monthly: d.feesMonthly,
      fees_quarterly: d.feesQuarterly,
      age_group: d.ageGroup ?? null,
      is_active: d.isActive,
    })
    .eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidateClassPaths()
  return { success: true }
}

export async function deleteProgramme(id: string, force = false) {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const admin = createAdminSupabase()
  const { count } = await admin.from('batches').select('id', { count: 'exact', head: true }).eq('programme_id', id)
  if ((count ?? 0) > 0 && !force) {
    return {
      success: false,
      error: `This programme has ${count} batch(es). Delete or reassign them first, or confirm cascade delete.`,
      batchCount: count,
    }
  }

  const { error } = await admin.from('programmes').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidateClassPaths()
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

  revalidateClassPaths()
  return { success: true }
}

export async function updateBatch(id: string, data: UpdateBatchData) {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const parsed = updateBatchSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid batch' }
  }
  const d = parsed.data

  const { data: existing } = await supabase.from('batches').select('id').eq('id', id).maybeSingle()
  if (!existing) return { success: false, error: 'Batch not found' }

  const { error } = await supabase
    .from('batches')
    .update({
      programme_id: d.programmeId,
      instructor_id: d.instructorId,
      name: d.name,
      days: d.days,
      time_start: d.timeStart,
      time_end: d.timeEnd,
      capacity: d.capacity,
      status: d.status,
    })
    .eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidateClassPaths()
  return { success: true }
}

export async function deleteBatch(id: string) {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const admin = createAdminSupabase()
  const { count } = await admin.from('students').select('id', { count: 'exact', head: true }).eq('batch_id', id)
  if ((count ?? 0) > 0) {
    return {
      success: false,
      error: `Cannot delete — ${count} student(s) are enrolled. Reassign them first.`,
      studentCount: count,
    }
  }

  const { error } = await admin.from('batches').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidateClassPaths()
  return { success: true }
}

export async function updateBatchStatus(id: string, status: 'active' | 'paused' | 'full') {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const { error } = await supabase.from('batches').update({ status }).eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidateClassPaths()
  return { success: true }
}
