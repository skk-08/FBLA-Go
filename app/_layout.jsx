import '../global.css';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { fetchProfile } from '../models/userModel';
import { colors } from '../constants/theme';

const ONBOARDING_KEY = 'fblago_has_seen_onboarding';

function AuthGuard() {
  const router    = useRouter();
  const segments  = useSegments();
  const { session, sessionLoading, profile, setSession, setProfile, setLoading } = useAuthStore();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);

  // Check if user has ever seen the onboarding splash
  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setHasSeenOnboarding(val === 'true');
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        try {
          const profile = await fetchProfile(session.user.id);
          if (!profile) {
            // Session token exists but the user record was deleted (e.g. DB wipe).
            // Sign out so AuthGuard falls back to the onboarding/login flow.
            await supabase.auth.signOut();
          } else {
            setProfile(profile);
          }
        } catch (_) {
          await supabase.auth.signOut();
        }
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
    if (hasSeenOnboarding === null) return; // still loading AsyncStorage

    const inAuth       = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inVerify     = segments[0] === 'verify';

    if (!session) {
      if (!inAuth && !inOnboarding) {
        if (!hasSeenOnboarding) {
          // First time ever — show the splash
          router.replace('/onboarding');
        } else {
          router.replace('/(auth)/login');
        }
      }
      return;
    }

    // Has a session
    if (inAuth || inOnboarding) {
      // Only leave the auth flow once the profile is fully set up
      const { profile: p } = useAuthStore.getState();
      if (p?.onboarding_complete) router.replace('/(tabs)');
      return;
    }

    // Has a session, not in auth/onboarding/verify — ensure profile is complete
    if (!inVerify) {
      const { profile: p } = useAuthStore.getState();
      if (!p?.onboarding_complete) {
        router.replace('/(auth)/signup');
        return;
      }
    }
  }, [session, sessionLoading, segments, profile, hasSeenOnboarding]);

  return null;
}

export default function RootLayout() {
  const sessionLoading = useAuthStore((s) => s.sessionLoading);

  return (
    <SafeAreaProvider>
      <AuthGuard />
      {sessionLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </SafeAreaProvider>
  );
}
