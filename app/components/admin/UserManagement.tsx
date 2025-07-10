import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { User } from '../../types/user';
import { Mail, Phone, Building2, MapPin, Receipt } from 'lucide-react-native';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const result = await userService.listUsers();

      if (!result.success) {
        throw new Error(result.error);
      }

      setUsers(result.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Kullanıcılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Kullanıcılar yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchUsers}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz hiç kullanıcı bulunmuyor.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {users.map(user => (
        <View key={user.id} style={styles.userCard}>
          <View style={styles.userHeader}>
            <Text style={styles.userName}>{user.full_name}</Text>
            <View style={styles.userMeta}>
              <Text style={styles.userDate}>
                Kayıt: {new Date(user.created_at).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.infoRow}>
              <Mail size={16} color="#64748b" />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Building2 size={16} color="#64748b" />
              <Text style={styles.infoText}>{user.company_name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Phone size={16} color="#64748b" />
              <Text style={styles.infoText}>{user.phone}</Text>
            </View>

            {user.tax_id && (
              <View style={styles.infoRow}>
                <Receipt size={16} color="#64748b" />
                <Text style={styles.infoText}>{user.tax_id}</Text>
              </View>
            )}

            {user.address && (
              <View style={styles.infoRow}>
                <MapPin size={16} color="#64748b" />
                <Text style={styles.infoText}>{user.address}</Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userHeader: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  userInfo: {
    gap: 12,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
});