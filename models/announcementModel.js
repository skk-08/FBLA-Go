import { supabase } from '../lib/supabase';

export async function fetchAnnouncements(chapterId, limit = 20) {
  const { data, error } = await supabase
    .from('announcements')
    .select('*, users(email)')
    .eq('chapter_id', chapterId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function createAnnouncement(chapterId, authorId, title, body, isPinned = false) {
  const { data, error } = await supabase
    .from('announcements')
    .insert({ chapter_id: chapterId, author_id: authorId, title, body, is_pinned: isPinned })
    .select()
    .single();
  if (error) throw error;
  return data;
}
