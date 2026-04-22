import { View, Text, Image, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, fontSize, spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { useProfileViewModel } from '../../viewmodels/useProfileViewModel';

function Avatar({ name, photoUrl, size = 120 }) {
  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }
  const initials = (name ?? 'M').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: '#B0BEC5', justifyContent: 'center', alignItems: 'center',
    }}>
      <Text style={{ color: colors.primary, fontSize: size * 0.32, fontWeight: '800' }}>{initials}</Text>
    </View>
  );
}

function InterestPill({ label, t }) {
  return (
    <View style={[s.pill, { backgroundColor: t.inputBg }]}>
      <Text style={[s.pillText, { color: t.text }]}>{label}</Text>
    </View>
  );
}

export default function ProfileTab() {
  const router = useRouter();
  const { colors: t } = useTheme();
  const { profile, userEvents, uploading, pickAndUploadID } = useProfileViewModel();

  const name      = profile?.full_name ?? 'Member';
  const role      = profile?.role ?? 'member';
  const chapter   = profile?.chapter_name ?? null;
  const roleLabel = chapter ? `${role.charAt(0).toUpperCase() + role.slice(1)}, ${chapter}` : null;
  const interests = Array.isArray(profile?.interests) ? profile.interests : [];
  const bio       = profile?.bio ?? `Passionate about business and FBLA. Member of ${profile?.chapter_name ?? 'my chapter'}.`;

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: t.profileHeader }]} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={[s.headerSection, { backgroundColor: t.profileHeader }]}>
          <Avatar name={name} photoUrl={profile?.photo_url} />
          <Text style={s.name}>{name}</Text>
          {roleLabel ? <Text style={s.role}>{roleLabel}</Text> : null}
        </View>

        <View style={[s.body, { backgroundColor: t.bg }]}>

          <View style={[s.section, { backgroundColor: t.card }]}>
            <Text style={[s.sectionTitle, { color: t.text }]}>About Me:</Text>
            <Text style={[s.sectionBody, { color: t.textSecondary }]}>{bio}</Text>
          </View>

          {interests.length > 0 && (
            <View style={[s.section, { backgroundColor: t.card }]}>
              <Text style={[s.sectionTitle, { color: t.text }]}>Skills & Interests:</Text>
              <View style={s.pillRow}>
                {interests.map((i) => <InterestPill key={i} label={i} t={t} />)}
              </View>
            </View>
          )}

          {userEvents.length > 0 && (
            <View style={[s.section, { backgroundColor: t.card }]}>
              <Text style={[s.sectionTitle, { color: t.text }]}>Registered Events:</Text>
              {userEvents.map((ue) => (
                <Text key={ue.id} style={[s.sectionBody, { color: t.textSecondary }]}>• {ue.events?.name ?? 'Event'}</Text>
              ))}
            </View>
          )}

          <View style={[s.section, { backgroundColor: t.card }]}>
            <Text style={[s.sectionTitle, { color: t.text }]}>Links:</Text>
            <Text style={[s.sectionBody, { color: t.textSecondary }]}>
              {profile?.chapter_name ?? 'ICS FBLA'} Instagram:{' '}
              <Text style={{ color: colors.primary, textDecorationLine: 'underline' }}>
                https://instagramicsfbla
              </Text>
            </Text>
          </View>

          <Pressable
            onPress={pickAndUploadID}
            disabled={uploading}
            style={[s.uploadBtn, { backgroundColor: t.inputBg }]}
          >
            {uploading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={[s.uploadText, { color: colors.primary }]}>
                {profile?.member_id_url ? 'Update Member ID' : 'Upload Member ID'}
              </Text>
            )}
          </Pressable>

          <Pressable
            style={[s.uploadBtn, { marginTop: spacing.sm, backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Text style={[s.uploadText, { color: '#fff' }]}>Account Settings</Text>
          </Pressable>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1 },
  headerSection:  { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  name:           { color: colors.white, fontSize: 24, fontWeight: '800', marginTop: spacing.md },
  role:           { color: colors.white, fontSize: fontSize.sm, marginTop: 4, opacity: 0.9 },
  body:           { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.xl, flex: 1, marginTop: -16 },
  section:        { borderRadius: 12, padding: spacing.lg, marginBottom: spacing.md },
  sectionTitle:   { fontSize: fontSize.base, fontWeight: '800', marginBottom: spacing.sm },
  sectionBody:    { fontSize: fontSize.sm, lineHeight: 22 },
  pillRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  pill:           { borderRadius: 20, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  pillText:       { fontSize: fontSize.sm },
  uploadBtn:      { borderRadius: 12, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  uploadText:     { fontSize: fontSize.base, fontWeight: '600' },
});
