import { supabase } from '../lib/supabase';

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ user_id: userId, ...profileData })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadMemberID(userId, uri) {
  const ext      = uri.split('.').pop();
  const path     = `${userId}/member-id.${ext}`;
  const response = await fetch(uri);
  const blob     = await response.blob();

  const { error: uploadError } = await supabase.storage
    .from('member-ids')
    .upload(path, blob, { upsert: true, contentType: `image/${ext}` });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('member-ids').getPublicUrl(path);
  return data.publicUrl;
}

export async function fetchUserRole(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data.role;
}
