import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon, Plus, ArrowLeft } from 'lucide-react-native';
import { CategorySelector } from '../components/admin/CategorySelector';
import { VatSelector } from '../components/admin/VatSelector';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewProductScreen() {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    vat: '19',
    image: '',
    category: 'Getränke',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
      setNewProduct({ ...newProduct, image: result.assets[0].uri });
    }
  };

  const handleAddProduct = async () => {
    try {
      setLoading(true);

      if (!newProduct.name || !newProduct.price || !newProduct.category) {
        alert('Lütfen zorunlu alanları doldurun.');
        return;
      }

      const { error } = await supabase.from('products').insert({
        name: newProduct.name,
        description: newProduct.description || null,
        price: parseFloat(newProduct.price),
        vat: parseInt(newProduct.vat),
        image: newProduct.image || null,
        category: newProduct.category,
      });

      if (error) {
        throw error;
      }

      alert('Ürün başarıyla eklendi!');
      router.back();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Ürün eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.title}>Yeni Ürün Ekle</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.imageUploadContainer}
            onPress={pickImage}
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <ImageIcon size={40} color="#64748b" />
                <Text style={styles.imagePlaceholderText}>Ürün Görseli Seç</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ürün Adı *</Text>
              <TextInput
                style={styles.input}
                value={newProduct.name}
                onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                placeholder="Ürün adını giriniz"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Açıklama</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newProduct.description}
                onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
                placeholder="Ürün açıklamasını giriniz"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fiyat (€) *</Text>
              <TextInput
                style={styles.input}
                value={newProduct.price}
                onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>

            <VatSelector
              value={newProduct.vat}
              onChange={(vat) => setNewProduct({ ...newProduct, vat })}
            />

            <CategorySelector
              value={newProduct.category}
              onChange={(category) => setNewProduct({ ...newProduct, category })}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Resim URL</Text>
              <TextInput
                style={styles.input}
                value={newProduct.image}
                onChangeText={(text) => setNewProduct({ ...newProduct, image: text })}
                placeholder="https://example.com/image.jpg"
              />
            </View>

            <TouchableOpacity
              style={[styles.addButton, loading && styles.addButtonDisabled]}
              onPress={handleAddProduct}
              disabled={loading}
            >
              <Plus size={24} color="#ffffff" />
              <Text style={styles.addButtonText}>
                {loading ? 'Ekleniyor...' : 'Ürünü Ekle'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  content: {
    padding: 16,
  },
  imageUploadContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});