import { View, Text, TouchableOpacity } from 'react-native';
import { adminStyles } from '../../styles/adminStyles';

interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
}

const categories = ['Getränke', 'Gemüse & Obst', 'Verpackung'];

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <View style={adminStyles.inputContainer}>
      <Text style={adminStyles.label}>Kategori</Text>
      <View style={adminStyles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              adminStyles.categoryButton,
              value === category && adminStyles.categoryButtonActive,
            ]}
            onPress={() => onChange(category)}
          >
            <Text
              style={[
                adminStyles.categoryButtonText,
                value === category && adminStyles.categoryButtonTextActive,
              ]}
            >{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}