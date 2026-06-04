"use client";

import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const products = useStore((state) => state.products);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stats = [
    { name: 'Ventas del Mes', value: 'Q12,450.00', icon: DollarSign, trend: '+14%' },
    { name: 'Productos Activos', value: mounted ? products.length.toString() : '...', icon: Package, trend: '+3' },
    { name: 'Nuevos Clientes', value: '45', icon: Users, trend: '+12%' },
    { name: 'Conversión', value: '3.2%', icon: TrendingUp, trend: '+0.4%' },
  ];

  const recentProducts = mounted ? products.slice(-4).reverse() : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-brand-dark tracking-tight">Dashboard</h1>
        <p className="text-gray-500 font-medium mt-1">Resumen general de tu tienda Staycold.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-light/10 text-brand-light rounded-xl">
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">{stat.name}</p>
                <h3 className="text-3xl font-black text-brand-dark">{stat.value}</h3>
              </div>
              <div className="absolute -bottom-6 -right-6 text-brand-light/5 pointer-events-none">
                 <Icon size={120} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recents Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-brand-dark mb-6">Productos Agregados Recientemente</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 pt-2 px-4 font-semibold text-sm text-gray-400 uppercase tracking-wider">Producto</th>
                <th className="pb-3 pt-2 px-4 font-semibold text-sm text-gray-400 uppercase tracking-wider">Categoría</th>
                <th className="pb-3 pt-2 px-4 font-semibold text-sm text-gray-400 uppercase tracking-wider">Precio</th>
                <th className="pb-3 pt-2 px-4 font-semibold text-sm text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="pb-3 pt-2 px-4 font-semibold text-sm text-gray-400 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {p.imageUrl ? (
                           <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                           <Package size={20} className="text-gray-400" />
                        )}
                      </div>
                      <span className="font-bold text-brand-dark">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-500">{p.category}</td>
                  <td className="py-4 px-4 font-bold text-brand-dark">Q{p.price.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className="bg-brand-accent/20 text-brand-dark px-3 py-1 rounded-full text-xs font-bold">
                      {p.stock} en stock
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-sm font-bold text-brand-light hover:text-brand-dark transition-colors">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
              {recentProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">No hay productos recientes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
