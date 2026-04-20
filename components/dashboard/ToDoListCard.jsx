import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing, radius } from '../../constants/theme';
import { useTodoViewModel } from '../../viewmodels/useTodoViewModel';

export default function ToDoListCard({ todos, setTodos }) {
  const { newTitle, setNewTitle, add, toggle, remove, adding } = useTodoViewModel(todos, setTodos);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>To-Do List</Text>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a task…"
          placeholderTextColor={colors.muted}
          value={newTitle}
          onChangeText={setNewTitle}
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={add} disabled={adding}>
          {adding ? <ActivityIndicator size="small" color={colors.primary} /> : <Ionicons name="add" size={20} color={colors.primary} />}
        </TouchableOpacity>
      </View>

      {todos.length === 0 && <Text style={styles.empty}>No tasks yet</Text>}

      {todos.slice(0, 5).map((item) => (
        <View key={item.id} style={styles.row}>
          <TouchableOpacity onPress={() => toggle(item.id, item.is_done)} style={styles.check}>
            <Ionicons
              name={item.is_done ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={item.is_done ? colors.success : colors.muted}
            />
          </TouchableOpacity>
          <Text style={[styles.taskText, item.is_done && styles.done]} numberOfLines={1}>{item.title}</Text>
          <TouchableOpacity onPress={() => remove(item.id)}>
            <Ionicons name="close-outline" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card:      { backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  title:     { color: colors.accent, fontSize: fontSize.base, fontWeight: '700', marginBottom: spacing.md },
  addRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.sm },
  input:     { flex: 1, backgroundColor: colors.primary, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, color: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSize.sm },
  addBtn:    { backgroundColor: colors.accent, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  row:       { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs, gap: spacing.sm },
  check:     { padding: 2 },
  taskText:  { flex: 1, color: colors.white, fontSize: fontSize.sm },
  done:      { textDecorationLine: 'line-through', color: colors.muted },
  empty:     { color: colors.muted, fontSize: fontSize.sm, textAlign: 'center', paddingVertical: spacing.sm },
});
