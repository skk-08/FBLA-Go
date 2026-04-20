import { View, TextInput, Text } from 'react-native';
import { colors, fontSize, spacing, radius } from '../../constants/theme';

export default function AppInput({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete,
  editable = true,
}) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label && (
        <Text style={{ color: colors.white, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.xs }}>
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        editable={editable}
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: error ? colors.error : colors.border,
          borderRadius: radius.card,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          color: colors.white,
          fontSize: fontSize.base,
        }}
      />
      {error && (
        <Text style={{ color: colors.error, fontSize: fontSize.xs, marginTop: spacing.xs }}>
          {error}
        </Text>
      )}
    </View>
  );
}
