import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Platform } from 'react-native';
import { useFrameworkReady } from '@/../hooks/useFrameworkReady';
import { useAuthStore } from './store/authStore';
import { UserHeader } from './components/layout/UserHeader';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { registerForPushNotificationsAsync } from './lib/notifications';
import { userService } from './services/userService';
import { router } from 'expo-router';

export default function RootLayout() {
  useFrameworkReady();
  const { initialize, user, isAdmin } = useAuthStore();
  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

  useEffect(() => {
    
    initialize();
  }, [initialize]);

  useEffect(() => {
     console.log('useEffect triggered - user:', user?.id, 'isAdmin:', isAdmin);
      console.log('Starting push notification registration...');
  console.log('Device.isDevice:', Device.isDevice);
  console.log('Platform:', Platform.OS);
     
     registerForPushNotificationsAsync().then(async (token) => {
        console.log('Admin push token:', token);});
    // Register for push notifications when admin user logs in
    if (user && isAdmin) {
      registerForPushNotificationsAsync().then(async (token) => {
        console.log('Admin push token:', token);
        if (token) {
          try {
            await userService.saveAdminPushToken(
              user.id, 
              token,
              {
                platform: Platform.OS,
                deviceName: await Device.deviceName,
                osVersion: Device.osVersion
              }
            );
            console.log('Admin push token saved successfully in layout');
          } catch (error) {
            console.error('Error saving admin push token in layout:', error);
          }
        }
      });
    }

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for notification taps
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      if (data.type === 'new_order' && data.screen) {
        // Navigate to admin orders page
        router.push('/admin/orders');
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user, isAdmin]);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <UserHeader />
        <Stack>
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="category/[id]" 
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen 
            name="+not-found" 
            options={{
              headerShown: false
            }}
          />
        </Stack>
      </View>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}