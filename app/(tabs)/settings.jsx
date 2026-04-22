import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fontSize, spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { useUIStore } from '../../store/uiStore';
import { useSettingsViewModel } from '../../viewmodels/useSettingsViewModel';

function Row({ icon, label, onPress, destructive, rightElement, colors }) {
  return (
    <Pressable style={[s.row, { borderBottomColor: colors.hairline, backgroundColor: colors.card }]} onPress={onPress}>
      <Ionicons name={icon} size={22} color={destructive ? colors.error : colors.textMuted} style={s.rowIcon} />
      <Text style={[s.rowLabel, { color: destructive ? colors.error : colors.text }]}>{label}</Text>
      {rightElement ?? <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
    </Pressable>
  );
}

function Section({ title, children, colors }) {
  return (
    <View style={s.section}>
      <Text style={[s.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={[s.sectionBody, { backgroundColor: colors.card, borderColor: colors.hairline }]}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { handleSignOut, goToNotifications } = useSettingsViewModel();
  const { isDarkMode, toggleDarkMode } = useUIStore();

  function confirmSignOut() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: handleSignOut },
    ]);
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={[s.header, { borderBottomColor: colors.hairline }]}>
        <Pressable onPress={() => router.back()} style={{ marginRight: spacing.md }}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[s.title, { color: colors.text }]}>Account Settings</Text>
      </View>

      <ScrollView style={{ backgroundColor: colors.bg }}>
        <Section title="Appearance" colors={colors}>
          <View style={[s.row, { borderBottomColor: colors.hairline, backgroundColor: colors.card }]}>
            <Ionicons name="moon-outline" size={22} color={colors.textMuted} style={s.rowIcon} />
            <Text style={[s.rowLabel, { color: colors.text }]}>Dark mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#ccc', true: colors.accent }}
              thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
            />
          </View>
        </Section>

        <Section title="Account" colors={colors}>
          <Row icon="person-outline"        label="Edit profile"     colors={colors} onPress={() => router.push('/(tabs)/profile')} />
          <Row icon="shield-outline"        label="Security"         colors={colors} onPress={() => {}} />
          <Row icon="notifications-outline" label="Notifications"    colors={colors} onPress={goToNotifications} />
          <Row icon="lock-closed-outline"   label="Privacy"          colors={colors} onPress={() => {}} />
        </Section>

        <Section title="Support & About" colors={colors}>
          <Row icon="card-outline"               label="My Events"          colors={colors} onPress={() => router.push('/(tabs)/my-event')} />
          <Row icon="help-circle-outline"        label="Help & Support"     colors={colors} onPress={() => {}} />
          <Row icon="information-circle-outline" label="Terms and Policies" colors={colors} onPress={() => {}} />
        </Section>

        <Section title="Cache & cellular" colors={colors}>
          <Row icon="trash-outline"       label="Free up space" colors={colors} onPress={() => {}} />
          <Row icon="speedometer-outline" label="Data Saver"    colors={colors} onPress={() => {}} />
        </Section>

        <Section title="Actions" colors={colors}>
          <Row icon="flag-outline"    label="Report a problem" colors={colors} onPress={() => {}} />
          <Row icon="people-outline"  label="Add members"      colors={colors} onPress={() => {}} />
          <Row
            icon="log-out-outline"
            label="Log out"
            colors={colors}
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
  safe:         { flex: 1 },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, borderBottomWidth: 1 },
  title:        { fontSize: fontSize.xl, fontWeight: '800' },
  section:      { paddingHorizontal: spacing.xl, marginTop: spacing.xl },
  sectionTitle: { fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.sm },
  sectionBody:  { borderRadius: 10, overflow: 'hidden', borderWidth: 1 },
  row:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: spacing.md, borderBottomWidth: 1 },
  rowIcon:      { width: 32 },
  rowLabel:     { fontSize: fontSize.base, flex: 1 },
});
