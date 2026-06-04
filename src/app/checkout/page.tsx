"use client";

import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { CreditCard, ShieldCheck, Lock, ChevronLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const router = useRouter();
  const cartItems = useStore((state) => state.cart);
  const cartTotal = useStore((state) => state.cartTotal());
  const cartShippingTotal = useStore((state) => state.cartShippingTotal());
  const clearCart = useStore((state) => state.clearCart);

  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-black text-brand-dark mb-4">Tu carrito está vacío</h2>
          <Link href="/catalog" className="text-brand-light font-bold hover:underline">Ir al catálogo</Link>
        </div>
      </div>
    );
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simular procesamiento de pago
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Opcional: limpiar carrito después del éxito
      // clearCart();
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl max-w-lg w-full text-center reveal active">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={64} />
          </div>
          <h1 className="text-4xl font-black text-brand-dark mb-4">¡Pago Exitoso!</h1>
          <p className="text-gray-500 font-medium mb-8">Tu orden ha sido procesada correctamente. Recibirás un correo con los detalles de tu pedido.</p>
          <button 
            onClick={() => {
              // useStore.getState().clearCart(); // Clear cart
              router.push('/');
            }}
            className="w-full bg-brand-dark text-white py-4 rounded-2xl font-black text-lg hover:bg-brand-light transition-all shadow-xl"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-dark font-bold mb-8 transition-colors group">
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Volver al Catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario de Pago */}
          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl border border-gray-100 reveal active">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-brand-dark text-white rounded-2xl shadow-lg">
                <CreditCard size={24} />
              </div>
              <h2 className="text-2xl font-black text-brand-dark">Pago con Tarjeta</h2>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre en la Tarjeta</label>
                <input 
                  required
                  type="text" 
                  placeholder="Juan Pérez"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-brand-light/20 font-medium" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Número de Tarjeta</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-brand-light/20 font-medium" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    <div className="w-8 h-5 bg-gray-200 rounded-sm"></div>
                    <div className="w-8 h-5 bg-gray-300 rounded-sm"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Fecha Exp.</label>
                  <input 
                    required
                    type="text" 
                    placeholder="MM/YY"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-brand-light/20 font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                  <input 
                    required
                    type="text" 
                    placeholder="123"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-brand-light/20 font-medium" 
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3">
                <Lock className="text-brand-light flex-shrink-0" size={20} />
                <p className="text-xs text-gray-500 font-medium">Sus datos están encriptados y protegidos con seguridad de nivel bancario (AES-256).</p>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black text-xl hover:bg-brand-light transition-all shadow-xl hover:shadow-brand-light/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    Pagar Q{(cartTotal + cartShippingTotal).toFixed(2)}
                    <ShieldCheck size={24} className="group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div className="space-y-8 reveal active" style={{ transitionDelay: '200ms' }}>
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-brand-dark mb-6">Resumen del Pedido</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-brand-dark line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                      <p className="text-sm font-black text-brand-dark">Q{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>Q{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Envío</span>
                  <span className="text-brand-dark font-bold">Q{cartShippingTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-dark text-2xl font-black pt-3">
                  <span>Total</span>
                  <span>Q{(cartTotal + cartShippingTotal).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 opacity-50 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-6 object-contain" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-8 object-contain" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className="h-6 object-contain" alt="Paypal" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
