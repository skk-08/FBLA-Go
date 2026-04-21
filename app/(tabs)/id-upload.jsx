import { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, Image, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, fontSize, spacing } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { uploadMemberID, updateProfile } from '../../models/userModel';

export default function IDUploadScreen() {
  const router = useRouter();
  const { profile, user, setProfile } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [viewFull, setViewFull] = useState(false);
  const idUrl = profile?.member_id_url ?? null;

  async function handleScan() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera access is needed to scan your ID.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (result.canceled) return;
    setUploading(true);
    try {
      const url = await uploadMemberID(user.id, result.assets[0].uri);
      const updated = await updateProfile(user.id, { member_id_url: url });
      setProfile({ ...profile, ...updated });
    } catch {
      Alert.alert('Error', 'Could not upload ID. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={{ marginRight: spacing.md }}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={s.headerTitle}>ID Upload/Access</Text>
      </View>

      <View style={s.body}>
        <Pressable style={s.scanBtn} onPress={handleScan} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <>
              <Ionicons name="camera" size={28} color="#fff" />
              <Text style={s.scanText}>Scan Your ID</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={s.viewBox}
          onPress={() => {
            if (idUrl) setViewFull(true);
            else handleScan();
          }}
        >
          {idUrl ? (
            <Image
              source={{ uri: idUrl }}
              style={{ width: '100%', height: '100%', borderRadius: 12 }}
              resizeMode="contain"
            />
          ) : (
            <Text style={s.viewText}>Tap to View ID</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.primary },
  header:      { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  headerTitle: { color: '#fff', fontSize: fontSize.xl, fontWeight: '800' },
  body:        { flex: 1, backgroundColor: '#fff', padding: spacing.xl, gap: spacing.xl },
  scanBtn:     { backgroundColor: colors.blue2, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingVertical: spacing.xl },
  scanText:    { color: '#fff', fontSize: fontSize.lg, fontWeight: '600' },
  viewBox:     { flex: 1, backgroundColor: '#D9D9D9', borderRadius: 12, justifyContent: 'center', alignItems: 'center', minHeight: 200 },
  viewText:    { color: '#999', fontSize: fontSize.base },
});
