"use client";

import { MessageCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState, useEffect } from 'react';

export default function WhatsAppButton() {
  const whatsappNumber = useStore((state) => state.settings?.whatsappNumber || '50200000000');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <a 
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center hover:shadow-[#25D366]/40 group outline-none focus:ring-0"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
      <span className="absolute right-full mr-3 bg-white text-gray-800 px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none whitespace-nowrap border border-gray-100">
        ¿En qué podemos ayudarte?
      </span>
    </a>
  );
}
