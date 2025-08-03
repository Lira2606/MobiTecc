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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Loader2, Home, User, Building, Package, Send, Hash, Truck as TruckIcon, Pencil, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


const formSchema = z.object({
  schoolName: z.string().min(2, { message: 'O nome da escola é obrigatório.' }),
  department: z.string().optional(),
  item: z.string().min(2, { message: 'O nome do insumo é obrigatório.' }),
  sender: z.string().min(2, { message: 'O nome do responsável pelo envio é obrigatório.' }),
  shippingMethod: z.string({ required_error: 'Selecione a forma de envio.' }),
  shippingStatus: z.enum(['Pendente', 'Em trânsito', 'Entregue'], { required_error: 'Selecione o status do envio.' }),
  trackingCode: z.string().optional(),
});

type ShipmentFormValues = z.infer<typeof formSchema>;

const shippingMethodOptions = [
    { value: 'correios', label: 'Correios' },
    { value: 'transportadora', label: 'Transportadora' },
    { value: 'retirada_local', label: 'Retirada Local' },
    { value: 'outros', label: 'Outros' },
];

const shippingStatusOptions = [
  { value: 'Pendente', label: 'Pendente' },
  { value: 'Em trânsito', label: 'Em trânsito' },
  { value: 'Entregue', label: 'Entregue' },
];

interface ShipmentFormProps {
  onSubmit: (data: ShipmentFormValues) => void;
  allSchoolNames: string[];
}

export function ShipmentForm({ onSubmit, allSchoolNames }: ShipmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtherMethodDialogOpen, setIsOtherMethodDialogOpen] = useState(false);
  const [otherShippingMethod, setOtherShippingMethod] = useState('');

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: '',
      department: '',
      item: '',
      sender: '',
      trackingCode: '',
    },
  });

  const handleShippingMethodChange = (value: string) => {
    if (value === 'outros') {
      setIsOtherMethodDialogOpen(true);
    } else {
      form.setValue('shippingMethod', value);
    }
  };

  const handleSaveOtherMethod = () => {
    if (otherShippingMethod.trim() !== '') {
      form.setValue('shippingMethod', otherShippingMethod.trim());
      setIsOtherMethodDialogOpen(false);
    }
  };
  
  const handleClearCustomMethod = () => {
    form.setValue('shippingMethod', '');
  };

  const shippingMethodValue = form.watch('shippingMethod');
  const isCustomMethod = shippingMethodValue && !shippingMethodOptions.some(opt => opt.value === shippingMethodValue);


  const handleSubmit = (data: ShipmentFormValues) => {
    setIsSubmitting(true);
    onSubmit(data);
  };

  return (
    <>
      <div>
        <h2 className="text-3xl font-bold text-white fade-in-up" style={{ animationDelay: '100ms' }}>
          Novo Envio
        </h2>
        <p className="text-gray-400 mt-2 mb-8 fade-in-up" style={{ animationDelay: '200ms' }}>
          Preencha os detalhes para registrar um novo envio de insumos.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className="fade-in-up" style={{ animationDelay: '300ms' }}>
                    <FormControl>
                      <div className="relative">
                        <Building className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <Input placeholder="Secretaria (Opcional)" className="pl-12 h-14 bg-slate-800 border-slate-700" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem className="fade-in-up" style={{ animationDelay: '400ms' }}>
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
                name="item"
                render={({ field }) => (
                  <FormItem className="fade-in-up" style={{ animationDelay: '500ms' }}>
                    <FormControl>
                      <div className="relative">
                        <Package className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <Input placeholder="Insumo (Ex: Projetor)" className="pl-12 h-14 bg-slate-800 border-slate-700" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sender"
                render={({ field }) => (
                  <FormItem className="fade-in-up" style={{ animationDelay: '600ms' }}>
                    <FormControl>
                      <div className="relative">
                        <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <Input placeholder="Responsável pelo Envio" className="pl-12 h-14 bg-slate-800 border-slate-700" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="shippingMethod"
                  render={({ field }) => (
                    <FormItem className="fade-in-up" style={{ animationDelay: '700ms' }}>
                      <FormControl>
                        {isCustomMethod ? (
                          <div className="relative">
                            <TruckIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <Input
                              readOnly
                              value={field.value}
                              className="pl-12 pr-24 h-14 bg-slate-800 border-slate-700 text-white"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-gray-400 hover:text-white"
                                  onClick={() => setIsOtherMethodDialogOpen(true)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                 <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-gray-400 hover:text-red-400"
                                  onClick={handleClearCustomMethod}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <TruckIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                            <Select onValueChange={handleShippingMethodChange} value={field.value}>
                              <SelectTrigger className="pl-12 h-14 bg-slate-800 border-slate-700 data-[placeholder]:text-muted-foreground text-white">
                                <SelectValue placeholder="Forma de Envio" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                {shippingMethodOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="shippingStatus"
                render={({ field }) => (
                  <FormItem className="fade-in-up" style={{ animationDelay: '800ms' }}>
                    <FormControl>
                      <div className="relative">
                        <Send className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <SelectTrigger className="pl-12 h-14 bg-slate-800 border-slate-700 data-[placeholder]:text-muted-foreground text-white">
                            <SelectValue placeholder="Status do Envio" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            {shippingStatusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value as 'Pendente' | 'Em trânsito' | 'Entregue'}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="trackingCode"
                render={({ field }) => (
                  <FormItem className="fade-in-up" style={{ animationDelay: '900ms' }}>
                    <FormControl>
                       <div className="relative">
                        <Hash className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <Input placeholder="Código de Rastreio (Opcional)" className="pl-12 h-14 bg-slate-800 border-slate-700" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

            <div className="pt-4 fade-in-up" style={{ animationDelay: '1000ms' }}>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-500/90 text-white font-bold py-3 h-auto px-4 rounded-lg shadow-lg hover:shadow-primary/50 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-base">
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Registrar Envio'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <AlertDialog open={isOtherMethodDialogOpen} onOpenChange={setIsOtherMethodDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Outra Forma de Envio</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, especifique a forma de envio personalizada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input 
            placeholder="Ex: Entrega por Drone"
            value={otherShippingMethod}
            onChange={(e) => setOtherShippingMethod(e.target.value)}
            className="bg-slate-700 border-slate-600"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              if (!isCustomMethod) form.setValue('shippingMethod', '');
              setIsOtherMethodDialogOpen(false);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveOtherMethod}>
              Salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
