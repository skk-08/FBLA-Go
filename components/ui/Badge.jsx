import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize } from '../../constants/theme';

export default function Badge({ count }) {
  if (!count || count < 1) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  text: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
