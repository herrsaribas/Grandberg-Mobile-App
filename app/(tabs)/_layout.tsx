import { Tabs } from 'expo-router';
import { Chrome, ListChecks, Phone, User } from 'lucide-react-native';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#f1f1f1',
          },
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#64748b',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Ana Sayfa',
            tabBarIcon: ({ size, color }) => <Chrome size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="list"
          options={{
            title: 'Listem',
            tabBarIcon: ({ size, color }) => <ListChecks size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profilim',
            tabBarIcon: ({ size, color }) => <User size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="contact"
          options={{
            title: 'İletişim',
            tabBarIcon: ({ size, color }) => <Phone size={size} color={color} />
          }}
        />
      </Tabs>
    </View>
  );
}