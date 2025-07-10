import { Stack } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

export default function AdminLayout() {
  const { isAdmin } = useAuthStore();

  if (!isAdmin) {
    return <Redirect href="/profile" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="users" />
      </Stack>
    </View>
  );
}