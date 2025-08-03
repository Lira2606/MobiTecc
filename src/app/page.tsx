'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for the authentication check to complete
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/app');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Render nothing while loading and redirecting, 
  // the splash screen is handled by the RootLayout.
  return null;
}
