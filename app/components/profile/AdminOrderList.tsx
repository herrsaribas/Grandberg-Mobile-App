import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, Package, Clock, CircleCheck, User } from 'lucide-react-native';
import { orderStyles } from '../../styles/order';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'completed';
  total: number;
  items: OrderItem[];
  userId: string;
  userEmail?: string;
  userName?: string;
}

interface AdminOrderListProps {
  orders: Order[];
}

export function AdminOrderList({ orders }: AdminOrderListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#16a34a';
      case 'processing':
        return '#f59e0b';
      case 'pending':
        return '#64748b';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CircleCheck size={16} color="#16a34a" />;
      case 'processing':
        return <Clock size={16} color="#f59e0b" />;
      case 'pending':
        return <Clock size={16} color="#64748b" />;
      default:
        return <Clock size={16} color="#64748b" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'processing':
        return 'İşleniyor';
      case 'pending':
        return 'Bekliyor';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <View style={orderStyles.orderList}>
      {orders.map((order) => (
        <View key={order.id} style={orderStyles.orderCard}>
          <View style={orderStyles.orderHeader}>
            <View style={orderStyles.orderInfo}>
              <Package size={20} color="#64748b" />
              <Text style={orderStyles.orderId}>Sipariş #{order.id}</Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </View>

          <View style={orderStyles.userInfo}>
            <User size={16} color="#64748b" />
            <Text style={orderStyles.userName}>
              {order.userName || order.userEmail || 'Bilinmeyen Kullanıcı'}
            </Text>
          </View>

          <View style={orderStyles.orderDate}>
            <Clock size={16} color="#64748b" />
            <Text style={orderStyles.orderDateText}>{formatDate(order.date)}</Text>
          </View>

          <View style={orderStyles.orderItems}>
            {order.items.slice(0, 2).map((item, index) => (
              <Text key={index} style={orderStyles.orderItemText}>
                {item.quantity}x {item.name}
              </Text>
            ))}
            {order.items.length > 2 && (
              <Text style={orderStyles.orderItemMore}>
                +{order.items.length - 2} diğer ürün
              </Text>
            )}
          </View>

          <View style={orderStyles.orderFooter}>
            <View style={[orderStyles.orderStatus, { backgroundColor: `${getStatusColor(order.status)}15` }]}>
              {getStatusIcon(order.status)}
              <Text style={[orderStyles.orderStatusText, { color: getStatusColor(order.status) }]}>
                {getStatusText(order.status)}
              </Text>
            </View>
            <Text style={orderStyles.orderTotal}>
              €{order.total.toFixed(2)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}