'use client';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { SplashScreen } from '@/components/splash-screen';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans' 
});

function AppContent({ children }: { children: React.ReactNode }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const { isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = screen.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      screen.style.setProperty('--gradient-x', `${(x / rect.width) * 100}%`);
      screen.style.setProperty('--gradient-y', `${(y / rect.height) * 100}%`);
    };

    screen.addEventListener('mousemove', handleMouseMove);

    return () => {
      screen.removeEventListener('mousemove', handleMouseMove);
    };
  }, [loading]);
  
  const showShell = isAuthenticated || pathname === '/login';

  if(loading || isLoading) {
    return (
      <div className="bg-gray-900 flex items-center justify-center min-h-screen">
          <SplashScreen />
      </div>
    )
  }

  return (
    <div className={cn(
      'flex items-center justify-center min-h-screen p-4 font-sans',
       showShell ? 'bg-gray-900' : 'bg-slate-900'
    )}>
      {showShell ? (
         <div className="mobile-shell w-full max-w-[450px]">
          <div 
            id="mobile-screen" 
            ref={screenRef}
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
