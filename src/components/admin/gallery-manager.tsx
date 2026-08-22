'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, ArrowUp, ArrowDown } from 'lucide-react'

export function GalleryManager() {
  // Mock data
  const [items, setItems] = useState([
    { id: '1', url: 'https://images.unsplash.com/photo-1547153760-18fc86324498', tag: 'Kuchipudi' },
    { id: '2', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad', tag: 'Zumba' },
  ])

  return (
    <div className="space-y-6">
      <Card className="p-12 text-center border-dashed bg-light hover:bg-gray-50 transition-colors cursor-pointer">
        <Upload size={32} className="mx-auto text-mu mb-4" />
        <h4 className="font-medium text-blk">Click or drag images to upload</h4>
        <p className="text-sm text-mu mt-1">Supported formats: JPG, PNG, WEBP. Max size: 5MB.</p>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div key={item.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-wh">
            <div className="aspect-square relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="Gallery item" className="object-cover w-full h-full" />
              
              <div className="absolute inset-0 bg-blk/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-wh rounded-full text-blk hover:text-bl"><ArrowUp size={16} /></button>
                <button className="p-2 bg-wh rounded-full text-blk hover:text-bl"><ArrowDown size={16} /></button>
              </div>
            </div>
            
            <div className="p-3 flex justify-between items-center bg-wh">
              <span className="text-xs font-medium text-blk">{item.tag}</span>
              <button className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
