import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Mail, Lock, User, Building2, Phone, Briefcase, MapPin, Home, Hash } from 'lucide-react-native';
import { useState } from 'react';
import { appStyles } from '../../styles/app';
import { authStyles } from '../../styles/authStyles';

interface SignupScreenProps {
  onSignup: (email: string, password: string, userData: any) => Promise<{ error: any; needsVerification?: boolean }>;
  onSwitchToLogin: () => void;
  onNeedsVerification: (email: string) => void;
}

const sectors = [
  'Kasaplar',
  'Marketler', 
  'Pastaneler',
  'Dönerciler'
];

// German states for dropdown
const germanStates = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen'
];

export function SignupScreen({ onSignup, onSwitchToLogin, onNeedsVerification }: SignupScreenProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: '',
    phone: '',
    taxId: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    state: '',
    sector: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const handleSignup = async () => {
    try {
      setError(null);
      setLoading(true);

      // Form validation
      const trimmedData = {
        email: formData.email.trim(),
        fullName: formData.fullName.trim(),
        companyName: formData.companyName.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        taxId: formData.taxId.trim(),
        street: formData.street.trim(),
        houseNumber: formData.houseNumber.trim(),
        postalCode: formData.postalCode.trim(),
        state: formData.state.trim(),
        sector: formData.sector.trim(),
      };

      // Required fields validation
      if (!trimmedData.fullName) {
        setError('Ad ve soyad zorunludur');
        return;
      }

      if (!trimmedData.email) {
        setError('E-posta adresi zorunludur');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedData.email)) {
        setError('Geçerli bir e-posta adresi giriniz');
        return;
      }

      if (!trimmedData.companyName) {
        setError('Firma adı zorunludur');
        return;
      }

      if (!trimmedData.phone) {
        setError('Telefon numarası zorunludur');
        return;
      }

      if (!trimmedData.sector) {
        setError('Sektör seçimi zorunludur');
        return;
      }

      // Validate postal code format (German postal codes are 5 digits)
      if (trimmedData.postalCode && !/^\d{5}$/.test(trimmedData.postalCode)) {
        setError('Posta kodu 5 haneli olmalıdır (örn: 10115)');
        return;
      }

      if (trimmedData.password.length < 6) {
        setError('Şifre en az 6 karakter olmalıdır');
        return;
      }

      if (trimmedData.password !== trimmedData.confirmPassword) {
        setError('Şifreler eşleşmiyor');
        return;
      }

      // Combine address fields into a single address string
      const addressParts = [];
      if (trimmedData.street && trimmedData.houseNumber) {
        addressParts.push(`${trimmedData.street} ${trimmedData.houseNumber}`);
      }
      if (trimmedData.postalCode) {
        addressParts.push(trimmedData.postalCode);
      }
      if (trimmedData.state) {
        addressParts.push(trimmedData.state);
      }
      
      const fullAddress = addressParts.join(', ') || null;

      const { error: signupError, needsVerification } = await onSignup(trimmedData.email, trimmedData.password, {
        full_name: trimmedData.fullName,
        company_name: trimmedData.companyName,
        phone: trimmedData.phone,
        tax_id: trimmedData.taxId || null,
        address: fullAddress,
        sector: trimmedData.sector,
      });

      if (needsVerification) {
        onNeedsVerification(trimmedData.email);
        return;
      }

      if (signupError) {
        // Handle specific error codes and messages more gracefully
        if (signupError.code === 'user_already_exists' || 
            signupError.message?.includes('already registered') || 
            signupError.message?.includes('Bu e-posta adresi zaten kayıtlı')) {
          setError('Bu e-posta adresi zaten kayıtlı');
        } else if (signupError.code === 'invalid_email' || 
                   signupError.message?.includes('Invalid email') ||
                   signupError.message?.includes('Geçersiz e-posta adresi')) {
          setError('Geçersiz e-posta adresi');
        } else if (signupError.code === 'weak_password' || 
                   signupError.message?.includes('Password') ||
                   signupError.message?.includes('Şifre çok zayıf')) {
          setError('Şifre çok zayıf. Lütfen daha güçlü bir şifre seçin.');
        } else {
          setError(signupError.message || 'Kayıt işlemi başarısız');
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Kayıt olma işlemi sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSectorSelect = (sector: string) => {
    setFormData({ ...formData, sector });
    setShowSectorDropdown(false);
  };

  const handleStateSelect = (state: string) => {
    setFormData({ ...formData, state });
    setShowStateDropdown(false);
  };

  return (
    <ScrollView style={appStyles.content} contentContainerStyle={appStyles.scrollContent}>
      <View style={authStyles.tabs}>
        <TouchableOpacity
          style={authStyles.tab}
          onPress={onSwitchToLogin}
        >
          <Text style={authStyles.tabText}>
            Giriş Yap
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[authStyles.tab, authStyles.activeTab]}>
          <Text style={[authStyles.tabText, authStyles.activeTabText]}>
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
        <View style={authStyles.sectionHeader}>
          <Text style={authStyles.sectionTitle}>Kişisel Bilgiler</Text>
        </View>

        <View style={appStyles.inputContainer}>
          <Text style={appStyles.label}>Ad Soyad *</Text>
          <View style={appStyles.inputWrapper}>
            <User color="#64748b" size={20} style={appStyles.inputIcon} />
            <TextInput
              style={appStyles.input}
              placeholder="Adınız ve soyadınız"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />
          </View>
        </View>

        <View style={appStyles.inputContainer}>
          <Text style={appStyles.label}>E-posta *</Text>
          <View style={appStyles.inputWrapper}>
            <Mail color="#64748b" size={20} style={appStyles.inputIcon} />
            <TextInput
              style={appStyles.input}
              placeholder="E-posta adresinizi giriniz"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={authStyles.sectionHeader}>
          <Text style={authStyles.sectionTitle}>Firma Bilgileri</Text>
        </View>

        <View style={appStyles.inputContainer}>
          <Text style={appStyles.label}>Firma Adı *</Text>
          <View style={appStyles.inputWrapper}>
            <Building2 color="#64748b" size={20} style={appStyles.inputIcon} />
            <TextInput
              style={appStyles.input}
              placeholder="Firma adını giriniz"
              value={formData.companyName}
              onChangeText={(text) => setFormData({ ...formData, companyName: text })}
            />
          </View>
        </View>

        <View style={appStyles.inputContainer}>
          <Text style={appStyles.label}>Sektör *</Text>
          <View style={appStyles.inputWrapper}>
            <Briefcase color="#64748b" size={20} style={appStyles.inputIcon} />
            <TouchableOpacity
              style={[appStyles.input, { justifyContent: 'center' }]}
              onPress={() => setShowSectorDropdown(!showSectorDropdown)}
            >
              <Text style={{ color: formData.sector ? '#1e293b' : '#9ca3af' }}>
                {formData.sector || 'Sektör seçiniz'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {showSectorDropdown && (
            <View style={authStyles.dropdown}>
              <ScrollView style={authStyles.dropdownScroll} nestedScrollEnabled>
                {sectors.map((sector) => (
                  <TouchableOpacity
                    key={sector}
                    style={[
                      authStyles.dropdownItem,
                      formData.sector === sector && authStyles.dropdownItemSelected
                    ]}
                    onPress={() => handleSectorSelect(sector)}
                  >
                    <Text style={[
                      authStyles.dropdownItemText,
                      formData.sector === sector && authStyles.dropdownItemTextSelected
                    ]}>
                      {sector}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={appStyles.inputContainer}>
          <Text style={appStyles.label}>Telefon *</Text>
          <View style={appStyles.inputWrapper}>
            <Phone color="#64748b" size={20} style={appStyles.inputIcon} />
            <TextInput
              style={appStyles.input}
              placeholder="+49 123 456 7890"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={appStyles.inputContainer}>
          <Text style={appStyles.label}>Vergi Numarası</Text>
          <View style={appStyles.inputWrapper}>
            <Hash color="#64748b" size={20} style={appStyles.inputIcon} />
            <TextInput
              style={appStyles.input}
              placeholder="DE123456789"
              value={formData.taxId}
              onChangeText={(text) => setFormData({ ...formData, taxId: text })}
            />
          </View>
        </View>

        <View style={authStyles.sectionHeader}>
          <Text style={authStyles.sectionTitle}>Adres Bilgileri</Text>
        </View>

        <View style={authStyles.addressRow}>
          <View style={[appStyles.inputContainer, { flex: 3, marginRight: 8 }]}>
            <Text style={appStyles.label}>Cadde</Text>
            <View style={appStyles.inputWrapper}>
              <MapPin color="#64748b" size={20} style={appStyles.inputIcon} />
              <TextInput
                style={appStyles.input}
                placeholder="Musterstraße"
                value={formData.street}
                onChangeText={(text) => setFormData({ ...formData, street: text })}
              />
            </View>
          </View>

          <View style={[appStyles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={appStyles.label}>Ev No</Text>
            <View style={appStyles.inputWrapper}>
              <Home color="#64748b" size={20} style={appStyles.inputIcon} />
              <TextInput
                style={appStyles.input}
                placeholder="123"
                value={formData.houseNumber}
                onChangeText={(text) => setFormData({ ...formData, houseNumber: text })}
              />
            </View>
          </View>
        </View>

        <View style={appStyles.inputContainer}>
          <Text style={appStyles.label}>Posta Kodu</Text>
          <View style={appStyles.inputWrapper}>
            <Hash color="#64748b" size={20} style={appStyles.inputIcon} />
            <TextInput
              style={appStyles.input}
              placeholder="10115"
              value={formData.postalCode}
              onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>

        <View style={appStyles.inputContainer}>
          <Text style={appStyles.label}>Eyalet</Text>
          <View style={appStyles.inputWrapper}>
            <MapPin color="#64748b" size={20} style={appStyles.inputIcon} />
            <TouchableOpacity
              style={[appStyles.input, { justifyContent: 'center' }]}
              onPress={() => setShowStateDropdown(!showStateDropdown)}
            >
              <Text style={{ color: formData.state ? '#1e293b' : '#9ca3af' }}>
                {formData.state || 'Eyalet seçiniz'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {showStateDropdown && (
            <View style={authStyles.dropdown}>
              <ScrollView style={authStyles.dropdownScroll} nestedScrollEnabled>
                {germanStates.map((state) => (
                  <TouchableOpacity
                    key={state}
                    style={[
                      authStyles.dropdownItem,
                      formData.state === state && authStyles.dropdownItemSelected
                    ]}
                    onPress={() => handleStateSelect(state)}
                  >
                    <Text style={[
                      authStyles.dropdownItemText,
                      formData.state === state && authStyles.dropdownItemTextSelected
                    ]}>
                      {state}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={authStyles.sectionHeader}>
          <Text style={authStyles.sectionTitle}>Güvenlik</Text>
        </View>

        <View style={appStyles.inputContainer}>
          <Text style={appStyles.label}>Şifre *</Text>
          <View style={appStyles.inputWrapper}>
            <Lock color="#64748b" size={20} style={appStyles.inputIcon} />
            <TextInput
              style={appStyles.input}
              placeholder="En az 6 karakter"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
            />
          </View>
        </View>

        <View style={appStyles.inputContainer}>
          <Text style={appStyles.label}>Şifre Tekrar *</Text>
          <View style={appStyles.inputWrapper}>
            <Lock color="#64748b" size={20} style={appStyles.inputIcon} />
            <TextInput
              style={appStyles.input}
              placeholder="Şifrenizi tekrar giriniz"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[appStyles.submitButton, loading && { opacity: 0.7 }]} 
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={appStyles.submitButtonText}>
            {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}