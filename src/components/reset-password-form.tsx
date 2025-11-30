'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  password: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'], // Mostra o erro no campo de confirmação de senha
});

type ResetPasswordFormValues = z.infer<typeof formSchema>;

export function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('password_reset_token');
    if (!token) {
      toast({ 
        variant: 'destructive',
        title: 'Acesso Negado', 
        description: 'Você precisa verificar seu número de telefone primeiro.' 
      });
      router.push('/login');
    }
  }, [router, toast]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      // Aqui você implementaria a lógica para atualizar a senha do usuário no seu backend.
      // Como estamos usando uma autenticação simulada, vamos apenas mostrar um sucesso.
      console.log('Nova senha definida:', data.password);

      // Limpa o token de redefinição de senha e redireciona
      localStorage.removeItem('password_reset_token');
      
      toast({
        title: 'Senha Redefinida com Sucesso',
        description: 'Sua senha foi alterada. Você já pode fazer login.',
      });

      router.push('/login');

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha na Redefinição',
        description: (error as Error).message || 'Ocorreu um erro. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full p-8 bg-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Criar Nova Senha</h1>
        <p className="text-gray-400 mt-2">Escolha uma nova senha para sua conta.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-sm space-y-4 z-10">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="password" placeholder="Nova Senha" className="w-full pl-4 pr-4 py-3 h-auto bg-transparent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
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
                  <Input {...field} type="password" placeholder="Confirmar Senha" className="w-full pl-4 pr-4 py-3 h-auto bg-transparent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </FormControl>
                <FormMessage className="text-red-400 pl-2" />
              </FormItem>
            )}
          />
          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 h-auto px-4 rounded-lg">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Salvar Nova Senha'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
