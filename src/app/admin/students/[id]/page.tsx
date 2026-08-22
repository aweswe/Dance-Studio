import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, Phone, Mail, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const supabase = await createServerSupabase()
  const { data: studentData } = await supabase.from('students').select('*, programmes(name), batches(name, days)').eq('id', id).single()
  const student = (studentData as any) || {
    id,
    name: 'Student',
    phone: '+91 90529 80859',
    email: 'student@example.com',
    status: 'active',
    created_at: new Date().toISOString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/students" className="p-2 border border-gray-200 rounded-full text-mu hover:bg-light hover:text-blk transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="font-display text-3xl text-blk tracking-wide flex items-center gap-3">
            {student.name || `${student.first_name || ''} ${student.last_name || ''}`}
            <Badge variant={student.status === 'active' ? 'green' : 'default'} className="text-xs">{student.status.toUpperCase()}</Badge>
          </h2>
          <p className="text-mu font-body text-sm mt-1">Student Profile & History</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1 lg:col-span-1 h-fit space-y-6">
          <h3 className="font-display text-xl text-blk border-b border-gray-100 pb-2">Profile Details</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <Phone size={16} className="text-mu mt-0.5" />
              <div>
                <p className="font-medium text-blk">{student.phone}</p>
                <p className="text-xs text-mu">Primary Contact</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-sm">
              <Mail size={16} className="text-mu mt-0.5" />
              <div>
                <p className="font-medium text-blk">{student.email}</p>
                <p className="text-xs text-mu">Email</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <MapPin size={16} className="text-mu mt-0.5" />
              <div>
                <p className="font-medium text-blk">{student.address}</p>
                <p className="text-xs text-mu">Address</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Calendar size={16} className="text-mu mt-0.5" />
              <div>
                <p className="font-medium text-blk">{student.join_date}</p>
                <p className="text-xs text-mu">Join Date</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex gap-2">
            <Button className="w-full">Edit Profile</Button>
            <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">Deactivate</Button>
          </div>
        </Card>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-display text-xl text-blk border-b border-gray-100 pb-2 mb-4">Enrolments</h3>
            <div className="bg-light rounded-lg p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blk">Hip Hop Beginners</h4>
                <p className="text-sm text-mu">Batch: Weekends 10AM</p>
              </div>
              <Badge>ACTIVE</Badge>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-xl text-blk border-b border-gray-100 pb-2 mb-4">Recent Payments</h3>
            <div className="text-center py-6 text-sm text-mu">
              No recent payments found.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
