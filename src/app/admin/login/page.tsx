"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Manejamos la redirección manualmente
      });

      if (result?.error) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        setLoading(false);
      } else if (result?.ok) {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Error al conectar con el servidor. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">

        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="flex items-center gap-1">
              <span className="text-3xl font-black text-brand-dark">Stay</span>
              <span className="text-3xl font-medium text-brand-light">cold</span>
              <span className="w-2 h-2 rounded-full bg-brand-accent mb-3 ml-0.5"></span>
            </div>
          </div>

          <div className="w-14 h-14 bg-brand-dark/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-brand-dark" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Panel de Administración
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Acceso exclusivo para administradores.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-2xl border border-red-100">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email-address" className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light/60 focus:border-transparent transition-all text-sm bg-gray-50/50"
                placeholder="admin@staycold.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light/60 focus:border-transparent transition-all text-sm bg-gray-50/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-brand-dark hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Verificando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-sm font-medium text-brand-light hover:text-brand-dark transition-colors"
            >
              ← Volver a la tienda pública
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
