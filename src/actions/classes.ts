'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/supabase/guards'
import { createProgrammeSchema, updateProgrammeSchema, type CreateProgrammeData, type UpdateProgrammeData } from '@/lib/validators/programme'
import { createBatchSchema, updateBatchSchema, type CreateBatchData, type UpdateBatchData } from '@/lib/validators/batch'
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

export async function updateBatch(id: string, data: UpdateBatchData) {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const parsed = updateBatchSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid batch data' }
  }
  const d = parsed.data

  const { createAdminSupabase } = await import('@/lib/supabase/server')
  const admin = createAdminSupabase()

  const updatePayload: Record<string, any> = {}
  if (d.name !== undefined) updatePayload.name = d.name
  if (d.programmeId !== undefined) updatePayload.programme_id = d.programmeId
  if (d.instructorId !== undefined) updatePayload.instructor_id = d.instructorId ? d.instructorId : null
  if (d.days !== undefined) updatePayload.days = d.days
  if (d.timeStart !== undefined) updatePayload.time_start = d.timeStart
  if (d.timeEnd !== undefined) updatePayload.time_end = d.timeEnd
  if (d.capacity !== undefined) updatePayload.capacity = d.capacity
  if (d.status !== undefined) updatePayload.status = d.status

  const { error } = await (admin.from('batches') as any).update(updatePayload).eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/classes')
  revalidatePath('/programmes')
  revalidatePath('/schedule')
  revalidatePath('/student')
  revalidatePath('/student/schedule')
  revalidatePath('/instructor')
  revalidatePath('/instructor/classes')
  revalidatePath('/')
  return { success: true }
}

export async function updateProgramme(id: string, data: UpdateProgrammeData) {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const parsed = updateProgrammeSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid programme data' }
  }
  const d = parsed.data

  const { createAdminSupabase } = await import('@/lib/supabase/server')
  const admin = createAdminSupabase()

  const updatePayload: Record<string, any> = {}
  if (d.name !== undefined) updatePayload.name = d.name
  if (d.description !== undefined) updatePayload.description = d.description
  if (d.includes !== undefined) updatePayload.includes = d.includes
  if (d.feesMonthly !== undefined) updatePayload.fees_monthly = d.feesMonthly
  if (d.feesQuarterly !== undefined) updatePayload.fees_quarterly = d.feesQuarterly
  if (d.ageGroup !== undefined) updatePayload.age_group = d.ageGroup
  if (d.isActive !== undefined) updatePayload.is_active = d.isActive

  const { error } = await (admin.from('programmes') as any).update(updatePayload).eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/classes')
  revalidatePath('/programmes')
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

export async function updateBatchSchedule(
  batchId: string,
  updates: { time_start?: string; time_end?: string; days?: string[] },
) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { getUserRole } = await import('@/lib/supabase/guards')
  const role = await getUserRole(supabase)

  // Strict authorization: Admin can update any batch. Instructor can ONLY update batches assigned directly to them!
  if (role !== 'admin') {
    if (role !== 'instructor') {
      return { success: false, error: 'Unauthorized: Only instructors and admins can set up class schedules' }
    }

    const { getLinkedInstructor } = await import('@/lib/auth/instructor')
    const instructor = await getLinkedInstructor(supabase, user)
    if (!instructor) {
      return { success: false, error: 'Instructor profile not found' }
    }

    // Verify this batch is actually assigned to this instructor
    const { data: batch } = await supabase
      .from('batches')
      .select('id, instructor_id')
      .eq('id', batchId)
      .maybeSingle()

    if (!batch) {
      return { success: false, error: 'Batch not found' }
    }

    if (batch.instructor_id !== instructor.id) {
      return {
        success: false,
        error: 'Unauthorized: You can only configure class timings for your own assigned batches',
      }
    }
  }

  const { createAdminSupabase } = await import('@/lib/supabase/server')
  const admin = createAdminSupabase()

  const { error } = await admin
    .from('batches')
    .update({
      ...(updates.time_start ? { time_start: updates.time_start } : {}),
      ...(updates.time_end ? { time_end: updates.time_end } : {}),
      ...(updates.days ? { days: updates.days } : {}),
    })
    .eq('id', batchId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/instructor')
  revalidatePath('/instructor/classes')
  revalidatePath('/student')
  revalidatePath('/student/schedule')
  revalidatePath('/schedule')
  revalidatePath('/')
  return { success: true }
}

/**
 * Batches are strictly created by Studio Administrators.
 * Instructors cannot create batches — they can only configure class timings for batches assigned to them.
 */
export async function createInstructorBatch(_data?: unknown) {
  return {
    success: false,
    error: 'Batches can only be created by studio administration. Instructors are only authorized to configure class timings for batches assigned to them.',
  }
}

