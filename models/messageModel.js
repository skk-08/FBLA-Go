import { supabase } from '../lib/supabase';

export async function fetchMessages(chapterId, limit = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('*, users(email), profiles(full_name, photo_url)')
    .eq('chapter_id', chapterId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function sendMessage(chapterId, senderId, body) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ chapter_id: chapterId, sender_id: senderId, body })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function softDeleteMessage(messageId, deletedBy) {
  const { error } = await supabase
    .from('messages')
    .update({ is_deleted: true, deleted_by: deletedBy })
    .eq('id', messageId);
  if (error) throw error;
}

export function subscribeToMessages(chapterId, callback) {
  return supabase
    .channel(`messages:${chapterId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `chapter_id=eq.${chapterId}`,
    }, callback)
    .subscribe();
}
