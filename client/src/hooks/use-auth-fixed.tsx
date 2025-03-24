import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

// User type that matches what the server returns
type User = {
  id: number;
  username: string;
  email: string;
  birthDate?: string | null;
  birthTime?: string | null;
  birthLocation?: string | null;
  subscriptionLevel: string;
  profileImage?: string | null;
  createdAt: string;
};

// Auth context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => { throw new Error('Not implemented'); },
  register: async () => { throw new Error('Not implemented'); },
  logout: async () => { throw new Error('Not implemented'); },
  checkAuth: async () => { throw new Error('Not implemented'); }
});

// Hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Create default premium user for development
  const defaultUser: User = {
    id: 1,
    username: "demo_user",
    email: "demo@example.com",
    birthDate: "1990-01-01",
    birthTime: "12:00",
    birthLocation: "New York, NY",
    subscriptionLevel: "premium", // Set as premium for features access
    profileImage: null,
    createdAt: new Date().toISOString()
  };

  const [user, setUser] = useState<User | null>(defaultUser); // Set default user for development
  const [isLoading, setIsLoading] = useState(false); // Set to false to skip loading state
  const queryClient = useQueryClient();

  // Check auth status - bypassed for development with default user
  const checkAuth = async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      // For development: Always return the default user without server request
      setUser(defaultUser);
      return defaultUser;
      
      // This code would normally be used but is commented out for dev access
      /*
      const userData = await apiRequest('/api/auth/me');
      if (userData && userData.id) {
        setUser(userData);
        return userData;
      } else {
        setUser(null);
        return null;
      }
      */
    } catch (error) {
      console.error('Failed to check authentication status', error);
      // For development: Still use default user on error
      setUser(defaultUser);
      return defaultUser;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial auth check
  useEffect(() => {
    // Just use default user instead of checking auth
    setUser(defaultUser);
    setIsLoading(false);
  }, []);

  // Login method - used for development without server validation
  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      // For development: Skip actual login and use the default premium user
      console.log('Development mode: logging in with mock premium user');
      
      // Create a copy of defaultUser with the provided username
      const mockUser = {
        ...defaultUser,
        username,
        email: username.includes('@') ? username : `${username}@example.com`
      };
      
      setUser(mockUser);
      // Invalidate queries that might depend on auth state
      queryClient.invalidateQueries();
      return mockUser;
      
      /*
      // Normal implementation:
      const userData = await apiRequest('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      setUser(userData);
      // Invalidate queries that might depend on auth state
      queryClient.invalidateQueries();
      return userData;
      */
    } catch (error) {
      console.error('Login error:', error);
      // For development: Still use default user on error
      setUser(defaultUser);
      return defaultUser;
    } finally {
      setIsLoading(false);
    }
  };

  // Register method - used for development without server validation
  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<User> => {
    setIsLoading(true);
    try {
      // For development: Skip actual registration and use mock user
      console.log('Development mode: registering with mock premium user');
      
      // Create a copy of defaultUser with the provided details
      const mockUser = {
        ...defaultUser,
        username,
        email
      };
      
      setUser(mockUser);
      return mockUser;
      
      /*
      // Normal implementation:
      const userData = await apiRequest('/api/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });
      
      setUser(userData);
      return userData;
      */
    } catch (error) {
      console.error('Registration error:', error);
      // For development: Still use default user on error
      setUser(defaultUser);
      return defaultUser;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout method - modified for development to maintain premium access
  const logout = async (): Promise<void> => {
    try {
      // For development: Instead of actual logout, just show a message
      console.log('Development mode: logout requested but staying logged in for testing');
      
      // Optional: To see what real logout would be like, uncomment:
      // setUser(null);
      // queryClient.clear();
      
      // For development: Maintain the user session
      return;
      
      /*
      // Normal implementation:
      await apiRequest('/api/logout', { method: 'POST' });
      setUser(null);
      // Clear all queries from cache on logout
      queryClient.clear();
      */
    } catch (error) {
      console.error('Error during logout:', error);
      // For development: Stay logged in even on error
      return;
    }
  };

  // Create context value object
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}