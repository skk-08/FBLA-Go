import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../store/authStore';
import { updateProfile, uploadMemberID } from '../models/userModel';
import { fetchUserEvents } from '../models/eventModel';

export function useProfileViewModel() {
  const { user, profile, setProfile } = useAuthStore();
  const [userEvents, setUserEvents] = useState([]);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [grade, setGrade] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setChapterName(profile.chapter_name ?? '');
      setGrade(String(profile.grade ?? ''));
    }
    if (user?.id) {
      fetchUserEvents(user.id).then(setUserEvents).catch(() => {});
    }
  }, [profile, user?.id]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProfile(user.id, {
        full_name: fullName.trim(),
        chapter_name: chapterName.trim(),
        grade: parseInt(grade, 10),
      });
      setProfile({ ...profile, ...updated });
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function pickAndUploadID() {
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
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  return {
    profile, userEvents,
    editing, setEditing,
    fullName, setFullName,
    chapterName, setChapterName,
    grade, setGrade,
    save, saving,
    pickAndUploadID, uploading,
    error,
  };
}
