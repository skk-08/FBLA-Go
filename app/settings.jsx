import { useEffect } from 'react';
import { useRouter } from 'expo-router';

// Settings is now a tab — redirect to it
export default function SettingsRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/(tabs)/settings'); }, []);
  return null;
}
