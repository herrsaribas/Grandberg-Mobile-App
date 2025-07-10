import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { OrderWithItems, OrderStatus, ORDER_STATUS_LABELS } from '../../types/order';
import { Package, Clock, CheckCircle as CircleCheck, Download, Filter, CreditCard as Edit2, Eye, X, User, Building2, Phone, Mail } from 'lucide-react-native';
import { EditOrderModal } from './EditOrderModal';

interface OrderFilters {
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
}

const ITEMS_PER_PAGE = 20;

export function OrderManagement() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [totalOrders, setTotalOrders] = useState(0);
  const [editingOrder, setEditingOrder] = useState<OrderWithItems | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  async function fetchOrders(refresh = false) {
    try {
      if (refresh) {
        setPage(0);
        setOrders([]);
      }

      setLoading(true);
      
      // Admin sees all orders (no userId filter)
      const result = await orderService.listOrders({
        limit: ITEMS_PER_PAGE,
        offset: page * ITEMS_PER_PAGE,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      if (refresh) {
        setOrders(result.data);
      } else {
        setOrders(prev => {
          // Filter out any items from result.data that already exist in prev
          const existingIds = new Set(prev.map(order => order.id));
          const newOrders = result.data.filter(order => !existingIds.has(order.id));
          return [...prev, ...newOrders];
        });
      }

      setTotalOrders(result.count || 0);
      setHasMore((result.count || 0) > (page + 1) * ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Siparişler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const result = await orderService.updateOrderStatus(orderId, newStatus);

      if (!result.success) {
        throw new Error(result.error);
      }

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      Alert.alert('Başarılı', 'Sipariş durumu güncellendi!');
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Hata', 'Sipariş durumu güncellenirken bir hata oluştu.');
    }
  };

  const handleUpdateOrderItems = async (orderId: string, items: { id: string; quantity: number }[]) => {
    try {
      const result = await orderService.updateOrderItems(orderId, items);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Refresh orders to get updated data
      fetchOrders(true);
      Alert.alert('Başarılı', 'Sipariş başarıyla güncellendi!');
    } catch (error) {
      console.error('Error updating order items:', error);
      Alert.alert('Hata', 'Sipariş güncellenirken bir hata oluştu.');
    }
  };

  const handleExport = async () => {
    try {
      // Implementation for export functionality would go here
      Alert.alert('Bilgi', 'Dışa aktarma özelliği yakında eklenecek!');
    } catch (error) {
      Alert.alert('Hata', 'Dışa aktarma işlemi sırasında bir hata oluştu.');
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color="#16a34a" />;
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

  const handleOrderPress = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchOrders(true)}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Toplam</Text>
          <Text style={styles.statValue}>{totalOrders}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Bekleyen</Text>
          <Text style={styles.statValue}>
            {orders.filter(o => o.status === 'pending').length}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>İşlenen</Text>
          <Text style={styles.statValue}>
            {orders.filter(o => o.status === 'processing').length}
          </Text>
        </View>
      </View>

      {orders.map(order => (
        <View key={order.id} style={styles.orderCard}>
          <TouchableOpacity onPress={() => handleOrderPress(order)}>
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Package size={20} color="#64748b" />
                <Text style={styles.orderId}>Sipariş #{order.id.slice(0, 8)}</Text>
              </View>
              <View style={styles.orderActions}>
                <Eye size={16} color="#64748b" />
                <Text style={styles.orderDate}>
                  {formatDate(order.created_at)}
                </Text>
              </View>
            </View>

            <View style={styles.userInfo}>
              <User size={16} color="#64748b" />
              <Text style={styles.userName}>
                {order.user?.full_name || 'Bilinmeyen Kullanıcı'}
              </Text>
              <Text style={styles.userEmail}>
                ({order.user?.email || 'E-posta yok'})
              </Text>
            </View>

            <View style={styles.itemsList}>
              {order.items.slice(0, 2).map((item, index) => (
                <Text key={`${order.id}-${item.id}-${index}`} style={styles.itemText}>
                  {item.quantity}x {item.products?.name || 'Ürün'} - €{item.price.toFixed(2)}
                </Text>
              ))}
              {order.items.length > 2 && (
                <Text style={styles.itemMore}>
                  +{order.items.length - 2} diğer ürün
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.orderFooter}>
            <View style={styles.statusSection}>
              <Text style={styles.statusLabel}>Durum:</Text>
              <View style={[styles.statusBadge, styles[`status_${order.status}`]]}>
                {getStatusIcon(order.status as OrderStatus)}
                <Text style={[styles.statusText, styles[`statusText_${order.status}`]]}>
                  {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => setEditingOrder(order)}
              >
                <Edit2 size={16} color="#ffffff" />
                <Text style={styles.actionButtonText}>Düzenle</Text>
              </TouchableOpacity>

              {order.status !== 'processing' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.processButton]}
                  onPress={() => updateOrderStatus(order.id, 'processing')}
                >
                  <Text style={styles.actionButtonText}>İşleme Al</Text>
                </TouchableOpacity>
              )}
              {order.status !== 'completed' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.completeButton]}
                  onPress={() => updateOrderStatus(order.id, 'completed')}
                >
                  <Text style={styles.actionButtonText}>Tamamla</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Toplam:</Text>
            <Text style={styles.totalAmount}>€{order.total.toFixed(2)}</Text>
          </View>
        </View>
      ))}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      )}

      {!loading && hasMore && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={loadMore}
        >
          <Text style={styles.loadMoreButtonText}>Daha Fazla Yükle</Text>
        </TouchableOpacity>
      )}

      <EditOrderModal
        visible={!!editingOrder}
        order={editingOrder}
        onClose={() => setEditingOrder(null)}
        onSave={handleUpdateOrderItems}
      />

      {/* Order Detail Modal */}
      <Modal
        visible={showOrderModal}
        transparent
        animationType="slide"
        onRequestClose={closeOrderModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Sipariş Detayı #{selectedOrder?.id.slice(0, 8)}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeOrderModal}
              >
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedOrder && (
                <>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Müşteri Bilgileri</Text>
                    <View style={styles.customerInfo}>
                      <View style={styles.customerRow}>
                        <User size={16} color="#64748b" />
                        <Text style={styles.customerText}>
                          {selectedOrder.user?.full_name || 'Bilinmeyen'}
                        </Text>
                      </View>
                      <View style={styles.customerRow}>
                        <Mail size={16} color="#64748b" />
                        <Text style={styles.customerText}>
                          {selectedOrder.user?.email || 'E-posta yok'}
                        </Text>
                      </View>
                      {selectedOrder.user?.company_name && (
                        <View style={styles.customerRow}>
                          <Building2 size={16} color="#64748b" />
                          <Text style={styles.customerText}>
                            {selectedOrder.user.company_name}
                          </Text>
                        </View>
                      )}
                      {selectedOrder.user?.phone && (
                        <View style={styles.customerRow}>
                          <Phone size={16} color="#64748b" />
                          <Text style={styles.customerText}>
                            {selectedOrder.user.phone}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Sipariş Bilgileri</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Tarih:</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(selectedOrder.created_at)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Durum:</Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: `${getStatusColor(selectedOrder.status as OrderStatus)}15` }
                      ]}>
                        {getStatusIcon(selectedOrder.status as OrderStatus)}
                        <Text style={[
                          styles.statusBadgeText,
                          { color: getStatusColor(selectedOrder.status as OrderStatus) }
                        ]}>
                          {ORDER_STATUS_LABELS[selectedOrder.status as OrderStatus]}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Sipariş İçeriği</Text>
                    {selectedOrder.items.map((item, index) => (
                      <View key={index} style={styles.itemDetailRow}>
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemName}>
                            {item.products?.name || 'Ürün'}
                          </Text>
                          <Text style={styles.itemQuantity}>
                            {item.quantity} adet × €{item.price.toFixed(2)}
                          </Text>
                        </View>
                        <Text style={styles.itemTotal}>
                          €{(item.quantity * item.price).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Toplam</Text>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Genel Toplam:</Text>
                      <Text style={styles.totalAmount}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderDate: {
    fontSize: 14,
    color: '#64748b',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  itemsList: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 4,
  },
  itemMore: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    marginTop: 12,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  status_pending: {
    backgroundColor: '#f1f5f9',
  },
  status_processing: {
    backgroundColor: '#fef3c7',
  },
  status_completed: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusText_pending: {
    color: '#64748b',
  },
  statusText_processing: {
    color: '#d97706',
  },
  statusText_completed: {
    color: '#16a34a',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  editButton: {
    backgroundColor: '#2563eb',
  },
  processButton: {
    backgroundColor: '#f59e0b',
  },
  completeButton: {
    backgroundColor: '#16a34a',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  totalLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
  },
  loadMoreButton: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  loadMoreButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  customerInfo: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerText: {
    fontSize: 14,
    color: '#1e293b',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#64748b',
  },
  itemTotal: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
});