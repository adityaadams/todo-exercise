import { createContext, useContext, useState, type ReactNode } from 'react';
import { type User, type LoginCredentials, type RegisterCredentials, type AuthContextType } from '../types/Auth'

// Mock users database (untuk demo)
const MOCK_USERS: User[] = [
  { id: 1, email: 'demo@example.com', name: 'Demo User' }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulasi login
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation (untuk demo)
      if (credentials.email === 'demo@example.com' && credentials.password === 'password123') {
        const foundUser = MOCK_USERS.find(u => u.email === credentials.email);
        setUser(foundUser || null);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Simulasi register
  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validasi
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error("Passwords don't match");
      }
      
      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Cek apakah email sudah terdaftar
      if (MOCK_USERS.some(u => u.email === credentials.email)) {
        throw new Error('Email already registered');
      }
      
      // Buat user baru
      const newUser: User = {
        id: MOCK_USERS.length + 1,
        email: credentials.email,
        name: credentials.name
      };
      
      MOCK_USERS.push(newUser);
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      error,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};