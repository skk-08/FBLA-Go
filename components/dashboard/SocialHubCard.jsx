import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, fontSize, spacing, radius } from '../../constants/theme';

export default function SocialHubCard() {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/social-hub')}>
      <View style={styles.row}>
        <Ionicons name="logo-instagram" size={28} color={colors.accent} />
        <View style={styles.text}>
          <Text style={styles.title}>FBLA Social Hub</Text>
          <Text style={styles.sub}>Follow @fbla_pbl on Instagram</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:   { backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  row:    { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text:   { flex: 1 },
  title:  { color: colors.white, fontSize: fontSize.base, fontWeight: '700' },
  sub:    { color: colors.muted, fontSize: fontSize.sm, marginTop: 2 },
});
