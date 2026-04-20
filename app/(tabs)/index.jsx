import { ScrollView, View, Text, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors, fontSize, spacing } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useDashboardViewModel } from '../../viewmodels/useDashboardViewModel';
import { uploadMemberID, updateProfile } from '../../models/userModel';
import EventMetricCard from '../../components/dashboard/EventMetricCard';
import ToDoListCard from '../../components/dashboard/ToDoListCard';
import EventInfoCard from '../../components/dashboard/EventInfoCard';
import AnnouncementsCard from '../../components/dashboard/AnnouncementsCard';
import MemberIDCard from '../../components/dashboard/MemberIDCard';
import SocialHubCard from '../../components/dashboard/SocialHubCard';
import NotificationBell from '../../components/dashboard/NotificationBell';
import SettingsShortcut from '../../components/dashboard/SettingsShortcut';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { useState } from 'react';

export default function DashboardScreen() {
  const { profile, user, setProfile } = useAuthStore();
  const { todos, setTodos, announcements, userEvents, nextCompetition, loading, error, refresh } =
    useDashboardViewModel();
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function handleUploadID() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled) return;
    setUploading(true);
    try {
      const url = await uploadMemberID(user.id, result.assets[0].uri);
      const updated = await updateProfile(user.id, { member_id_url: url });
      setProfile({ ...profile, ...updated });
    } finally {
      setUploading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hey, {profile?.full_name?.split(' ')[0] ?? 'Member'} 👋
          </Text>
          <Text style={styles.chapter}>{profile?.chapter_name ?? 'FBLA Chapter'}</Text>
        </View>
        <View style={styles.headerActions}>
          <NotificationBell />
          <SettingsShortcut />
        </View>
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent} />}
        >
          {error && <ErrorBanner message={error} />}

          <EventMetricCard nextCompetition={nextCompetition} />
          <ToDoListCard todos={todos} setTodos={setTodos} />
          <EventInfoCard userEvents={userEvents} />
          <AnnouncementsCard announcements={announcements} />
          <MemberIDCard
            memberIdUrl={profile?.member_id_url}
            onUpload={handleUploadID}
            uploading={uploading}
          />
          <SocialHubCard />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.primary },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  greeting:       { color: colors.white, fontSize: fontSize.xl, fontWeight: '800' },
  chapter:        { color: colors.muted, fontSize: fontSize.sm, marginTop: 2 },
  headerActions:  { flexDirection: 'row', gap: spacing.md },
  scroll:         { padding: spacing.xl, paddingBottom: spacing.xxl },
});
