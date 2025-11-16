'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const USERS_STORAGE_KEY = 'mobitec_users'; // Key for local storage

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  newPassword: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

type ForgotPasswordFormValues = z.infer<typeof formSchema>;

// Helper to get users from localStorage
const getLocalUsers = () => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

export function ForgotPasswordForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      newPassword: '',
    },
  });

  const handleSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const users = getLocalUsers();
      const userIndex = users.findIndex((u: any) => u.email === data.email);

      if (userIndex === -1) {
        throw new Error('Nenhum usuário encontrado com este e-mail.');
      }

      // Update password for the found user
      users[userIndex].password = data.newPassword;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      console.log("Password changed successfully for:", data.email);

      toast({
        title: 'Senha Alterada',
        description: 'Sua senha foi alterada com sucesso. Você já pode fazer o login.',
      });
      onSwitchToLogin();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha ao Alterar Senha',
        description: (error as Error).message || 'Ocorreu um erro. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Criar Nova Senha</h1>
        <p className="text-gray-400 mt-2">Insira seu e-mail e a nova senha abaixo.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-sm space-y-4 z-10">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="email" placeholder="Email" className="w-full pl-4 pr-4 py-3 h-auto bg-transparent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </FormControl>
                <FormMessage className="text-red-400 pl-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="password" placeholder="Nova Senha" className="w-full pl-4 pr-4 py-3 h-auto bg-transparent rounded-lg text-white placeholder-gray-500 focus:outline-none focusring-2 focus:ring-teal-500" />
                </FormControl>
                <FormMessage className="text-red-400 pl-2" />
              </FormItem>
            )}
          />
          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 h-auto px-4 rounded-lg">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Alterar Senha'}
            </Button>
          </div>
        </form>
      </Form>
      
      <p className="text-center text-gray-400 text-sm mt-8">
        Lembrou da senha? <button onClick={onSwitchToLogin} className="text-teal-400 hover:text-teal-300 font-medium">Faça login</button>
      </p>
    </div>
  );
}
