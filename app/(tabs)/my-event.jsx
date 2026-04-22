import { useState, useMemo } from 'react';
import {
  View, Text, Image, ScrollView, TextInput, Pressable, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import {
  PRESENTATION_EVENTS,
  OBJECTIVE_TESTING_EVENTS,
  ROLE_PLAY_EVENTS,
} from '../../constants/fblaEvents';

const CATEGORIES = [
  { key: 'presentation', label: 'Presentation\nEvents',  data: PRESENTATION_EVENTS },
  { key: 'objective',    label: 'Objective\nTesting',    data: OBJECTIVE_TESTING_EVENTS },
  { key: 'roleplay',     label: 'Role play\nEvents',     data: ROLE_PLAY_EVENTS },
];

const LOGO = require('../../assets/fblago-logo.png');

const EVENTS = [
  {
    id: '1',
    name: 'Business & Management-\nObjective Test',
    conference: '2026 State Leadership Conference',
    dates: 'April 21-April 24, 2026 | Spokane, WA',
    score: '67/100',
  },
  {
    id: '2',
    name: 'Event Planning-\nPresentation Event',
    conference: '2026 State Leadership Conference',
    dates: 'April 21-April 24, 2026 | Spokane, WA',
    score: '91/100',
  },
  {
    id: '3',
    name: 'Business Plan-\nPresentation Event',
    conference: '2026 State Leadership Conference',
    dates: 'April 21-April 24, 2026 | Spokane, WA',
    score: '92/100',
  },
];

export default function MyEventScreen() {
  const router = useRouter();
  const { colors: t, isDark } = useTheme();
  const dark = isDark;
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState(params?.tab === 'browse' ? 'browse' : 'current');
  const [categoryTab, setCategoryTab] = useState('presentation');
  const [search, setSearch] = useState('');

  const filtered = EVENTS.filter((e) =>
    e.name.toLowerCase().replace('\n', ' ').includes(search.toLowerCase())
  );

  const browseData = CATEGORIES.find((c) => c.key === categoryTab)?.data ?? [];
  const filteredBrowse = useMemo(() => {
    if (!search.trim()) return browseData;
    return browseData.filter((name) => name.toLowerCase().includes(search.toLowerCase()));
  }, [search, browseData]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <View style={s.headerLogoClip}><Image source={LOGO} style={s.headerLogo} resizeMode="contain" /></View>
        <Text style={s.headerTitle}>Event Details</Text>
      </View>

      <View style={{ flex: 1, backgroundColor: t.bg }}>
        {/* Search */}
        <View style={[s.searchWrap, dark && { backgroundColor: t.inputBg }]}>
          <Ionicons name="search-outline" size={16} color="#999" />
          <TextInput
            style={[s.searchInput, dark && { color: t.text }]}
            placeholder={activeTab === 'browse' ? 'Search event name' : 'Search event name, city, state, or region'}
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Tabs */}
        <View style={[s.tabRow, dark && { borderBottomColor: t.hairline }]}>
          <Pressable onPress={() => setActiveTab('current')} style={s.tabWrap}>
            <Text style={[s.tabText, activeTab === 'current' && s.tabActive, dark && { color: activeTab === 'current' ? t.text : t.textSecondary }]}>
              Current Events
            </Text>
            {activeTab === 'current' && <View style={s.underline} />}
          </Pressable>
          <Pressable onPress={() => setActiveTab('scores')} style={s.tabWrap}>
            <Text style={[s.tabText, activeTab === 'scores' && s.tabActive, dark && { color: activeTab === 'scores' ? t.text : t.textSecondary }]}>
              Scores
            </Text>
            {activeTab === 'scores' && <View style={s.underline} />}
          </Pressable>
          <Pressable onPress={() => setActiveTab('browse')} style={s.tabWrap}>
            <Text style={[s.tabText, activeTab === 'browse' && s.tabActive, dark && { color: activeTab === 'browse' ? t.text : t.textSecondary }]}>
              Browse
            </Text>
            {activeTab === 'browse' && <View style={s.underline} />}
          </Pressable>
        </View>

        {activeTab === 'browse' ? (
          <>
            <View style={s.categoryRow}>
              {CATEGORIES.map((c) => (
                <Pressable
                  key={c.key}
                  style={[s.categoryBtn, dark && { backgroundColor: t.card }, categoryTab === c.key && s.categoryBtnActive]}
                  onPress={() => setCategoryTab(c.key)}
                >
                  <Text style={[s.categoryText, dark && { color: t.textSecondary }, categoryTab === c.key && s.categoryTextActive]}>
                    {c.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <ScrollView contentContainerStyle={s.browseList}>
              {filteredBrowse.map((name) => (
                <Pressable
                  key={name}
                  onPress={() => router.push({ pathname: '/(tabs)/event-detail', params: { name } })}
                >
                  <Text style={[s.eventLink, dark && { color: colors.accent }]}>{name}</Text>
                </Pressable>
              ))}
              {filteredBrowse.length === 0 && (
                <Text style={[s.empty, dark && { color: t.textSecondary }]}>No events found</Text>
              )}
            </ScrollView>
          </>
        ) : (
          <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 40 }}>
            <Text style={s.dateLabel}>April 2026</Text>

            {filtered.map((ev) => (
              <View key={ev.id} style={[s.card, dark && { backgroundColor: t.card }]}>
                <Text style={[s.eventName, dark && { color: t.text }]}>{ev.name}</Text>

                {activeTab === 'current' ? (
                  <>
                    <Text style={[s.conference, dark && { color: t.text }]}>{ev.conference}</Text>
                    <View style={s.cardFooter}>
                      <Text style={[s.dates, dark && { color: t.textSecondary }]}>{ev.dates}</Text>
                      <Pressable
                        style={s.actionBtn}
                        onPress={() => Alert.alert('Check In', `Checking in to ${ev.name.replace('\n', ' ')}`)}
                      >
                        <Text style={s.actionText}>Check In</Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <View style={s.cardFooter}>
                    <Text style={s.score}>{ev.score}</Text>
                    <Pressable style={s.actionBtn}>
                      <Text style={s.actionText}>more</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}

            {filtered.length === 0 && (
              <Text style={[s.empty, dark && { color: t.textSecondary }]}>No events found</Text>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.primary },
  header:      { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerLogoClip: { width: 32, height: 32 },
  headerLogo:     { width: 32, height: 32 },
  headerTitle: { color: '#fff', fontSize: fontSize.xxl, fontWeight: '800' },
  searchWrap:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EBEBEB', borderRadius: 24, marginHorizontal: spacing.lg, marginVertical: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.xs },
  searchInput: { flex: 1, fontSize: fontSize.sm, color: '#1A1A1A' },
  tabRow:      { flexDirection: 'row', paddingHorizontal: spacing.xl, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  tabWrap:     { marginRight: spacing.xl, paddingBottom: spacing.sm, position: 'relative' },
  tabText:     { fontSize: fontSize.base, color: '#888', fontWeight: '600' },
  tabActive:   { color: colors.primary },
  underline:   { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: colors.primary },
  dateLabel:   { color: colors.error, fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.xs },
  card:        { backgroundColor: '#EBEBEB', borderRadius: 12, padding: spacing.lg },
  eventName:   { fontSize: fontSize.base, fontWeight: '800', color: '#1A1A1A', marginBottom: spacing.xs },
  conference:  { fontSize: fontSize.sm, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  cardFooter:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  dates:       { fontSize: fontSize.xs, color: '#666', flex: 1, flexWrap: 'wrap' },
  score:       { fontSize: fontSize.lg, fontWeight: '700', color: colors.error },
  actionBtn:   { backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 8, paddingHorizontal: spacing.lg },
  actionText:  { color: '#fff', fontSize: fontSize.sm, fontWeight: '600' },
  empty:       { textAlign: 'center', color: '#888', paddingTop: 40, fontSize: fontSize.sm },
  categoryRow:       { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.md, marginBottom: spacing.md },
  categoryBtn:       { flex: 1, backgroundColor: '#D9D9D9', borderRadius: 10, paddingVertical: spacing.sm, alignItems: 'center' },
  categoryBtnActive: { backgroundColor: colors.primary },
  categoryText:      { fontSize: 11, fontWeight: '600', color: '#555', textAlign: 'center', lineHeight: 15 },
  categoryTextActive:{ color: '#fff' },
  browseList:        { paddingHorizontal: spacing.xl, paddingBottom: 40, gap: 4 },
  eventLink:         { fontSize: fontSize.sm, color: colors.primary, textDecorationLine: 'underline', paddingVertical: 6 },
});
