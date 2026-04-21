import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchProfile, updateProfile, upsertProfile } from '../models/userModel';
import { useAuthStore } from '../store/authStore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function validateEmail(email) {
  if (!email) return 'Email is required.';
  if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address.';
  return null;
}

function validatePassword(password) {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!PASSWORD_REGEX.test(password))
    return 'Password must include an uppercase letter, a number, and a symbol.';
  return null;
}

export function useLoginViewModel() {
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [errors,      setErrors]      = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading,   setIsLoading]   = useState(false);

  function validate() {
    const e = {};
    const emailErr = validateEmail(email);
    const passErr  = validatePassword(password);
    if (emailErr) e.email    = emailErr;
    if (passErr)  e.password = passErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setIsLoading(true);
    setServerError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        // Semantic: differentiate account-not-found vs wrong password
        if (error.message.toLowerCase().includes('invalid login')) {
          setServerError('No account found with these credentials. Please check your email and password.');
        } else {
          setServerError(error.message);
        }
      }
    } catch (err) {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword() {
    const emailErr = validateEmail(email);
    if (emailErr) {
      setErrors((e) => ({ ...e, email: 'Enter your email above before resetting your password.' }));
      return false;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) { setServerError(error.message); return false; }
    return true;
  }

  return {
    email, setEmail, password, setPassword,
    errors, serverError, isLoading,
    handleLogin, handleForgotPassword,
  };
}

export function useSignupViewModel() {
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [school,      setSchool]      = useState('');
  const [role,        setRole]        = useState('member');
  const [roleCode,    setRoleCode]    = useState('');
  const [otp,         setOtp]         = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [errors,      setErrors]      = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading,   setIsLoading]   = useState(false);

  function validateCredentials() {
    const e = {};
    const emailErr = validateEmail(email);
    if (emailErr) e.email = emailErr;
    const passErr = validatePassword(password);
    if (passErr) e.password = passErr;
    if (password !== confirm) e.confirm = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateProfileFields() {
    const e = {};
    if (!firstName.trim()) e.firstName = 'First name is required.';
    if (!lastName.trim())  e.lastName  = 'Last name is required.';
    if (!school.trim())    e.school    = 'School is required.';
    if ((role === 'executive' || role === 'advisor') && !roleCode.trim()) {
      e.roleCode = 'Enter your role access code.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // Step 0 — create auth account and trigger OTP email
  async function sendVerificationCode() {
    if (!validateCredentials()) return false;
    setIsLoading(true);
    setServerError(null);
    try {
      const { error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          setServerError('An account with this email already exists. Please log in instead.');
        } else {
          setServerError(error.message);
        }
        return false;
      }
      return true;
    } catch {
      setServerError('Could not send verification code. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  // Step 1 — verify the 6-digit OTP sent to email
  async function verifyEmailCode() {
    setErrors({});
    if (!otp.trim() || otp.trim().length !== 6) {
      setErrors({ otp: 'Enter the 6-digit code from your email.' });
      return false;
    }
    setIsLoading(true);
    setServerError(null);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type:  'signup',
      });
      if (error) {
        setServerError('Invalid or expired code. Check your email and try again.');
        return false;
      }
      return true;
    } catch {
      setServerError('Verification failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  // Step 4 — save full profile (user is already authenticated via OTP)
  async function completeProfile(photoUri, interests) {
    if (!validateProfileFields()) return false;
    setIsLoading(true);
    setServerError(null);
    try {
      // 1. Get userId from the session created after OTP verification
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        setServerError('Session expired. Please restart signup.');
        return false;
      }
      const userId = currentUser.id;

      // 2. Ensure public.users has this user's row (DB trigger may have beat us)
      const { error: usersError } = await supabase
        .from('users')
        .upsert({ id: userId, email: email.trim() }, { onConflict: 'id' });
      if (usersError) {
        const nonFatal =
          usersError.code === '23505' ||
          usersError.code === '42501' ||
          usersError.message?.includes('already exists') ||
          usersError.message?.includes('row-level security');
        if (!nonFatal) {
          setServerError(usersError.message || 'Could not initialise account. Please try again.');
          return false;
        }
      }

      // 3. Validate role code for executive/advisor signups
      let verifiedRole = role || 'member';
      if (role === 'executive' || role === 'advisor') {
        const { data: codes } = await supabase
          .from('chapter_codes')
          .select('executive_code, advisor_code')
          .ilike('chapter_name', school.trim())
          .single();
        const expected = role === 'executive' ? codes?.executive_code : codes?.advisor_code;
        if (!expected || roleCode.trim() !== expected) {
          setServerError('Invalid role code. Ask your advisor for the correct code.');
          return false;
        }
      }

      // 4. Save profile and mark onboarding complete
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const savedProfile = await upsertProfile(userId, {
        full_name:           fullName,
        chapter_name:        school.trim(),
        role:                verifiedRole,
        onboarding_complete: true,
      });

      // 5. Save interests separately
      if (interests?.length) {
        const { error: interestsError } = await supabase
          .from('profiles')
          .update({ interests })
          .eq('user_id', userId);
        if (interestsError && !interestsError.message?.includes('schema cache') && interestsError.code !== 'PGRST204') {
          console.warn('[completeProfile] interests save failed:', interestsError.message);
        }
      }

      // 6. Update auth store so AuthGuard immediately sees onboarding_complete: true
      useAuthStore.getState().setProfile(savedProfile);
      return true;
    } catch (err) {
      console.error('[completeProfile] caught:', err);
      const msg = err?.message
        || (typeof err === 'string' ? err : null)
        || JSON.stringify(err)
        || 'Could not complete setup. Please try again.';
      setServerError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    firstName, setFirstName, lastName, setLastName,
    school, setSchool, role, setRole, roleCode, setRoleCode,
    otp, setOtp,
    email, setEmail,
    password, setPassword, confirm, setConfirm,
    errors, serverError, isLoading,
    sendVerificationCode, verifyEmailCode, completeProfile, validateProfileFields,
  };
}
