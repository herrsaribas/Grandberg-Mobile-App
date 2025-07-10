import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { CategorySelector } from './CategorySelector';
import { VatSelector } from './VatSelector';
import { adminStyles } from '../../styles/adminStyles';

export function AddProductForm() {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    vat: '19',
    image: '',
    category: 'Getränke',
  });

  const handleAddProduct = () => {
    // Add product logic here
    alert('Ürün başarıyla eklendi!');
    setNewProduct({
      name: '',
      description: '',
      price: '',
      vat: '19',
      image: '',
      category: 'Getränke',
    });
  };

  return (
    <View style={adminStyles.section}>
      <Text style={adminStyles.sectionTitle}>Yeni Ürün Ekle</Text>
      <View style={adminStyles.inputContainer}>
        <Text style={adminStyles.label}>Ürün Adı</Text>
        <TextInput
          style={adminStyles.input}
          value={newProduct.name}
          onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
          placeholder="Ürün adını giriniz"
        />
      </View>
      <View style={adminStyles.inputContainer}>
        <Text style={adminStyles.label}>Açıklama</Text>
        <TextInput
          style={adminStyles.input}
          value={newProduct.description}
          onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
          placeholder="Ürün açıklamasını giriniz"
        />
      </View>
      <View style={adminStyles.inputContainer}>
        <Text style={adminStyles.label}>Fiyat (€)</Text>
        <TextInput
          style={adminStyles.input}
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
      <View style={adminStyles.inputContainer}>
        <Text style={adminStyles.label}>Resim URL</Text>
        <TextInput
          style={adminStyles.input}
          value={newProduct.image}
          onChangeText={(text) => setNewProduct({ ...newProduct, image: text })}
          placeholder="https://example.com/image.jpg"
        />
      </View>
      {newProduct.image && (
        <View style={adminStyles.imagePreview}>
          <Text style={adminStyles.label}>Resim Önizleme</Text>
          <Image
            source={{ uri: newProduct.image }}
            style={adminStyles.previewImage}
            resizeMode="cover"
          />
        </View>
      )}
      <TouchableOpacity
        style={adminStyles.addButton}
        onPress={handleAddProduct}
      >
        <Text style={adminStyles.addButtonText}>Ürünü Ekle</Text>
      </TouchableOpacity>
    </View>
  );
}