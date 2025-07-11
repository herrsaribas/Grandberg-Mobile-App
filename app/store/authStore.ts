import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { registerForPushNotificationsAsync } from '../lib/notifications';
import { userService } from '../services/userService';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  phone: string;
  tax_id?: string;
  address?: string;
  sector?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: UserProfile | null;
  session: any;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, userData: any) => Promise<{ error: any; needsVerification?: boolean }>;
  logout: () => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<UserProfile | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      session: null,

      fetchUserProfile: async (userId: string): Promise<UserProfile | null> => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          if (error) {
            console.error('Error fetching user profile:', error);
            return null;
          }

          return data as UserProfile;
        } catch (error) {
          console.error('Error fetching user profile:', error);
          return null;
        }
      },

      initialize: async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Session error:', error);
            return;
          }

          if (session?.user) {
            const userProfile = await get().fetchUserProfile(session.user.id);
            const isAdmin = session.user.app_metadata?.role === 'admin';
            
            set({ 
              isAuthenticated: true, 
              isAdmin,
              user: userProfile,
              session 
            });
//if Admin save push token
            if (isAdmin) {
              try {
                const token = await registerForPushNotificationsAsync();
                if (token) {
                  await userService.saveAdminPushToken(
                    session.user.id, 
                    token,
                    {
                      platform: Platform.OS,
                      deviceName: await Device.deviceName,
                      osVersion: Device.osVersion
                    }
                  );
                  console.log('Admin push token saved successfully');
                }
              } catch (error) {
                console.error('Error saving admin push token:', error);
              }
            }

            // Handle pending user data if exists
            try {
              const pendingDataString = await AsyncStorage.getItem('pendingUserData');
              if (pendingDataString) {
                const pendingData = JSON.parse(pendingDataString);
                
                // Check if this matches the verified user
                if (pendingData.userId === session.user.id) {
                  // Create the user profile
                  const { error: profileError } = await supabase.from('users').insert({
                    id: session.user.id,
                    email: pendingData.email,
                    full_name: pendingData.full_name,
                    company_name: pendingData.company_name,
                    phone: pendingData.phone,
                    tax_id: pendingData.tax_id || null,
                    address: pendingData.address || null,
                    sector: pendingData.sector,
                  });

                  if (!profileError) {
                    // Clear pending data
                    await AsyncStorage.removeItem('pendingUserData');
                    
                    // Fetch updated profile
                    const updatedProfile = await get().fetchUserProfile(session.user.id);
                    set({ user: updatedProfile });
                  }
                }
              }
            } catch (error) {
              console.warn('Error handling pending user data:', error);
            }
          }
        } catch (error) {
          console.error('Initialize error:', error);
        }
      },

      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            return { error };
          }

          if (!data.user || !data.session) {
            return { error: new Error('Login failed') };
          }

          const userProfile = await get().fetchUserProfile(data.user.id);
          const isAdmin = data.user.app_metadata?.role === 'admin';
          
          set({ 
            isAuthenticated: true, 
            isAdmin,
            user: userProfile,
            session: data.session 
          });

          // if Admin logged in save push token
          if (isAdmin) {
            try {
              const token = await registerForPushNotificationsAsync();
              if (token) {
                await userService.saveAdminPushToken(
                  data.user.id, 
                  token,
                  {
                    platform: Platform.OS,
                    deviceName: await Device.deviceName,
                    osVersion: Device.osVersion
                  }
                );
                console.log('Admin push token saved on login');
              }
            } catch (error) {
              console.error('Error saving admin push token on login:', error);
            }
          }

          return { error: null };
        } catch (error) {
          console.error('Login error:', error);
          return { error };
        }
      },

      signup: async (email: string, password: string, userData: any) => {
        try {
          // Validate required fields
          if (!userData.full_name || !userData.company_name || !userData.phone || !userData.sector) {
            return { error: new Error('Full name, company name, phone and sector are required') };
          }

          // Create auth user with email confirmation enabled
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: userData.full_name,
              },
              emailRedirectTo: undefined, // This ensures email confirmation is required
            },
          });

          if (authError) {
            // Handle specific error cases more gracefully
            if (authError.message?.includes('User already registered') || authError.message?.includes('user_already_exists')) {
              return { error: { message: 'Bu e-posta adresi zaten kayıtlı', code: 'user_already_exists' } };
            }
            
            if (authError.message?.includes('Invalid email')) {
              return { error: { message: 'Geçersiz e-posta adresi', code: 'invalid_email' } };
            }
            
            if (authError.message?.includes('Password')) {
              return { error: { message: 'Şifre çok zayıf. Lütfen daha güçlü bir şifre seçin.', code: 'weak_password' } };
            }
            
            return { error: authError };
          }

          if (!authData.user) {
            return { error: new Error('User creation failed') };
          }

          // If user needs email confirmation, return early
          if (!authData.session) {
            // Store user data temporarily for after verification
            try {
              await AsyncStorage.setItem('pendingUserData', JSON.stringify({
                userId: authData.user.id,
                email: email,
                ...userData
              }));
            } catch (storageError) {
              console.warn('Could not store pending user data:', storageError);
            }
            
            return { error: null, needsVerification: true };
          }

          // If user is immediately confirmed, create profile
          const { error: profileError } = await supabase.from('users').insert({
            id: authData.user.id,
            email: email,
            full_name: userData.full_name,
            company_name: userData.company_name,
            phone: userData.phone,
            tax_id: userData.tax_id || null,
            address: userData.address || null,
            sector: userData.sector,
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Rollback auth user creation
            await supabase.auth.signOut();
            return { error: profileError };
          }

          // Fetch the created user profile
          const userProfile = await get().fetchUserProfile(authData.user.id);

          set({ 
            isAuthenticated: true, 
            isAdmin: false, 
            user: userProfile,
            session: authData.session 
          });

          return { error: null };
        } catch (error) {
          console.error('Signup error:', error);
          return { error };
        }
      },

      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Supabase signOut error:', error);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            isAuthenticated: false, 
            isAdmin: false, 
            user: null, 
            session: null 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Listen for auth state changes and handle post-verification profile creation
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    try {
      // Check if this is a newly verified user
      const pendingDataStr = await AsyncStorage.getItem('pendingUserData');
      if (pendingDataStr) {
        const pendingData = JSON.parse(pendingDataStr);
        
        // Check if this matches the verified user
        if (pendingData.userId === session.user.id) {
          // Create the user profile
          const { error: profileError } = await supabase.from('users').insert({
            id: session.user.id,
            email: pendingData.email,
            full_name: pendingData.full_name,
            company_name: pendingData.company_name,
            phone: pendingData.phone,
            tax_id: pendingData.tax_id || null,
            address: pendingData.address || null,
            sector: pendingData.sector,
          });

          if (profileError) {
            console.error('Profile creation error after verification:', profileError);
          } else {
            // Update the auth store with the new user profile
            const authStore = useAuthStore.getState();
            const userProfile = await authStore.fetchUserProfile(session.user.id);
            useAuthStore.setState({ user: userProfile });
          }

          // Clear pending data
          await AsyncStorage.removeItem('pendingUserData');
        }
      }
    } catch (error) {
      console.error('Error handling post-verification profile creation:', error);
    }
  }
});