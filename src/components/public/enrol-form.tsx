'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface EnrolFormProps {
  programmes?: any[];
  batches?: any[];
}

export function EnrolForm({ programmes = [], batches = [] }: EnrolFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    programme: '',
    batch: '',
    name: '',
    email: '',
    phone: '',
  });

  const filteredBatches = batches.filter(b => b.programme?.slug === formData.programme || !formData.programme);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final submission logic
      console.log('Submitted', formData);
      alert('Enrollment submitted successfully!');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 max-w-lg mx-auto w-full">
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
              step >= s ? "bg-blk text-white" : "bg-off text-mu"
            )}>
              {s}
            </div>
            {s < 3 && <div className={cn("h-px w-10 sm:w-16 transition-colors", step > s ? "bg-blk" : "bg-off")} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {step === 1 && (
          <div>
            <h3 className="heading-display text-2xl text-blk mb-4">Select Programme</h3>
            <select 
              required
              className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
              value={formData.programme}
              onChange={e => setFormData({...formData, programme: e.target.value, batch: ''})}
            >
              <option value="">Choose a programme...</option>
              {programmes.length > 0 ? (
                programmes.map((p, idx) => (
                  <option key={p.id || idx} value={p.slug}>{p.name}</option>
                ))
              ) : (
                <>
                  <option value="kids-dance">Kids Dance</option>
                  <option value="adults-dance">Adults Dance</option>
                  <option value="mind-body-fitness">Mind & Body Fitness</option>
                  <option value="kuchipudi">Kuchipudi Classical</option>
                </>
              )}
            </select>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="heading-display text-2xl text-blk mb-4">Select Batch</h3>
            <select 
              required
              className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
              value={formData.batch}
              onChange={e => setFormData({...formData, batch: e.target.value})}
            >
              <option value="">Choose a batch...</option>
              {filteredBatches.length > 0 ? (
                filteredBatches.map((b, idx) => (
                  <option key={b.id || idx} value={b.id}>
                    {b.days} ({b.time_start} - {b.time_end})
                  </option>
                ))
              ) : (
                <>
                  <option value="batch-1">Mon-Wed (5:00 PM - 7:00 PM)</option>
                  <option value="batch-2">Mon-Fri (9:30 AM - 10:30 AM)</option>
                  <option value="batch-3">Fri-Sat (6:30 PM - 7:30 PM)</option>
                </>
              )}
            </select>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="heading-display text-2xl text-blk mb-4">Your Details</h3>
            <div className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                required
                className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          {step > 1 ? (
            <button 
              type="button" 
              onClick={() => setStep(step - 1)}
              className="text-[11px] font-semibold tracking-[1.8px] uppercase px-6 py-3 border border-black/20 text-blk hover:border-bl hover:text-bl transition-all"
            >
              Back
            </button>
          ) : <div />}
          
          <button 
            type="submit"
            className="text-[11px] font-semibold tracking-[1.8px] uppercase px-8 py-3 bg-bl text-white hover:bg-[#22a0c4] transition-all"
          >
            {step === 3 ? 'Confirm & Pay' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
}
