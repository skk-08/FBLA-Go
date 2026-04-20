import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignupViewModel } from '../../viewmodels/useAuthViewModel';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { colors, spacing, fontSize, radius } from '../../constants/theme';

export default function SignupScreen() {
  const {
    fullName, setFullName, chapterName, setChapterName,
    grade, setGrade, email, setEmail,
    password, setPassword, confirm, setConfirm,
    errors, serverError, isLoading, handleSignup,
  } = useSignupViewModel();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: spacing.xl }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.lg }}>
            <Text style={{ color: colors.accent, fontSize: 32, fontWeight: '800' }}>FBLAgo</Text>
            <Text style={{ color: colors.white, fontSize: fontSize.base, opacity: 0.8, marginTop: spacing.xs }}>
              Create your account
            </Text>
          </View>

          <View style={{
            backgroundColor: colors.surface, borderRadius: radius.modal,
            padding: spacing.xl, borderWidth: 1, borderColor: colors.border,
          }}>
            <ErrorBanner message={serverError} />

            <AppInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Jane Smith"
              error={errors.fullName}
            />
            <AppInput
              label="Chapter Name"
              value={chapterName}
              onChangeText={setChapterName}
              placeholder="Thomas Jefferson High School"
              error={errors.chapterName}
            />
            <AppInput
              label="Grade"
              value={grade}
              onChangeText={setGrade}
              placeholder="10"
              keyboardType="number-pad"
              autoCapitalize="none"
              error={errors.grade}
            />
            <AppInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@school.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />
            <AppInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              error={errors.password}
            />
            <AppInput
              label="Confirm Password"
              value={confirm}
              onChangeText={setConfirm}
              placeholder="••••••••"
              secureTextEntry
              error={errors.confirm}
            />

            <Text style={{ color: colors.muted, fontSize: fontSize.xs, marginBottom: spacing.lg }}>
              Password must be 8+ characters with an uppercase letter, number, and symbol.
            </Text>

            <AppButton title="Create Account" onPress={handleSignup} isLoading={isLoading} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl, marginBottom: spacing.xl }}>
            <Text style={{ color: colors.muted, fontSize: fontSize.sm }}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={{ color: colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>Log in</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
