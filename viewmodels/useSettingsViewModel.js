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

  function goToOnboarding() {
    router.push('/onboarding');
  }

  function goToProfile() {
    router.push('/profile');
  }

  function goToNotifications() {
    router.push('/notifications');
  }

  return { handleSignOut, goToOnboarding, goToProfile, goToNotifications };
}
