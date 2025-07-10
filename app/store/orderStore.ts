import { create } from 'zustand';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'completed';
  total: number;
  items: OrderItem[];
  userId: string;
  userEmail?: string;
  userName?: string;
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  addOrder: (order) => {
    set((state) => ({
      orders: [{
        ...order,
        id: Math.random().toString(36).substr(2, 9)
      }, ...state.orders]
    }));
  },
  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map(order => 
        order.id === orderId 
          ? { ...order, status }
          : order
      )
    }));
  },
}));