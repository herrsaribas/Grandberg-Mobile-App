import { Database } from './supabase';

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];

export type OrderWithItems = Order & {
  items: OrderItem[];
  user?: {
    email: string;
    full_name: string;
  };
};

export type OrderStatus = 'pending' | 'processing' | 'completed';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Bekliyor',
  processing: 'İşleniyor',
  completed: 'Tamamlandı'
};