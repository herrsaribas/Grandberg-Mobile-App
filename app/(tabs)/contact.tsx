import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, Mail, MapPin, Globe, Clock } from 'lucide-react-native';

export default function ContactScreen() {
  const handleCall = () => {
    Linking.openURL('tel:+491234567890');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:info@ornekfirma.de');
  };

  const handleWebsite = () => {
    Linking.openURL('https://www.ornekfirma.de');
  };

  const handleLocation = () => {
    Linking.openURL('https://maps.google.com/?q=Berlin,Germany');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>İletişim</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Firma Bilgileri</Text>
          <Text style={styles.companyName}>Örnek Firma GmbH</Text>
          <Text style={styles.companyDesc}>
            2010 yılından beri Almanya'da toptan gıda ve market ürünleri tedariği yapıyoruz.
          </Text>
        </View>

        <View style={styles.contactItems}>
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <View style={[styles.iconContainer, { backgroundColor: '#22c55e' }]}>
              <Phone color="#ffffff" size={24} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Telefon</Text>
              <Text style={styles.contactValue}>+49 123 456 7890</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <View style={[styles.iconContainer, { backgroundColor: '#3b82f6' }]}>
              <Mail color="#ffffff" size={24} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>E-posta</Text>
              <Text style={styles.contactValue}>info@ornekfirma.de</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleLocation}>
            <View style={[styles.iconContainer, { backgroundColor: '#ef4444' }]}>
              <MapPin color="#ffffff" size={24} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Adres</Text>
              <Text style={styles.contactValue}>Musterstraße 123, 10115 Berlin</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
            <View style={[styles.iconContainer, { backgroundColor: '#6366f1' }]}>
              <Globe color="#ffffff" size={24} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Website</Text>
              <Text style={styles.contactValue}>www.ornekfirma.de</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.contactItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#f59e0b' }]}>
              <Clock color="#ffffff" size={24} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Çalışma Saatleri</Text>
              <Text style={styles.contactValue}>Pazartesi - Cuma: 08:00 - 17:00</Text>
              <Text style={styles.contactValue}>Cumartesi: 09:00 - 14:00</Text>
            </View>
          </View>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Sipariş ve bilgi için bizi arayabilir veya e-posta gönderebilirsiniz.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 8,
  },
  companyDesc: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  contactItems: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  notice: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#0369a1',
    textAlign: 'center',
    lineHeight: 20,
  },
});