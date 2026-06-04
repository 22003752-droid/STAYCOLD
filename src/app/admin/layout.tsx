"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, Package, Tags, Settings, LogOut, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // No mostrar el layout del admin en la página de login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Productos', href: '/admin/products' },
    { icon: Tags, label: 'Categorías y Marcas', href: '/admin/categories' },
    { icon: Settings, label: 'Configuración', href: '/admin/settings' },
  ];

  const adminName = session?.user?.name || 'Administrador';
  const adminInitial = adminName.charAt(0).toUpperCase();

  const SidebarContent = () => (
    <>
      <div className="h-20 flex items-center px-6 border-b border-gray-100">
        <Link href="/admin" className="flex items-center gap-1" onClick={() => setSidebarOpen(false)}>
          <span className="text-2xl font-black text-brand-dark">Stay</span>
          <span className="text-2xl font-medium text-brand-light">cold</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mb-2 ml-0.5"></span>
          <span className="ml-2 text-xs font-bold text-gray-400 tracking-wider">ADMIN</span>
        </Link>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-brand-dark'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100 space-y-2">
        {/* Info del usuario */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-brand-light/20 flex items-center justify-center text-brand-dark font-bold text-sm">
            {adminInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{adminName}</p>
            <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
          </div>
        </div>

        {/* Cerrar Sesión — usa NextAuth signOut */}
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 gap-4">
          {/* Menu button mobile */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-50 text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="relative flex-1 max-w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-light/50 outline-none text-sm font-medium"
            />
          </div>

          {/* Avatar desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{adminName}</p>
              <p className="text-xs text-gray-400">{session?.user?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-light/20 flex items-center justify-center text-brand-dark font-bold">
              {adminInitial}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 overflow-y-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
