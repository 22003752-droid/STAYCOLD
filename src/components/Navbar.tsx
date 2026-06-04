"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Menu, Search, User, X, Trash2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Zustand store
  const isCartOpen = useStore((state) => state.isCartOpen);
  const setIsCartOpen = useStore((state) => state.setIsCartOpen);
  const cartItems = useStore((state) => state.cart);
  const cartCount = useStore((state) => state.cartCount());
  const cartTotal = useStore((state) => state.cartTotal());
  const cartShippingTotal = useStore((state) => state.cartShippingTotal());
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);

  // Evitar error de hidratación con persistencia
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity">
                <span className="text-4xl font-black tracking-tighter text-brand-dark">Stay</span>
                <span className="text-4xl font-medium tracking-tighter text-brand-light">cold</span>
                <span className="w-2.5 h-2.5 rounded-full bg-brand-accent mb-4 ml-1"></span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-500 hover:text-brand-dark font-bold transition-colors">Inicio</Link>
              <Link href="/catalog" className="text-gray-500 hover:text-brand-dark font-bold transition-colors">Catálogo</Link>
              <Link href="/about" className="text-gray-500 hover:text-brand-dark font-bold transition-colors">Nosotros</Link>
            </div>

            {/* Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 bg-gray-50 border border-gray-200 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light/50 transition-all focus:w-64"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark">
                  <Search size={16} strokeWidth={2.5} />
                </button>
              </form>
              
              <Link href="/admin/login" className="text-gray-400 hover:text-brand-dark transition-colors">
                <User size={22} strokeWidth={2.5} />
              </Link>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-gray-400 hover:text-brand-dark transition-colors relative"
              >
                <ShoppingCart size={22} strokeWidth={2.5} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-accent text-brand-dark text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-4">
              <button onClick={() => setIsCartOpen(true)} className="text-brand-dark hover:text-brand-light transition-colors relative">
                <ShoppingCart size={22} strokeWidth={2.5} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-accent text-brand-dark text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-brand-dark hover:text-brand-light transition-colors p-2"
              >
                <Menu size={26} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-xl absolute w-full left-0 top-20">
            <form onSubmit={handleSearch} className="px-3 mb-4">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light/50"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </button>
              </div>
            </form>
            <Link href="/" className="block px-3 py-3 rounded-xl text-base font-bold text-gray-500 hover:text-brand-dark hover:bg-gray-50">Inicio</Link>
            <Link href="/catalog" className="block px-3 py-3 rounded-xl text-base font-bold text-gray-500 hover:text-brand-dark hover:bg-gray-50">Catálogo</Link>
            <Link href="/about" className="block px-3 py-3 rounded-xl text-base font-bold text-gray-500 hover:text-brand-dark hover:bg-gray-50">Nosotros</Link>
            <Link href="/admin/login" className="block px-3 py-3 rounded-xl text-base font-bold text-gray-500 hover:text-brand-dark hover:bg-gray-50">Panel de Administración</Link>
          </div>
        )}
      </nav>

      {/* Cart Slide-over */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md transform transition-transform duration-500 ease-in-out shadow-2xl bg-white flex flex-col">
              {/* Cart Header */}
              <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ShoppingCart size={20} className="text-brand-dark" />
                  </div>
                  <h2 className="text-2xl font-black text-brand-dark">Tu Carrito</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-400 hover:text-brand-dark bg-white hover:bg-gray-100 p-2 rounded-full transition-colors shadow-sm border border-gray-100"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {!mounted || cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                      <ShoppingCart size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700">Tu carrito está vacío</h3>
                    <p className="text-gray-500">¡Agrega algunos termos geniales a tu carrito para continuar!</p>
                    <Link href="/catalog" onClick={() => setIsCartOpen(false)} className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-light transition-colors mt-4 inline-block">
                      Explorar Catálogo
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                          <Link href={`/product/${item.product.id}`} onClick={() => setIsCartOpen(false)}>
                            <h3 className="text-sm font-bold text-brand-dark line-clamp-2 pr-4 hover:text-brand-light transition-colors">{item.product.name}</h3>
                          </Link>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <span className="font-black text-lg text-brand-dark mt-1">Q{(item.product.price || 0).toFixed(2)}</span>
                        <div className="mt-auto flex items-center gap-3">
                          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-3 py-1 font-bold text-gray-500 hover:text-brand-dark">-</button>
                            <span className="px-2 font-bold text-sm text-brand-dark">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-1 font-bold text-gray-500 hover:text-brand-dark">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {mounted && cartItems.length > 0 && (
                <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                  <div className="flex justify-between text-base font-medium text-gray-500 mb-2">
                    <p>Subtotal</p>
                    <p className="font-bold text-brand-dark">Q{cartTotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-500 mb-6">
                    <p>Envío</p>
                    <p className="font-bold text-brand-dark">Q{cartShippingTotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-xl font-black text-brand-dark mb-6 pt-4 border-t border-dashed border-gray-200">
                    <p>Total</p>
                    <p>Q{(cartTotal + cartShippingTotal).toFixed(2)}</p>
                  </div>
                  <button onClick={handleCheckout} className="w-full bg-brand-dark flex items-center justify-center gap-2 border border-transparent rounded-xl shadow-md px-6 py-4 text-base font-black text-white hover:bg-brand-light transition-all transform hover:-translate-y-1 hover:shadow-xl">
                    Proceder al Pago
                    <ArrowRight size={20} />
                  </button>
                  <div className="mt-4 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      o{' '}
                      <button
                        type="button"
                        className="font-bold text-brand-light hover:text-brand-dark transition-colors"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Continuar Comprando<span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
