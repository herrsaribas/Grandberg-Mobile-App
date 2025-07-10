import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ChevronRight, Package, Clock, CheckCircle as CircleCheck, Eye, X } from 'lucide-react-native';
import { orderStyles } from '../../styles/order';
import { OrderWithItems, OrderStatus, ORDER_STATUS_LABELS } from '../../types/order';
import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';

interface OrderListProps {
  userId: string;
}

export function OrderList({ userId }: OrderListProps) {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Filter orders for the current user by passing userId
      const result = await orderService.listOrders({ userId });
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setOrders(result.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' - ' + date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <CircleCheck size={16} color="#16a34a" />;
      case 'processing':
        return <Clock size={16} color="#f59e0b" />;
      default:
        return <Clock size={16} color="#64748b" />;
    }
  };

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'completed':
        return '#16a34a';
      case 'processing':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const handleOrderPress = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <View style={orderStyles.loadingContainer}>
        <Text style={orderStyles.loadingText}>Siparişler yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={orderStyles.errorContainer}>
        <Text style={orderStyles.errorText}>{error}</Text>
        <TouchableOpacity
          style={orderStyles.retryButton}
          onPress={fetchOrders}
        >
          <Text style={orderStyles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={orderStyles.emptyContainer}>
        <Text style={orderStyles.emptyText}>Henüz siparişiniz bulunmuyor</Text>
      </View>
    );
  }

  return (
    <>
      <View style={orderStyles.orderList}>
        {orders.map((order) => (
          <TouchableOpacity 
            key={order.id} 
            style={orderStyles.orderCard}
            onPress={() => handleOrderPress(order)}
          >
            <View style={orderStyles.orderHeader}>
              <View style={orderStyles.orderInfo}>
                <Package size={20} color="#64748b" />
                <Text style={orderStyles.orderId}>Sipariş #{order.id.slice(0, 8)}</Text>
              </View>
              <View style={orderStyles.orderActions}>
                <Eye size={16} color="#64748b" />
                <ChevronRight size={20} color="#64748b" />
              </View>
            </View>

            <View style={orderStyles.orderDate}>
              <Clock size={16} color="#64748b" />
              <Text style={orderStyles.orderDateText}>{formatDate(order.created_at)}</Text>
            </View>

            <View style={orderStyles.orderItems}>
              {order.items.slice(0, 2).map((item, index) => (
                <Text key={index} style={orderStyles.orderItemText}>
                  {item.quantity}x {item.products?.name || 'Ürün'} - €{item.price.toFixed(2)}
                </Text>
              ))}
              {order.items.length > 2 && (
                <Text style={orderStyles.orderItemMore}>
                  +{order.items.length - 2} diğer ürün
                </Text>
              )}
            </View>

            <View style={orderStyles.orderFooter}>
              <View style={[
                orderStyles.orderStatus,
                { backgroundColor: `${getStatusColor(order.status as OrderStatus)}15` }
              ]}>
                {getStatusIcon(order.status as OrderStatus)}
                <Text style={[
                  orderStyles.orderStatusText,
                  { color: getStatusColor(order.status as OrderStatus) }
                ]}>
                  {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                </Text>
              </View>
              <Text style={orderStyles.orderTotal}>
                €{order.total.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Order Detail Modal */}
      <Modal
        visible={showOrderModal}
        transparent
        animationType="slide"
        onRequestClose={closeOrderModal}
      >
        <View style={orderStyles.modalOverlay}>
          <View style={orderStyles.modalContent}>
            <View style={orderStyles.modalHeader}>
              <Text style={orderStyles.modalTitle}>
                Sipariş Detayı #{selectedOrder?.id.slice(0, 8)}
              </Text>
              <TouchableOpacity
                style={orderStyles.closeButton}
                onPress={closeOrderModal}
              >
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={orderStyles.modalBody}>
              {selectedOrder && (
                <>
                  <View style={orderStyles.detailSection}>
                    <Text style={orderStyles.detailSectionTitle}>Sipariş Bilgileri</Text>
                    <View style={orderStyles.detailRow}>
                      <Text style={orderStyles.detailLabel}>Tarih:</Text>
                      <Text style={orderStyles.detailValue}>
                        {formatDate(selectedOrder.created_at)}
                      </Text>
                    </View>
                    <View style={orderStyles.detailRow}>
                      <Text style={orderStyles.detailLabel}>Durum:</Text>
                      <View style={[
                        orderStyles.statusBadge,
                        { backgroundColor: `${getStatusColor(selectedOrder.status as OrderStatus)}15` }
                      ]}>
                        {getStatusIcon(selectedOrder.status as OrderStatus)}
                        <Text style={[
                          orderStyles.statusBadgeText,
                          { color: getStatusColor(selectedOrder.status as OrderStatus) }
                        ]}>
                          {ORDER_STATUS_LABELS[selectedOrder.status as OrderStatus]}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={orderStyles.detailSection}>
                    <Text style={orderStyles.detailSectionTitle}>Sipariş İçeriği</Text>
                    {selectedOrder.items.map((item, index) => (
                      <View key={index} style={orderStyles.itemDetailRow}>
                        <View style={orderStyles.itemInfo}>
                          <Text style={orderStyles.itemName}>
                            {item.products?.name || 'Ürün'}
                          </Text>
                          <Text style={orderStyles.itemQuantity}>
                            {item.quantity} adet × €{item.price.toFixed(2)}
                          </Text>
                        </View>
                        <Text style={orderStyles.itemTotal}>
                          €{(item.quantity * item.price).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={orderStyles.detailSection}>
                    <Text style={orderStyles.detailSectionTitle}>Toplam</Text>
                    <View style={orderStyles.totalRow}>
                      <Text style={orderStyles.totalLabel}>Genel Toplam:</Text>
                      <Text style={orderStyles.totalAmount}>
                        €{selectedOrder.total.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}