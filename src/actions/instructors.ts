'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/supabase/guards'
import { createInstructorSchema, type CreateInstructorData } from '@/lib/validators/instructor'
import { revalidatePath } from 'next/cache'

export async function getInstructorsAction() {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.from('instructors').select('*').order('name')
  if (error) return []
  return data
}

export async function createInstructor(data: CreateInstructorData) {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }

  const parsed = createInstructorSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid instructor' }
  }
  const d = parsed.data

  let authId: string | null = null
  if (d.email) {
    const { createAdminSupabase } = await import('@/lib/supabase/server')
    const admin = createAdminSupabase()
    const { data: created, error: authErr } = await admin.auth.admin.createUser({
      email: d.email,
      email_confirm: true,
    })
    if (!authErr && created.user) {
      authId = created.user.id
      await (admin as any).from('users').upsert({ id: authId, role: 'instructor' })
    } else if (authErr?.message?.includes('already')) {
      const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
      const found = existing?.users?.find((u) => u.email === d.email)
      if (found) {
        authId = found.id
        await (admin as any).from('users').upsert({ id: authId, role: 'instructor' })
      }
    }
  }

  const { error } = await supabase.from('instructors').insert({
    name: d.name,
    role: d.role ?? null,
    bio: d.bio ?? null,
    certifications: d.certifications,
    email: d.email || null,
    phone: d.phone || null,
    is_active: d.isActive,
    auth_id: authId,
  })
  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/admin/instructors')
  return { success: true }
}

export async function linkInstructorAuth(instructorId: string, email: string) {
  const supabase = await createServerSupabase()
  if (!(await isAdmin(supabase))) return { success: false, error: 'Not authorized' }
  const { createAdminSupabase } = await import('@/lib/supabase/server')
  const admin = createAdminSupabase()
  const { data: created, error: authErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  })
  let authId = created?.user?.id ?? null
  if (!authId) {
    const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
    authId = existing?.users?.find((u) => u.email === email)?.id ?? null
  }
  if (!authId) return { success: false, error: authErr?.message || 'Could not create login' }
  await (admin as any).from('users').upsert({ id: authId, role: 'instructor' })
  const { error } = await supabase.from('instructors').update({ auth_id: authId, email }).eq('id', instructorId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/instructors')
  return { success: true }
}
