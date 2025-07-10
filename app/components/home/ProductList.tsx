import { View, Text } from 'react-native';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/product';
import { homeStyles } from '../../styles/homeStyles';

interface ProductListProps {
  products: Product[];
  quantities: Record<string, number>;
  hasItem: (id: string) => boolean;
  onUpdateQuantity: (productId: string, increment: boolean) => void;
  onToggleInList: (product: Product) => void;
}

export function ProductList({ 
  products, 
  quantities, 
  hasItem, 
  onUpdateQuantity, 
  onToggleInList 
}: ProductListProps) {
  return (
    <View style={homeStyles.productsContainer}>
      <View style={homeStyles.productsHeader}>
        <Text style={homeStyles.productsTitle}>Tüm Ürünler</Text>
      </View>
      <View style={homeStyles.productsList}>
        {products.map((product) => (
          <View key={product.id} style={homeStyles.productWrapper}>
            <ProductCard
              product={product}
              quantity={quantities[product.id]}
              isInList={hasItem(product.id)}
              onUpdateQuantity={(increment) => onUpdateQuantity(product.id, increment)}
              onToggleInList={() => onToggleInList(product)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}