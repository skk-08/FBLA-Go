import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator,
  Modal, TextInput, KeyboardAvoidingView, Platform, Alert, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { fetchAnnouncements } from '../../models/announcementModel';

const SAMPLE = [
  { id: '1', title: 'State Leadership Conference Information Meeting', body: "Join us for our next Chapter Meeting on Thursday, February 19th in Ms. Sullivan's room for information about SLC! If you can't make it, ensure that you email @fblaexec.org!", created_at: '2026-02-17T00:00:00Z', author_name: 'J C', archived: false },
  { id: '2', title: 'IMPORTANT: State Leadership Conference Registration Deadline!', body: "Don't forget to register for State Leadership Conference by this Friday, February 13th! Permission slips are available in Ms. Sullivan's room, and the fee is $500!", created_at: '2026-02-10T00:00:00Z', author_name: 'J C', archived: false },
  { id: '3', title: 'FUNDRAISER SUCCESS!', body: 'Our Chipotle Fundraiser was a success! We raised $900! Thank you to whoever donated!', created_at: '2026-01-31T00:00:00Z', author_name: 'J C', archived: false },
];

function AuthorBubble({ name }) {
  const initials = (name ?? 'JC').replace(/\s+/g, '').slice(0, 2).toUpperCase();
  return (
    <View style={s.authorBubble}>
      <Text style={s.authorText}>{initials}</Text>
    </View>
  );
}

