import { Pressable, Text, ActivityIndicator } from 'react-native';
import { colors, fontSize, spacing, radius } from '../../constants/theme';

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
}) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => ({
        backgroundColor: isPrimary ? colors.accent : 'transparent',
        borderWidth:     isPrimary ? 0 : 1.5,
        borderColor:     isPrimary ? undefined : colors.accent,
        borderRadius:    radius.pill,
        paddingVertical: spacing.md,
        alignItems:      'center',
        opacity:         (pressed || disabled || isLoading) ? 0.7 : 1,
        marginBottom:    spacing.sm,
      })}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? colors.primary : colors.accent} />
      ) : (
        <Text style={{
          color:      isPrimary ? colors.primary : colors.accent,
          fontSize:   fontSize.base,
          fontWeight: '700',
          letterSpacing: 0.5,
        }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
