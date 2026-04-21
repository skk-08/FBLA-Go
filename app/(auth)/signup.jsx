import { useState } from 'react';
import {
  View, Text, Image, Pressable, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, Alert, StyleSheet, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSignupViewModel } from '../../viewmodels/useAuthViewModel';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { colors, spacing, radius, fontSize } from '../../constants/theme';

const ROLE_LABELS = {
  member:    'Member',
  executive: 'Executive',
  advisor:   'Advisor',
};

const LOGO = require('../../assets/fblago-logo.png');

const INTERESTS = [
  { key: 'Marketing',        icon: 'bar-chart-outline' },
  { key: 'Finance',          icon: 'cash-outline' },
  { key: 'Public Speaking',  icon: 'megaphone-outline' },
  { key: 'Entrepreneurship', icon: 'bulb-outline' },
  { key: 'Business Law',     icon: 'hammer-outline' },
  { key: 'Coding',           icon: 'code-slash-outline' },
  { key: 'UX Design',        icon: 'desktop-outline' },
  { key: 'Hospitality',      icon: 'restaurant-outline' },
  { key: 'Accounting',       icon: 'calculator-outline' },
];

const PASSWORD_RULES = [
  { label: 'At least 8 characters',           test: (p) => p.length >= 8 },
  { label: 'At least one uppercase letter',   test: (p) => /[A-Z]/.test(p) },
  { label: 'At least one lowercase letter',   test: (p) => /[a-z]/.test(p) },
  { label: 'At least one number',             test: (p) => /[0-9]/.test(p) },
  { label: 'At least one special character',  test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function PasswordStrength({ password }) {
  if (!password) return null;
  return (
    <View style={s.strengthBox}>
      {PASSWORD_RULES.map(({ label, test }) => {
        const met = test(password);
        return (
          <View key={label} style={s.strengthRow}>
            <Ionicons
              name={met ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={met ? '#4CAF50' : '#E53935'}
            />
            <Text style={[s.strengthLabel, met ? s.strengthLabelMet : s.strengthLabelFail]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

function PasswordMatch({ password, confirm }) {
  if (!confirm) return null;
  const matches = password === confirm && confirm.length > 0;
  return (
    <View style={[s.strengthBox, { marginTop: -spacing.sm }]}>
      <View style={s.strengthRow}>
        <Ionicons
          name={matches ? 'checkmark-circle' : 'close-circle'}
          size={16}
          color={matches ? '#4CAF50' : '#E53935'}
        />
        <Text style={[s.strengthLabel, matches ? s.strengthLabelMet : s.strengthLabelFail]}>
          Passwords match
        </Text>
      </View>
    </View>
  );
}

function GrayInput({ value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#888"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType ?? 'default'}
      autoCapitalize={autoCapitalize ?? 'sentences'}
      style={s.input}
    />
  );
}

function PasswordInput({ value, onChangeText, placeholder }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={s.passwordRow}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        secureTextEntry={!visible}
        autoCapitalize="none"
        style={s.passwordInput}
      />
      <Pressable onPress={() => setVisible((v) => !v)} style={s.eyeBtn}>
        <Ionicons
          name={visible ? 'eye-off-outline' : 'eye-outline'}
          size={22}
          color="#555"
        />
      </Pressable>
    </View>
  );
}

function Watermark() {
  return (
    <View style={s.watermark}>
      <Image source={LOGO} style={s.watermarkImg} resizeMode="contain" />
    </View>
  );
}

function YellowButton({ title, onPress, disabled, loading }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[s.yellowBtn, (disabled || loading) && { backgroundColor: '#C4A000' }]}
    >
      <Text style={s.yellowBtnText}>{loading ? 'Please wait…' : title}</Text>
    </Pressable>
  );
}

export default function SignupScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  // If already authenticated (returning mid-signup), skip credentials step
  const [step, setStep] = useState(0);
  const [photoUri, setPhotoUri] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const [rolePickerOpen, setRolePickerOpen] = useState(false);

  const {
    firstName, setFirstName, lastName, setLastName,
    school, setSchool, role, setRole, roleCode, setRoleCode,
    email, setEmail, password, setPassword, confirm, setConfirm,
    errors, serverError, isLoading,
    createAccount, completeProfile, validateProfileFields,
  } = useSignupViewModel();

  function toggleInterest(key) {
    setSelectedInterests((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= 4) return prev;
      return [...prev, key];
    });
  }

  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission denied', 'Camera access is required.'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission denied', 'Gallery access is required.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

  function handleStep0Next() {
    if (createAccount()) setStep(1);
  }

  function handleStep1Next() {
    if (!validateProfileFields()) return;
    setStep(2);
  }

  async function handleComplete() {
    const ok = await completeProfile(photoUri, selectedInterests);
    if (ok) router.replace('/(tabs)');
  }

  function goBack() {
    if (step === 0) router.replace('/(auth)/login');
    else setStep((s) => s - 1);
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Back arrow */}
      <Pressable onPress={goBack} style={s.backBtn}>
        <Ionicons name="chevron-back" size={24} color={colors.white} />
      </Pressable>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── STEP 0: Create Account (credentials) ──────────────────────── */}
          {step === 0 && (
            <>
              <Text style={[s.stepTitle, { fontSize: 26 }]}>Create Your Account</Text>
              <ErrorBanner message={serverError} />

              <GrayInput value={email} onChangeText={setEmail} placeholder="School Email" keyboardType="email-address" autoCapitalize="none" />
              {errors.email ? <Text style={s.err}>{errors.email}</Text> : null}
              <Text style={s.emailNote}>
                Use your school email so your advisor can connect with you. If you weren't given one, your personal email works too.
              </Text>

              <Text style={s.passwordWarning}>
                ⚠️ Do not use your school password for this app.
              </Text>

              <PasswordInput value={password} onChangeText={setPassword} placeholder="Password" />
              {errors.password ? <Text style={s.err}>{errors.password}</Text> : null}
              <PasswordStrength password={password} />

              <PasswordInput value={confirm} onChangeText={setConfirm} placeholder="Confirm Password" />
              {errors.confirm ? <Text style={s.err}>{errors.confirm}</Text> : null}
              <PasswordMatch password={password} confirm={confirm} />

              <View style={s.btnRow}>
                <YellowButton title="Next" onPress={handleStep0Next} loading={isLoading} />
              </View>

              <View style={s.loginLink}>
                <Text style={s.loginLinkMuted}>Already have an account? </Text>
                <Pressable onPress={() => router.replace('/(auth)/login')}>
                  <Text style={s.loginLinkAccent}>Log in</Text>
                </Pressable>
              </View>
            </>
          )}

          {/* ── STEP 1/3: Create Your Profile ─────────────────────────────── */}
          {step === 1 && (
            <>
              <Text style={[s.stepTitle, { fontSize: 26 }]}>Create Your Profile</Text>
              <ErrorBanner message={serverError} />

              <GrayInput value={firstName} onChangeText={setFirstName} placeholder="First Name" />
              {errors.firstName ? <Text style={s.err}>{errors.firstName}</Text> : null}

              <GrayInput value={lastName} onChangeText={setLastName} placeholder="Last Name" />
              {errors.lastName ? <Text style={s.err}>{errors.lastName}</Text> : null}

              <GrayInput value={school} onChangeText={setSchool} placeholder="School" />
              {errors.school ? <Text style={s.err}>{errors.school}</Text> : null}

              {/* Role selector */}
              <Pressable style={s.roleRow} onPress={() => setRolePickerOpen((v) => !v)}>
                <Text style={[s.rolePlaceholder, role && { color: '#1A1A1A' }]}>
                  {role ? ROLE_LABELS[role] : 'Role (Member / Executive / Advisor)'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#888" />
              </Pressable>
              {rolePickerOpen && (
                <View style={s.roleOptions}>
                  {Object.entries(ROLE_LABELS).map(([r, label]) => (
                    <Pressable
                      key={r}
                      style={[s.roleOption, role === r && { backgroundColor: '#B0B8D0' }]}
                      onPress={() => { setRole(r); setRolePickerOpen(false); }}
                    >
                      <Text style={s.roleOptionText}>{label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Role code — only shown for executive / advisor */}
              {(role === 'executive' || role === 'advisor') && (
                <>
                  <TextInput
                    style={s.input}
                    placeholder="Enter your role access code"
                    placeholderTextColor="#888"
                    value={roleCode}
                    onChangeText={setRoleCode}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.roleCode ? <Text style={s.err}>{errors.roleCode}</Text> : null}
                </>
              )}

              <View style={s.btnRow}>
                <YellowButton title="Next" onPress={handleStep1Next} />
                <Text style={s.counter}>1/3</Text>
              </View>
            </>
          )}

          {/* ── STEP 2/3: Add Photo ────────────────────────────────────────── */}
          {step === 2 && (
            <>
              <Text style={[s.stepTitle, { textAlign: 'center' }]}>Add Photo</Text>

              <View style={s.photoCircle}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={s.photoImage} />
                ) : (
                  <Ionicons name="camera" size={80} color={colors.primary} />
                )}
              </View>

              <Pressable onPress={pickFromCamera} style={s.photoRow}>
                <View style={s.photoRowIcon}>
                  <Ionicons name="camera-outline" size={22} color={colors.white} />
                </View>
                <Text style={s.photoRowText}>Take Photo</Text>
              </Pressable>

              <Pressable onPress={pickFromGallery} style={s.photoRow}>
                <View style={s.photoRowIcon}>
                  <Ionicons name="images-outline" size={22} color={colors.white} />
                </View>
                <Text style={s.photoRowText}>Choose From Gallery</Text>
              </Pressable>

              <View style={s.btnRow}>
                <YellowButton title="Next" onPress={() => setStep(3)} />
                <Text style={s.counter}>2/3</Text>
              </View>

              <Pressable onPress={() => setStep(3)} style={{ alignItems: 'center', marginTop: spacing.md }}>
                <Text style={{ color: colors.white, fontSize: fontSize.sm, textDecorationLine: 'underline', opacity: 0.7 }}>
                  Skip this step
                </Text>
              </Pressable>
            </>
          )}

          {/* ── STEP 3/3: Personalize & Interests ─────────────────────────── */}
          {step === 3 && (
            <>
              <Text style={[s.stepTitle, { textAlign: 'center', fontSize: 24 }]}>
                Personalize Your Interests
              </Text>
              <Text style={s.interestSub}>Select Up To 4</Text>
              <ErrorBanner message={serverError} />

              <View style={s.interestGrid}>
                {INTERESTS.map(({ key, icon }) => {
                  const active = selectedInterests.includes(key);
                  return (
                    <Pressable
                      key={key}
                      onPress={() => toggleInterest(key)}
                      style={[s.interestCard, active && s.interestCardActive]}
                    >
                      <Ionicons name={icon} size={40} color="#1A1A1A" />
                      <Text style={s.interestLabel}>{key}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={s.btnRow}>
                <YellowButton
                  title="Complete Member Profile Setup"
                  onPress={handleComplete}
                  loading={isLoading}
                />
                <Text style={s.counter}>3/3</Text>
              </View>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      <Watermark />
    </SafeAreaView>
  );
}

const GRID_GAP = spacing.sm;
const CARD_SIZE = Math.floor((Dimensions.get('window').width - spacing.xl * 2 - GRID_GAP * 2) / 3);

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: colors.primary },
  backBtn:          { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xs, alignSelf: 'flex-start' },
  scroll:           { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: 120 },
  stepTitle:        { color: colors.white, fontSize: 34, fontWeight: '800', marginBottom: spacing.xxl, lineHeight: 42 },

  input:            { backgroundColor: '#D9D9D9', borderRadius: 12, paddingHorizontal: spacing.lg, paddingVertical: 18, fontSize: fontSize.base, color: '#1A1A1A', marginBottom: spacing.md, width: '100%' },
  passwordRow:      { backgroundColor: '#D9D9D9', borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  passwordInput:    { flex: 1, paddingHorizontal: spacing.lg, paddingVertical: 18, fontSize: fontSize.base, color: '#1A1A1A' },
  eyeBtn:           { paddingHorizontal: spacing.md, paddingVertical: 18 },
  err:              { color: colors.error, fontSize: fontSize.xs, marginTop: -8, marginBottom: spacing.sm },

  btnRow:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.md, gap: spacing.lg },
  yellowBtn:        { backgroundColor: colors.accent, borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center', flexShrink: 1 },
  yellowBtnText:    { color: '#1A1A1A', fontWeight: '700', fontSize: fontSize.base, textAlign: 'center' },
  counter:          { color: colors.white, fontSize: fontSize.base },

  emailNote:        { color: colors.muted, fontSize: fontSize.xs, lineHeight: 18, marginBottom: spacing.md, paddingHorizontal: spacing.xs },
  passwordWarning:  { color: colors.accent, fontSize: fontSize.xs, lineHeight: 18, marginBottom: spacing.sm, paddingHorizontal: spacing.xs, fontWeight: '600' },
  strengthBox:      { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: spacing.md, marginBottom: spacing.md, gap: 6 },
  strengthRow:      { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  strengthLabel:    { fontSize: fontSize.xs },
  strengthLabelMet: { color: '#4CAF50' },
  strengthLabelFail:{ color: '#E53935' },
  loginLink:        { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  loginLinkMuted:   { color: colors.muted, fontSize: fontSize.sm },
  loginLinkAccent:  { color: colors.accent, fontSize: fontSize.sm, fontWeight: '700' },

  // Photo step
  photoCircle:      { width: 220, height: 220, borderRadius: 110, backgroundColor: '#D9D9D9', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: spacing.xxl },
  photoImage:       { width: 220, height: 220 },
  photoRow:         { backgroundColor: '#D9D9D9', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 16, marginBottom: spacing.md, gap: spacing.md },
  photoRowIcon:     { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  photoRowText:     { color: '#555', fontSize: fontSize.base },

  // Interests step
  interestSub:      { color: colors.accent, fontSize: fontSize.base, textAlign: 'center', marginBottom: spacing.lg, marginTop: -spacing.lg },
  interestGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP, width: CARD_SIZE * 3 + GRID_GAP * 2, alignSelf: 'center', marginBottom: spacing.md },
  interestCard:     { width: CARD_SIZE, height: CARD_SIZE, backgroundColor: '#D9D9D9', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  interestCardActive: { backgroundColor: colors.accent },
  interestLabel:    { color: '#1A1A1A', fontSize: 12, textAlign: 'center', fontWeight: '600', marginTop: 5 },

  // Role picker
  roleRow:          { backgroundColor: '#D9D9D9', borderRadius: 12, paddingHorizontal: spacing.lg, paddingVertical: 18, marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center' },
  rolePlaceholder:  { flex: 1, color: '#888', fontSize: fontSize.base },
  roleOptions:      { backgroundColor: '#C8C8C8', borderRadius: 10, marginTop: -spacing.sm, marginBottom: spacing.md, overflow: 'hidden' },
  roleOption:       { paddingHorizontal: spacing.lg, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#B8B8B8' },
  roleOptionText:   { fontSize: fontSize.base, color: '#1A1A1A' },

  // Watermark
  watermark:        { position: 'absolute', bottom: spacing.xl, right: spacing.xl, alignItems: 'center' },
  watermarkImg:     { width: 48, height: 48 },
});
