import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Platform } from 'react-native';
import { useFrameworkReady } from '@/../hooks/useFrameworkReady';
import { useAuthStore } from './store/authStore';
import { UserHeader } from './components/layout/UserHeader';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './lib/notifications';
import { userService } from './services/userService';
import { router } from 'expo-router';

export default function RootLayout() {
  useFrameworkReady();
  const { initialize, user, isAdmin } = useAuthStore();
   const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    
    initialize();
  }, [initialize]);

   useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
       const data = response.notification.request.content.data;
      
      if (data.type === 'new_order' && data.screen) {
        // Navigate to admin orders page
        router.push('/admin/orders');
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  
 

 

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