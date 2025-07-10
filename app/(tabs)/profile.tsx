import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { router } from 'expo-router';
import { LogOut, Package, Users, ShoppingBag, ChevronRight, User, Tag } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { profileStyles } from '../styles/profile';
import { LoginScreen } from '../components/auth/LoginScreen';
import { SignupScreen } from '../components/auth/SignupScreen';
import { EmailVerificationScreen } from '../components/auth/EmailVerificationScreen';
import { OrderList } from '../components/profile/OrderList';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const { isAuthenticated, isAdmin, login, signup, logout, user } = useAuthStore();

  const handleNeedsVerification = (email: string) => {
    setVerificationEmail(email);
    setShowVerification(true);
  };

  const handleVerificationComplete = () => {
    setShowVerification(false);
    setVerificationEmail('');
    // The auth state will be updated automatically by Supabase
  };

  const handleBackFromVerification = () => {
    setShowVerification(false);
    setVerificationEmail('');
  };

  if (showVerification) {
    return (
      <SafeAreaView style={profileStyles.container}>
        <EmailVerificationScreen
          email={verificationEmail}
          onVerificationComplete={handleVerificationComplete}
          onBack={handleBackFromVerification}
        />
      </SafeAreaView>
    );
  }

  if (isAuthenticated && user) {
    return (
      <SafeAreaView style={profileStyles.container}>
        <ScrollView>
          <View style={profileStyles.userInfo}>
            <View style={profileStyles.avatarContainer}>
              <User size={40} color="#ffffff" />
            </View>
            <Text style={profileStyles.welcomeText}>Hoş Geldiniz</Text>
            <Text style={profileStyles.nameText}>{user.user_metadata?.full_name}</Text>
            <Text style={profileStyles.emailText}>{user.email}</Text>
          </View>

          {!isAdmin && (
            <View style={profileStyles.section}>
              <Text style={profileStyles.sectionTitle}>Siparişlerim</Text>
              <OrderList userId={user.id} />
            </View>
          )}

          {isAdmin && (
            <View style={profileStyles.section}>
              <Text style={profileStyles.sectionTitle}>Yönetici İşlemleri</Text>
              
              <TouchableOpacity
                style={profileStyles.menuItem}
                onPress={() => router.push('/admin/orders')}
              >
                <View style={profileStyles.menuItemContent}>
                  <ShoppingBag size={20} color="#2563eb" />
                  <Text style={profileStyles.menuItemText}>Sipariş Yönetimi</Text>
                </View>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>

              <TouchableOpacity
                style={profileStyles.menuItem}
                onPress={() => router.push('/admin')}
              >
                <View style={profileStyles.menuItemContent}>
                  <Package size={20} color="#2563eb" />
                  <Text style={profileStyles.menuItemText}>Ürün Yönetimi</Text>
                </View>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>

              <TouchableOpacity
                style={profileStyles.menuItem}
                onPress={() => router.push('/admin/categories')}
              >
                <View style={profileStyles.menuItemContent}>
                  <Tag size={20} color="#2563eb" />
                  <Text style={profileStyles.menuItemText}>Kategori Yönetimi</Text>
                </View>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>

              <TouchableOpacity
                style={profileStyles.menuItem}
                onPress={() => router.push('/admin/users')}
              >
                <View style={profileStyles.menuItemContent}>
                  <Users size={20} color="#2563eb" />
                  <Text style={profileStyles.menuItemText}>Kullanıcı Yönetimi</Text>
                </View>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={profileStyles.logoutButton} onPress={logout}>
            <LogOut size={20} color="#ffffff" />
            <Text style={profileStyles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={profileStyles.container}>
      {activeTab === 'login' ? (
        <LoginScreen
          onLogin={login}
          onSwitchToSignup={() => setActiveTab('signup')}
        />
      ) : (
        <SignupScreen
          onSignup={signup}
          onSwitchToLogin={() => setActiveTab('login')}
          onNeedsVerification={handleNeedsVerification}
        />
      )}
    </SafeAreaView>
  );
}