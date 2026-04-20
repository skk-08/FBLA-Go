import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../constants/theme';
import { useOnboardingViewModel } from '../viewmodels/useOnboardingViewModel';
import OnboardingSlide from '../components/onboarding/OnboardingSlide';

const SLIDES = [
  {
    icon: 'document-text-outline',
    title: 'Terms & Conditions',
    body:
      'By using FBLAgo, you agree to our Terms of Service and Privacy Policy. Your data is stored securely and never sold. Member ID photos are encrypted at rest.\n\nFBLAgo is for FBLA members and chapter advisers only.',
    isTerms: true,
  },
  {
    icon: 'star-outline',
    title: 'Everything in One Place',
    body:
      'Track your competitive events, view rubrics, and countdown to competition day.\n\nStay connected with chapter announcements, messaging, and a shared calendar.',
  },
  {
    icon: 'rocket-outline',
    title: "You're All Set!",
    body:
      'Head to your Dashboard to get started.\n\nUpload your member ID, register for events, and connect with your chapter.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { step, agreed, setAgreed, canAdvance, next, back, loading, totalSteps } =
    useOnboardingViewModel(() => router.replace('/(tabs)'));

  const slide = SLIDES[step];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>FBLAgo</Text>
        <Text style={styles.stepText}>{step + 1} / {totalSteps}</Text>
      </View>

      <View style={styles.slideWrap}>
        <OnboardingSlide icon={slide.icon} title={slide.title} body={slide.body} />

        {slide.isTerms && (
          <TouchableOpacity style={styles.checkRow} onPress={() => setAgreed(!agreed)}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Ionicons name="checkmark" size={14} color={colors.primary} />}
            </View>
            <Text style={styles.checkLabel}>I agree to the Terms & Conditions</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.dotsRow}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={back}>
            <Ionicons name="arrow-back" size={20} color={colors.muted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, !canAdvance && styles.nextDisabled]}
          onPress={next}
          disabled={!canAdvance || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.nextText}>
              {step === totalSteps - 1 ? 'Get Started' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.primary },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  logo:        { color: colors.accent, fontSize: fontSize.xl, fontWeight: '800' },
  stepText:    { color: colors.muted, fontSize: fontSize.sm },
  slideWrap:   { flex: 1 },
  checkRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xxl, marginTop: spacing.xl },
  checkbox:    { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: colors.accent, marginRight: spacing.sm, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: colors.accent },
  checkLabel:  { color: colors.white, fontSize: fontSize.sm, flex: 1 },
  dotsRow:     { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, paddingBottom: spacing.lg },
  dot:         { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive:   { backgroundColor: colors.accent, width: 24 },
  footer:      { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.md },
  backBtn:     { padding: spacing.md },
  nextBtn:     { backgroundColor: colors.accent, paddingVertical: spacing.md, paddingHorizontal: spacing.xxl, borderRadius: radius.pill },
  nextDisabled:{ opacity: 0.4 },
  nextText:    { color: colors.primary, fontSize: fontSize.base, fontWeight: '700' },
});
