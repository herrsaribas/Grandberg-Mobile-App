import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { appStyles } from '../../styles/app';
import { authStyles } from '../../styles/authStyles';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<{ error: any }>;
  onSwitchToSignup: () => void;
}

export function LoginScreen({ onLogin, onSwitchToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    const { error } = await onLogin(email, password);
    if (error) setError(error.message);
  };

  return (
    <ScrollView style={appStyles.content} contentContainerStyle={appStyles.scrollContent}>
      <View style={authStyles.tabs}>
        <TouchableOpacity style={[authStyles.tab, authStyles.activeTab]}>
          <Text style={[authStyles.tabText, authStyles.activeTabText]}>
            Giriş Yap
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={authStyles.tab}
          onPress={onSwitchToSignup}
        >
          <Text style={authStyles.tabText}>
            Kayıt Ol
          </Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={authStyles.errorContainer}>
          <Text style={authStyles.errorText}>{error}</Text>
        </View>
      )}

      <View style={appStyles.form}>
        <View style={appStyles.inputContainer}>
          <Text style={appStyles.label}>E-posta</Text>
          <View style={appStyles.inputWrapper}>
            <Mail color="#64748b" size={20} style={appStyles.inputIcon} />
            <TextInput
              style={appStyles.input}
              placeholder="E-posta adresinizi giriniz"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={appStyles.inputContainer}>
          <Text style={appStyles.label}>Şifre</Text>
          <View style={appStyles.inputWrapper}>
            <Lock color="#64748b" size={20} style={appStyles.inputIcon} />
            <TextInput
              style={appStyles.input}
              placeholder="Şifrenizi giriniz"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity style={appStyles.submitButton} onPress={handleLogin}>
          <Text style={appStyles.submitButtonText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}