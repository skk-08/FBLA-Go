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
    .eq('user_id', userId);
  if (error) throw error;
  if (!data?.length) return null;
  const withDates = data
    .map((ue) => ue.events)
    .filter((e) => e?.competition_date)
    .sort((a, b) => new Date(a.competition_date) - new Date(b.competition_date));
  return withDates[0] ?? null;
}
