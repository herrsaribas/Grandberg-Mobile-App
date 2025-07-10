import { supabase } from '../lib/supabase';
import { User } from '../types/user';

export const userService = {
  async listUsers(): Promise<{ success: boolean; data?: User[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          auth_user:id (
            raw_app_meta_data
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Filter out admin users
      const filteredUsers = data.filter(user => {
        const appMetaData = user.auth_user?.raw_app_meta_data;
        return !appMetaData?.role || appMetaData.role !== 'admin';
      });

      return { success: true, data: filteredUsers };
    } catch (error) {
      console.error('Error listing users:', error);
      return {
        success: false,
        error: 'Kullanıcılar listelenirken bir hata oluştu.',
      };
    }
  }
};