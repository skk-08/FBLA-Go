import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { colors, fontSize, spacing, radius } from '../../constants/theme';
import { useMessagingViewModel } from '../../viewmodels/useMessagingViewModel';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function MessageBubble({ msg, isMine, isAdmin, onDelete }) {
  const name = msg.profiles?.full_name ?? msg.users?.email ?? 'Member';
  const time = msg.created_at
    ? formatDistanceToNow(parseISO(msg.created_at), { addSuffix: true })
    : '';

  function handleLongPress() {
    if (!isAdmin) return;
    Alert.alert('Moderate Message', `Delete message from ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(msg.id) },
    ]);
  }

  return (
    <TouchableOpacity
      style={[styles.bubbleWrap, isMine && styles.bubbleWrapMine]}
      onLongPress={handleLongPress}
      delayLongPress={400}
    >
      {!isMine && <Text style={styles.sender}>{name}</Text>}
      <View style={[styles.bubble, isMine && styles.bubbleMine]}>
        <Text style={[styles.msgText, isMine && styles.msgTextMine]}>{msg.body}</Text>
      </View>
      <Text style={[styles.time, isMine && styles.timeRight]}>{time}</Text>
    </TouchableOpacity>
  );
}

export default function MessagingScreen() {
  const { messages, draft, setDraft, send, deleteMessage, loading, sending, isAdmin, userId } =
    useMessagingViewModel();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chapter Chat</Text>
        {isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminText}>Adviser</Text>
          </View>
        )}
      </View>

      {loading ? <LoadingSpinner /> : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}
        >
          <FlatList
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => (
              <MessageBubble
                msg={item}
                isMine={item.sender_id === userId}
                isAdmin={isAdmin}
                onDelete={deleteMessage}
              />
            )}
            contentContainerStyle={styles.messageList}
            inverted={false}
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type a message…"
              placeholderTextColor={colors.muted}
              value={draft}
              onChangeText={setDraft}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={send} disabled={sending || !draft.trim()}>
              {sending ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="send" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.primary },
  flex:         { flex: 1 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle:  { color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  adminBadge:   { backgroundColor: colors.accent, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  adminText:    { color: colors.primary, fontSize: fontSize.xs, fontWeight: '700' },
  messageList:  { padding: spacing.lg, gap: spacing.sm },
  bubbleWrap:   { maxWidth: '80%', alignSelf: 'flex-start', marginBottom: spacing.md },
  bubbleWrapMine: { alignSelf: 'flex-end' },
  sender:       { color: colors.muted, fontSize: fontSize.xs, marginBottom: 2, marginLeft: spacing.xs },
  bubble:       { backgroundColor: colors.surface, borderRadius: radius.modal, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  bubbleMine:   { backgroundColor: colors.accent, borderColor: colors.accent },
  msgText:      { color: colors.white, fontSize: fontSize.sm, lineHeight: 20 },
  msgTextMine:  { color: colors.primary },
  time:         { color: colors.muted, fontSize: 10, marginTop: 2, marginLeft: spacing.xs },
  timeRight:    { textAlign: 'right', marginRight: spacing.xs },
  inputRow:     { flexDirection: 'row', alignItems: 'flex-end', padding: spacing.md, gap: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  input:        { flex: 1, backgroundColor: colors.surface, borderRadius: radius.modal, borderWidth: 1, borderColor: colors.border, color: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSize.sm, maxHeight: 100 },
  sendBtn:      { backgroundColor: colors.accent, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
