import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export function useSettingsViewModel() {
  const router = useRouter();
  const { signOut } = useAuthStore();

  async function handleSignOut() {
    await supabase.auth.signOut();
    signOut();
    router.replace('/(auth)/login');
  }

  function goToProfile() {
    router.push('/(tabs)/profile');
  }

  function goToNotifications() {
    router.push('/(tabs)/notifications');
  }

  return { handleSignOut, goToProfile, goToNotifications };
}
