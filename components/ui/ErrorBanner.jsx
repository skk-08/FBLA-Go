import { View, Text } from 'react-native';
import { colors, spacing, radius, fontSize } from '../../constants/theme';

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <View style={{
      backgroundColor: '#3D0000',
      borderWidth: 1,
      borderColor: colors.error,
      borderRadius: radius.card,
      padding: spacing.md,
      marginBottom: spacing.lg,
    }}>
      <Text style={{ color: colors.error, fontSize: fontSize.sm }}>
        {message}
      </Text>
    </View>
  );
}
