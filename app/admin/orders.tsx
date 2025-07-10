import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Download, Filter } from 'lucide-react-native';
import { OrderManagement } from '../components/admin/OrderManagement';
import { OrderStatus } from '../types/order';

export default function OrdersScreen() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.filters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedStatus === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setSelectedStatus('all')}
            >
              <Text style={[
                styles.filterButtonText,
                selectedStatus === 'all' && styles.filterButtonTextActive
              ]}>Tümü</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedStatus === 'pending' && styles.filterButtonActive
              ]}
              onPress={() => setSelectedStatus('pending')}
            >
              <Text style={[
                styles.filterButtonText,
                selectedStatus === 'pending' && styles.filterButtonTextActive
              ]}>Bekleyen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedStatus === 'processing' && styles.filterButtonActive
              ]}
              onPress={() => setSelectedStatus('processing')}
            >
              <Text style={[
                styles.filterButtonText,
                selectedStatus === 'processing' && styles.filterButtonTextActive
              ]}>İşleniyor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedStatus === 'completed' && styles.filterButtonActive
              ]}
              onPress={() => setSelectedStatus('completed')}
            >
              <Text style={[
                styles.filterButtonText,
                selectedStatus === 'completed' && styles.filterButtonTextActive
              ]}>Tamamlandı</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <ScrollView style={styles.scrollContent}>
          <OrderManagement />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  filters: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    flex: 1,
  },
});