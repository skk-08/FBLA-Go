import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing, radius } from '../../constants/theme';

export default function EventInfoCard({ userEvents }) {
  if (!userEvents || userEvents.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>My Events</Text>
        <Text style={styles.empty}>No events registered yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>My Events</Text>
      {userEvents.slice(0, 3).map((ue) => (
        <View key={ue.id} style={styles.row}>
          <Ionicons name="ribbon-outline" size={18} color={colors.accent} />
          <View style={styles.info}>
            <Text style={styles.eventName}>{ue.events?.name ?? 'Event'}</Text>
            {ue.events?.competition_date && (
              <Text style={styles.date}>{ue.events.competition_date}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card:       { backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  title:      { color: colors.accent, fontSize: fontSize.base, fontWeight: '700', marginBottom: spacing.md },
  row:        { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.sm },
  info:       { flex: 1 },
  eventName:  { color: colors.white, fontSize: fontSize.sm, fontWeight: '600' },
  date:       { color: colors.muted, fontSize: fontSize.xs, marginTop: 2 },
  empty:      { color: colors.muted, fontSize: fontSize.sm },
});
