import { View, Text, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import { useState } from 'react';
import { X, Check, ImageIcon, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Product } from '@/types/product';
import { CategorySelector } from './CategorySelector';
import { VatSelector } from './VatSelector';
import { adminStyles } from '../../styles/adminStyles';

interface EditProductFormProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
  onCancel: () => void;
}

export function EditProductForm({ product, onUpdate, onCancel }: EditProductFormProps) {
  const [editedProduct, setEditedProduct] = useState(product);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(product.image);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setSelectedImage(result.assets[0].uri);
        setEditedProduct({ ...editedProduct, image: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      if (!editedProduct.name || !editedProduct.price || !editedProduct.category) {
        alert('Lütfen zorunlu alanları doldurun.');
        return;
      }

      // Validate price
      if (isNaN(editedProduct.price) || editedProduct.price <= 0) {
        alert('Lütfen geçerli bir fiyat girin.');
        return;
      }

      onUpdate(editedProduct);
    } catch (error) {
      alert('Ürün güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={adminStyles.editForm}>
      <TouchableOpacity 
        style={adminStyles.imageUploadContainer}
        onPress={pickImage}
      >
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            style={adminStyles.selectedImage}
          />
        ) : (
          <View style={adminStyles.imagePlaceholder}>
            <ImageIcon size={40} color="#64748b" />
            <Text style={adminStyles.imagePlaceholderText}>Ürün Görseli Seç</Text>
          </View>
        )}
        <View style={adminStyles.uploadOverlay}>
          <Upload size={24} color="#ffffff" />
          <Text style={adminStyles.uploadText}>Görsel Yükle</Text>
        </View>
      </TouchableOpacity>

      <View style={adminStyles.inputContainer}>
        <Text style={adminStyles.label}>Ürün Adı *</Text>
        <TextInput
          style={adminStyles.input}
          value={editedProduct.name}
          onChangeText={(text) => setEditedProduct({ ...editedProduct, name: text })}
          placeholder="Ürün adını giriniz"
        />
      </View>

      <View style={adminStyles.inputContainer}>
        <Text style={adminStyles.label}>Açıklama</Text>
        <TextInput
          style={[adminStyles.input, adminStyles.textArea]}
          value={editedProduct.description || ''}
          onChangeText={(text) => setEditedProduct({ ...editedProduct, description: text })}
          placeholder="Ürün açıklamasını giriniz"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={adminStyles.inputContainer}>
        <Text style={adminStyles.label}>Fiyat (€) *</Text>
        <TextInput
          style={adminStyles.input}
          value={editedProduct.price.toString()}
          onChangeText={(text) => {
            const price = parseFloat(text) || 0;
            setEditedProduct({ ...editedProduct, price });
          }}
          keyboardType="decimal-pad"
          placeholder="0.00"
        />
      </View>

      <VatSelector
        value={editedProduct.vat.toString()}
        onChange={(vat) => setEditedProduct({ ...editedProduct, vat: parseInt(vat) })}
      />

      <CategorySelector
        value={editedProduct.category}
        onChange={(category) => setEditedProduct({ ...editedProduct, category })}
      />

      <View style={adminStyles.buttonRow}>
        <TouchableOpacity
          style={[adminStyles.actionButton, adminStyles.cancelButton]}
          onPress={onCancel}
          disabled={loading}
        >
          <X size={20} color="#ffffff" />
          <Text style={adminStyles.actionButtonText}>İptal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[adminStyles.actionButton, adminStyles.saveButton, loading && adminStyles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Check size={20} color="#ffffff" />
          <Text style={adminStyles.actionButtonText}>
            {loading ? 'Güncelleniyor...' : 'Kaydet'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}