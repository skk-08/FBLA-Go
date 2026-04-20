import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { colors, fontSize, spacing, radius } from '../../constants/theme';

export default function AnnouncementsCard({ announcements }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Announcements</Text>
      {(!announcements || announcements.length === 0) && (
        <Text style={styles.empty}>No announcements</Text>
      )}
      {announcements?.map((ann) => (
        <View key={ann.id} style={styles.item}>
          {ann.is_pinned && <Ionicons name="pin" size={14} color={colors.accent} style={styles.pin} />}
          <View style={styles.content}>
            <Text style={styles.itemTitle}>{ann.title}</Text>
            <Text style={styles.body} numberOfLines={2}>{ann.body}</Text>
            <Text style={styles.time}>
              {formatDistanceToNow(parseISO(ann.created_at), { addSuffix: true })}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card:       { backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  title:      { color: colors.accent, fontSize: fontSize.base, fontWeight: '700', marginBottom: spacing.md },
  item:       { flexDirection: 'row', marginBottom: spacing.md, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  pin:        { marginTop: 2, marginRight: spacing.xs },
  content:    { flex: 1 },
  itemTitle:  { color: colors.white, fontSize: fontSize.sm, fontWeight: '600', marginBottom: 2 },
  body:       { color: colors.muted, fontSize: fontSize.xs, lineHeight: 18 },
  time:       { color: colors.border, fontSize: fontSize.xs, marginTop: 4 },
  empty:      { color: colors.muted, fontSize: fontSize.sm },
});
