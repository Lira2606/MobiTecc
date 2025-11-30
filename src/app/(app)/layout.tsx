'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Sidebar } from '@/components/ui/sidebar';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const hideStatusBar = async () => {
      if (Capacitor.isNativePlatform()) {
        await StatusBar.hide();
      }
    };
    hideStatusBar();
  }, []);

  if (isLoading || !isAuthenticated) {
    // You can return a loading spinner or null here
    return null;
  }

  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full bg-gray-800 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
