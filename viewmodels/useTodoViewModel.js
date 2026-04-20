import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { createTodo, toggleTodo, deleteTodo } from '../models/todoModel';

export function useTodoViewModel(todos, setTodos) {
  const { user } = useAuthStore();
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  async function add() {
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const todo = await createTodo(user.id, newTitle.trim());
      setTodos((prev) => [todo, ...prev]);
      setNewTitle('');
    } finally {
      setAdding(false);
    }
  }

  async function toggle(id, current) {
    const updated = await toggleTodo(id, !current);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function remove(id) {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return { newTitle, setNewTitle, add, toggle, remove, adding };
}
