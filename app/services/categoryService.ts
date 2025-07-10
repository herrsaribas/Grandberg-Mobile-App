import { supabase } from '../lib/supabase';
import { Category, CategoryFormData } from '../types/category';

export const categoryService = {
  async listCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      return { success: true, data: data as Category[] };
    } catch (error) {
      console.error('Error listing categories:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Kategoriler listelenirken bir hata oluştu'
      };
    }
  },

  async createCategory(formData: CategoryFormData) {
    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: formData.name,
          slug,
          is_active: formData.is_active
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Kategori oluşturulurken bir hata oluştu'
      };
    }
  },

  async updateCategory(id: string, formData: CategoryFormData) {
    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const { data, error } = await supabase
        .from('categories')
        .update({
          name: formData.name,
          slug,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Kategori güncellenirken bir hata oluştu'
      };
    }
  },

  async deleteCategory(id: string) {
    try {
      // Check if category is in use
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id);

      if (countError) throw countError;

      if (count && count > 0) {
        throw new Error('Bu kategori ürünler tarafından kullanılıyor ve silinemiyor');
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Kategori silinirken bir hata oluştu'
      };
    }
  }
};