import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Beer, Apple, Package, Snowflake } from 'lucide-react-native';
import { homeStyles } from '../../styles/homeStyles';
import { router } from 'expo-router';

export const categories = [
  {
    id: '1',
    name: 'Getränke',
    icon: Beer,
    color: '#f97316',
  },
  {
    id: '2',
    name: 'Gemüse & Obst',
    icon: Apple,
    color: '#22c55e',
  },
  {
    id: '3',
    name: 'Verpackung',
    icon: Package,
    color: '#6366f1',
  },
  {
    id: '4',
    name: 'Kühlsachen',
    icon: Snowflake,
    color: '#0ea5e9',
  },
];

export function CategoryList() {
  const handleCategoryPress = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={homeStyles.categoryCard}
      onPress={() => handleCategoryPress(item.id)}
    >
      <View style={[homeStyles.iconContainer, { backgroundColor: item.color }]}>
        <item.icon color="white" size={24} />
      </View>
      <Text style={homeStyles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <Text style={homeStyles.title}>Kategoriler</Text>
      </View>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.list}
      />
    </View>
  );
}