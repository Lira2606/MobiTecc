'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// localStorage keys
const USERS_STORAGE_KEY = 'mobitec_users';
const SESSION_STORAGE_KEY = 'mobitec_session';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  sendVerificationCode: (phone: string) => Promise<void>;
  confirmVerificationCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get users from localStorage
const getLocalUsers = () => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  // Check for an active session on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sessionEmail = localStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionEmail) {
      const users = getLocalUsers();
      const loggedInUser = users.find((u: any) => u.email === sessionEmail);
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const users = getLocalUsers();
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      localStorage.setItem(SESSION_STORAGE_KEY, foundUser.email);
      setUser(foundUser);
      router.push('/app');
    } else {
      throw new Error('Email ou senha inválidos.');
    }
  };

  const register = async (data: any) => {
    const { name, email, password } = data;
    const users = getLocalUsers();
    const userExists = users.some((u: any) => u.email === email);

    if (userExists) {
      throw new Error('Este endereço de e-mail já está em uso.');
    }

    users.push({ name, email, password });
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    router.push('/login');
  };

  const logout = async () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
    router.push('/login');
  };

  // Phone verification is not applicable for local storage auth
  const sendVerificationCode = async (phone: string) => {
    console.warn('Phone verification is not applicable for local storage auth.');
    throw new Error('Verificação por telefone não está disponível no modo offline.');
  };

  const confirmVerificationCode = async (code: string) => {
    console.warn('Phone verification is not applicable for local storage auth.');
    throw new Error('Verificação por telefone não está disponível no modo offline.');
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      register,
      sendVerificationCode,
      confirmVerificationCode,
    }}>
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
