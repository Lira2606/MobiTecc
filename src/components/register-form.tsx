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
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não correspondem.",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof formSchema>;

export function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const { register } = useAuth();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await register(data);
      toast({
        title: 'Cadastro realizado com sucesso!',
        description: "Você será redirecionado para a tela de login.",
      });
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Falha no Cadastro',
        description: (error as Error).message || 'Ocorreu um erro. Tente novamente.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full p-8">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Crie sua Conta</h1>
            <p className="text-gray-400 mt-2">É rápido e fácil.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-sm space-y-4 z-10">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input {...field} type="text" placeholder="Nome Completo" className="w-full pl-4 pr-4 py-3 h-auto bg-transparent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </FormControl>
                    <FormMessage className="text-red-400 pl-2" />
                    </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input {...field} type="email" placeholder="E-mail" className="w-full pl-4 pr-4 py-3 h-auto bg-transparent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </FormControl>
                    <FormMessage className="text-red-400 pl-2" />
                    </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <div className="relative">
                            <Input {...field} type={passwordVisible ? 'text' : 'password'} placeholder="Senha" className="w-full pl-4 pr-10 py-3 h-auto bg-transparent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 flex items-center pr-3 group">
                                {passwordVisible ? <EyeOff className="h-5 w-5 text-gray-400 group-hover:text-white" /> : <Eye className="h-5 w-5 text-gray-400 group-hover:text-white" />}
                            </button>
                        </div>
                    </FormControl>
                    <FormMessage className="text-red-400 pl-2" />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <div className="relative">
                            <Input {...field} type={confirmPasswordVisible ? 'text' : 'password'} placeholder="Confirme a Senha" className="w-full pl-4 pr-10 py-3 h-auto bg-transparent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute inset-y-0 right-0 flex items-center pr-3 group">
                                {confirmPasswordVisible ? <EyeOff className="h-5 w-5 text-gray-400 group-hover:text-white" /> : <Eye className="h-5 w-5 text-gray-400 group-hover:text-white" />}
                            </button>
                        </div>
                    </FormControl>
                    <FormMessage className="text-red-400 pl-2" />
                    </FormItem>
                )}
                />

              <div className="pt-2">
                <Button type="submit" disabled={isSubmitting} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 h-auto px-4 rounded-lg">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Cadastrar'}
                </Button>
              </div>
          </form>
        </Form>
        
        <p className="text-center text-gray-400 text-sm mt-8">
            Já tem uma conta? <button onClick={onSwitchToLogin} className="text-teal-400 hover:text-teal-300 font-medium">Faça login</button>
        </p>
    </div>
  );
}
