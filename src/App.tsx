import { useState, useMemo } from 'react';
import { useAuthStore } from './store/authStore';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import ThemeToggle from './components/ThemeToggle';
import SearchInput from './components/SearchInput';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { type Todo, type FilterType } from './types/todo';

// Import gambar dari local
import bgLight from './assets/Bitmap-pagi.png';
import bgDark from './assets/Bitmap-malam.png'

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
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');

  // Use zustand store
  const { isAuthenticated, login, register, loading, error, clearError, user, logout } = useAuthStore();

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
    let filtered = todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }, [todos, filter, searchQuery]);

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  // Jika belum login, tampilkan halaman auth
  if (!isAuthenticated) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        {authView === 'signin' ? (
          <SignIn 
            onLogin={login}
            onSwitchToSignUp={() => {
              setAuthView('signup');
              clearError();
            }}
            error={error}
            loading={loading}
          />
        ) : (
          <SignUp
            onRegister={register}
            onSwitchToSignIn={() => {
              setAuthView('signin');
              clearError();
            }}
            error={error}
            loading={loading}
          />
        )}
      </div>
    );
  }

  // Jika sudah login, tampilkan todo app
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        {/* Background Image dengan gradient sesuai design */}
        <div 
          className="absolute inset-0 h-80 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: darkMode 
              ? `linear-gradient(to right, #8a6cb8, #5a3e7a), url(${bgDark})`
              : `linear-gradient(to right, #a18cd1, #fbc2eb), url(${bgLight})`,
            backgroundBlendMode: 'overlay',
          }}
        />
        
        <div className="relative container mx-auto max-w-2xl px-4 py-8">
          {/* Header dengan user info dan logout */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold tracking-widest text-white">
              TODO
            </h1>
            <div className="flex items-center gap-4">
              {/* User info dengan email */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-white text-sm font-medium">
                  {user?.name}
                </span>
                <span className="text-white/70 text-xs">
                  {user?.email}
                </span>
              </div>
              
              {/* Avatar dengan inisial */}
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <button
                onClick={logout}
                className="text-white hover:text-gray-200 transition-colors text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
              >
                Logout
              </button>
              
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
          </div>
          
          {/* Tampilkan email di mobile */}
          <div className="sm:hidden mb-4 flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium">
                  {user?.name}
                </span>
                <span className="text-white/70 text-xs">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
          
          <TodoInput onAdd={addTodo} />
          
          {/* Search Input */}
          <div className="mb-4">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
          
          {/* Info hasil pencarian */}
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