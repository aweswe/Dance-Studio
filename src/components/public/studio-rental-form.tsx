'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

export function StudioRentalForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to /api/studio-rental
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="bg-light p-8 rounded-2xl text-center border border-green/20">
        <div className="w-16 h-16 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="heading-display text-2xl mb-2">Request Received</h3>
        <p className="text-mu">We'll get back to you shortly to confirm your booking.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-[11px] font-bold uppercase tracking-wider text-bl"
        >
          Book Another Slot
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 flex flex-col gap-5">
      <h3 className="heading-display text-2xl mb-2">Request a Booking</h3>
      
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-blk mb-2">Full Name</label>
        <input 
          type="text" 
          required
          className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-blk mb-2">Phone Number</label>
        <input 
          type="tel" 
          required
          className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
          placeholder="Enter phone number"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-blk mb-2">Preferred Date</label>
          <input 
            type="date" 
            required
            className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-blk mb-2">Time Slot</label>
          <input 
            type="time" 
            required
            className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-blk mb-2">Purpose</label>
        <select required className="w-full p-4 border border-black/10 rounded-lg text-sm bg-off outline-none focus:border-bl transition-colors">
          <option value="">Select purpose...</option>
          <option value="rehearsal">Dance Rehearsal</option>
          <option value="workshop">Workshop / Masterclass</option>
          <option value="shoot">Video / Photo Shoot</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className={cn(
          "mt-4 text-[11px] font-semibold tracking-[1.8px] uppercase px-8 py-4 bg-blk text-white transition-all rounded-lg",
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-black"
        )}
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
      
      <p className="text-[10px] text-mu text-center mt-2">
        Submitting this form does not confirm your booking. We will contact you to finalize.
      </p>
    </form>
  );
}
