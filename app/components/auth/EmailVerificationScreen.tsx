import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface EmailVerificationScreenProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export function EmailVerificationScreen({ 
  email, 
  onVerificationComplete, 
  onBack 
}: EmailVerificationScreenProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Lütfen doğrulama kodunu giriniz');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Doğrulama kodu 6 haneli olmalıdır');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'signup'
      });

      if (error) {
        if (error.message.includes('expired')) {
          setError('Doğrulama kodu süresi dolmuş. Lütfen yeni kod talep edin.');
        } else if (error.message.includes('invalid')) {
          setError('Geçersiz doğrulama kodu. Lütfen tekrar deneyin.');
        } else {
          setError('Doğrulama işlemi başarısız. Lütfen tekrar deneyin.');
        }
        return;
      }

      if (data.user) {
        Alert.alert(
          'Başarılı!', 
          'E-posta adresiniz başarıyla doğrulandı. Artık uygulamayı kullanabilirsiniz.',
          [{ text: 'Tamam', onPress: onVerificationComplete }]
        );
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Doğrulama işlemi sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      setError(null);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        setError('Kod gönderimi başarısız. Lütfen tekrar deneyin.');
        return;
      }

      Alert.alert(
        'Kod Gönderildi', 
        'Yeni doğrulama kodu e-posta adresinize gönderildi.'
      );
      
      setCountdown(60);
      setCanResend(false);
      setVerificationCode('');
    } catch (error) {
      console.error('Resend error:', error);
      setError('Kod gönderimi sırasında bir hata oluştu');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={24} color="#64748b" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Mail size={48} color="#2563eb" />
        </View>

        <Text style={styles.title}>E-posta Doğrulama</Text>
        <Text style={styles.description}>
          <Text style={styles.email}>{email}</Text> adresine gönderilen 6 haneli doğrulama kodunu giriniz.
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.codeInputContainer}>
          <Text style={styles.label}>Doğrulama Kodu</Text>
          <TextInput
            style={styles.codeInput}
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.buttonDisabled]}
          onPress={handleVerifyCode}
          disabled={loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading ? 'Doğrulanıyor...' : 'Doğrula'}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity
              style={[styles.resendButton, resendLoading && styles.buttonDisabled]}
              onPress={handleResendCode}
              disabled={resendLoading}
            >
              <RefreshCw size={16} color="#2563eb" />
              <Text style={styles.resendButtonText}>
                {resendLoading ? 'Gönderiliyor...' : 'Yeni Kod Gönder'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.countdownText}>
              Yeni kod gönderebilmek için {countdown} saniye bekleyin
            </Text>
          )}
        </View>

        <Text style={styles.helpText}>
          Kod gelmedi mi? Spam klasörünüzü kontrol edin veya yeni kod talep edin.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  email: {
    fontWeight: '600',
    color: '#2563eb',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  codeInputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  codeInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    padding: 16,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 8,
    color: '#1e293b',
  },
  verifyButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  countdownText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
  helpText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});