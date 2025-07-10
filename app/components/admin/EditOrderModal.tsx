import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { X, Plus, Minus, Save } from 'lucide-react-native';
import { OrderWithItems } from '../../types/order';
import { useState, useEffect } from 'react';

interface EditOrderModalProps {
  visible: boolean;
  order: OrderWithItems | null;
  onClose: () => void;
  onSave: (orderId: string, items: { id: string; quantity: number }[]) => Promise<void>;
}

export function EditOrderModal({ visible, order, onClose, onSave }: EditOrderModalProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      const initialQuantities = order.items.reduce((acc, item) => {
        // Ensure we always have a valid number for quantity, defaulting to 1 if undefined
        acc[item.id] = item.quantity !== undefined ? item.quantity : 1;
        return acc;
      }, {} as Record<string, number>);
      setQuantities(initialQuantities);
    }
  }, [order]);

  const handleUpdateQuantity = (itemId: string, increment: boolean) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: increment ? (prev[itemId] || 1) + 1 : Math.max(1, (prev[itemId] || 1) - 1)
    }));
  };

  const handleSave = async () => {
    if (!order) return;
    
    try {
      setLoading(true);
      const updatedItems = order.items.map(item => ({
        id: item.id,
        quantity: quantities[item.id] || 1 // Ensure we always have a valid quantity
      }));
      
      await onSave(order.id, updatedItems);
      onClose();
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Sipariş Düzenle</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.itemsList}>
            {order.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {item.products?.name || 'Ürün'}
                  </Text>
                  <Text style={styles.itemPrice}>
                    €{item.price.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleUpdateQuantity(item.id, false)}
                  >
                    <Minus size={16} color="#64748b" />
                  </TouchableOpacity>
                  
                  <TextInput
                    style={styles.quantityInput}
                    value={String(quantities[item.id] || 1)} // Ensure we always have a valid string value
                    onChangeText={(text) => {
                      const num = parseInt(text) || 1;
                      setQuantities(prev => ({
                        ...prev,
                        [item.id]: num
                      }));
                    }}
                    keyboardType="number-pad"
                  />
                  
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleUpdateQuantity(item.id, true)}
                  >
                    <Plus size={16} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Save size={20} color="#ffffff" />
            <Text style={styles.saveButtonText}>
              {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  itemsList: {
    padding: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#64748b',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quantityInput: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});