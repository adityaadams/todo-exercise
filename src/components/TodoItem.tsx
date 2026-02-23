import { type Todo } from '../types/todo';
import { useState } from 'react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
  onSave: (id: number) => void;
  onCancel: () => void;
  isEditing: boolean;
  editText: string;
  setEditText: (text: string) => void;
}

const TodoItem = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit,
  onSave,
  onCancel,
  isEditing,
  editText,
  setEditText
}: TodoItemProps) => {
  const [showActions, setShowActions] = useState(false);

  const handleSave = () => {
    onSave(todo.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-4 bg-white dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.completed 
              ? 'bg-gradient-to-r from-blue-400 to-purple-500 border-transparent' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-200 border-b border-blue-400 pb-1"
          autoFocus
        />
        
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="text-green-500 hover:text-green-400 transition-colors text-sm font-medium"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="text-red-500 hover:text-red-400 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-4 bg-white dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600 group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.completed 
            ? 'bg-gradient-to-r from-blue-400 to-purple-500 border-transparent' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      
      <span 
        className={`flex-1 text-gray-700 dark:text-gray-200 cursor-pointer ${
          todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
        }`}
        onDoubleClick={() => onEdit(todo.id, todo.text)}
      >
        {todo.text}
      </span>
      
      <div className={`flex gap-3 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <button
          onClick={() => onEdit(todo.id, todo.text)}
          className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;