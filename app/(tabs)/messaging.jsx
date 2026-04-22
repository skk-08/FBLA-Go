import { useState } from 'react';
import {
  View, Text, Image, FlatList, TextInput, Pressable, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const LOGO = require('../../assets/fblago-logo.png');
import { colors, fontSize, spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { useUIStore } from '../../store/uiStore';
import { useMessagingViewModel } from '../../viewmodels/useMessagingViewModel';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AVATAR_COLORS = ['#1A1A1A', '#4A78B8', '#C8860A', '#2A5A9A', '#C8860A', '#A0522D', '#333'];

function Avatar({ label, size = 46, colorIdx = 0 }) {
  const initials = (label ?? '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: AVATAR_COLORS[colorIdx % AVATAR_COLORS.length], justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: size * 0.33, fontWeight: '700' }}>{initials}</Text>
    </View>
  );
}

const CONTACTS = [
  { id: 'group', name: 'FBLA Group',   initials: 'FG',   colorIdx: 0, unread: true },
  { id: 'or',    name: 'Olivia R.',    initials: 'O.R.', colorIdx: 1 },
  { id: 'jo',    name: 'Jason O.',     initials: 'J.O.', colorIdx: 2 },
  { id: 'cq',    name: 'Christine Q.', initials: 'C.Q.', colorIdx: 3, unread: true },
  { id: 'mv',    name: 'Maya V.',      initials: 'M.V.', colorIdx: 4, unread: true },
  { id: 'as',    name: 'Amanda S.',    initials: 'A.S.', colorIdx: 5 },
  { id: 'bo',    name: 'Brett O.',     initials: 'B.O.', colorIdx: 6 },
];

const PREVIEW = {
  group: 'Janine K: Are you guys free to call this Thursday to finalize marketing?',
  or:    'YOU: Did you send out the meeting reminder yet? If not make sure to do it ASAP!',
  jo:    'YOU: Yeah I did finish the app design for the announcements page, could you take a look at it?',
  cq:    "My payment portal isn't working for the SLC fees, do you know if I could get an extension?",
  mv:    'Could you send me the updated presentation?',
  as:    "I'm not sure about which room the meeting is in. Could you check with Ms. Sullivan?",
  bo:    "Okay I'll make sure of it.",
};

const CHAT_HISTORY = {
  group: [
    { id: 'gr1', body: 'Janine K: Are you guys free to call this Thursday to finalize marketing?', sender_id: 'other', sender_name: 'Janine K' },
    { id: 'gr2', body: 'I can hop on after 6pm, just finishing up debate practice.', sender_id: 'other', sender_name: 'Marcus T' },
    { id: 'gr3', body: 'Same here, 6pm works for me!', sender_id: 'other', sender_name: 'Priya S' },
    { id: 'gr4', body: "I'll be there. Should we use the shared Google Doc for the agenda?", sender_id: 'me' },
    { id: 'gr5', body: "Yes please! I'll drop the link in here before the call.", sender_id: 'other', sender_name: 'Janine K' },
    { id: 'gr6', body: 'Reminder: bring your section drafts so we can review together.', sender_id: 'other', sender_name: 'Ms. Sullivan' },
    { id: 'gr7', body: "Got it, I'll have the social media plan ready.", sender_id: 'me' },
  ],
  or: [
    { id: 'or1', body: 'Hey! I had a question about the registration date.', sender_id: 'other' },
    { id: 'or2', body: 'Is it February 13th? What should I send out?', sender_id: 'other' },
    { id: 'or3', body: "Yeah, February 13th is the registration date. Send this out: Don't forget to register for State Leadership Conference by this Friday, February 13th! Permission slips are available in Ms. Sullivan's room, and the fee is $500!", sender_id: 'me' },
    { id: 'or4', body: 'Thanks!', sender_id: 'me' },
    { id: 'or5', body: "Thank you so much! I'll do it ASAP!", sender_id: 'other' },
    { id: 'or6', body: "I'll take a look at the ppt btw", sender_id: 'other' },
    { id: 'or7', body: 'Did you send out the meeting reminder yet? If not make sure to do it ASAP!', sender_id: 'me' },
  ],
  jo: [
    { id: 'jo1', body: 'Hey, did you finish the app design for the announcements page?', sender_id: 'other' },
    { id: 'jo2', body: 'Yeah I did finish the app design for the announcements page, could you take a look at it?', sender_id: 'me' },
  ],
  cq: [
    { id: 'cq1', body: "My payment portal isn't working for the SLC fees, do you know if I could get an extension?", sender_id: 'other' },
    { id: 'cq2', body: "I'll check with Ms. Sullivan and get back to you!", sender_id: 'me' },
  ],
  mv: [
    { id: 'mv1', body: 'Could you send me the updated presentation?', sender_id: 'other' },
    { id: 'mv2', body: "Sure, I'll send it over now!", sender_id: 'me' },
  ],
  as: [
    { id: 'as1', body: "I'm not sure about which room the meeting is in. Could you check with Ms. Sullivan?", sender_id: 'other' },
  ],
  bo: [
    { id: 'bo1', body: 'Make sure you turn in the permission slip by Friday!', sender_id: 'me' },
    { id: 'bo2', body: "Okay I'll make sure of it.", sender_id: 'other' },
  ],
};

function MessageBubble({ body, isMine, isAdmin, onLongPress, dark, t }) {
  return (
    <Pressable
      style={[s.bubbleRow, isMine && { justifyContent: 'flex-end' }]}
      onLongPress={onLongPress}
      delayLongPress={400}
    >
      <View style={[isMine ? s.bubbleMine : s.bubbleOther, !isMine && dark && { backgroundColor: t.inputBg }]}>
        <Text style={[isMine ? s.bubbleMineText : s.bubbleOtherText, !isMine && dark && { color: t.text }]}>{body}</Text>
      </View>
    </Pressable>
  );
}

export default function MessagingScreen() {
  const { colors: t, isDark } = useTheme();
  const dark = isDark;
  const [activeContact, setActiveContact] = useState(null);
  const { messages, draft, setDraft, send, deleteMessage, loading, sending, isAdmin, userId } =
    useMessagingViewModel();

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (!activeContact) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.header}>
          <View style={s.headerLogoClip}><Image source={LOGO} style={s.headerLogo} resizeMode="contain" /></View>
          <Text style={s.headerTitle}>Messages</Text>
        </View>
        <FlatList
          data={CONTACTS}
          keyExtractor={(c) => c.id}
          style={{ backgroundColor: t.bg }}
          renderItem={({ item }) => (
            <Pressable style={[s.convRow, dark && { backgroundColor: t.bg }]} onPress={() => setActiveContact(item)}>
              <View style={{ position: 'relative' }}>
                <Avatar label={item.initials} size={50} colorIdx={item.colorIdx} />
                {item.unread && <View style={s.unreadDot} />}
              </View>
              <View style={s.convBody}>
                <Text style={[s.convName, dark && { color: t.text }]}>{item.name}</Text>
                <Text style={[s.convPreview, dark && { color: t.textSecondary }]} numberOfLines={2}>
                  {item.id === 'group' && messages.length > 0
                    ? messages[messages.length - 1]?.body?.slice(0, 80) ?? PREVIEW[item.id]
                    : PREVIEW[item.id]}
                </Text>
              </View>
            </Pressable>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: dark ? t.hairline : '#E8E8E8', marginLeft: 78 }} />
          )}
        />
      </SafeAreaView>
    );
  }

  // ── CHAT VIEW ──────────────────────────────────────────────────────────────
  const isGroup = activeContact.id === 'group';
  const staticMessages = CHAT_HISTORY[activeContact.id] ?? [];

  function handleLongPressGroup(msgId, name) {
    if (!isAdmin) return;
    Alert.alert('Moderate', `Delete message from ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMessage(msgId) },
    ]);
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.chatHeader}>
        <Pressable onPress={() => setActiveContact(null)} style={{ marginRight: spacing.sm }}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </Pressable>
        <Avatar label={activeContact.initials} size={40} colorIdx={activeContact.colorIdx} />
        <Text style={s.chatName}>{activeContact.name}</Text>
      </View>

      {loading && isGroup ? <LoadingSpinner /> : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}
        >
          {isGroup ? (
            <FlatList
              data={messages.length > 0 ? messages : CHAT_HISTORY.group}
              keyExtractor={(m) => m.id}
              renderItem={({ item }) => (
                <MessageBubble
                  body={item.body}
                  isMine={item.sender_id === userId || item.sender_id === 'me'}
                  isAdmin={isAdmin}
                  onLongPress={() => handleLongPressGroup(item.id, item.profiles?.full_name ?? item.sender_name ?? 'Member')}
                  dark={dark}
                  t={t}
                />
              )}
              contentContainerStyle={{ padding: spacing.lg, gap: spacing.xs, paddingBottom: spacing.md }}
              style={{ backgroundColor: t.bg }}
            />
          ) : (
            <FlatList
              data={staticMessages}
              keyExtractor={(m) => m.id}
              renderItem={({ item }) => (
                <MessageBubble
                  body={item.body}
                  isMine={item.sender_id === 'me'}
                  dark={dark}
                  t={t}
                />
              )}
              contentContainerStyle={{ padding: spacing.lg, gap: spacing.xs, paddingBottom: spacing.md }}
              style={{ backgroundColor: t.bg }}
            />
          )}

          <View style={[s.inputRow, dark && { backgroundColor: t.card, borderTopColor: t.hairline }]}>
            <Pressable style={s.plusBtn}>
              <Ionicons name="add" size={22} color={dark ? t.accent : colors.primary} />
            </Pressable>
            <TextInput
              style={[s.input, dark && { backgroundColor: t.inputBg, color: t.text }]}
              placeholder="Type a message"
              placeholderTextColor="#999"
              value={draft}
              onChangeText={setDraft}
              multiline
              maxLength={500}
              editable={isGroup}
            />
            {isGroup && (
              <Pressable onPress={send} disabled={sending || !draft.trim()} style={s.sendBtn}>
                {sending
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Ionicons name="send" size={16} color="#fff" />
                }
              </Pressable>
            )}
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.primary },
  header:         { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerLogoClip: { width: 32, height: 32 },
  headerLogo:     { width: 32, height: 32 },
  headerTitle:    { color: '#fff', fontSize: fontSize.xxl, fontWeight: '800' },
  convRow:        { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.md, backgroundColor: '#fff' },
  unreadDot:      { position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.error, borderWidth: 2, borderColor: '#fff' },
  convBody:       { flex: 1 },
  convName:       { fontSize: fontSize.base, fontWeight: '700', color: '#1A1A1A', marginBottom: 3 },
  convPreview:    { fontSize: fontSize.sm, color: '#444', lineHeight: 18 },
  chatHeader:     { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, gap: spacing.sm },
  chatName:       { color: '#fff', fontSize: fontSize.lg, fontWeight: '700' },
  bubbleRow:      { flexDirection: 'row', marginBottom: 6 },
  bubbleOther:    { maxWidth: '72%', backgroundColor: '#E8E8E8', borderRadius: 14, borderBottomLeftRadius: 4, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  bubbleOtherText:{ color: '#1A1A1A', fontSize: fontSize.sm, lineHeight: 20 },
  bubbleMine:     { maxWidth: '72%', backgroundColor: colors.primary, borderRadius: 14, borderBottomRightRadius: 4, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  bubbleMineText: { color: '#fff', fontSize: fontSize.sm, lineHeight: 20 },
  inputRow:       { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm, backgroundColor: '#E8E8E8', borderTopWidth: 1, borderTopColor: '#D0D0D0' },
  plusBtn:        { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  input:          { flex: 1, backgroundColor: '#D0D0D0', borderRadius: 20, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSize.sm, color: '#1A1A1A', maxHeight: 100 },
  sendBtn:        { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
});
