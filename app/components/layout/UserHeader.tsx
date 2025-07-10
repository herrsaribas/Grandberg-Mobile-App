import { View, Text, TouchableOpacity, Image, Modal, Pressable, SafeAreaView } from 'react-native';
import { User, Settings, ShoppingBag, LogOut, ChevronDown } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { router } from 'expo-router';
import { useState } from 'react';
import { headerStyles } from '../../styles/header';

export function UserHeader() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleAuthNavigation = () => {
    router.push('/profile');
  };

  const handleMenuItemPress = (route: string) => {
    setShowMenu(false);
    if (route === 'logout') {
      logout();
    } else {
      router.push(route);
    }
  };

  return (
    <SafeAreaView style={headerStyles.safeArea}>
      <View style={headerStyles.container}>
        <Image 
          source={{ uri: 'https://cdn02.plentymarkets.com/2axx1jehazxc/frontend/Logo/grandberg.png' }}
          style={headerStyles.logo}
        />
        
        {isAuthenticated ? (
          <View style={headerStyles.userSection}>
            <TouchableOpacity 
              style={headerStyles.userButton}
              onPress={() => setShowMenu(true)}
            >
              <View style={headerStyles.modernAvatar}>
                <User size={20} color="#ffffff" />
              </View>
              <Text style={headerStyles.userName}>
                {user?.full_name || user?.email}
              </Text>
              <ChevronDown size={20} color="#64748b" />
            </TouchableOpacity>

            <Modal
              visible={showMenu}
              transparent
              animationType="fade"
              onRequestClose={() => setShowMenu(false)}
            >
              <Pressable 
                style={headerStyles.modalOverlay}
                onPress={() => setShowMenu(false)}
              >
                <View style={headerStyles.dropdownMenu}>
                  <View style={headerStyles.userInfo}>
                    <Text style={headerStyles.userFullName}>
                      {user?.full_name}
                    </Text>
                    <Text style={headerStyles.userEmail}>
                      {user?.email}
                    </Text>
                  </View>

                  <TouchableOpacity 
                    style={headerStyles.dropdownItem}
                    onPress={() => handleMenuItemPress('/profile')}
                  >
                    <Settings size={20} color="#1e293b" />
                    <Text style={headerStyles.dropdownItemText}>Hesap Ayarları</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={headerStyles.dropdownItem}
                    onPress={() => handleMenuItemPress('/admin/orders')}
                  >
                    <ShoppingBag size={20} color="#1e293b" />
                    <Text style={headerStyles.dropdownItemText}>Siparişlerim</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[headerStyles.dropdownItem, headerStyles.dropdownItemDanger]}
                    onPress={() => handleMenuItemPress('logout')}
                  >
                    <LogOut size={20} color="#ef4444" />
                    <Text style={headerStyles.dropdownItemTextDanger}>Çıkış Yap</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Modal>
          </View>
        ) : (
          <TouchableOpacity 
            style={headerStyles.authButton} 
            onPress={handleAuthNavigation}
          >
            <User size={20} color="#ffffff" />
            <Text style={headerStyles.authButtonText}>Giriş Yap</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}