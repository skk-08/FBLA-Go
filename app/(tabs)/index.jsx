import {
  ScrollView, View, Text, Image, Pressable, StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useDashboardViewModel } from '../../viewmodels/useDashboardViewModel';
import { useUIStore } from '../../store/uiStore';

const LOGO = require('../../assets/fblago-logo.png');

function ArrowCircle() {
  return (
    <View style={s.arrowCircle}>
      <Ionicons name="arrow-forward" size={16} color={colors.white} />
    </View>
  );
}

export default function DashboardScreen() {
  const { profile } = useAuthStore();
  const { todos, nextCompetition, loading, refresh } = useDashboardViewModel();
  const { notificationCount: notifCount, isDarkMode } = useUIStore();
  const dark = isDarkMode;
  const router = useRouter();

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Member';
  const completedTodos = todos.filter((t) => t.completed).length;
  const progress = todos.length > 0 ? completedTodos / todos.length : 0.65;

  const DEFAULT_TODOS = ['Turn in Permission Slip', 'Pay Dues', 'Study for Objective Test'];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Logo bar */}
      <View style={s.logoBar}>
        <View style={s.logoClip}>
          <Image source={LOGO} style={s.logoIcon} resizeMode="contain" />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: dark ? '#121212' : '#fff' }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent} />}
      >
        {/* Welcome banner */}
        <View style={s.welcomeBanner}>
          <Text style={s.welcomeText}>Welcome {firstName}!</Text>
          <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
            <Pressable onPress={() => router.push('/(tabs)/settings')}>
              <Ionicons name="settings-outline" size={22} color={colors.white} />
            </Pressable>
            <Pressable onPress={() => router.push('/(tabs)/notifications')}>
              <View>
                <Ionicons name="notifications-outline" size={22} color={colors.white} />
                {notifCount > 0 && (
                  <View style={s.badge}>
                    <Text style={s.badgeText}>{notifCount > 9 ? '9+' : notifCount}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          </View>
        </View>

        {/* 3-row grid that fills remaining space */}
        <View style={s.gridContainer}>
          {/* Row 1 */}
          <View style={s.gridRow}>
            <View style={[s.card, s.cardDark]}>
              <Text style={[s.cardTitle, { color: colors.white }]}>Competitive Events</Text>
              <View style={s.progressBar}>
                <View style={[s.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
              </View>
              <Text style={[s.pct, { color: colors.white }]}>{Math.round(progress * 100)}%</Text>
              <Text style={s.cardSubDark} numberOfLines={2}>
                {nextCompetition?.name ?? 'Get Ready for Business Plan-SLC'}
              </Text>
            </View>

            <Pressable style={[s.card, dark && { backgroundColor: '#1E1E1E' }]} onPress={() => router.push('/(tabs)/planner')}>
              <Text style={[s.cardTitle, dark && { color: '#eee' }]}>To Do:</Text>
              {todos.length > 0
                ? todos.slice(0, 3).map((t) => (
                    <View key={t.id} style={s.todoRow}>
                      <View style={[s.dot, t.completed && { backgroundColor: colors.success }]} />
                      <Text style={[s.todoText, t.completed && s.todoStrike, dark && { color: '#bbb' }]} numberOfLines={1}>
                        {t.title}
                      </Text>
                    </View>
                  ))
                : DEFAULT_TODOS.map((t) => (
                    <View key={t} style={s.todoRow}>
                      <View style={s.dot} />
                      <Text style={[s.todoText, dark && { color: '#bbb' }]} numberOfLines={1}>{t}</Text>
                    </View>
                  ))
              }
            </Pressable>
          </View>

          {/* Row 2 */}
          <View style={s.gridRow}>
            <View style={[s.card, dark && { backgroundColor: '#1E1E1E' }]}>
              <Text style={[s.cardTitle, dark && { color: '#eee' }]}>Event Information{'\n'}& Rubrics</Text>
              <Text style={[s.cardSub, dark && { color: '#aaa' }]}>Tap for info on all FBLA event and judging criteria</Text>
              <Pressable style={s.arrowWrap} onPress={() => router.push('/(tabs)/event-information')}>
                <ArrowCircle />
              </Pressable>
            </View>

            <View style={[s.card, s.cardDark]}>
              <Text style={[s.cardTitle, { color: colors.white }]}>Chapter{'\n'}Announcements</Text>
              <Text style={s.cardSubDark}>
                Tap to check your chapter's announcements posted by club execs & advisors!
              </Text>
              <Pressable style={s.arrowWrap} onPress={() => router.push('/(tabs)/chapter-announcements')}>
                <ArrowCircle />
              </Pressable>
            </View>
          </View>

          {/* Row 3 */}
          <View style={s.gridRow}>
            <View style={[s.card, dark && { backgroundColor: '#1E1E1E' }]}>
              <Text style={[s.cardTitle, dark && { color: '#eee' }]}>ID Upload/{'\n'}Access</Text>
              <Text style={[s.cardSub, dark && { color: '#aaa' }]}>Upload/Access your student ID for easy access here!</Text>
              <Pressable style={s.arrowWrap} onPress={() => router.push('/(tabs)/id-upload')}>
                <ArrowCircle />
              </Pressable>
            </View>

            <View style={[s.card, s.cardDark]}>
              <Text style={[s.cardTitle, { color: colors.white }]}>FBLA{'\n'}Social Hub</Text>
              <Text style={s.cardSubDark}>
                Tap to check your chapter's announcements posted by club execs & advisors!
              </Text>
              <Pressable style={s.arrowWrap} onPress={() => router.push('/(tabs)/social-hub')}>
                <ArrowCircle />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_GAP = 10;

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.primary },
  logoBar:      { backgroundColor: colors.primary, alignItems: 'center', paddingVertical: spacing.sm },
  logoClip:     { width: 36, height: 36 },
  logoIcon:     { width: 36, height: 36 },
  welcomeBanner:{ backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: spacing.lg, marginTop: spacing.sm, marginBottom: spacing.sm, borderRadius: 10, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  welcomeText:  { color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  badge:        { position: 'absolute', top: -4, right: -6, backgroundColor: colors.error, borderRadius: 7, width: 14, height: 14, justifyContent: 'center', alignItems: 'center' },
  badgeText:    { color: '#fff', fontSize: 8, fontWeight: '700' },
  gridContainer:{ flex: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: CARD_GAP },
  gridRow:      { flex: 1, flexDirection: 'row', gap: CARD_GAP },
  card:         { flex: 1, backgroundColor: '#E0E2E6', borderRadius: 12, padding: spacing.md, position: 'relative' },
  cardDark:     { backgroundColor: colors.primary },
  cardTitle:    { fontSize: fontSize.sm, fontWeight: '800', color: '#1A1A1A', lineHeight: 18, marginBottom: spacing.xs },
  cardSub:      { fontSize: 10, color: '#555', lineHeight: 15, marginTop: spacing.xs },
  cardSubDark:  { fontSize: 10, color: '#A8C0DC', lineHeight: 15, marginTop: spacing.xs },
  arrowWrap:    { position: 'absolute', bottom: spacing.sm, right: spacing.sm },
  arrowCircle:  { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  progressBar:  { height: 5, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, marginTop: spacing.sm, overflow: 'hidden' },
  progressFill: { height: 5, backgroundColor: colors.accent, borderRadius: 3 },
  pct:          { fontSize: fontSize.base, fontWeight: '700', marginTop: spacing.xs },
  todoRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginTop: 4 },
  dot:          { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4, flexShrink: 0 },
  todoText:     { fontSize: 10, color: '#1A1A1A', flex: 1, lineHeight: 15, textDecorationLine: 'underline' },
  todoStrike:   { textDecorationLine: 'line-through', color: '#888' },
});
