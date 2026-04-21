import { useState } from 'react';
import {
  View, Text, Image, ScrollView, TextInput, Pressable, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../../constants/theme';
import { useUIStore } from '../../store/uiStore';

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
  const { isDarkMode } = useUIStore();
  const dark = isDarkMode;
  const [activeTab, setActiveTab] = useState('current');
  const [search, setSearch] = useState('');

  const filtered = EVENTS.filter((e) =>
    e.name.toLowerCase().replace('\n', ' ').includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <View style={s.headerLogoClip}><Image source={LOGO} style={s.headerLogo} resizeMode="contain" /></View>
        <Text style={s.headerTitle}>Event Details</Text>
      </View>

      <View style={{ flex: 1, backgroundColor: dark ? '#121212' : '#fff' }}>
        {/* Search */}
        <View style={[s.searchWrap, dark && { backgroundColor: '#2A2A2A' }]}>
          <Ionicons name="search-outline" size={16} color="#999" />
          <TextInput
            style={[s.searchInput, dark && { color: '#eee' }]}
            placeholder="Search event name, city, state, or region"
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Tabs */}
        <View style={[s.tabRow, dark && { borderBottomColor: '#333' }]}>
          <Pressable onPress={() => setActiveTab('current')} style={s.tabWrap}>
            <Text style={[s.tabText, activeTab === 'current' && s.tabActive, dark && { color: activeTab === 'current' ? colors.primary : '#666' }]}>
              Current Events
            </Text>
            {activeTab === 'current' && <View style={s.underline} />}
          </Pressable>
          <Pressable onPress={() => setActiveTab('scores')} style={s.tabWrap}>
            <Text style={[s.tabText, activeTab === 'scores' && s.tabActive, dark && { color: activeTab === 'scores' ? colors.primary : '#666' }]}>
              Scores
            </Text>
            {activeTab === 'scores' && <View style={s.underline} />}
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 40 }}>
          <Text style={s.dateLabel}>April 2026</Text>

          {filtered.map((ev) => (
            <View key={ev.id} style={[s.card, dark && { backgroundColor: '#1E1E1E' }]}>
              <Text style={[s.eventName, dark && { color: '#eee' }]}>{ev.name}</Text>

              {activeTab === 'current' ? (
                <>
                  <Text style={[s.conference, dark && { color: '#ccc' }]}>{ev.conference}</Text>
                  <View style={s.cardFooter}>
                    <Text style={[s.dates, dark && { color: '#aaa' }]}>{ev.dates}</Text>
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
            <Text style={s.empty}>No events found</Text>
          )}
        </ScrollView>
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
});
