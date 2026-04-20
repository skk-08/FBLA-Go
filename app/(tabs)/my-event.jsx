import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing, radius } from '../../constants/theme';
import { useMyEventViewModel } from '../../viewmodels/useMyEventViewModel';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorBanner from '../../components/ui/ErrorBanner';

function EventCard({ event, isRegistered }) {
  return (
    <View style={[styles.eventCard, isRegistered && styles.registeredCard]}>
      <View style={styles.eventHeader}>
        <Ionicons
          name={isRegistered ? 'ribbon' : 'ribbon-outline'}
          size={20}
          color={isRegistered ? colors.accent : colors.muted}
        />
        <Text style={[styles.eventName, isRegistered && styles.registeredName]}>{event.name}</Text>
      </View>
      {event.category && (
        <Text style={styles.category}>{event.category}</Text>
      )}
      {event.description && (
        <Text style={styles.description} numberOfLines={3}>{event.description}</Text>
      )}
      {event.rubric_url && (
        <View style={styles.rubricRow}>
          <Ionicons name="document-text-outline" size={14} color={colors.accent} />
          <Text style={styles.rubricText}>Rubric available</Text>
        </View>
      )}
      {event.competition_date && (
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.muted} />
          <Text style={styles.dateText}>{event.competition_date}</Text>
        </View>
      )}
    </View>
  );
}

export default function MyEventScreen() {
  const { userEvents, filteredEvents, search, setSearch, loading, error } = useMyEventViewModel();
  const registeredIds = new Set(userEvents.map((ue) => ue.event_id));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Event</Text>
      </View>

      {loading ? <LoadingSpinner /> : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {error && <ErrorBanner message={error} />}

          {userEvents.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Registered Events</Text>
              {userEvents.map((ue) => (
                <EventCard key={ue.id} event={ue.events ?? {}} isRegistered />
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All FBLA Events</Text>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color={colors.muted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search events…"
                placeholderTextColor={colors.muted}
                value={search}
                onChangeText={setSearch}
              />
            </View>
            {filteredEvents.length === 0 && (
              <Text style={styles.empty}>No events found</Text>
            )}
            {filteredEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} isRegistered={registeredIds.has(ev.id)} />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.primary },
  header:         { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle:    { color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  scroll:         { padding: spacing.xl, paddingBottom: spacing.xxl },
  section:        { marginBottom: spacing.xl },
  sectionTitle:   { color: colors.accent, fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.md, letterSpacing: 1, textTransform: 'uppercase' },
  searchBar:      { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, marginBottom: spacing.md, gap: spacing.sm },
  searchInput:    { flex: 1, color: colors.white, fontSize: fontSize.sm, paddingVertical: spacing.md },
  eventCard:      { backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  registeredCard: { borderColor: colors.accent },
  eventHeader:    { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  eventName:      { color: colors.white, fontSize: fontSize.base, fontWeight: '700', flex: 1 },
  registeredName: { color: colors.accent },
  category:       { color: colors.muted, fontSize: fontSize.xs, marginBottom: spacing.xs },
  description:    { color: colors.muted, fontSize: fontSize.sm, lineHeight: 20, marginBottom: spacing.sm },
  rubricRow:      { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  rubricText:     { color: colors.accent, fontSize: fontSize.xs },
  dateRow:        { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  dateText:       { color: colors.muted, fontSize: fontSize.xs },
  empty:          { color: colors.muted, fontSize: fontSize.sm, textAlign: 'center', paddingVertical: spacing.lg },
});
