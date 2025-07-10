import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  vat: number;
  image: string;
  category: string;
  quantity: number;
}

interface ListStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, increment: boolean) => void;
  clearItems: () => void;
  hasItem: (productId: string) => boolean;
}

export const useListStore = create<ListStore>((set, get) => ({
  items: [],
  addItem: (product) => {
    set((state) => ({
      items: [...state.items, product],
    }));
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },
  updateQuantity: (productId, increment) => {
    set((state) => ({
      items: state.items.map((item) => 
        item.id === productId 
          ? { ...item, quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
          : item
      ),
    }));
  },
  clearItems: () => {
    set({ items: [] });
  },
  hasItem: (productId) => {
    return get().items.some((item) => item.id === productId);
  },
}));