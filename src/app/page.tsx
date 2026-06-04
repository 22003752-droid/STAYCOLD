"use client";

import ProductCard from '../components/ProductCard';
import { Filter, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../store/useStore';

export default function Home() {
  const products = useStore((state) => state.products);
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48 bg-gradient-to-b from-brand-light/20 to-brand-cream reveal">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-brand-light/30 blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] rounded-full bg-brand-accent/20 blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-center mx-auto">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white text-brand-dark font-bold text-sm mb-6 shadow-sm border border-brand-light/20 tracking-wide uppercase">
              Colección Premium 2024
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-brand-dark mb-8 leading-[1.1] tracking-tight">
              Mantén el <span className="text-gradient">frío</span>.<br />
              Vive la <span className="relative inline-block float-animation">
                aventura
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-accent" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="transparent"/></svg>
              </span>.
            </h1>
            <p className="text-xl text-brand-dark/70 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
              Distribuidores oficiales de los termos más resistentes. Hasta 24 horas de temperatura perfecta garantizada para cada desafío.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/catalog" className="w-full sm:w-auto bg-brand-dark text-white px-10 py-5 rounded-full font-black text-lg hover:bg-brand-light hover:shadow-[0_20px_50px_rgba(118,161,210,0.4)] transition-all duration-500 transform hover:-translate-y-2 flex items-center justify-center gap-2 group">
                Explorar Catálogo
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="w-full sm:w-auto text-center bg-white/50 backdrop-blur-md text-brand-dark px-10 py-5 rounded-full font-bold text-lg border border-white hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Nuestra Historia
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Features Section */}
      <section className="py-20 bg-brand-dark text-white overflow-hidden reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black text-brand-accent">24h</p>
              <p className="text-sm font-bold text-brand-light uppercase tracking-widest">Frío Extremo</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black text-brand-accent">12h</p>
              <p className="text-sm font-bold text-brand-light uppercase tracking-widest">Calor Intenso</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black text-brand-accent">100%</p>
              <p className="text-sm font-bold text-brand-light uppercase tracking-widest">Inoxidable</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black text-brand-accent">MAX</p>
              <p className="text-sm font-bold text-brand-light uppercase tracking-widest">Durabilidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-20 reveal">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] p-8 md:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
            <div>
              <h2 className="text-4xl font-black text-brand-dark tracking-tight">Colección Destacada</h2>
              <p className="text-brand-dark/50 font-bold mt-2 text-lg">Los favoritos de la comunidad Staycold</p>
            </div>
            
            <Link href="/catalog" className="text-brand-dark font-black flex items-center gap-2 group hover:text-brand-light transition-colors text-lg">
              Ver todo el catálogo
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
