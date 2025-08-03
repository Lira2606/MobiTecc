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
import { Loader2, Home, MapPin } from 'lucide-react';

const formSchema = z.object({
  schoolName: z.string().min(2, { message: 'O nome da escola é obrigatório.' }),
  schoolAddress: z.string().min(5, { message: 'O endereço da escola é obrigatório.' }),
});

type VisitFormValues = z.infer<typeof formSchema>;

interface VisitFormProps {
  onSubmit: (data: VisitFormValues) => void;
  allSchoolNames: string[];
}

export function VisitForm({ onSubmit }: VisitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: '',
      schoolAddress: '',
    },
  });

  const handleSubmit = (data: VisitFormValues) => {
    setIsSubmitting(true);
    onSubmit(data);
  };

  return (
    <>
      <div>
        <h2 className="text-3xl font-bold text-white fade-in-up" style={{ animationDelay: '100ms' }}>
          Registrar Visita
        </h2>
        <p className="text-gray-400 mt-2 mb-8 fade-in-up" style={{ animationDelay: '200ms' }}>
          Preencha os detalhes para agendar uma visita.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem className="fade-in-up" style={{ animationDelay: '300ms' }}>
                    <FormControl>
                      <div className="relative">
                        <Home className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <Input placeholder="Nome da Escola" className="pl-12 h-14 bg-slate-800 border-slate-700" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolAddress"
                render={({ field }) => (
                  <FormItem className="fade-in-up" style={{ animationDelay: '400ms' }}>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <Input placeholder="Endereço da Escola" className="pl-12 h-14 bg-slate-800 border-slate-700" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

            <div className="pt-4 fade-in-up" style={{ animationDelay: '500ms' }}>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-500/90 text-white font-bold py-3 h-auto px-4 rounded-lg shadow-lg hover:shadow-primary/50 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-base">
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Registrar Visita'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
