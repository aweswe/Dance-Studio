'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreVertical, Mail, Phone } from 'lucide-react'

export function InstructorManager({ initialInstructors }: { initialInstructors: any[] }) {
  const [instructors, setInstructors] = useState(initialInstructors || [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-blk">All Instructors</h3>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Add Instructor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor) => (
          <Card key={instructor.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-light border border-gray-200 flex items-center justify-center font-display text-xl text-bl">
                  {instructor.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-display text-xl text-blk">{instructor.name}</h4>
                  <Badge variant={instructor.status === 'active' || instructor.is_active ? 'green' : 'default'} className="mt-1">
                    {instructor.status?.toUpperCase() || (instructor.is_active ? 'ACTIVE' : 'INACTIVE')}
                  </Badge>
                </div>
              </div>
              <button className="text-mu hover:text-blk p-1"><MoreVertical size={16} /></button>
            </div>
            
            <p className="text-sm text-mu mb-4 line-clamp-2">{instructor.bio || 'No biography provided.'}</p>
            
            <div className="space-y-2 border-t border-gray-100 pt-4">
              {instructor.email && (
                <div className="flex items-center gap-2 text-sm text-mu">
                  <Mail size={14} className="text-bl" /> {instructor.email}
                </div>
              )}
              {instructor.phone && (
                <div className="flex items-center gap-2 text-sm text-mu">
                  <Phone size={14} className="text-bl" /> {instructor.phone}
                </div>
              )}
            </div>
          </Card>
        ))}

        {instructors.length === 0 && (
          <div className="col-span-full py-12 text-center text-mu bg-light rounded-[16px]">
            No instructors found.
          </div>
        )}
      </div>
    </div>
  )
}
