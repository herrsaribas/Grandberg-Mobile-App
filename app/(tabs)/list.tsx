import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Trash2, Plus, Minus, ShoppingCart, Mail } from 'lucide-react-native';
import { useListStore } from '../store/listStore';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { listStyles } from '../styles/list';
import { router } from 'expo-router';
import { orderService } from '../services/orderService';

export default function ListScreen() {
  const { items, removeItem, updateQuantity, clearItems } = useListStore();
  const { addOrder } = useOrderStore();
  const { isAuthenticated, user } = useAuthStore();

  const totalNet = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalVat = items.reduce((sum, item) => sum + ((item.price * item.quantity) * item.vat / 100), 0);
  const totalGross = totalNet + totalVat;

  const handleAddProducts = () => {
    router.push('/');
  };

  const createOrderInDatabase = async () => {
    if (!isAuthenticated || !user) {
      return null;
    }

    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const result = await orderService.createOrder({
        userId: user.id,
        items: orderItems,
        total: totalGross
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Add to local store as well
      addOrder({
        id: result.data.id,
        date: new Date().toISOString(),
        status: 'pending',
        total: totalGross,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        userId: user.id,
        userEmail: user.email,
        userName: user.user_metadata?.full_name
      });

      return result.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handleEmailOrder = async () => {
    if (!isAuthenticated || !user) {
      router.push('/profile');
      return;
    }

    try {
      // First create the order in database
      await createOrderInDatabase();

      // Format the order message for email
      let message = `Yeni Sipariş\n\n`;
      message += `Müşteri Bilgileri:\n`;
      message += `Ad Soyad: ${user.user_metadata?.full_name}\n`;
      message += `E-posta: ${user.email}\n\n`;
      
      message += `Sipariş Detayı:\n`;
      items.forEach(item => {
        message += `• ${item.quantity}x ${item.name} - €${(item.price * item.quantity).toFixed(2)}\n`;
      });
      
      message += `\nToplam:\n`;
      message += `Ara Toplam: €${totalNet.toFixed(2)}\n`;
      message += `KDV: €${totalVat.toFixed(2)}\n`;
      message += `Genel Toplam: €${totalGross.toFixed(2)}`;

      // Encode the message for URL
      const encodedMessage = encodeURIComponent(message);
      const encodedSubject = encodeURIComponent('Yeni Sipariş');
      
      // Email address for orders
      const emailAddress = 'info@ornekfirma.de';
      
      // Create mailto URL
      const url = `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedMessage}`;

      // Check if the URL can be opened
      const canOpen = await Linking.canOpenURL(url);
      
      if (!canOpen) {
        throw new Error('E-posta uygulaması bulunamadı');
      }

      // Open email client
      await Linking.openURL(url);
      
      // Clear items and show success message
      clearItems();
      Alert.alert('Başarılı', 'Sipariş oluşturuldu ve e-posta uygulamanız açıldı!');
    } catch (error) {
      console.error('Error sending email:', error);
      Alert.alert(
        'Hata',
        'E-posta ile sipariş gönderilirken bir hata oluştu. Lütfen e-posta uygulamanızın yüklü olduğundan emin olun.'
      );
    }
  };

  const handleWhatsAppOrder = async () => {
    if (!isAuthenticated || !user) {
      router.push('/profile');
      return;
    }

    try {
      // First create the order in database
      await createOrderInDatabase();

      // Format the order message
      let message = `*Yeni Sipariş*\n\n`;
      message += `*Müşteri Bilgileri:*\n`;
      message += `Ad Soyad: ${user.user_metadata?.full_name}\n`;
      message += `E-posta: ${user.email}\n\n`;
      
      message += `*Sipariş Detayı:*\n`;
      items.forEach(item => {
        message += `• ${item.quantity}x ${item.name} - €${(item.price * item.quantity).toFixed(2)}\n`;
      });
      
      message += `\n*Toplam:*\n`;
      message += `Ara Toplam: €${totalNet.toFixed(2)}\n`;
      message += `KDV: €${totalVat.toFixed(2)}\n`;
      message += `Genel Toplam: €${totalGross.toFixed(2)}`;

      // Encode the message for URL
      const encodedMessage = encodeURIComponent(message);
      
      // WhatsApp business number
      const phoneNumber = '905340301025'; // Format: countrycode + number without leading +
      
      // Create WhatsApp URL
      const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // Check if the URL can be opened
      const canOpen = await Linking.canOpenURL(url);
      
      if (!canOpen) {
        throw new Error('WhatsApp uygulaması bulunamadı');
      }

      // Open WhatsApp
      await Linking.openURL(url);
      
      // Clear items and show success message
      clearItems();
      Alert.alert('Başarılı', 'Sipariş oluşturuldu ve WhatsApp açıldı!');
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      Alert.alert(
        'Hata',
        'WhatsApp ile sipariş gönderilirken bir hata oluştu. Lütfen WhatsApp\'ın yüklü olduğundan emin olun.'
      );
    }
  };

  return (
    <SafeAreaView style={listStyles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {items.length === 0 ? (
          <View style={listStyles.emptyState}>
            <View style={listStyles.emptyStateContent}>
              <ShoppingCart size={48} color="#64748b" />
              <Text style={listStyles.emptyStateText}>Listenizde henüz ürün bulunmuyor</Text>
              <TouchableOpacity 
                style={listStyles.addButton}
                onPress={handleAddProducts}
              >
                <Plus size={20} color="#ffffff" />
                <Text style={listStyles.addButtonText}>Yeni Ürün Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {items.map((item) => (
              <View key={item.id} style={listStyles.listItem}>
                <Image source={{ uri: item.image }} style={listStyles.itemImage} />
                <View style={listStyles.itemDetails}>
                  <View style={listStyles.itemHeader}>
                    <Text style={listStyles.itemName}>{item.name}</Text>
                    <View style={listStyles.quantityControls}>
                      <TouchableOpacity 
                        style={listStyles.quantityButton}
                        onPress={() => updateQuantity(item.id, false)}
                      >
                        <Minus size={16} color="#64748b" />
                      </TouchableOpacity>
                      <Text style={listStyles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity 
                        style={listStyles.quantityButton}
                        onPress={() => updateQuantity(item.id, true)}
                      >
                        <Plus size={16} color="#64748b" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={listStyles.itemDesc}>{item.description}</Text>
                  <View style={listStyles.priceContainer}>
                    <Text style={listStyles.priceNet}>€{(item.price * item.quantity).toFixed(2)}</Text>
                    <Text style={listStyles.vatAmount}>
                      KDV (%{item.vat}): €{((item.price * item.quantity * item.vat) / 100).toFixed(2)}
                    </Text>
                    <Text style={listStyles.priceGross}>
                      Toplam: €{(item.price * item.quantity * (1 + item.vat / 100)).toFixed(2)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={listStyles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Trash2 color="#ef4444" size={20} />
                </TouchableOpacity>
              </View>
            ))}

            <View style={listStyles.summary}>
              <View style={listStyles.summaryContent}>
                <Text style={listStyles.summaryText}>Ara Toplam: €{totalNet.toFixed(2)}</Text>
                <Text style={listStyles.summaryText}>KDV: €{totalVat.toFixed(2)}</Text>
                <Text style={listStyles.totalValue}>Toplam: €{totalGross.toFixed(2)}</Text>
              </View>
            </View>

            <View style={listStyles.orderButtons}>
              <TouchableOpacity 
                style={[listStyles.orderButton, listStyles.emailButton]}
                onPress={handleEmailOrder}
              >
                <Mail color="#ffffff" size={20} />
                <Text style={listStyles.orderButtonText}>Mail ile Gönder</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[listStyles.orderButton, listStyles.whatsappButton]}
                onPress={handleWhatsAppOrder}
              >
                <MessageCircle color="#ffffff" size={20} />
                <Text style={listStyles.orderButtonText}>WhatsApp ile Gönder</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}