import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/theme';

export default function SettingsShortcut() {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.wrap} onPress={() => router.push('/(tabs)/settings')}>
      <Ionicons name="settings-outline" size={26} color={colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 4 },
});
