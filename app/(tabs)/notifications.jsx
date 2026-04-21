import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { colors, fontSize, spacing, radius } from '../../constants/theme';
import { useNotificationsViewModel } from '../../viewmodels/useNotificationsViewModel';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SAMPLES = [
  { id: '1',    title: 'New Message',      body: 'Chapter Member',    created_at: new Date(Date.now() - 3   * 60000).toISOString() },
  { id: '2',    title: 'New Message',      body: 'Chapter Member',    created_at: new Date(Date.now() - 20  * 60000).toISOString() },
  { id: '3',    title: 'New Announcement', body: 'State Competition', created_at: new Date(Date.now() - 60  * 60000).toISOString() },
  { id: '4',    title: 'Reminder',         body: 'Chapter Meeting',   created_at: new Date(Date.now() - 4   * 3600000).toISOString() },
];

function NotifCard({ item, onPress }) {
  const time = item.created_at
    ? formatDistanceToNow(parseISO(item.created_at), { addSuffix: true })
    : '';
  return (
    <Pressable style={s.card} onPress={onPress}>
      <View style={s.iconCircle} />
      <View style={s.content}>
        <Text style={s.title}>{item.title}</Text>
        {item.body ? <Text style={s.body}>{item.body}</Text> : null}
        <Text style={s.time}>{time}</Text>
      </View>
      {item.link && (
        <Ionicons name="chevron-forward" size={16} color="#bbb" />
      )}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, loading, markAllRead } = useNotificationsViewModel();
  const display = notifications.length > 0 ? notifications : SAMPLES;

  function handlePress(item) {
    if (item.link === 'events') router.push('/(tabs)/my-event');
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={{ marginRight: spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </Pressable>
        <Text style={s.headerTitle}>{'Notification\nCenter'}</Text>
      </View>

      {loading ? <LoadingSpinner /> : (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ alignItems: 'flex-end', paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
            <Pressable style={s.markAllBtn} onPress={markAllRead}>
              <Text style={s.markAllText}>Mark all as read</Text>
            </Pressable>
          </View>

          <FlatList
            data={display}
            keyExtractor={(n) => n.id}
            renderItem={({ item }) => (
              <NotifCard item={item} onPress={() => handlePress(item)} />
            )}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md, paddingBottom: 40 }}
            ListEmptyComponent={<Text style={s.empty}>No notifications</Text>}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.primary },
  header:      { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  headerTitle: { color: colors.white, fontSize: 28, fontWeight: '900', lineHeight: 34 },
  markAllBtn:  { backgroundColor: colors.blue2, borderRadius: radius.pill, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  markAllText: { color: colors.white, fontSize: fontSize.sm, fontWeight: '600' },
  card:        { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8E8E8', borderRadius: 12, padding: spacing.lg, gap: spacing.md },
  iconCircle:  { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primary, flexShrink: 0 },
  content:     { flex: 1 },
  title:       { fontSize: fontSize.base, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  body:        { fontSize: fontSize.sm, color: '#555', marginBottom: 4 },
  time:        { fontSize: fontSize.xs, color: '#999', textAlign: 'right' },
  empty:       { textAlign: 'center', color: '#888', paddingTop: 60, fontSize: fontSize.sm },
});
