'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface StoredUser extends User {
  password?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  resetPassword: (email: string, pass: string) => Promise<void>;
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
          // Allow any other login for demo purposes if it matches a registered user pattern (mock)
          const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const foundUser = storedUsers.find((u) => u.email === email && u.password === pass);

          if (foundUser) {
            const userData: User = {
              id: foundUser.id,
              name: foundUser.name,
              email: foundUser.email,
              avatar: 'https://placehold.co/112x112.png',
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            router.push('/app');
            resolve();
          } else {
            reject(new Error('Credenciais inválidas.'));
          }
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        if (storedUsers.find((u) => u.email === email)) {
          return;
        }

        const newUser: StoredUser = { id: Date.now().toString(), name, email, password: pass };
        storedUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));

        // No auto login, just resolve
        resolve();
      }, 1000);
    });
  };

  const resetPassword = async (email: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = storedUsers.findIndex((u) => u.email === email);

        if (userIndex !== -1) {
          storedUsers[userIndex].password = pass;
          localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
          resolve();
        } else if (email === 'admin@mobitec.com') {
          // Admin password cannot be reset in this mock
          reject(new Error('Não é possível redefinir a senha do administrador.'));
        } else {
          reject(new Error('E-mail não encontrado.'));
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
    register,
    resetPassword,
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
