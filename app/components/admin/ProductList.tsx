import { View, Text } from 'react-native';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { EditProductForm } from './EditProductForm';
import { adminStyles } from '../../styles/adminStyles';

interface ProductListProps {
  products: Product[];
  editingProduct: Product | null;
  onEditProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onCancelEdit: () => void;
  updating?: boolean;
}

export function ProductList({
  products,
  editingProduct,
  onEditProduct,
  onUpdateProduct,
  onDeleteProduct,
  onCancelEdit,
  updating = false,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <View style={adminStyles.emptyState}>
        <Text style={adminStyles.emptyStateText}>
          Henüz hiç ürün eklenmemiş.
        </Text>
      </View>
    );
  }

  return (
    <View style={adminStyles.section}>
      <Text style={adminStyles.sectionTitle}>Mevcut Ürünler</Text>
      {products.map((product) => (
        <View key={product.id} style={adminStyles.card}>
          {editingProduct?.id === product.id ? (
            <EditProductForm
              product={editingProduct}
              onUpdate={onUpdateProduct}
              onCancel={onCancelEdit}
            />
          ) : (
            <ProductCard
              product={product}
              onEdit={() => onEditProduct(product)}
              onDelete={() => onDeleteProduct(product.id)}
            />
          )}
        </View>
      ))}
    </View>
  );
}