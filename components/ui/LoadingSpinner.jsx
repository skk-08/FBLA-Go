import { View, ActivityIndicator } from 'react-native';
import { colors } from '../../constants/theme';

export default function LoadingSpinner({ size = 'large' }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={size} color={colors.accent} />
    </View>
  );
}
