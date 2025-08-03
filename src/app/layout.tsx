'use client';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
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
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const [isShowingSplash, setIsShowingSplash] = useState(true);

  useEffect(() => {
    // This timer ensures the splash screen is visible for at least 7 seconds.
    const splashTimer = setTimeout(() => {
      setIsShowingSplash(false);
    }, 7000); 

    return () => clearTimeout(splashTimer);
  }, []);

  // Show splash while auth is loading or the splash timer is active.
  if (isLoading || isShowingSplash) {
    return <SplashScreen />;
  }
  
  const showShell = isAuthenticated || pathname === '/login';

  return (
    <div className={cn(
      'flex items-center justify-center min-h-screen p-4 font-sans',
       showShell ? 'bg-gray-900' : 'bg-slate-900'
    )}>
      {showShell ? (
         <div className="mobile-shell w-full max-w-[450px]">
          <div 
            id="mobile-screen" 
            className="mobile-screen w-full rounded-3xl overflow-hidden relative flex flex-col"
          >
           {children}
          </div>
        </div>
      ) : (
        children
      )}
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
