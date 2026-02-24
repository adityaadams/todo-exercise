import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User, type LoginCredentials, type RegisterCredentials } from '../types/Auth';

// Mock users database (untuk demo)
const MOCK_USERS: User[] = [
  { id: 1, email: 'demo@example.com', name: 'Demo User' }
];

interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login action
      login: async (credentials: LoginCredentials) => {
        set({ loading: true, error: null });
        
        try {
          // Simulasi API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock validation
          if (credentials.email === 'demo@example.com' && credentials.password === 'password123') {
            const foundUser = MOCK_USERS.find(u => u.email === credentials.email);
            set({ 
              user: foundUser || null, 
              isAuthenticated: true, 
              loading: false 
            });
          } else {
            throw new Error('Invalid email or password');
          }
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'Login failed', 
            loading: false 
          });
        }
      },

      // Register action
      register: async (credentials: RegisterCredentials) => {
        set({ loading: true, error: null });
        
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
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            loading: false 
          });
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'Registration failed', 
            loading: false 
          });
        }
      },

      // Logout action
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          error: null 
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage', // unique name for localStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // hanya persist user dan isAuthenticated
    }
  )
);