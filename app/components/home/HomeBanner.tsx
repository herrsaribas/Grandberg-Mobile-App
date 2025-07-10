import { View, Text } from 'react-native';
import { homeStyles } from '../../styles/homeStyles';

export function HomeBanner() {
  return (
    <View style={homeStyles.banner}>
      <Text style={homeStyles.bannerText}>
        Uygulama üzerinden güncel ürün fiyatlarımızı inceleyebilir, sipariş oluşturabilirsiniz. 
        Fiyatlar günceldir, sipariş sonrası en kısa sürede teyit edilir.
      </Text>
    </View>
  );
}