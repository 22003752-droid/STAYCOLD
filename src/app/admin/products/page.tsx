"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { useStore, Product } from '../../../store/useStore';

export default function AdminProducts() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const products = useStore((state) => state.products);
  const categories = useStore((state) => state.categories);
  const brands = useStore((state) => state.brands);
  const addProduct = useStore((state) => state.addProduct);
  const deleteProduct = useStore((state) => state.deleteProduct);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Form State
  const [formData, setFormData] = useState({
    name: '', price: '', stock: '', shippingPrice: '0', category: categories[0] || '', brand: brands[0] || '', description: '', imageUrl: ''
  });

  const handleSave = () => {
    if (!formData.name || !formData.price) return;
    
    addProduct({
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      shippingPrice: parseFloat(formData.shippingPrice) || 0,
      category: formData.category,
      brand: formData.brand,
      description: formData.description,
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800",
      ounces: 24
    });
    
    setShowModal(false);
    setFormData({ name: '', price: '', stock: '', shippingPrice: '0', category: categories[0] || '', brand: brands[0] || '', description: '', imageUrl: '' });
  };

  const filteredProducts = (products || []).filter(p => 
    p && p.name && p.name.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">Productos</h1>
          <p className="text-gray-500 font-medium mt-1">Gestiona tu inventario y catálogo.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-light transition-all shadow-md hover:shadow-xl flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      {/* Header tools */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-light/50 outline-none text-sm font-medium"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-sm text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-500 uppercase tracking-wider">Inventario</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((p) => (
                <tr key={p.id || Math.random()} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img src={p.imageUrl || ''} alt={p.name || 'Producto'} className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <span className="font-bold text-brand-dark block">{p.name || 'Sin Nombre'}</span>
                        <span className="text-xs text-gray-400 font-medium">{p.category || '-'} • {p.brand || '-'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-brand-dark">Q{(p.price || 0).toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${(p.stock || 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="font-medium text-gray-600">{p.stock || 0} en stock</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">No se encontraron productos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Formulario de Creación */}
      {showModal && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-black text-brand-dark">Agregar Nuevo Producto</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-brand-dark text-xl font-bold p-2">✕</button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Formulario */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Producto</label>
                  <input 
                    type="text" 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" placeholder="Ej. Termo Explorer 40oz" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Precio (Q)</label>
                    <input 
                      type="number" 
                      value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Envío (Q)</label>
                    <input 
                      type="number" 
                      value={formData.shippingPrice} onChange={(e) => setFormData({...formData, shippingPrice: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Stock</label>
                    <input 
                      type="number" 
                      value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
                    <select 
                      value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Marca</label>
                    <select 
                      value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50">
                      {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                  <textarea 
                    rows={4} 
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" placeholder="Describe el producto..."></textarea>
                </div>
              </div>

              {/* Uploader de Imágenes */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Imagen del Producto (URL o Archivo)</label>
                <input 
                  type="text" 
                  value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full mb-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" placeholder="https://... o sube un archivo abajo" />
                  
                <label className="border-2 border-dashed border-gray-200 rounded-3xl h-48 flex flex-col items-center justify-center bg-gray-50 hover:bg-brand-light/5 transition-colors group cursor-pointer overflow-hidden relative">
                  {formData.imageUrl && formData.imageUrl.startsWith('data:image') ? (
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-brand-light/10 flex items-center justify-center text-brand-light mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud size={32} />
                      </div>
                      <p className="font-bold text-brand-dark mb-1">Haz clic para subir imagen local</p>
                      <p className="text-sm text-gray-400 text-center px-4">Soporta JPG, PNG (se guardará como Base64)</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-3xl mt-auto">
              <button onClick={() => setShowModal(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-brand-dark">Cancelar</button>
              <button onClick={handleSave} className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-light transition-colors shadow-md">Guardar Producto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
