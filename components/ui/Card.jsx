import { View } from 'react-native';
import { colors, spacing, radius } from '../../constants/theme';

export default function Card({ children, style }) {
  return (
    <View style={[{
      backgroundColor: colors.surface,
      borderRadius:    radius.card,
      borderWidth:     1,
      borderColor:     colors.border,
      padding:         spacing.lg,
      marginBottom:    spacing.md,
    }, style]}>
      {children}
    </View>
  );
}
