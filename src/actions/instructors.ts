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

  const { error } = await supabase.from('instructors').insert({
    name: d.name,
    role: d.role ?? null,
    bio: d.bio ?? null,
    certifications: d.certifications,
    email: d.email || null,
    phone: d.phone || null,
    is_active: d.isActive,
  })
  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  revalidatePath('/about')
  return { success: true }
}
