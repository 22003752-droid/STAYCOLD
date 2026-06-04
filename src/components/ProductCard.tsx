import Link from 'next/link';
import { ShoppingBag, Star } from 'lucide-react';
import { useStore, Product } from '../store/useStore';

export default function ProductCard(product: Product) {
  const { id, name, price, imageUrl, category, brand, ounces, isNew } = product;
  const addToCart = useStore((state) => state.addToCart);
  const setIsCartOpen = useStore((state) => state.setIsCartOpen);

  // Imagen por defecto si falla
  const displayImage = imageUrl || "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegación
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true); // Abrir el carrito
  };

  return (
    <div className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-brand-light/30 relative transform hover:-translate-y-1">
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Imagen del producto */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent"></div>
        
        {isNew && (
          <div className="absolute top-4 left-4 bg-brand-accent/90 backdrop-blur-sm text-brand-dark text-xs font-bold px-4 py-1.5 rounded-full z-10 shadow-sm flex items-center gap-1 border border-brand-accent/20">
            <Star size={12} fill="currentColor" />
            NUEVO
          </div>
        )}
        
        {/* Capacidad */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-brand-dark text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm border border-gray-200/50">
          {ounces} oz
        </div>

        <Link href={`/product/${id}`} className="w-full h-full relative block z-0">
          <img 
            src={displayImage} 
            alt={name} 
            className="object-contain w-full h-full group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out drop-shadow-xl"
          />
        </Link>
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow relative z-10 bg-white">
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs font-bold text-brand-light uppercase tracking-widest">{brand}</div>
        </div>
        
        <Link href={`/product/${id}`} className="hover:text-brand-light transition-colors mb-2 block">
          <h3 className="font-extrabold text-xl text-brand-dark line-clamp-2 leading-tight">{name}</h3>
        </Link>
        <p className="text-sm text-gray-400 font-medium mb-6">{category}</p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <span className="font-black text-2xl text-brand-dark tracking-tight">Q{price.toFixed(2)}</span>
          <button 
            onClick={handleAddToCart}
            className="bg-brand-dark text-white p-3 rounded-2xl hover:bg-brand-light transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 duration-300 flex items-center justify-center"
          >
            <ShoppingBag size={22} className="stroke-[2.5px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
