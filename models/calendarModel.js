import { supabase } from '../lib/supabase';

export async function fetchCalendarEvents(userId, chapterId) {
  let query = supabase.from('calendar_events').select('*').order('start_time');
  if (chapterId) {
    query = query.or(`user_id.eq.${userId},and(is_shared.eq.true,chapter_id.eq.${chapterId})`);
  } else {
    query = query.eq('user_id', userId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createCalendarEvent(userId, event) {
  const { data, error } = await supabase
    .from('calendar_events')
    .insert({ user_id: userId, ...event })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCalendarEvent(eventId, updates) {
  const { data, error } = await supabase
    .from('calendar_events')
    .update(updates)
    .eq('id', eventId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCalendarEvent(eventId) {
  const { error } = await supabase.from('calendar_events').delete().eq('id', eventId);
  if (error) throw error;
}
