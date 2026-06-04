"use client";

import { useState, useEffect } from 'react';
import { Plus, Tag, Bookmark, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../../../store/useStore';

export default function AdminCategories() {
  const categories = useStore((state) => state.categories);
  const brands = useStore((state) => state.brands);
  const addCategory = useStore((state) => state.addCategory);
  const deleteCategory = useStore((state) => state.deleteCategory);
  const addBrand = useStore((state) => state.addBrand);
  const deleteBrand = useStore((state) => state.deleteBrand);

  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory("");
      setSuccessMsg("Categoría añadida con éxito");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleAddBrand = () => {
    if (newBrand.trim()) {
      addBrand(newBrand.trim());
      setNewBrand("");
      setSuccessMsg("Marca añadida con éxito");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center relative">
        <div>
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">Categorías y Marcas</h1>
          <p className="text-gray-500 font-medium mt-1">Organiza la clasificación de tu catálogo.</p>
        </div>
        {successMsg && (
          <div className="absolute right-0 bg-green-500 text-white px-6 py-3 rounded-xl font-bold animate-bounce shadow-lg">
            {successMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Categorías */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-light/10 text-brand-light rounded-lg">
                <Tag size={20} />
              </div>
              <h2 className="text-xl font-bold text-brand-dark">Categorías</h2>
            </div>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCategory();
            }} 
            className="flex gap-2 mb-6"
          >
            <input 
              type="text" 
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nueva categoría..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light/50"
            />
            <button type="submit" className="bg-brand-light/10 text-brand-dark px-4 py-2 rounded-xl font-bold hover:bg-brand-light hover:text-white transition-colors">
              Agregar
            </button>
          </form>
          
          <div className="space-y-3 flex-grow">
            {categories.map((cat) => (
              <div key={cat} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <span className="font-bold text-gray-700">{cat}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => deleteCategory(cat)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marcas */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-accent/20 text-brand-dark rounded-lg">
                <Bookmark size={20} />
              </div>
              <h2 className="text-xl font-bold text-brand-dark">Marcas</h2>
            </div>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAddBrand();
            }} 
            className="flex gap-2 mb-6"
          >
            <input 
              type="text" 
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              placeholder="Nueva marca..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light/50"
            />
            <button type="submit" className="bg-brand-accent/20 text-brand-dark px-4 py-2 rounded-xl font-bold hover:bg-brand-accent transition-colors">
              Agregar
            </button>
          </form>
          
          <div className="space-y-3 flex-grow">
            {brands.map((brand) => (
              <div key={brand} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <span className="font-bold text-gray-700">{brand}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => deleteBrand(brand)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
