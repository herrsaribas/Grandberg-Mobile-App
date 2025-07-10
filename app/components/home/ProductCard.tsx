import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Check, Plus, Minus } from 'lucide-react-native';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  quantity: number;
  isInList: boolean;
  onUpdateQuantity: (increment: boolean) => void;
  onToggleInList: () => void;
}

export function ProductCard({ 
  product, 
  quantity, 
  isInList, 
  onUpdateQuantity, 
  onToggleInList 
}: ProductCardProps) {
  const grossPrice = (product.price * (100 + product.vat)) / 100;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
      </View>
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(false)}
            >
              <Minus size={16} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(true)}
            >
              <Plus size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.priceNet}>€{product.price.toFixed(2)}</Text>
          <Text style={styles.priceGross}>KDV Dahil: €{grossPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.addButton, isInList && styles.addButtonActive]}
          onPress={onToggleInList}
        >
          {isInList ? (
            <View style={styles.buttonContent}>
              <Check size={18} color="#ffffff" />
              <Text style={styles.buttonText}>Listede</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Listeye Ekle</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 160,
  },
  imageContainer: {
    width: 120,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
  },
  priceContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  priceNet: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
  },
  priceGross: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quantityText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    marginHorizontal: 14,
  },
  addButton: {
    backgroundColor: '#2563eb',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonActive: {
    backgroundColor: '#16a34a',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});