function AnnouncementCard({ item, canShare, t, dark }) {
  const posted = item.created_at
    ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  async function shareAnnouncement() {
    try {
      await Share.share({ message: `${item.title}\n\n${item.body}`, title: item.title });
    } catch (_) {}
  }

  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <Text style={s.cardTitle}>{item.title}</Text>
      </View>
      <View style={[s.cardBody, dark && { backgroundColor: t.card }]}>
        <Text style={[s.cardText, dark && { color: t.text }]}>{item.body}</Text>
        <View style={s.cardFooter}>
          <Text style={[s.postedText, dark && { color: t.textSecondary }]}>Posted: {posted}</Text>
          <AuthorBubble name={item.author_name} />
        </View>
        {canShare && (
          <View style={s.shareRow}>
            <Pressable style={s.igShareBtn} onPress={shareAnnouncement}>
              <Ionicons name="logo-instagram" size={16} color="#fff" />
              <Text style={s.igShareText}>Share to Instagram</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

export default function ChapterAnnouncementsScreen() {
  const router = useRouter();
  const { colors: t, isDark } = useTheme();
  const dark = isDark;
  const { profile } = useAuthStore();
  const [tab, setTab] = useState('current');
  const [announcements, setAnnouncements] = useState(SAMPLE);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [posting, setPosting] = useState(false);

  const isPrivileged = profile?.role === 'executive' || profile?.role === 'advisor';

  useEffect(() => {
    if (!profile?.chapter_id) return;
    setLoading(true);
    fetchAnnouncements(profile.chapter_id)
      .then((d) => { if (d?.length) setAnnouncements(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profile?.chapter_id]);

  const display = tab === 'current'
    ? announcements.filter((a) => !a.archived)
    : announcements.filter((a) => a.archived);

  function handlePost() {
    if (!newTitle.trim() || !newBody.trim()) {
      Alert.alert('Missing fields', 'Please fill in the title and description.');
      return;
    }
    setPosting(true);
    const newAnnouncement = {
      id: String(Date.now()),
      title: newTitle.trim(),
      body: newBody.trim(),
      created_at: new Date().toISOString(),
      author_name: profile?.full_name?.split(' ').map((w) => w[0]).join(' ') ?? 'JC',
      archived: false,
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setNewTitle('');
    setNewBody('');
    setModalVisible(false);
    setPosting(false);
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={{ marginRight: spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </Pressable>
        <Text style={s.headerTitle}>{'Chapter\nAnnouncements'}</Text>
      </View>

      {/* Tabs row */}
      <View style={[s.tabRow, dark && { backgroundColor: t.bg, borderBottomColor: t.hairline }]}>
        <Pressable onPress={() => setTab('current')} style={s.tabWrap}>
          <Text style={[s.tabText, tab === 'current' && s.tabActive, dark && { color: tab === 'current' ? t.text : t.textSecondary }]}>Current</Text>
          {tab === 'current' && <View style={s.underline} />}
        </Pressable>
        <Pressable onPress={() => setTab('archived')} style={s.tabWrap}>
          <Text style={[s.tabText, tab === 'archived' && s.tabActive, dark && { color: tab === 'archived' ? t.text : t.textSecondary }]}>Archived</Text>
          {tab === 'archived' && <View style={s.underline} />}
        </Pressable>
        <View style={{ flex: 1 }} />
        {isPrivileged && (
          <Pressable style={s.addBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={20} color={colors.white} />
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: t.bg }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView style={{ backgroundColor: t.bg }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
          {display.length === 0 && <Text style={[s.empty, dark && { color: t.textSecondary }]}>No announcements</Text>}
          {display.map((a) => (
            <AnnouncementCard key={a.id} item={a} canShare={isPrivileged} t={t} dark={dark} />
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* New Announcement Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[s.modalCard, dark && { backgroundColor: t.card }]}>
            <Text style={[s.modalTitle, dark && { color: t.text }]}>New Announcement</Text>

            <TextInput
              style={[s.input, dark && { backgroundColor: t.inputBg, color: t.text }]}
              placeholder="Title"
              placeholderTextColor="#888"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[s.input, { height: 120, textAlignVertical: 'top' }, dark && { backgroundColor: t.inputBg, color: t.text }]}
              placeholder="Description..."
              placeholderTextColor="#888"
              value={newBody}
              onChangeText={setNewBody}
              multiline
            />

            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
              <Pressable
                style={[s.modalBtn, { backgroundColor: colors.primary, flex: 1 }]}
                onPress={handlePost}
                disabled={posting}
              >
                {posting
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.modalBtnText}>Post</Text>
                }
              </Pressable>
              <Pressable
                style={[s.modalBtn, { backgroundColor: dark ? t.inputBg : '#D0D0D0', flex: 1 }]}
                onPress={() => { setModalVisible(false); setNewTitle(''); setNewBody(''); }}
              >
                <Text style={[s.modalBtnText, { color: dark ? t.text : '#1A1A1A' }]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.primary },
  header:       { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md },
  headerTitle:  { color: colors.white, fontSize: 28, fontWeight: '900', lineHeight: 34 },
  tabRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: spacing.xl, paddingTop: spacing.md, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  tabWrap:      { paddingBottom: spacing.sm, marginRight: spacing.xxl, position: 'relative' },
  tabText:      { fontSize: fontSize.base, color: '#888', fontWeight: '600' },
  tabActive:    { color: colors.primary },
  underline:    { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: colors.primary },
  addBtn:       { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  card:         { borderRadius: 10, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 3, elevation: 2 },
  cardHeader:   { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  cardTitle:    { color: colors.white, fontSize: fontSize.sm, fontWeight: '700', lineHeight: 18 },
  cardBody:     { backgroundColor: '#E8E8E8', padding: spacing.lg },
  cardText:     { fontSize: fontSize.sm, color: '#333', lineHeight: 22, marginBottom: spacing.lg },
  cardFooter:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  postedText:   { fontSize: fontSize.xs, color: '#888' },
  authorBubble: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  authorText:   { color: '#fff', fontSize: 11, fontWeight: '700' },
  shareRow:     { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  igShareBtn:   { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: '#E04060', borderRadius: 20, paddingVertical: 6, paddingHorizontal: spacing.md },
  igShareText:  { color: '#fff', fontSize: fontSize.xs, fontWeight: '600' },
  empty:        { textAlign: 'center', color: '#888', paddingVertical: spacing.xxl, fontSize: fontSize.sm },
  modalCard:    { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.xl },
  modalTitle:   { fontSize: fontSize.xl, fontWeight: '800', color: '#1A1A1A', marginBottom: spacing.lg },
  input:        { backgroundColor: '#EBEBEB', borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSize.sm, color: '#1A1A1A', marginBottom: spacing.md },
  modalBtn:     { borderRadius: 10, paddingVertical: spacing.md, alignItems: 'center' },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: fontSize.base },
});
