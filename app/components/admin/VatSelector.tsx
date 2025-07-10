import { View, Text, TouchableOpacity } from 'react-native';
import { adminStyles } from '../../styles/adminStyles';

interface VatSelectorProps {
  value: string;
  onChange: (vat: string) => void;
}

export function VatSelector({ value, onChange }: VatSelectorProps) {
  return (
    <View style={adminStyles.inputContainer}>
      <Text style={adminStyles.label}>KDV Oranı (%)</Text>
      <View style={adminStyles.vatContainer}>
        {[0, 7, 19].map((rate) => (
          <TouchableOpacity
            key={rate}
            style={[
              adminStyles.vatButton,
              value === rate.toString() && adminStyles.vatButtonActive,
            ]}
            onPress={() => onChange(rate.toString())}
          >
            <Text
              style={[
                adminStyles.vatButtonText,
                value === rate.toString() && adminStyles.vatButtonTextActive,
              ]}
            >%{rate}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}