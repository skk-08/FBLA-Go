import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { colors, fontSize, spacing, radius } from '../constants/theme';
import { useNotificationsViewModel } from '../viewmodels/useNotificationsViewModel';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function NotifItem({ item }) {
  return (
    <View style={[styles.item, !item.is_read && styles.unread]}>
      <View style={styles.dot} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title ?? 'Notification'}</Text>
        {item.body && <Text style={styles.body}>{item.body}</Text>}
        <Text style={styles.time}>
          {item.created_at
            ? formatDistanceToNow(parseISO(item.created_at), { addSuffix: true })
            : ''}
        </Text>
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, loading } = useNotificationsViewModel();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? <LoadingSpinner /> : (
        <FlatList
          data={notifications}
          keyExtractor={(n) => n.id}
          renderItem={({ item }) => <NotifItem item={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="notifications-off-outline" size={48} color={colors.muted} />
              <Text style={styles.empty}>No notifications yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: colors.primary },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle:{ color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  list:       { padding: spacing.xl },
  item:       { flexDirection: 'row', gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  unread:     { borderColor: colors.accent },
  dot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginTop: 6 },
  content:    { flex: 1 },
  title:      { color: colors.white, fontSize: fontSize.sm, fontWeight: '600', marginBottom: 2 },
  body:       { color: colors.muted, fontSize: fontSize.sm, lineHeight: 18, marginBottom: 4 },
  time:       { color: colors.border, fontSize: fontSize.xs },
  emptyWrap:  { flex: 1, alignItems: 'center', paddingTop: 80, gap: spacing.md },
  empty:      { color: colors.muted, fontSize: fontSize.base },
});
