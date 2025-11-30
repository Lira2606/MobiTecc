'use client';

import { Inter } from 'next/font/google';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { SplashScreen } from '@/components/splash-screen';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';
import { useEffect, useState } from 'react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans'
});

function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const [isShowingSplash, setIsShowingSplash] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setIsShowingSplash(false);
    }, 7000);

    return () => clearTimeout(splashTimer);
  }, []);

  const showSplash = isLoading || isShowingSplash;

  return (
    <div className={cn(
      'flex items-center justify-center min-h-screen font-sans bg-gray-900'
    )}>
      {showSplash ? <SplashScreen /> : children}
      <Toaster />
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(inter.variable)}>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}
