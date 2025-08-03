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
import { Loader2, KeyRound, Mail } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Falha no Login',
        description: (error as Error).message || 'Ocorreu um erro. Tente novamente.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center mb-10">
          <svg className="w-16 h-16 text-teal-400 header-logo" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="12" y="12" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="3"/>
              <path d="M26 12V4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M38 12V4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M26 52V60" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M38 52V60" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M52 26H60" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M52 38H60" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M12 26H4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M12 38H4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M24 24H30V30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40 40H34V34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
      </div>
      <h2 className="text-3xl font-bold text-white text-center fade-in-up">
        Bem-vindo!
      </h2>
      <p className="text-gray-400 mt-2 mb-8 text-center fade-in-up" style={{ animationDelay: '100ms' }}>
        Faça login para continuar.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="fade-in-up" style={{ animationDelay: '200ms' }}>
                  <FormControl>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <Input placeholder="seu@email.com" className="pl-12 h-14 bg-slate-800 border-slate-700" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="fade-in-up" style={{ animationDelay: '300ms' }}>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <Input placeholder="Sua senha" type="password" className="pl-12 h-14 bg-slate-800 border-slate-700" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

          <div className="pt-4 fade-in-up" style={{ animationDelay: '400ms' }}>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-500/90 text-white font-bold py-3 h-auto px-4 rounded-lg shadow-lg hover:shadow-primary/50 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-base">
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Entrar'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
