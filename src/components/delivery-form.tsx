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
import { useState } from 'react';
import { Loader2, Home, User, Briefcase, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  schoolName: z.string().min(2, { message: 'O nome da escola é obrigatório.' }),
  responsibleParty: z.string().min(2, { message: 'O nome do responsável é obrigatório.' }),
  role: z.string().min(2, { message: 'A função é obrigatória.' }),
  phoneNumber: z.string().min(10, { message: 'O número de telefone é obrigatório.' }),
  observations: z.string().optional(),
  photoDataUri: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof formSchema>;

interface DeliveryFormProps {
  onSubmit: (data: DeliveryFormValues) => void;
  allSchoolNames: string[];
}

export function DeliveryForm({ onSubmit, allSchoolNames }: DeliveryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: '',
      responsibleParty: '',
      role: '',
      phoneNumber: '',
      observations: '',
      photoDataUri: '',
    },
  });

  const handleSubmit = (data: DeliveryFormValues) => {
    setIsSubmitting(true);
    onSubmit(data);
    // No form reset here, parent component will handle state change
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-white fade-in-up" style={{ animationDelay: '100ms' }}>
        Nova Entrega
      </h2>
      <p className="text-gray-400 mt-2 mb-8 fade-in-up" style={{ animationDelay: '200ms' }}>
        Preencha os detalhes para registrar uma entrega.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem className="fade-in-up" style={{ animationDelay: '300ms' }}>
                  <FormControl>
                    <FloatingLabelInput
                      id="schoolName"
                      label="Nome da Escola"
                      icon={<Home className="w-5 h-5 text-gray-400" />}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responsibleParty"
              render={({ field }) => (
                <FormItem className="fade-in-up" style={{ animationDelay: '400ms' }}>
                  <FormControl>
                    <FloatingLabelInput
                      id="responsibleParty"
                      label="Nome do Responsável"
                      icon={<User className="w-5 h-5 text-gray-400" />}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="fade-in-up" style={{ animationDelay: '500ms' }}>
                  <FormControl>
                    <FloatingLabelInput
                      id="role"
                      label="Função (Ex: Professor)"
                      icon={<Briefcase className="w-5 h-5 text-gray-400" />}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="fade-in-up" style={{ animationDelay: '600ms' }}>
                  <FormControl>
                    <FloatingLabelInput
                      id="phoneNumber"
                      label="(XX) XXXXX-XXXX"
                      type="tel"
                      icon={<Phone className="w-5 h-5 text-gray-400" />}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

          <div className="pt-4 fade-in-up" style={{ animationDelay: '700ms' }}>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white font-bold py-3 h-auto px-4 rounded-lg shadow-lg hover:shadow-teal-500/50 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-base">
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Registrar Entrega'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

// Reusable FloatingLabelInput component
function FloatingLabelInput({ id, label, type = 'text', icon, ...props }: { id: string, label: string, type?: string, icon: React.ReactNode, [key: string]: any }) {
  return (
    <div className="form-group relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {icon}
        </div>
        <input 
            id={id}
            type={type}
            className="form-input w-full p-4 pl-12 bg-[#1e293b] border border-[#334155] text-white rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 peer h-14"
            placeholder=" " 
            {...props}
        />
        <label 
            htmlFor={id} 
            className="form-label absolute left-12 top-4 text-gray-400 pointer-events-none transition-all duration-200 ease-in-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-teal-400 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-teal-400"
        >
            {label}
        </label>
    </div>
  )
}
