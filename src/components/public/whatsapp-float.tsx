'use client';

import { MessageCircle } from 'lucide-react';
import { ACADEMY } from '@/lib/utils/constants';

export function WhatsappFloat() {
  const handleClick = () => {
    // Optionally contextualize message based on pathname if needed
    const text = encodeURIComponent('Hi, I would like to know more about the classes at Rhythmzz Academy.');
    window.open(`https://wa.me/919052980859?text=${text}`, '_blank');
  };

  return (
    <button 
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} />
    </button>
  );
}
