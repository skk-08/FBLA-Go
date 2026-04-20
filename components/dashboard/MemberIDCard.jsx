import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing, radius } from '../../constants/theme';

export default function MemberIDCard({ memberIdUrl, onUpload, uploading }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Member ID</Text>
      {memberIdUrl ? (
        <View style={styles.preview}>
          <Image source={{ uri: memberIdUrl }} style={styles.image} resizeMode="cover" />
          <TouchableOpacity style={styles.changeBtn} onPress={onUpload} disabled={uploading}>
            <Text style={styles.changeBtnText}>Update ID</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadBtn} onPress={onUpload} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={28} color={colors.primary} />
              <Text style={styles.uploadText}>Upload Member ID</Text>
            </>
          )}
        </TouchableOpacity>
      )}
      <Text style={styles.note}>
        <Ionicons name="lock-closed-outline" size={12} color={colors.muted} /> Encrypted & stored securely
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:        { backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  title:       { color: colors.accent, fontSize: fontSize.base, fontWeight: '700', marginBottom: spacing.md },
  uploadBtn:   { backgroundColor: colors.accent, borderRadius: radius.card, paddingVertical: spacing.xl, alignItems: 'center', gap: spacing.sm, flexDirection: 'row', justifyContent: 'center' },
  uploadText:  { color: colors.primary, fontSize: fontSize.base, fontWeight: '700' },
  preview:     { alignItems: 'center', gap: spacing.md },
  image:       { width: '100%', height: 160, borderRadius: radius.card },
  changeBtn:   { paddingVertical: spacing.sm, paddingHorizontal: spacing.xl, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.accent },
  changeBtnText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '600' },
  note:        { color: colors.muted, fontSize: fontSize.xs, marginTop: spacing.sm, textAlign: 'center' },
});
