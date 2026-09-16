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
  revalidatePath('/schedule')
  revalidatePath('/')
  return { success: true }
}

export async function updateBatchStatus(id: string, status: 'active' | 'paused' | 'full') {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const { error } = await supabase.from('batches').update({ status }).eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/classes')
  revalidatePath('/programmes')
  revalidatePath('/schedule')
  revalidatePath('/')
  return { success: true }
}

export async function deleteBatch(id: string) {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const { createAdminSupabase } = await import('@/lib/supabase/server')
  const admin = createAdminSupabase()

  // Unassign any students currently enrolled in this batch
  await admin.from('students').update({ batch_id: null }).eq('batch_id', id)

  // Clean up any batch switch requests referencing this batch
  await admin.from('batch_switch_requests').delete().eq('requested_batch_id', id)
  await admin.from('batch_switch_requests').delete().eq('current_batch_id', id)

  // Clean up waitlist
  await admin.from('batch_waitlist').delete().eq('batch_id', id)

  // Delete attendance records
  await admin.from('attendance').delete().eq('batch_id', id)

  // Delete batch
  const { error } = await admin.from('batches').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/classes')
  revalidatePath('/programmes')
  revalidatePath('/schedule')
  revalidatePath('/')
  return { success: true }
}

export async function deleteProgramme(id: string) {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const { createAdminSupabase } = await import('@/lib/supabase/server')
  const admin = createAdminSupabase()

  // Get all batches for this programme
  const { data: batches } = await admin.from('batches').select('id').eq('programme_id', id)
  const batchIds = (batches || []).map((b) => b.id)

  if (batchIds.length > 0) {
    // Unassign students from these batches
    await admin.from('students').update({ batch_id: null }).in('batch_id', batchIds)

    // Delete switch requests, waitlist, attendance for these batches
    for (const bId of batchIds) {
      await admin.from('batch_switch_requests').delete().eq('requested_batch_id', bId)
      await admin.from('batch_switch_requests').delete().eq('current_batch_id', bId)
      await admin.from('batch_waitlist').delete().eq('batch_id', bId)
      await admin.from('attendance').delete().eq('batch_id', bId)
    }

    // Delete batches
    await admin.from('batches').delete().eq('programme_id', id)
  }

  // Unassign students from this programme
  await admin.from('students').update({ programme_id: null, batch_id: null }).eq('programme_id', id)

  // Delete programme
  const { error } = await admin.from('programmes').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/classes')
  revalidatePath('/programmes')
  revalidatePath('/schedule')
  revalidatePath('/')
  return { success: true }
}

