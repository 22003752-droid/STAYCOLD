"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../../store/useStore';

// ─── Inner component que usa useSearchParams ─────────────────────────────────
// Debe estar dentro de <Suspense> para que Next.js pueda hacer build
function CatalogContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || "";
  
  const allProducts = useStore((state) => state.products);
  const categories = useStore((state) => state.categories);
  
  const minInventoryPrice = allProducts.length > 0 ? Math.floor(Math.min(...allProducts.map(p => p.price))) : 0;
  const maxInventoryPrice = allProducts.length > 0 ? Math.ceil(Math.max(...allProducts.map(p => p.price))) : 100;

  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [maxPrice, setMaxPrice] = useState(100);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (allProducts.length > 0) {
      setMaxPrice(maxInventoryPrice);
    }
  }, [allProducts.length, maxInventoryPrice]);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const filteredProducts = (allProducts || []).filter(product => {
    if (!product || !product.name || !product.brand) return false;
    
    const matchesSearch = product.name.toLowerCase().includes((searchTerm || '').toLowerCase()) || 
                          product.brand.toLowerCase().includes((searchTerm || '').toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesPrice = (product.price || 0) <= maxPrice;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (!mounted) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-brand-dark pt-12 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-5 mix-blend-screen"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Catálogo de Productos</h1>
          <p className="text-brand-light font-medium text-lg">Encuentra el termo perfecto para tu estilo de vida.</p>
          
          <div className="mt-8 relative max-w-xl mx-auto shadow-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar termos, marcas o categorías..." 
              className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl focus:ring-4 focus:ring-brand-light/30 outline-none text-brand-dark font-medium text-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <SlidersHorizontal size={20} className="text-brand-dark" />
                <h3 className="font-black text-lg text-brand-dark">Filtros</h3>
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">Categorías</h4>
                <div className="space-y-2">
                  {['Todos', ...categories].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="w-4 h-4 text-brand-dark focus:ring-brand-light" 
                      />
                      <span className={`font-medium transition-colors ${selectedCategory === cat ? 'text-brand-dark font-bold' : 'text-gray-600 group-hover:text-brand-dark'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">Precio Máximo: Q{maxPrice}</h4>
                <input 
                  type="range" 
                  min={minInventoryPrice} 
                  max={maxInventoryPrice} 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-dark" 
                />
                <div className="flex justify-between text-xs font-bold text-gray-400 mt-2">
                  <span>Q{minInventoryPrice}</span>
                  <span>Q{maxInventoryPrice}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <span className="font-medium text-gray-500">Mostrando <strong className="text-brand-dark">{filteredProducts.length}</strong> productos</span>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron productos</h3>
                <p className="text-gray-500">Intenta ajustar tus filtros o buscar con otras palabras clave.</p>
                <button 
                  onClick={() => { setSearchTerm(""); setSelectedCategory("Todos"); setMaxPrice(maxInventoryPrice); }}
                  className="mt-6 text-brand-light font-bold hover:text-brand-dark transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Page wrapper con Suspense (requerido por Next.js para useSearchParams) ──
export default function Catalog() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-brand-dark font-bold text-xl">Cargando catálogo...</div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
