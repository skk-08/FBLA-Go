import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing, radius } from '../constants/theme';
import { useSettingsViewModel } from '../viewmodels/useSettingsViewModel';
import { useAuthStore } from '../store/authStore';

function SettingsRow({ icon, label, onPress, destructive }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Ionicons name={icon} size={20} color={destructive ? colors.error : colors.muted} />
      <Text style={[styles.rowLabel, destructive && styles.destructiveLabel]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.border} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { handleSignOut, goToOnboarding, goToProfile, goToNotifications } = useSettingsViewModel();
  const profile = useAuthStore((s) => s.profile);

  function confirmSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: handleSignOut },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={colors.muted} />
        </View>
        <View>
          <Text style={styles.profileName}>{profile?.full_name ?? 'Member'}</Text>
          <Text style={styles.profileChapter}>{profile?.chapter_name ?? ''}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingsRow icon="person-outline" label="Edit Profile" onPress={goToProfile} />
        <SettingsRow icon="notifications-outline" label="Notifications" onPress={goToNotifications} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <SettingsRow icon="book-outline" label="View Onboarding" onPress={goToOnboarding} />
      </View>

      <View style={styles.section}>
        <SettingsRow icon="log-out-outline" label="Sign Out" onPress={confirmSignOut} destructive />
      </View>

      <Text style={styles.version}>FBLAgo · FBLA State 2025–2026</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.primary },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle:    { color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  profileCard:    { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border },
  avatar:         { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  profileName:    { color: colors.white, fontSize: fontSize.lg, fontWeight: '700' },
  profileChapter: { color: colors.muted, fontSize: fontSize.sm, marginTop: 2 },
  section:        { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  sectionTitle:   { color: colors.muted, fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: spacing.sm },
  row:            { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel:       { flex: 1, color: colors.white, fontSize: fontSize.base },
  destructiveLabel: { color: colors.error },
  version:        { color: colors.border, fontSize: fontSize.xs, textAlign: 'center', position: 'absolute', bottom: spacing.xl, alignSelf: 'center' },
});
