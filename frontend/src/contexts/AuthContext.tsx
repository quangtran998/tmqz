'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ error?: string }>;
  googleLogin: (credential: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.getMe().then(({ data, error }) => {
        if (data) {
          setUser(data);
        } else {
          localStorage.removeItem('token');
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await authApi.login(email, password);
    if (data) {
      localStorage.setItem('token', data.token!);
      setUser(data);
      return {};
    }
    return { error };
  };

  const register = async (username: string, email: string, password: string) => {
    const { data, error } = await authApi.register(username, email, password);
    if (data) {
      localStorage.setItem('token', data.token!);
      setUser(data);
      return {};
    }
    return { error };
  };

  const googleLogin = async (credential: string) => {
    const { data, error } = await authApi.googleLogin(credential);
    if (data) {
      localStorage.setItem('token', data.token!);
      setUser(data);
      return {};
    }
    return { error };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
