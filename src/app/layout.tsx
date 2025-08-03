'use client';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
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
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  
  const showShell = isAuthenticated || pathname === '/login' || pathname === '/';

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
