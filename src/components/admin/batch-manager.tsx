'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Users, Clock, MapPin, MoreVertical, Plus } from 'lucide-react'

// Basic types for the UI
type Programme = any
type Batch = any
type Instructor = any

export function BatchManager({ 
  initialProgrammes, 
  initialBatches,
  instructors 
}: { 
  initialProgrammes: Programme[], 
  initialBatches: Batch[],
  instructors: Instructor[]
}) {
  const [activeTab, setActiveTab] = useState<'batches' | 'programmes'>('batches')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('batches')}
          className={`pb-3 text-sm font-display tracking-[1px] uppercase transition-colors ${
            activeTab === 'batches' ? 'border-b-2 border-bl text-bl' : 'text-mu hover:text-blk'
          }`}
        >
          Batches
        </button>
        <button
          onClick={() => setActiveTab('programmes')}
          className={`pb-3 text-sm font-display tracking-[1px] uppercase transition-colors ${
            activeTab === 'programmes' ? 'border-b-2 border-bl text-bl' : 'text-mu hover:text-blk'
          }`}
        >
          Programmes
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-blk">
          {activeTab === 'batches' ? 'Active Batches' : 'Academy Programmes'}
        </h3>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          {activeTab === 'batches' ? 'New Batch' : 'New Programme'}
        </Button>
      </div>

      {activeTab === 'batches' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialBatches?.map((batch: any) => (
            <Card key={batch.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Badge variant="outline" className="mb-2">{batch.programme?.name}</Badge>
                  <h4 className="font-display text-2xl text-blk">{batch.name}</h4>
                </div>
                <button className="text-mu hover:text-blk p-1"><MoreVertical size={16} /></button>
              </div>
              
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-sm text-mu">
                  <Users size={16} className="text-bl" />
                  <span>{batch.enrolled_count || 0} / {batch.capacity} Students</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-mu">
                  <Clock size={16} className="text-gold" />
                  <span>{batch.time_slot} ({batch.days?.join(', ')})</span>
                </div>
              </div>
            </Card>
          ))}
          {(!initialBatches || initialBatches.length === 0) && (
            <div className="col-span-full py-12 text-center text-mu bg-light rounded-[16px]">
              No batches available. Create one to get started.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialProgrammes?.map((prog: any) => (
            <Card key={prog.id} className="p-6">
              <h4 className="font-display text-xl text-blk mb-2">{prog.name}</h4>
              <p className="text-sm text-mu line-clamp-2">{prog.description}</p>
            </Card>
          ))}
          {(!initialProgrammes || initialProgrammes.length === 0) && (
            <div className="col-span-full py-12 text-center text-mu bg-light rounded-[16px]">
              No programmes available. Create one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
