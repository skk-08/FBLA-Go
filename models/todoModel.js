import { supabase } from '../lib/supabase';

export async function fetchTodos(userId) {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTodo(userId, title, dueDate = null) {
  const { data, error } = await supabase
    .from('todos')
    .insert({ user_id: userId, title, due_date: dueDate })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleTodo(todoId, isDone) {
  const { data, error } = await supabase
    .from('todos')
    .update({ is_done: isDone, updated_at: new Date().toISOString() })
    .eq('id', todoId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTodo(todoId) {
  const { error } = await supabase.from('todos').delete().eq('id', todoId);
  if (error) throw error;
}
