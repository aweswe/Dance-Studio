import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Phone, Mail, Calendar, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { StudentActions } from '@/components/admin/student-actions'
import { KuchipudiAdmin } from '@/components/admin/kuchipudi-admin'
import { formatDate, formatCurrency, formatTime, telLink } from '@/lib/utils/format'

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createServerSupabase()

  const { data: studentData } = await supabase
    .from('students')
    .select(`
      id, name, phone, email, status, join_date, student_id_display, batch_id, auth_id,
      programme:programmes(name, slug),
      batch:batches(name, days, time_start, time_end, programme:programmes(name))
    `)
    .eq('id', id)
    .single()

  if (!studentData) notFound()
  const student = studentData as any

  // Kuchipudi students get inline module marking (instructor marking deferred —
  // no instructor auth accounts exist yet).
  const isKuchipudi = (student.programme as any)?.slug === 'kuchipudi'
  let kuchipudiProgress = null
  if (isKuchipudi) {
    const { data: progressRow } = await supabase
      .from('kuchipudi_progress')
      .select('current_level, modules_completed')
      .eq('student_id', id)
      .maybeSingle()
    kuchipudiProgress = progressRow
  }

  const { data: payments } = await supabase
    .from('fee_payments')
    .select('id, amount, source, notes, paid_at')
    .eq('student_id', id)
    .order('paid_at', { ascending: false })
    .limit(5)

  const { data: batches } = await supabase
    .from('batches')
    .select('id, name, days, programme:programmes(name)')
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/students" className="p-2 border border-gray-200 rounded-full text-mu hover:bg-light hover:text-blk transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="font-display text-3xl text-blk tracking-wide flex items-center gap-3">
            {student.name}
            <Badge variant={student.status === 'active' ? 'green' : 'default'} className="text-xs">{student.status.toUpperCase()}</Badge>
          </h2>
          <p className="text-mu font-body text-sm mt-1">
            {student.student_id_display} · Joined {formatDate(student.join_date, 'long')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1 lg:col-span-1 h-fit space-y-6">
          <h3 className="font-display text-xl text-blk border-b border-gray-100 pb-2">Profile Details</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <Phone size={16} className="text-mu mt-0.5" />
              <div>
                <p className="font-medium text-blk flex items-center gap-2">
                  {student.phone}
                  <a
                    href={telLink(student.phone)}
                    className="p-1 rounded text-mu hover:text-bl hover:bg-black/5 transition-colors"
                    aria-label="Call student"
                  >
                    <Phone size={13} />
                  </a>
                  <a
                    href={`https://wa.me/91${String(student.phone).replace(/\D/g, '').replace(/^91/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded text-mu hover:text-green hover:bg-black/5 transition-colors"
                    aria-label="WhatsApp student"
                  >
                    <MessageCircle size={13} />
                  </a>
                </p>
                <p className="text-xs text-mu">Primary Contact</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Mail size={16} className="text-mu mt-0.5" />
              <div>
                <p className="font-medium text-blk">{student.email || '—'}</p>
                <p className="text-xs text-mu">Email</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Calendar size={16} className="text-mu mt-0.5" />
              <div>
                <p className="font-medium text-blk">{formatDate(student.join_date, 'long')}</p>
                <p className="text-xs text-mu">Join Date</p>
              </div>
            </div>
          </div>

          <StudentActions
            student={{
              id: student.id,
              name: student.name,
              phone: student.phone,
              email: student.email,
              status: student.status,
              batch_id: student.batch_id,
              auth_id: student.auth_id,
            }}
            batches={(batches ?? []) as any[]}
          />
        </Card>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          {isKuchipudi && <KuchipudiAdmin studentId={id} initialProgress={kuchipudiProgress as any} />}

          <Card className="p-6">
            <h3 className="font-display text-xl text-blk border-b border-gray-100 pb-2 mb-4">Enrolment</h3>
            {student.batch ? (
              <div className="bg-light rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blk">{student.batch.programme?.name || 'Programme'}</h4>
                  <p className="text-sm text-mu">
                    {student.batch.name || student.batch.days?.join(', ')}
                    {student.batch.time_start && ` · ${formatTime(student.batch.time_start)} - ${formatTime(student.batch.time_end)}`}
                  </p>
                </div>
                <Badge variant={student.status === 'active' ? 'green' : 'default'}>
                  {student.status.toUpperCase()}
                </Badge>
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-mu">No batch assigned.</div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-xl text-blk border-b border-gray-100 pb-2 mb-4">Recent Payments</h3>
            {payments && payments.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {(payments as any[]).map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blk">{formatCurrency(p.amount)}</p>
                      <p className="text-xs text-mu">{formatDate(p.paid_at, 'long')}{p.notes ? ` · ${p.notes}` : ''}</p>
                    </div>
                    <Badge variant="outline">{p.source.toUpperCase()}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-mu">
                No recent payments found.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
