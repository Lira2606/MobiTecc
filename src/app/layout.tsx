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
      <body className={cn('bg-gray-900 flex items-center justify-center min-h-screen p-4', inter.variable)}>
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

// Add shell styles to a new layer in globals or a new css file if preferred
const styles = `
  .mobile-shell {
    background: linear-gradient(-45deg, #1f2937, #111827, #0d2438, #1a1a2e);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    padding: 1rem;
    border-radius: 2.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  }
  .mobile-screen {
    max-width: 420px;
    height: 850px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    background: #111827;
    --gradient-x: 50%;
    --gradient-y: 50%;
    background-image: radial-gradient(circle at var(--gradient-x) var(--gradient-y), rgba(20, 184, 166, 0.15), transparent 40%);
  }
`;

// This is a hack to inject styles. In a real app, you'd use a CSS file.
const StyleInjector = () => <style>{styles}</style>;

Object.assign(RootLayout, { StyleInjector });
