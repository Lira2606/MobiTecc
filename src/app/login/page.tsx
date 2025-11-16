'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/login-form';
import { RegisterForm } from '@/components/register-form';
import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [view, setView] = useState('login');
  const router = useRouter();

  const renderView = () => {
    switch (view) {
      case 'register':
        return <RegisterForm onSwitchToLogin={() => setView('login')} />;
      case 'forgotPassword':
        return <ForgotPasswordForm onSwitchToLogin={() => setView('login')} />;
      case 'login':
      default:
        return <LoginForm onSwitchToRegister={() => setView('register')} onSwitchToForgotPassword={() => setView('forgotPassword')} />;
    }
  };

  return renderView();
}
