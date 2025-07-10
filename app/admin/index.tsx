import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Plus, ArrowLeft } from 'lucide-react-native';
import { ProductList } from '../components/admin/ProductList';
import { Product } from '@/types/product';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function AdminScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Ürünler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      setUpdating(true);

      // Validate required fields
      if (!updatedProduct.name?.trim()) {
        throw new Error('Ürün adı zorunludur');
      }

      // Convert and validate price
      const price = Number(updatedProduct.price);
      if (isNaN(price) || price < 0) {
        throw new Error('Geçerli bir fiyat giriniz');
      }

      // Validate VAT
      if (isNaN(updatedProduct.vat) || updatedProduct.vat < 0) {
        throw new Error('Geçerli bir KDV oranı giriniz');
      }

      // Validate category
      if (!updatedProduct.category?.trim()) {
        throw new Error('Kategori seçimi zorunludur');
      }

      // Prepare update data
      const updateData = {
        name: updatedProduct.name.trim(),
        description: updatedProduct.description?.trim() || null,
        price: price,
        vat: updatedProduct.vat,
        category: updatedProduct.category.trim(),
        image: updatedProduct.image?.trim() || null,
        updated_at: new Date().toISOString(),
      };

      // Update in Supabase
      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', updatedProduct.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === updatedProduct.id
            ? { ...product, ...updateData }
            : product
        )
      );

      setEditingProduct(null);
      Alert.alert('Başarılı', 'Ürün başarıyla güncellendi!');
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert(
        'Hata',
        error instanceof Error 
          ? error.message 
          : 'Ürün güncellenirken bir hata oluştu.'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        throw error;
      }

      // Update local state
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== productId)
      );

      Alert.alert('Başarılı', 'Ürün başarıyla silindi!');
    } catch (error) {
      console.error('Error deleting product:', error);
      Alert.alert('Hata', 'Ürün silinirken bir hata oluştu.');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Ürünler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchProducts}
          >
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.title}>Ürün Yönetimi</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/admin/new')}
          >
            <Plus size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Yeni Ürün</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent}>
          <ProductList
            products={products}
            editingProduct={editingProduct}
            onEditProduct={handleEditProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onCancelEdit={handleCancelEdit}
            updating={updating}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginLeft: 16,
  },
  scrollContent: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});