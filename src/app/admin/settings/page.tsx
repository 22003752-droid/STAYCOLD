"use client";

import { Save, User, Mail, Shield, Globe, Phone, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("perfil");
  const settingsRaw = useStore((state) => state.settings ?? { whatsappNumber: '50200000000', storeName: 'Staycold Oficial' });
  const settings = settingsRaw as any;
  const updateSettings = useStore((state) => state.updateSettings);

  const [localSettings, setLocalSettings] = useState({
    whatsappNumber: settings?.whatsappNumber || '50200000000',
    storeName: settings?.storeName || 'Staycold Oficial',
    instagramUrl: settings?.instagramUrl || '',
    tiktokUrl: settings?.tiktokUrl || '',
    facebookUrl: settings?.facebookUrl || ''
  });
  const [mounted, setMounted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setMounted(true);
    setLocalSettings(settings);
  }, [settings]);

  if (!mounted) return null;

  const handleSave = () => {
    updateSettings(localSettings);
    setSuccessMsg("Información guardada con éxito");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">Configuración</h1>
          <p className="text-gray-500 font-medium mt-1">Ajustes generales de tu tienda y cuenta.</p>
        </div>
        {successMsg && (
          <div className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold animate-bounce shadow-lg shadow-green-500/20">
            {successMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar Nav Settings */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab("perfil")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-left ${activeTab === 'perfil' ? 'bg-white shadow-sm text-brand-dark border-l-4 border-brand-dark' : 'text-gray-500 hover:bg-gray-100 font-medium'}`}
          >
            <User size={20} />
            Perfil de Usuario
          </button>
          <button 
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-left ${activeTab === 'general' ? 'bg-white shadow-sm text-brand-dark border-l-4 border-brand-dark' : 'text-gray-500 hover:bg-gray-100 font-medium'}`}
          >
            <Globe size={20} />
            General de la Tienda
          </button>
          <button 
            onClick={() => setActiveTab("seguridad")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-left ${activeTab === 'seguridad' ? 'bg-white shadow-sm text-brand-dark border-l-4 border-brand-dark' : 'text-gray-500 hover:bg-gray-100 font-medium'}`}
          >
            <Shield size={20} />
            Seguridad
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          {activeTab === "perfil" && (
            <>
              <h2 className="text-xl font-bold text-brand-dark mb-6 border-b border-gray-100 pb-4">Información del Perfil</h2>
              <div className="space-y-6 max-w-lg">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-brand-light/20 flex items-center justify-center text-4xl text-brand-dark font-black">
                    A
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-brand-dark font-bold rounded-lg transition-colors text-sm">
                      Cambiar Avatar
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
                  <input type="text" defaultValue="Administrador Staycold" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="email" defaultValue="admin@staycold.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" />
                  </div>
                </div>
                <div className="pt-6">
                  <button 
                    onClick={handleSave}
                    className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-light transition-colors shadow-md flex items-center gap-2"
                  >
                    <Save size={18} />
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "general" && (
            <>
              <h2 className="text-xl font-bold text-brand-dark mb-6 border-b border-gray-100 pb-4">General de la Tienda</h2>
              <div className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Tienda</label>
                  <input 
                    type="text" 
                    value={localSettings.storeName} 
                    onChange={(e) => setLocalSettings({...localSettings, storeName: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp de Contacto (con código de país)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={localSettings.whatsappNumber} 
                      onChange={(e) => setLocalSettings({...localSettings, whatsappNumber: e.target.value})}
                      placeholder="50200000000"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" 
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Ejemplo: 50255554444 (Sin el símbolo +)</p>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-bold text-brand-dark mb-4">Redes Sociales</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Instagram (URL)</label>
                      <input 
                        type="text" 
                        value={localSettings.instagramUrl} 
                        onChange={(e) => setLocalSettings({...localSettings, instagramUrl: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" 
                        placeholder="https://instagram.com/staycold" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">TikTok (URL)</label>
                      <input 
                        type="text" 
                        value={localSettings.tiktokUrl} 
                        onChange={(e) => setLocalSettings({...localSettings, tiktokUrl: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" 
                        placeholder="https://tiktok.com/@staycold" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Facebook (URL)</label>
                      <input 
                        type="text" 
                        value={localSettings.facebookUrl} 
                        onChange={(e) => setLocalSettings({...localSettings, facebookUrl: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" 
                        placeholder="https://facebook.com/staycold" 
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Moneda Principal</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50">
                    <option value="GTQ">Quetzales (Q)</option>
                    <option value="USD">Dólares Estadounidenses ($)</option>
                  </select>
                </div>
                <div className="pt-6">
                  <button 
                    onClick={handleSave}
                    className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-light transition-colors shadow-md flex items-center gap-2"
                  >
                    <Save size={18} />
                    Guardar Configuración
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "seguridad" && (
            <>
              <h2 className="text-xl font-bold text-brand-dark mb-6 border-b border-gray-100 pb-4">Seguridad</h2>
              <div className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña Actual</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nueva Contraseña</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-light/50" />
                </div>
                <div className="pt-6">
                  <button 
                    onClick={handleSave}
                    className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-light transition-colors shadow-md flex items-center gap-2"
                  >
                    <Save size={18} />
                    Actualizar Contraseña
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
