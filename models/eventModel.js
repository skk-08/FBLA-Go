import { supabase } from '../lib/supabase';

export async function fetchEvents(searchQuery = '') {
  let query = supabase.from('events').select('*').order('name');
  if (searchQuery) query = query.ilike('name', `%${searchQuery}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchUserEvents(userId) {
  const { data, error } = await supabase
    .from('user_events')
    .select('*, events(*)')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function fetchNextCompetitionDate(userId) {
  const { data, error } = await supabase
    .from('user_events')
    .select('events(competition_date, name)')
    .eq('user_id', userId)
    .not('events.competition_date', 'is', null)
    .order('events(competition_date)', { ascending: true })
    .limit(1);
  if (error) throw error;
  return data?.[0]?.events ?? null;
}
