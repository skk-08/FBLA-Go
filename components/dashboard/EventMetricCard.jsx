import { View, Text, StyleSheet } from 'react-native';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing, radius } from '../../constants/theme';

export default function EventMetricCard({ nextCompetition }) {
  if (!nextCompetition) {
    return (
      <View style={styles.card}>
        <Ionicons name="trophy-outline" size={28} color={colors.accent} />
        <Text style={styles.label}>No upcoming competitions</Text>
      </View>
    );
  }

  const days = differenceInDays(parseISO(nextCompetition.competition_date), new Date());

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="trophy" size={28} color={colors.accent} />
        <View style={styles.info}>
          <Text style={styles.eventName} numberOfLines={1}>{nextCompetition.name}</Text>
          <Text style={styles.date}>{format(parseISO(nextCompetition.competition_date), 'MMM d, yyyy')}</Text>
        </View>
      </View>
      <View style={styles.countdown}>
        <Text style={styles.daysNumber}>{days > 0 ? days : 0}</Text>
        <Text style={styles.daysLabel}>{days === 1 ? 'day' : 'days'} away</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:        { backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  row:         { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  info:        { flex: 1 },
  eventName:   { color: colors.white, fontSize: fontSize.base, fontWeight: '700' },
  date:        { color: colors.muted, fontSize: fontSize.sm, marginTop: 2 },
  countdown:   { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  daysNumber:  { color: colors.accent, fontSize: 48, fontWeight: '800', lineHeight: 52 },
  daysLabel:   { color: colors.muted, fontSize: fontSize.lg },
  label:       { color: colors.muted, fontSize: fontSize.sm, marginTop: spacing.sm },
});
