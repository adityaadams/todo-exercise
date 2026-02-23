import TodoItem from './TodoItem';
import { type Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
  onSave: (id: number) => void;
  onCancel: () => void;
  editingId: number | null;
  editText: string;
  setEditText: (text: string) => void;
}

const TodoList = ({ 
  todos, 
  onToggle, 
  onDelete, 
  onEdit,
  onSave,
  onCancel,
  editingId,
  editText,
  setEditText
}: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-8 text-center text-gray-500 dark:text-gray-400">
        No todos yet
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          isEditing={editingId === todo.id}
          editText={editText}
          setEditText={setEditText}
        />
      ))}
    </div>
  );
};

export default TodoList;