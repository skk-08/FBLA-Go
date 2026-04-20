import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUIStore } from '../../store/uiStore';
import Badge from '../ui/Badge';
import { colors } from '../../constants/theme';

export default function NotificationBell() {
  const router = useRouter();
  const count = useUIStore((s) => s.notificationCount);

  return (
    <TouchableOpacity style={styles.wrap} onPress={() => router.push('/notifications')}>
      <View>
        <Ionicons name="notifications-outline" size={26} color={colors.white} />
        <Badge count={count} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 4 },
});
