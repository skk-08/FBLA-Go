import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { updateProfile } from '../models/userModel';

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
  const [fullName,    setFullName]    = useState('');
  const [chapterName, setChapterName] = useState('');
  const [grade,       setGrade]       = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [errors,      setErrors]      = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading,   setIsLoading]   = useState(false);

  function validate() {
    const e = {};
    if (!fullName.trim())           e.fullName    = 'Full name is required.';
    if (!chapterName.trim())        e.chapterName = 'Chapter name is required.';
    const gradeNum = parseInt(grade, 10);
    if (!grade || gradeNum < 9 || gradeNum > 12) e.grade = 'Grade must be between 9 and 12.';
    const emailErr = validateEmail(email);
    if (emailErr) e.email = emailErr;
    const passErr = validatePassword(password);
    if (passErr) e.password = passErr;
    if (password !== confirm) e.confirm = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignup() {
    if (!validate()) return;
    setIsLoading(true);
    setServerError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name:    fullName.trim(),
            chapter_name: chapterName.trim(),
            grade:        parseInt(grade, 10),
          },
        },
      });
      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          setErrors((e) => ({ ...e, email: 'An account with this email already exists.' }));
        } else {
          setServerError(error.message);
        }
        return;
      }
      if (data.user) {
        // Trigger already created the profile row — update it with the user's details
        await updateProfile(data.user.id, {
          full_name:    fullName.trim(),
          chapter_name: chapterName.trim(),
          grade:        parseInt(grade, 10),
        }).catch(() => {});
      }
    } catch (err) {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    fullName, setFullName, chapterName, setChapterName,
    grade, setGrade, email, setEmail,
    password, setPassword, confirm, setConfirm,
    errors, serverError, isLoading, handleSignup,
  };
}
