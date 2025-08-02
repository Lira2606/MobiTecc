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
import { useState, useRef } from 'react';
import { Loader2, Home, User, Briefcase, Phone, Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const formSchema = z.object({
  schoolName: z.string().min(2, { message: 'O nome da escola é obrigatório.' }),
  responsibleParty: z.string().min(2, { message: 'O nome do responsável é obrigatório.' }),
  role: z.string().min(2, { message: 'A função é obrigatória.' }),
  phoneNumber: z.string().min(10, { message: 'O número de telefone é obrigatório.' }),
  observations: z.string().optional(),
  photoDataUri: z.string().optional(),
});

type CollectionFormValues = z.infer<typeof formSchema>;

interface CollectionFormProps {
  onSubmit: (data: CollectionFormValues) => void;
  allSchoolNames: string[];
}

export function CollectionForm({ onSubmit }: CollectionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<CollectionFormValues>({
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

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPhotoPreview(dataUri);
        form.setValue('photoDataUri', dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setPhotoPreview(null);
    form.setValue('photoDataUri', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (data: CollectionFormValues) => {
    setIsSubmitting(true);
    onSubmit(data);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-white fade-in-up" style={{ animationDelay: '100ms' }}>
        Novo Recolhimento
      </h2>
      <p className="text-gray-400 mt-2 mb-8 fade-in-up" style={{ animationDelay: '200ms' }}>
        Preencha os detalhes para registrar um recolhimento.
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
                      id="schoolNameCol"
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
                      id="responsiblePartyCol"
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
                      id="roleCol"
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
                      id="phoneNumberCol"
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

            <div className="fade-in-up" style={{ animationDelay: '700ms' }}>
                <FormControl>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                  />
                </FormControl>
                {photoPreview ? (
                  <div className="relative group mx-auto w-fit">
                    <Image
                      src={photoPreview}
                      alt="Pré-visualização"
                      width={200}
                      height={200}
                      className="max-h-48 w-auto rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearPhoto}
                      className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/75 transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Remover foto"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#334155] rounded-lg text-gray-400 hover:bg-[#1e293b] hover:border-teal-500 transition-all"
                  >
                    <Camera className="w-8 h-8 mb-2" />
                    <span className="text-sm font-semibold">Adicionar Foto</span>
                  </button>
                )}
            </div>

          <div className="pt-4 fade-in-up" style={{ animationDelay: '800ms' }}>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white font-bold py-3 h-auto px-4 rounded-lg shadow-lg hover:shadow-teal-500/50 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-base">
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Registrar Recolhimento'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

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
