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

export const metadata: Metadata = {
  title: 'MobiTec',
  description: 'Gerencie suas entregas de forma fácil e eficiente.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn('bg-gray-900 flex items-center justify-center min-h-screen p-4 font-sans', inter.variable)}>
        <div className="mobile-shell w-full max-w-[450px]">
          <div 
            id="mobile-screen" 
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
