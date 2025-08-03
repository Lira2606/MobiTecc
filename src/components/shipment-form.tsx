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
import { useState, useRef, useEffect } from 'react';
import { Loader2, Home, User, Building, Package, Send, Hash, Truck as TruckIcon, Pencil, X, Camera, Upload, Check, CameraOff } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


const formSchema = z.object({
  schoolName: z.string().min(2, { message: 'O nome da escola é obrigatório.' }),
  department: z.string().optional(),
  sender: z.string().min(2, { message: 'O nome do responsável pelo envio é obrigatório.' }),
  item: z.string().min(2, { message: 'O nome do insumo é obrigatório.' }),
  shippingStatus: z.enum(['Pendente', 'Em trânsito', 'Entregue'], { required_error: 'Selecione o status do envio.' }),
  shippingMethod: z.string({ required_error: 'Selecione a forma de envio.' }),
  trackingCode: z.string().optional(),
  photoDataUri: z.string().optional(),
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
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: '',
      department: '',
      item: '',
      sender: '',
      trackingCode: '',
      photoDataUri: '',
    },
  });

  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      if (!isTakingPhoto) {
         if (videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
          }
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Acesso à câmera negado',
          description: 'Por favor, habilite a permissão da câmera nas configurações do seu navegador.',
        });
        setIsTakingPhoto(false);
      }
    };

    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isTakingPhoto, toast]);

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
    setIsTakingPhoto(false);
  };
  
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvasRef.current.toDataURL('image/jpeg');
        setPhotoPreview(dataUri);
        form.setValue('photoDataUri', dataUri);
        setIsTakingPhoto(false);
      }
    }
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
                name="sender"
                render={({ field }) => (
                  <FormItem className="fade-in-up" style={{ animationDelay: '500ms' }}>
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
                name="item"
                render={({ field }) => (
                  <FormItem className="fade-in-up" style={{ animationDelay: '600ms' }}>
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
                name="shippingStatus"
                render={({ field }) => (
                  <FormItem className="fade-in-up" style={{ animationDelay: '700ms' }}>
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
                  name="shippingMethod"
                  render={({ field }) => (
                    <FormItem className="fade-in-up" style={{ animationDelay: '800ms' }}>
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
               {(shippingMethodValue === 'correios' || shippingMethodValue === 'transportadora') && (
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
               )}
              <div className="fade-in-up" style={{ animationDelay: '900ms' }}>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                    />
                  </FormControl>

                   <canvas ref={canvasRef} className="hidden" />

                  {isTakingPhoto ? (
                      <div className="space-y-4">
                          <video ref={videoRef} className="w-full aspect-video rounded-md bg-slate-800" autoPlay muted />
                          {hasCameraPermission === false && (
                              <Alert variant="destructive">
                                  <CameraOff className="h-4 w-4" />
                                  <AlertTitle>Acesso à câmera negado</AlertTitle>
                                  <AlertDescription>
                                      Habilite a permissão da câmera para tirar fotos.
                                  </AlertDescription>
                              </Alert>
                          )}
                           <div className="grid grid-cols-2 gap-4">
                              <Button type="button" onClick={capturePhoto} disabled={!hasCameraPermission}>
                                  <Check className="mr-2 h-4 w-4" /> Capturar
                              </Button>
                               <Button type="button" variant="outline" onClick={() => setIsTakingPhoto(false)}>
                                  <X className="mr-2 h-4 w-4" /> Cancelar
                              </Button>
                          </div>
                      </div>
                  ) : photoPreview ? (
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
                    <div className="grid grid-cols-2 gap-4">
                      <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex flex-col items-center justify-center p-2 border-2 border-dashed border-primary/20 rounded-lg text-primary hover:bg-primary/10 transition-all"
                      >
                          <Upload className="w-6 h-6 mb-1" />
                          <span className="text-xs font-semibold">Adicionar Foto</span>
                      </button>
                      <button
                          type="button"
                          onClick={() => setIsTakingPhoto(true)}
                          className="w-full flex flex-col items-center justify-center p-2 border-2 border-dashed border-primary/20 rounded-lg text-primary hover:bg-primary/10 transition-all"
                      >
                          <Camera className="w-6 h-6 mb-1" />
                          <span className="text-xs font-semibold">Tirar Foto</span>
                      </button>
                    </div>
                  )}
              </div>

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
