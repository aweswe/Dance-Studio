'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, Save } from 'lucide-react'

export function ContentEditor() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <Settings className="text-bl" size={20} />
          <h3 className="font-display text-xl text-blk">Announcement Banner</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="banner-active" className="rounded text-bl focus:ring-bl" />
            <label htmlFor="banner-active" className="text-sm font-medium text-blk">Show banner on website</label>
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Banner Text</label>
            <Input placeholder="e.g., Early bird registrations open for Summer Camp!" />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Call to Action Link (Optional)</label>
            <Input placeholder="/contact" />
          </div>
          <Button className="flex items-center gap-2"><Save size={16}/> Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <Settings className="text-bl" size={20} />
          <h3 className="font-display text-xl text-blk">Homepage Stats</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-mu mb-1">Students</label>
            <Input defaultValue="500+" />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Classes/Week</label>
            <Input defaultValue="50+" />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Instructors</label>
            <Input defaultValue="15" />
          </div>
        </div>
        <div className="mt-4">
          <Button className="flex items-center gap-2"><Save size={16}/> Save Stats</Button>
        </div>
      </Card>
    </div>
  )
}
