import '../global.css';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { fetchProfile } from '../models/userModel';
import { colors } from '../constants/theme';

function AuthGuard() {
  const router    = useRouter();
  const segments  = useSegments();
  const { session, sessionLoading, setSession, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        try {
          const profile = await fetchProfile(session.user.id);
          setProfile(profile);
        } catch (_) {}
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        try {
          const profile = await fetchProfile(session.user.id);
          setProfile(profile);
        } catch (_) {}
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (sessionLoading) return;
    const inAuth        = segments[0] === '(auth)';
    const inOnboarding  = segments[0] === 'onboarding';
    if (!session && !inAuth) {
      router.replace('/(auth)/login');
      return;
    }
    if (session && inAuth) {
      const { profile: p } = useAuthStore.getState();
      if (p && !p.onboarding_complete) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
      return;
    }
    if (session && !inAuth && !inOnboarding) {
      const { profile: p } = useAuthStore.getState();
      if (p && !p.onboarding_complete) {
        router.replace('/onboarding');
      }
    }
  }, [session, sessionLoading, segments]);

  return null;
}

export default function RootLayout() {
  const sessionLoading = useAuthStore((s) => s.sessionLoading);

  if (sessionLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
