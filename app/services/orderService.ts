import { supabase } from '../lib/supabase';
import { OrderWithItems, OrderStatus } from '../types/order';
import { userService } from './userService';
import { sendPushNotification } from '../lib/notifications';

interface CreateOrderParams {
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  deliveryAddress?: string;
  notes?: string;
}

interface ListOrdersParams {
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
  status?: OrderStatus;
  userId?: string; // Add userId filter for user-specific orders
}

export const orderService = {
  async createOrder(params: CreateOrderParams) {
    try {
      const { userId, items, total, deliveryAddress, notes } = params;

      // Start a Supabase transaction
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total,
          delivery_address: deliveryAddress,
          notes,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Send notification to admins about new order
      try {
        const adminTokensResult = await userService.getAdminPushTokens();
        if (adminTokensResult.success && adminTokensResult.tokens) {
          const notificationPromises = adminTokensResult.tokens.map(token =>
            sendPushNotification(
              token,
              'Yeni Sipariş!',
              `Yeni bir sipariş alındı. Toplam: €${total.toFixed(2)}`,
              { 
                type: 'new_order',
                orderId: order.id,
                screen: '/admin/orders'
              }
            )
          );
          
          // Send notifications in parallel but don't wait for them to complete
          Promise.all(notificationPromises).catch(error => {
            console.error('Error sending notifications:', error);
          });
        }
      } catch (notificationError) {
        // Don't fail the order creation if notification fails
        console.error('Error sending order notifications:', notificationError);
      }

      return { success: true, data: order };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sipariş oluşturulurken bir hata oluştu',
      };
    }
  },

  async listOrders(params: ListOrdersParams = {}) {
    try {
      const {
        limit = 50,
        offset = 0,
        startDate,
        endDate,
        status,
        userId,
      } = params;

      // Build the query with proper joins
      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            id,
            product_id,
            quantity,
            price,
            products(
              name,
              description
            )
          ),
          user:users(
            email,
            full_name,
            company_name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }

      if (endDate) {
        query = query.lte('created_at', endDate.toISOString());
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data: orders, error: ordersError, count } = await query;

      if (ordersError) throw ordersError;

      // Transform the data to ensure proper structure
      const transformedOrders = (orders || []).map(order => ({
        ...order,
        user: order.user || null, // Ensure user is null if not found instead of undefined
        items: order.items || []
      }));

      return {
        success: true,
        data: transformedOrders as OrderWithItems[],
        count,
      };
    } catch (error) {
      console.error('Error listing orders:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Siparişler listelenirken bir hata oluştu',
      };
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sipariş durumu güncellenirken bir hata oluştu',
      };
    }
  },

  async updateOrderItems(orderId: string, items: { id: string; quantity: number }[]) {
    try {
      // Update each item individually to ensure proper RLS handling
      const updatePromises = items.map(async (item) => {
        const { error } = await supabase
          .from('order_items')
          .update({ quantity: item.quantity })
          .eq('id', item.id);

        if (error) throw error;
        return { success: true };
      });

      await Promise.all(updatePromises);

      return { success: true };
    } catch (error) {
      console.error('Error updating order items:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sipariş ürünleri güncellenirken bir hata oluştu',
      };
    }
  },

  async getOrderDetails(orderId: string) {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            id,
            product_id,
            quantity,
            price,
            products(
              name,
              description
            )
          ),
          user:users(
            email,
            full_name,
            company_name,
            phone
          )
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      return {
        success: true,
        data: {
          ...order,
          user: order.user || null
        } as OrderWithItems
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sipariş detayları alınırken bir hata oluştu',
      };
    }
  },
};