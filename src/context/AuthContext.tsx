import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

export type UserRole = 'OFFICER' | 'STARTUP' | 'CITIZEN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  orgName?: string;
}

export interface RegisterFields {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  orgName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fields: RegisterFields) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AUTH_STORAGE_KEY = 'pilotgov_auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.user ?? null;
      }
    } catch (e) {
      console.error('Failed to parse auth from localStorage:', e);
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.token ?? null;
      }
    } catch (e) {
      console.error('Failed to parse token from localStorage:', e);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Keep localStorage in sync if user or token changes
    if (token && user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
    } else if (!token && !user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [token, user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fields: RegisterFields) => {
    setIsLoading(true);
    try {
      const response = await api<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(fields),
      });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
