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
  },

  // fetch only admin tokens
  async getAdminPushTokens(): Promise<{ success: boolean; tokens?: string[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('admin_push_tokens')
        .select('push_token');

      if (error) throw error;

      const tokens = data?.map(item => item.push_token) || [];

      return { success: true, tokens };
    } catch (error) {
      console.error('Error fetching admin push tokens:', error);
      return {
        success: false,
        error: 'Admin push tokenları alınamadı.',
      };
    }
  },

  // Admin push token save/update
  async saveAdminPushToken(userId: string, token: string, deviceInfo?: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('admin_push_tokens')
        .upsert({
          user_id: userId,
          push_token: token,
          device_info: deviceInfo,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error saving admin push token:', error);
      return {
        success: false,
        error: 'Admin push token kaydedilemedi.',
      };
    }
  },
};