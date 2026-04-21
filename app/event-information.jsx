import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../constants/theme';
import {
  PRESENTATION_EVENTS,
  OBJECTIVE_TESTING_EVENTS,
  ROLE_PLAY_EVENTS,
} from '../constants/fblaEvents';

const TABS = [
  { key: 'presentation', label: 'Presentation\nEvents',  data: PRESENTATION_EVENTS },
  { key: 'objective',    label: 'Objective\nTesting',    data: OBJECTIVE_TESTING_EVENTS },
  { key: 'roleplay',     label: 'Role play\nEvents',     data: ROLE_PLAY_EVENTS },
];

export default function EventInformationScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('presentation');
  const [search, setSearch] = useState('');

  const currentData = TABS.find((t) => t.key === activeTab)?.data ?? [];

  const filtered = useMemo(() => {
    if (!search.trim()) return currentData;
    return currentData.filter((e) => e.toLowerCase().includes(search.toLowerCase()));
  }, [search, currentData]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Event Information</Text>
      </View>

      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={s.searchWrap}>
          <Ionicons name="search-outline" size={16} color="#999" />
          <TextInput
            style={s.searchInput}
            placeholder="Search event name"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={s.tabRow}>
          {TABS.map((t) => (
            <Pressable
              key={t.key}
              style={[s.tabBtn, activeTab === t.key && s.tabBtnActive]}
              onPress={() => { setActiveTab(t.key); setSearch(''); }}
            >
              <Text style={[s.tabText, activeTab === t.key && s.tabTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView contentContainerStyle={s.list}>
          {filtered.map((name) => (
            <Pressable
              key={name}
              onPress={() => router.push({ pathname: '/event-detail', params: { name } })}
              onLongPress={() => {
                const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                Linking.openURL(`https://www.fbla.org/events/${slug}/`).catch(() =>
                  Linking.openURL('https://www.fbla.org/competitive-events/')
                );
              }}
            >
              <Text style={s.eventLink}>{name}</Text>
            </Pressable>
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
  safe:         { flex: 1, backgroundColor: colors.primary },
  header:       { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  headerTitle:  { color: '#fff', fontSize: fontSize.xxl, fontWeight: '800' },
  searchWrap:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EBEBEB', borderRadius: 24, marginHorizontal: spacing.lg, marginVertical: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.xs },
  searchInput:  { flex: 1, fontSize: fontSize.sm, color: '#1A1A1A' },
  tabRow:       { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  tabBtn:       { flex: 1, backgroundColor: '#D9D9D9', borderRadius: 10, paddingVertical: spacing.sm, alignItems: 'center' },
  tabBtnActive: { backgroundColor: colors.primary },
  tabText:      { fontSize: 11, fontWeight: '600', color: '#555', textAlign: 'center', lineHeight: 15 },
  tabTextActive:{ color: '#fff' },
  list:         { paddingHorizontal: spacing.xl, paddingBottom: 40, gap: 4 },
  eventLink:    { fontSize: fontSize.sm, color: colors.primary, textDecorationLine: 'underline', paddingVertical: 6 },
  empty:        { textAlign: 'center', color: '#888', paddingTop: 40, fontSize: fontSize.sm },
});
