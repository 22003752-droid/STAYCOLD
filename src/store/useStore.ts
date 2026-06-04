import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  brand: string;
  ounces: number;
  isNew?: boolean;
  description: string;
  stock: number;
  shippingPrice: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  // Cart State
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartShippingTotal: () => number;
  cartCount: () => number;

  // DB State (Mock)
  products: Product[];
  categories: string[];
  brands: string[];
  
  // DB Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  
  addBrand: (brand: string) => void;
  deleteBrand: (brand: string) => void;

  // Settings State
  settings: {
    whatsappNumber: string;
    storeName: string;
    instagramUrl: string;
    tiktokUrl: string;
    facebookUrl: string;
  };
  updateSettings: (settings: { whatsappNumber?: string; storeName?: string }) => void;
  
  // Server Sync
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  fetchSettings: () => Promise<void>;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Termo Staycold Explorer",
    price: 35.99,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800",
    category: "Deportivos",
    brand: "Staycold Premium",
    ounces: 40,
    isNew: true,
    description: "El termo definitivo para tus aventuras. Mantiene el frío por 24 horas y el calor por 12 horas. Acero inoxidable de doble pared.",
    stock: 50,
    shippingPrice: 15.00
  },
  {
    id: 2,
    name: "Pachón Kids Adventure",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1544605481-81d3bc2c9e78?auto=format&fit=crop&q=80&w=800",
    category: "Niños",
    brand: "Staycold Basic",
    ounces: 12,
    description: "Perfecto para el regreso a clases. Antiderrames, ligero y con colores divertidos que a tus hijos les encantarán.",
    stock: 20,
    shippingPrice: 10.00
  },
  {
    id: 3,
    name: "Taza Térmica Office Pro",
    price: 24.50,
    imageUrl: "https://images.unsplash.com/photo-1517083074811-0e1d0df9f64c?auto=format&fit=crop&q=80&w=800",
    category: "Oficina",
    brand: "Staycold Premium",
    ounces: 20,
    description: "Elegancia en tu escritorio. Tu café caliente durante toda la mañana, o tu agua fría todo el día.",
    stock: 15,
    shippingPrice: 12.00
  },
  {
    id: 4,
    name: "Botella Slim Fit",
    price: 28.00,
    imageUrl: "https://images.unsplash.com/photo-1606822209772-50d4f2bc4ee8?auto=format&fit=crop&q=80&w=800",
    category: "Deportivos",
    brand: "Staycold Premium",
    ounces: 24,
    description: "Diseño ergonómico perfecto para el portavasos de tu auto o la caminadora del gimnasio.",
    stock: 100,
    shippingPrice: 15.00
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // --- CART ---
      cart: [],
      isCartOpen: false,
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      addToCart: (product, quantity = 1) => set((state) => {
        const existingItem = state.cart.find(item => item.product.id === product.id);
        if (existingItem) {
          return {
            cart: state.cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        }
        return { cart: [...state.cart, { product, quantity }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.product.id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((total, item) => total + (item.product.price * item.quantity), 0),
      cartShippingTotal: () => {
        const items = get().cart;
        if (items.length === 0) return 0;
        // El envío es único, tomamos el mayor costo de envío de los productos en el carrito
        return Math.max(...items.map(item => item.product.shippingPrice || 0));
      },
      cartCount: () => get().cart.reduce((count, item) => count + item.quantity, 0),

      // --- MOCK DB ---
      products: initialProducts,
      categories: ["Deportivos", "Oficina", "Niños", "Aventura"],
      brands: ["Staycold Premium", "Staycold Basic", "Owala", "Yeti"],
      
      addProduct: async (product) => {
        try {
          const res = await fetch('/api/products', {
            method: 'POST',
            body: JSON.stringify(product)
          });
          const newProduct = await res.json();
          if (!newProduct.error) {
            set((state) => ({ products: [...state.products, newProduct] }));
          }
        } catch (e) { console.error(e); }
      },
      updateProduct: async (product) => {
        try {
          const res = await fetch('/api/products', {
            method: 'PUT',
            body: JSON.stringify(product)
          });
          const updatedProduct = await res.json();
          if (!updatedProduct.error) {
            set((state) => ({
              products: state.products.map(p => p.id === product.id ? product : p)
            }));
          }
        } catch (e) { console.error(e); }
      },
      deleteProduct: async (id) => {
        try {
          await fetch(`/api/products?id=${id}`, {
            method: 'DELETE'
          });
          set((state) => ({
            products: state.products.filter(p => p.id !== id)
          }));
        } catch (e) { console.error(e); }
      },
      
      addCategory: async (category) => {
        try {
          const res = await fetch('/api/categories', {
            method: 'POST',
            body: JSON.stringify({ category })
          });
          const data = await res.json();
          set({ categories: data });
        } catch (e) { console.error(e); }
      },
      deleteCategory: async (category) => {
        try {
          const res = await fetch(`/api/categories?name=${category}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          set({ categories: data });
        } catch (e) { console.error(e); }
      },
      
      addBrand: async (brand) => {
        try {
          const res = await fetch('/api/brands', {
            method: 'POST',
            body: JSON.stringify({ brand })
          });
          const data = await res.json();
          set({ brands: data });
        } catch (e) { console.error(e); }
      },
      deleteBrand: async (brand) => {
        try {
          const res = await fetch(`/api/brands?name=${brand}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          set({ brands: data });
        } catch (e) { console.error(e); }
      },

      // --- SETTINGS ---
      settings: {
        whatsappNumber: '50200000000',
        storeName: 'Staycold Oficial',
        instagramUrl: '',
        tiktokUrl: '',
        facebookUrl: ''
      },
      updateSettings: async (newSettings) => {
        try {
          const res = await fetch('/api/settings', {
            method: 'POST',
            body: JSON.stringify(newSettings)
          });
          const updated = await res.json();
          set({ settings: updated });
        } catch (e) { console.error(e); }
      },

      // --- SERVER SYNC ---
      fetchProducts: async () => {
        try {
          const res = await fetch('/api/products');
          const data = await res.json();
          if (Array.isArray(data)) set({ products: data });
        } catch (e) { console.error(e); }
      },
      fetchCategories: async () => {
        try {
          const res = await fetch('/api/categories');
          const data = await res.json();
          if (Array.isArray(data)) set({ categories: data });
        } catch (e) { console.error(e); }
      },
      fetchBrands: async () => {
        try {
          const res = await fetch('/api/brands');
          const data = await res.json();
          if (Array.isArray(data)) set({ brands: data });
        } catch (e) { console.error(e); }
      },
      fetchSettings: async () => {
        try {
          const res = await fetch('/api/settings');
          const data = await res.json();
          if (data && data.storeName) set({ settings: data });
        } catch (e) { console.error(e); }
      }
    }),
    {
      name: 'staycold-storage',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        let state = persistedState;
        if (version < 2) {
          state = {
            ...state,
            settings: {
              whatsappNumber: state.settings?.whatsappNumber || '50200000000',
              storeName: state.settings?.storeName || 'Staycold Oficial',
              instagramUrl: state.settings?.instagramUrl || '',
              tiktokUrl: state.settings?.tiktokUrl || '',
              facebookUrl: state.settings?.facebookUrl || ''
            }
          };
        }
        return state;
      },
    }
  )
);
