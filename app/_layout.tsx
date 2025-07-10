import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuthStore } from './store/authStore';
import { UserHeader } from './components/layout/UserHeader';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  useFrameworkReady();
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

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