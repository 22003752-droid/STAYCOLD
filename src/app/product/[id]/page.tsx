"use client";

import { useEffect, useState } from 'react';
import { useStore } from '../../../store/useStore';
import { ShoppingBag, ArrowLeft, Star, Shield, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const products = useStore(state => state.products);
  const addToCart = useStore(state => state.addToCart);
  const setIsCartOpen = useStore(state => state.setIsCartOpen);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const product = products.find(p => p.id === parseInt(params.id));

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-black text-brand-dark mb-4">Producto no encontrado</h1>
        <p className="text-gray-500 mb-8">El termo que buscas ya no está disponible o no existe.</p>
        <Link href="/catalog" className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-light transition-colors">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => router.push('/catalog')} 
          className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-brand-dark hover:shadow-md transition-all font-bold mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Regresar al Inventario
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Image Gallery */}
            <div className="lg:w-1/2 bg-gray-50 p-12 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-200/50 to-transparent"></div>
              {product.isNew && (
                <div className="absolute top-8 left-8 bg-brand-accent/90 backdrop-blur-sm text-brand-dark text-sm font-bold px-4 py-2 rounded-full z-10 shadow-sm flex items-center gap-1">
                  <Star size={16} fill="currentColor" />
                  NUEVO LOTE
                </div>
              )}
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="relative z-10 object-contain w-full max-w-md drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
              <div className="text-sm font-bold text-brand-light uppercase tracking-widest mb-3">
                {product.brand} • {product.category}
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-brand-dark leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-black text-brand-dark">Q{product.price.toFixed(2)}</span>
                {product.stock > 0 ? (
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full mb-1">
                    Disponible ({product.stock})
                  </span>
                ) : (
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full mb-1">
                    Agotado
                  </span>
                )}
              </div>

              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                {product.description || "Un termo excepcional diseñado para mantener tus bebidas a la temperatura ideal durante horas. Construido con materiales premium para resistir tu estilo de vida."}
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <Shield size={20} className="text-brand-light" />
                  <span className="font-bold text-gray-700 text-sm">Alta Durabilidad Certificada</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <Truck size={20} className="text-brand-light" />
                  <span className="font-bold text-gray-700 text-sm">Envío rápido</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  onClick={() => {
                    addToCart(product);
                    setIsCartOpen(true);
                  }}
                  disabled={product.stock === 0}
                  className="flex-1 bg-brand-dark text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-brand-light transition-all shadow-xl hover:shadow-brand-light/30 flex items-center justify-center gap-3 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <ShoppingBag size={24} />
                  {product.stock > 0 ? "Agregar al Carrito" : "Agotado"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
