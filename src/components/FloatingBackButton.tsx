"use client";

import { ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function FloatingBackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || pathname === '/') return null;

  return (
    <button 
      onClick={() => router.back()}
      className="fixed bottom-6 right-24 z-50 bg-white text-brand-dark px-6 py-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-gray-100 font-black gap-2 hover:bg-gray-50 active:scale-95 group"
    >
      <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      Regresar
    </button>
  );
}
