import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useListStore } from '../store/listStore';
import { useAuthStore } from '../store/authStore';
import { CategoryList } from '../components/home/CategoryList';
import { ProductList } from '../components/home/ProductList';
import { AuthModal } from '../components/home/AuthModal';
import { HomeHeader } from '../components/home/HomeHeader';
import { HomeBanner } from '../components/home/HomeBanner';
import { Product } from '../types/product';
import { supabase } from '../lib/supabase';

export default function HomeScreen() {
  const { addItem, removeItem, hasItem } = useListStore();
  const { isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setProducts(data);
      
      // Initialize quantities for new products
      const initialQuantities = data.reduce((acc, product) => {
        acc[product.id] = 1;
        return acc;
      }, {} as Record<string, number>);
      
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Ürünler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }

  const handleToggleProductInList = (product: Product) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (hasItem(product.id)) {
      removeItem(product.id);
    } else {
      const quantity = quantities[product.id];
      addItem({ ...product, quantity });
    }
  };

  const handleUpdateQuantity = (productId: string, increment: boolean) => {
    setQuantities(prev => {
      const currentQty = prev[productId];
      const newQty = increment ? currentQty + 1 : Math.max(1, currentQty - 1);
      return { ...prev, [productId]: newQty };
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Ürünler yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <HomeHeader />
        <HomeBanner />
        <CategoryList />
        <ProductList
          products={products}
          quantities={quantities}
          hasItem={hasItem}
          onUpdateQuantity={handleUpdateQuantity}
          onToggleInList={handleToggleProductInList}
        />
        <View style={styles.websitePromo}>
          <Text style={styles.promoText}>
            Daha fazla bilgi için www.ornekfirma.de
          </Text>
        </View>
      </ScrollView>

      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  websitePromo: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
  },
  promoText: {
    fontSize: 14,
    color: '#2563eb',
  },
});