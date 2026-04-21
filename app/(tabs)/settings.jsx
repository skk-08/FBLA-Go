import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../../constants/theme';
import { useUIStore } from '../../store/uiStore';
import { useSettingsViewModel } from '../../viewmodels/useSettingsViewModel';

function Row({ icon, label, onPress, destructive, rightElement }) {
  return (
    <Pressable style={s.row} onPress={onPress}>
      <Ionicons name={icon} size={22} color={destructive ? colors.error : '#9E9E9E'} style={s.rowIcon} />
      <Text style={[s.rowLabel, destructive && { color: colors.error }]}>{label}</Text>
      {rightElement ?? <Ionicons name="chevron-forward" size={16} color="#ccc" />}
    </Pressable>
  );
}

function Section({ title, children }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionBody}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { handleSignOut, goToNotifications } = useSettingsViewModel();
  const { isDarkMode, toggleDarkMode } = useUIStore();

  function confirmSignOut() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: handleSignOut },
    ]);
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Plain white header with back arrow */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={{ marginRight: spacing.md }}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </Pressable>
        <Text style={s.title}>Account Settings</Text>
      </View>

      <ScrollView style={{ backgroundColor: '#fff' }}>
        <Section title="Account">
          <Row icon="person-outline"        label="Edit profile"     onPress={() => router.push('/(tabs)/profile')} />
          <Row icon="shield-outline"        label="Security"         onPress={() => {}} />
          <Row icon="notifications-outline" label="Notifications"    onPress={goToNotifications} />
          <Row icon="lock-closed-outline"   label="Privacy"          onPress={() => {}} />
        </Section>

        <Section title="Support & About">
          <Row icon="card-outline"               label="My Events"          onPress={() => router.push('/(tabs)/my-event')} />
          <Row icon="help-circle-outline"        label="Help & Support"     onPress={() => {}} />
          <Row icon="information-circle-outline" label="Terms and Policies" onPress={() => {}} />
        </Section>

        <Section title="Cache & cellular">
          <Row icon="trash-outline"       label="Free up space" onPress={() => {}} />
          <Row icon="speedometer-outline" label="Data Saver"    onPress={() => {}} />
        </Section>

        <Section title="Actions">
          <Row icon="flag-outline"    label="Report a problem" onPress={() => {}} />
          <Row icon="people-outline"  label="Add members"      onPress={() => {}} />
          <Row
            icon="log-out-outline"
            label="Log out"
            onPress={confirmSignOut}
            destructive
            rightElement={<View />}
          />
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#fff' },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  title:        { fontSize: fontSize.xl, fontWeight: '800', color: '#1A1A1A' },
  section:      { paddingHorizontal: spacing.xl, marginTop: spacing.xl },
  sectionTitle: { fontSize: fontSize.sm, fontWeight: '700', color: '#1A1A1A', marginBottom: spacing.sm },
  sectionBody:  { backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  row:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', backgroundColor: '#fff' },
  rowIcon:      { width: 32 },
  rowLabel:     { fontSize: fontSize.base, color: '#1A1A1A', flex: 1 },
});
