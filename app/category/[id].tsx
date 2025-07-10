import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { categories, CategoryList } from '../components/home/CategoryList';
import { initialProducts } from '../types/product';
import { ProductList } from '../components/home/ProductList';
import { useState } from 'react';
import { useListStore } from '../store/listStore';
import { useAuthStore } from '../store/authStore';
import { AuthModal } from '../components/home/AuthModal';
import { appStyles } from '../styles/app';
import { HomeBanner } from '../components/home/HomeBanner';
import { ArrowLeft } from 'lucide-react-native';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const category = categories.find(cat => cat.id === id);
  const { addItem, removeItem, hasItem } = useListStore();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    return initialProducts.reduce((acc, product) => {
      acc[product.id] = 1;
      return acc;
    }, {} as Record<string, number>);
  });

  const filteredProducts = initialProducts.filter(
    product => product.category === category?.name
  );

  const handleToggleProductInList = (product) => {
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

  return (
    <View style={appStyles.container}>
      <View style={appStyles.header}>
        <TouchableOpacity
          style={appStyles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={appStyles.title}>{category?.name}</Text>
      </View>

      <ScrollView>
        <CategoryList />
        <HomeBanner />

        <ProductList
          products={filteredProducts}
          quantities={quantities}
          hasItem={hasItem}
          onUpdateQuantity={handleUpdateQuantity}
          onToggleInList={handleToggleProductInList}
        />
      </ScrollView>

      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </View>
  );
}