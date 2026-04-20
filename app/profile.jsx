import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing, radius } from '../constants/theme';
import { useProfileViewModel } from '../viewmodels/useProfileViewModel';
import ErrorBanner from '../components/ui/ErrorBanner';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    profile, userEvents,
    editing, setEditing,
    fullName, setFullName,
    chapterName, setChapterName,
    grade, setGrade,
    save, saving,
    pickAndUploadID, uploading,
    error,
  } = useProfileViewModel();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => editing ? save() : setEditing(true)} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Text style={styles.editBtn}>{editing ? 'Save' : 'Edit'}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {error && <ErrorBanner message={error} />}

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={colors.muted} />
          </View>
          <Text style={styles.name}>{profile?.full_name ?? 'Member'}</Text>
          <Text style={styles.chapter}>{profile?.chapter_name ?? ''}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Info</Text>
          <Field label="Full Name" value={fullName} onChangeText={setFullName} editable={editing} />
          <Field label="Chapter" value={chapterName} onChangeText={setChapterName} editable={editing} />
          <Field label="Grade" value={grade} onChangeText={setGrade} editable={editing} keyboardType="numeric" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Member ID</Text>
          {profile?.member_id_url ? (
            <View style={styles.idPreview}>
              <Image source={{ uri: profile.member_id_url }} style={styles.idImage} resizeMode="cover" />
              <TouchableOpacity style={styles.updateBtn} onPress={pickAndUploadID} disabled={uploading}>
                {uploading ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.updateBtnText}>Update ID</Text>}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBtn} onPress={pickAndUploadID} disabled={uploading}>
              {uploading ? <ActivityIndicator color={colors.primary} /> : (
                <>
                  <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
                  <Text style={styles.uploadText}>Upload Member ID</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {userEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Registered Events</Text>
            {userEvents.map((ue) => (
              <View key={ue.id} style={styles.eventRow}>
                <Ionicons name="ribbon-outline" size={18} color={colors.accent} />
                <Text style={styles.eventName}>{ue.events?.name ?? 'Event'}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChangeText, editable, keyboardType }) {
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      {editable ? (
        <TextInput
          style={fieldStyles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor={colors.muted}
        />
      ) : (
        <Text style={fieldStyles.value}>{value || '—'}</Text>
      )}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap:  { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { color: colors.muted, fontSize: fontSize.xs, marginBottom: 2 },
  input: { color: colors.white, fontSize: fontSize.base, paddingVertical: spacing.xs },
  value: { color: colors.white, fontSize: fontSize.base },
});

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.primary },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle:   { color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  editBtn:       { color: colors.accent, fontSize: fontSize.base, fontWeight: '700' },
  scroll:        { padding: spacing.xl, paddingBottom: spacing.xxl },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.xl },
  avatar:        { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  name:          { color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  chapter:       { color: colors.muted, fontSize: fontSize.sm, marginTop: 4 },
  section:       { marginBottom: spacing.xl },
  sectionTitle:  { color: colors.accent, fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.md, textTransform: 'uppercase', letterSpacing: 1 },
  uploadBtn:     { backgroundColor: colors.accent, borderRadius: radius.card, paddingVertical: spacing.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  uploadText:    { color: colors.primary, fontSize: fontSize.base, fontWeight: '700' },
  idPreview:     { alignItems: 'center', gap: spacing.md },
  idImage:       { width: '100%', height: 160, borderRadius: radius.card },
  updateBtn:     { paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.accent },
  updateBtnText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '600' },
  eventRow:      { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  eventName:     { color: colors.white, fontSize: fontSize.sm },
});
