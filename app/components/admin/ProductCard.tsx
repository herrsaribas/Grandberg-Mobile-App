import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { Product } from '@/types/product';
import { adminStyles } from '../../styles/adminStyles';

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const handleDelete = () => {
    Alert.alert(
      'Ürünü Sil',
      'Bu ürünü silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          onPress: onDelete,
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View>
      <Image source={{ uri: product.image }} style={adminStyles.productImage} />
      <View style={adminStyles.productInfo}>
        <View style={adminStyles.productHeader}>
          <View>
            <Text style={adminStyles.productName}>{product.name}</Text>
            <Text style={adminStyles.productDesc}>{product.description}</Text>
            <Text style={adminStyles.productCategory}>{product.category}</Text>
          </View>
          <View style={adminStyles.actionButtons}>
            <TouchableOpacity
              style={adminStyles.editButton}
              onPress={onEdit}
            >
              <Pencil size={20} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity
              style={adminStyles.deleteButton}
              onPress={handleDelete}
            >
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={adminStyles.priceContainer}>
          <Text style={adminStyles.priceNet}>€{product.price.toFixed(2)}</Text>
          <Text style={adminStyles.priceGross}>
            KDV (%{product.vat}): €{((product.price * product.vat) / 100).toFixed(2)}
          </Text>
          <Text style={adminStyles.priceTotal}>
            Toplam: €{(product.price + (product.price * product.vat) / 100).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}