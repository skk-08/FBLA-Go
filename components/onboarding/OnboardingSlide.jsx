import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../../constants/theme';

export default function OnboardingSlide({ icon, title, body }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={80} color={colors.accent} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  icon: {
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.white,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    color: colors.muted,
    fontSize: fontSize.base,
    textAlign: 'center',
    lineHeight: 24,
  },
});
