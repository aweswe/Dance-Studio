'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { whatsappLink } from '@/lib/utils/format';

export function WhatsappFloat() {
  const pathname = usePathname();

  // Contextual message depending on where the visitor is.
  const message = pathname === '/enrol'
    ? 'Hi, I am trying to book a class at Rhythmzz Academy and need a hand.'
    : pathname?.startsWith('/programmes')
      ? 'Hi, I would like to know more about a programme at Rhythmzz Academy.'
      : 'Hi, I would like to know more about the classes at Rhythmzz Academy.';

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
      aria-label="Chat with Rhythmzz Academy on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
