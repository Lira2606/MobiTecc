'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { SplashScreen } from '@/components/splash-screen';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isShowingSplash, setIsShowingSplash] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setIsShowingSplash(false);
    }, 5000); // 5 second splash screen

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    // Wait for both auth check and splash timer to complete
    if (!isLoading && !isShowingSplash) {
      if (isAuthenticated) {
        router.replace('/app');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, isShowingSplash, router]);

  // Show splash while loading auth or splash timer is active
  if (isLoading || isShowingSplash) {
    return <SplashScreen />;
  }

  // Render nothing while redirecting
  return null;
}
