import { View, Text, Pressable, StyleSheet, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

function ResourceCard({ icon, label, sublabel, onPress, t, dark }) {
  return (
    <Pressable style={[s.card, dark && { backgroundColor: t.card }]} onPress={onPress}>
      <View style={s.cardIcon}>
        <Ionicons name={icon} size={40} color={dark ? t.textSecondary : '#888'} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.cardLabel, dark && { color: t.text }]}>{label}</Text>
        {sublabel ? <Text style={[s.cardSub, dark && { color: t.textSecondary }]}>{sublabel}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color={dark ? t.textSecondary : '#bbb'} />
    </Pressable>
  );
}

export default function EventDetailScreen() {
  const router = useRouter();
  const { colors: t, isDark } = useTheme();
  const dark = isDark;
  const { name } = useLocalSearchParams();

  const slug = String(name ?? '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const rubricUrl = `https://www.fbla.org/events/${slug}/`;

  function openRubric() {
    Linking.openURL(rubricUrl).catch(() =>
      Linking.openURL('https://www.fbla.org/competitive-events/')
    );
  }

  function openArchives() {
    Alert.alert(
      'Event Archives',
      `Archives for ${name} are stored by your chapter. Members can upload past materials for this event.`,
      [{ text: 'OK' }]
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </Pressable>
        <Text style={s.headerTitle}>Event Information</Text>
      </View>

      <View style={[s.body, dark && { backgroundColor: t.bg }]}>
        <Text style={[s.eventName, dark && { color: colors.accent }]}>{name}</Text>

        <View style={s.cards}>
          <ResourceCard
            icon="time-outline"
            label="Event Archives"
            sublabel="View past materials saved by your chapter"
            onPress={openArchives}
            t={t}
            dark={dark}
          />
          <ResourceCard
            icon="document-text-outline"
            label="Event Rubric"
            sublabel="Opens rubric & rules PDF in browser"
            onPress={openRubric}
            t={t}
            dark={dark}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.primary },
  header:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  backBtn:     { marginRight: spacing.md },
  headerTitle: { color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  body:        { flex: 1, backgroundColor: '#fff', padding: spacing.xl },
  eventName:   { fontSize: fontSize.xl, fontWeight: '800', color: colors.primary, marginBottom: spacing.xxl * 1.5 },
  cards:       { gap: spacing.lg },
  card:        { backgroundColor: '#D9D9D9', borderRadius: 12, paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  cardIcon:    { width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },
  cardLabel:   { fontSize: fontSize.base, fontWeight: '600', color: '#1A1A1A' },
  cardSub:     { fontSize: fontSize.xs, color: '#888', marginTop: 2 },
});
