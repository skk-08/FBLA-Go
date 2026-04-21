import { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fontSize } from '../constants/theme';

const LOGO = require('../assets/fblago-logo.png');

async function markSeen(router) {
  await AsyncStorage.setItem('fblago_has_seen_onboarding', 'true');
  router.replace('/(auth)/login');
}

export default function OnboardingScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => markSeen(router), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <TouchableOpacity
      style={s.container}
      activeOpacity={1}
      onPress={() => markSeen(router)}
    >
      <Image source={LOGO} style={s.logo} resizeMode="contain" />
      <Text style={s.fbla}>FBLA</Text>
      <Text style={s.go}>GO</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 16,
  },
  fbla: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
    lineHeight: 54,
  },
  go: {
    color: '#fff',
    fontSize: 40,
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 46,
  },
});
