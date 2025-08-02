'use client';

import { useEffect, useRef } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans' 
});

// Metadata can't be exported from a client component.
// If you need dynamic metadata, you can export a generateMetadata function.
// For static metadata, you can move it to a parent layout or the page component.
// For now, I will comment it out. A proper fix would be to extract this to a client component.
// export const metadata: Metadata = {
//   title: 'MobiTec',
//   description: 'Gerencie suas entregas de forma fácil e eficiente.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const screenRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn('bg-gray-900 flex items-center justify-center min-h-screen p-4 font-sans', inter.variable)}>
        <div className="mobile-shell w-full max-w-[450px]">
          <div 
            id="mobile-screen" 
            ref={screenRef}
            className="mobile-screen w-full rounded-3xl overflow-hidden relative flex flex-col"
          >
            {children}
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
