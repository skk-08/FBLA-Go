import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSize, spacing } from '../../constants/theme';

export default function SocialHubScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
        <Text style={{ color: colors.accent, fontSize: fontSize.xxl, fontWeight: '800' }}>Social Hub</Text>
        <Text style={{ color: colors.muted, fontSize: fontSize.base, marginTop: spacing.sm }}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
