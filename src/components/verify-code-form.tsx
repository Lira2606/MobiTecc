'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  code: z.string().length(6, { message: 'O código deve ter 6 dígitos.' }),
});

type VerifyCodeFormValues = z.infer<typeof formSchema>;

export function VerifyCodeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmVerificationCode } = useAuth(); // Função será criada no próximo passo
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  });

  const handleSubmit = async (data: VerifyCodeFormValues) => {
    setIsSubmitting(true);
    try {
      await confirmVerificationCode(data.code);
      toast({
        title: 'Código Verificado',
        description: 'Você já pode criar uma nova senha.',
      });
      // Redireciona para a página de redefinição de senha
      router.push('/reset-password');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Código Inválido',
        description: (error as Error).message || 'O código inserido é inválido. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full p-8 bg-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Verificar Código</h1>
        <p className="text-gray-400 mt-2">Insira o código de 6 dígitos que você recebeu por SMS.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-sm space-y-4 z-10">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="text" placeholder="_ _ _ _ _ _" maxLength={6} className="w-full pl-4 pr-4 py-3 h-auto bg-transparent rounded-lg text-white text-center tracking-[1em] text-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </FormControl>
                <FormMessage className="text-red-400 pl-2" />
              </FormItem>
            )}
          />
          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 h-auto px-4 rounded-lg">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Verificar Código'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
