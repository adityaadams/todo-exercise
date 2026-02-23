import { useState, useMemo } from 'react'; // ← perbaiki import useMemo
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import ThemeToggle from './components/ThemeToggle';
import SearchInput from './components/SearchInput';
import { type Todo, type FilterType } from './types/todo';

// Import gambar dari local
import bgDesktopLight from './assets/Bitmap-pagi.png';
import bgDesktopDark from './assets/Bitmap-malam.png';

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Complete online JavaScript course', completed: false, createdAt: Date.now() - 600000 },
    { id: 2, text: 'Jog around the park 3x', completed: false, createdAt: Date.now() - 500000 },
    { id: 3, text: '10 minutes meditation', completed: false, createdAt: Date.now() - 400000 },
    { id: 4, text: 'Read for 1 hour', completed: false, createdAt: Date.now() - 300000 },
    { id: 5, text: 'Pick up groceries', completed: false, createdAt: Date.now() - 200000 },
    { id: 6, text: 'Complete Todo App on Frontend Mentor', completed: false, createdAt: Date.now() - 100000 },
  ]);

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // Fitur Add
  const addTodo = (text: string) => {
    if (text.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now()
      };
      setTodos([...todos, newTodo]);
    }
  };

  // Fitur Delete
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditText('');
    }
  };

  // Fitur Toggle Complete
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Fitur Update - Start editing
  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  // Fitur Update - Save edit
  const saveEdit = (id: number) => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editText.trim() } : todo
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  // Fitur Update - Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Fitur Clear Completed
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Filter dan Search todos
  const filteredAndSearchedTodos = useMemo(() => {
    // Step 1: Filter berdasarkan status
    let filtered = todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });

    // Step 2: Filter berdasarkan search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(query)
      );
    }

    // Step 3: Sort berdasarkan createdAt (newest first)
    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }, [todos, filter, searchQuery]);

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        {/* Background Image dengan gradient sesuai design */}
        <div 
          className="absolute inset-0 h-80 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: darkMode 
              ? `linear-gradient(to right, #8a6cb8, #5a3e7a), url(${bgDesktopDark})`
              : `linear-gradient(to right, #a18cd1, #fbc2eb), url(${bgDesktopLight})`,
            backgroundBlendMode: 'overlay',
          }}
        />
        
        <div className="relative container mx-auto max-w-2xl px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold tracking-widest text-white">
              TODO
            </h1>
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
          
          <TodoInput onAdd={addTodo} />
          
          {/* Search Input - bisa diketik (menggantikan sort dropdown) */}
          <div className="mb-4">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
          
          {/* Info hasil pencarian (opsional) */}
          {searchQuery && (
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              Found {filteredAndSearchedTodos.length} tasks matching "{searchQuery}"
            </div>
          )}
          
          <TodoList 
            todos={filteredAndSearchedTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={startEditing}
            onSave={saveEdit}
            onCancel={cancelEdit}
            editingId={editingId}
            editText={editText}
            setEditText={setEditText}
          />
          
          <TodoFooter 
            itemsLeft={itemsLeft}
            currentFilter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
          />
        </div>
      </div>
    </div>
  );
}

export default App;