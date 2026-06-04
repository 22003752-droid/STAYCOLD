"use client";

import { Shield, Target, Heart, Instagram, Facebook, MessageCircle, Music2 } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../../store/useStore';
import { useState, useEffect } from 'react';

export default function About() {
  const settings = useStore((state) => state.settings);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !settings) return null;

  const socialLinks = [
    { icon: <Instagram size={28} />, name: 'Instagram', url: settings.instagramUrl || '', color: 'hover:text-pink-500' },
    { icon: <Music2 size={28} />, name: 'TikTok', url: settings.tiktokUrl || '', color: 'hover:text-black' },
    { icon: <Facebook size={28} />, name: 'Facebook', url: settings.facebookUrl || '', color: 'hover:text-blue-600' },
    { icon: <MessageCircle size={28} />, name: 'WhatsApp', url: `https://wa.me/${settings.whatsappNumber || '50200000000'}`, color: 'hover:text-green-500' },
  ];

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Hero */}
      <section className="bg-brand-dark pt-24 pb-32 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden reveal">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-screen"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">Nuestra Historia</h1>
          <p className="text-xl text-brand-light font-medium max-w-2xl mx-auto leading-relaxed">
            Nacimos con una misión simple: distribuir los termos más resistentes y eficientes del mundo. Como distribuidores oficiales, acercamos la mejor tecnología de hidratación a los aventureros, los oficinistas y todos los guatemaltecos.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 -mt-16 relative z-20 reveal">
        <div className="bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-light/10 text-brand-light flex items-center justify-center mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-4">Nuestra Misión</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Proveer productos de hidratación premium que acompañen a las personas en cada momento de su vida, asegurando la temperatura perfecta en cada sorbo.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-light/10 text-brand-light flex items-center justify-center mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-4">Calidad Premium</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Utilizamos acero inoxidable de grado alimenticio y tecnología de aislamiento al vacío de doble pared en todos nuestros productos.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-accent/20 text-brand-dark flex items-center justify-center mb-6">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-4">Compromiso</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Nos preocupamos por el medio ambiente. Cada Staycold que compras es una botella de plástico menos en el océano.
              </p>
            </div>
          </div>
        </div>

        {/* Redes Sociales Section */}
        <div className="bg-brand-dark rounded-[40px] p-12 md:p-20 text-center mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-4">Síguenos en Redes Sociales</h2>
            <p className="text-brand-light/70 font-bold mb-12 text-lg">Únete a la comunidad Staycold y no te pierdas nuestras ofertas</p>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {socialLinks.map((social) => (
                social.url || social.name === 'WhatsApp' ? (
                  <a 
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center gap-3 text-white/80 transition-all duration-300 transform hover:-translate-y-2 ${social.color}`}
                  >
                    <div className="w-20 h-20 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl">
                      {social.icon}
                    </div>
                    <span className="font-bold text-sm tracking-widest uppercase">{social.name}</span>
                  </a>
                ) : null
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-12">
          <h2 className="text-4xl font-black text-brand-dark mb-6">¿Listo para encontrar tu Staycold ideal?</h2>
          <Link href="/catalog" className="inline-flex items-center justify-center bg-brand-dark text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-light transition-all shadow-xl hover:shadow-brand-light/30 transform hover:-translate-y-1">
            Explorar el Catálogo
          </Link>
        </div>
      </section>
    </div>
  );
}
