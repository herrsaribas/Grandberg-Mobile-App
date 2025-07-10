import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { Category, CategoryFormData } from '../../types/category';
import { categoryService } from '../../services/categoryService';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react-native';

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    is_active: true
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const result = await categoryService.listCategories();

      if (!result.success) {
        throw new Error(result.error);
      }

      setCategories(result.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Kategoriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  const handleAddCategory = async () => {
    try {
      if (!formData.name.trim()) {
        Alert.alert('Hata', 'Kategori adı zorunludur');
        return;
      }

      const result = await categoryService.createCategory(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setCategories(prev => [...prev, result.data]);
      setIsAdding(false);
      setFormData({ name: '', is_active: true });
      Alert.alert('Başarılı', 'Kategori başarıyla oluşturuldu');
    } catch (error) {
      Alert.alert('Hata', error instanceof Error ? error.message : 'Kategori oluşturulurken bir hata oluştu');
    }
  };

  const handleUpdateCategory = async () => {
    try {
      if (!editingCategory || !formData.name.trim()) {
        Alert.alert('Hata', 'Kategori adı zorunludur');
        return;
      }

      const result = await categoryService.updateCategory(editingCategory.id, formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setCategories(prev =>
        prev.map(cat => cat.id === editingCategory.id ? result.data : cat)
      );
      setEditingCategory(null);
      setFormData({ name: '', is_active: true });
      Alert.alert('Başarılı', 'Kategori başarıyla güncellendi');
    } catch (error) {
      Alert.alert('Hata', error instanceof Error ? error.message : 'Kategori güncellenirken bir hata oluştu');
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    Alert.alert(
      'Kategori Sil',
      'Bu kategoriyi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await categoryService.deleteCategory(category.id);

              if (!result.success) {
                throw new Error(result.error);
              }

              setCategories(prev => prev.filter(cat => cat.id !== category.id));
              Alert.alert('Başarılı', 'Kategori başarıyla silindi');
            } catch (error) {
              Alert.alert('Hata', error instanceof Error ? error.message : 'Kategori silinirken bir hata oluştu');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Kategoriler yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchCategories}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isAdding && !editingCategory && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAdding(true)}
        >
          <Plus size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Yeni Kategori</Text>
        </TouchableOpacity>
      )}

      {(isAdding || editingCategory) && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Kategori Adı</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Kategori adını giriniz"
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Aktif</Text>
            <Switch
              value={formData.is_active}
              onValueChange={(value) => setFormData(prev => ({ ...prev, is_active: value }))}
            />
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                setIsAdding(false);
                setEditingCategory(null);
                setFormData({ name: '', is_active: true });
              }}
            >
              <X size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>İptal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={editingCategory ? handleUpdateCategory : handleAddCategory}
            >
              <Check size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>
                {editingCategory ? 'Güncelle' : 'Kaydet'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.categoriesList}>
        {categories.map(category => (
          <View key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <View style={[
                styles.statusBadge,
                category.is_active ? styles.activeBadge : styles.inactiveBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  category.is_active ? styles.activeText : styles.inactiveText
                ]}>
                  {category.is_active ? 'Aktif' : 'Pasif'}
                </Text>
              </View>
            </View>

            <View style={styles.categoryActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditingCategory(category);
                  setFormData({
                    name: category.name,
                    is_active: category.is_active
                  });
                }}
              >
                <Pencil size={20} color="#2563eb" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCategory(category)}
              >
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
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
  addButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesList: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
  },
  inactiveBadge: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeText: {
    color: '#16a34a',
  },
  inactiveText: {
    color: '#ef4444',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
});