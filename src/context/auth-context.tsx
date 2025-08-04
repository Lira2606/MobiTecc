'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import { auth } from '@/lib/firebase'; // Prepared for future Firebase connection

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a stored session
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);
  

  const login = async (email: string, pass: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
       setTimeout(() => {
        if (email === 'admin@mobitec.com' && pass === 'admin') {
            const userData: User = { 
                id: '1', 
                name: 'Admin MobiTec', 
                email: 'admin@mobitec.com',
                avatar: 'https://placehold.co/112x112.png',
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            router.push('/app');
            resolve();
        } else {
            reject(new Error('Credenciais inválidas.'));
        }
       }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
