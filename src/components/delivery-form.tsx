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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import { Loader2, Camera, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';


const formSchema = z.object({
  schoolName: z.string().min(2, { message: 'O nome da escola é obrigatório.' }),
  responsibleParty: z.string().min(2, { message: 'O nome do responsável é obrigatório.' }),
  role: z.string().min(2, { message: 'A função é obrigatória.' }),
  phoneNumber: z.string().min(8, { message: 'O número de telefone é obrigatório.' }),
  observations: z.string().optional(),
  photoDataUri: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof formSchema>;

interface DeliveryFormProps {
  onSubmit: (data: DeliveryFormValues) => void;
  allSchoolNames: string[];
}

export function DeliveryForm({ onSubmit }: DeliveryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    if (showCamera) {
      getCameraPermission();
    }
     return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showCamera]);
  
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

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPhotoDataUri(dataUri);
        form.setValue('photoDataUri', dataUri);
        setShowCamera(false);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setPhotoDataUri(dataUri);
        form.setValue('photoDataUri', dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (data: DeliveryFormValues) => {
    setIsSubmitting(true);
    onSubmit(data);
    form.reset();
    setPhotoDataUri(null);
    setShowCamera(false);
    setTimeout(() => setIsSubmitting(false), 1000);
  };
  
  const handleClearPhoto = () => {
    setPhotoDataUri(null);
    form.setValue('photoDataUri', undefined);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Nova Entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Escola</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome da escola" {...field} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="responsibleParty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome de quem recebeu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Professor(a), Coordenador(a)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(XX) XXXXX-XXXX" {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </div>
            
            <FormItem>
              <FormLabel>Foto</FormLabel>
              <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden"
                />
              <div className="space-y-4">
                 {hasCameraPermission === false && showCamera && (
                    <Alert variant="destructive">
                      <AlertTitle>Câmera não disponível</AlertTitle>
                      <AlertDescription>
                        Não foi possível acessar a câmera. Por favor, verifique as permissões no seu navegador.
                      </AlertDescription>
                    </Alert>
                  )}
                {photoDataUri ? (
                  <div className="relative group">
                    <Image src={photoDataUri} alt="Foto da entrega" width={400} height={300} className="rounded-md w-full object-cover" />
                    <Button type="button" variant="destructive" size="icon" onClick={handleClearPhoto} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 />
                    </Button>
                  </div>
                ) : (
                  <>
                  {showCamera ? (
                     <>
                      <div className="w-full bg-muted rounded-md overflow-hidden aspect-video relative">
                          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" onClick={handleCapture} className="w-full md:w-auto">
                          <Camera className="mr-2" /> Capturar Foto
                        </Button>
                         <Button type="button" variant="secondary" onClick={() => setShowCamera(false)} className="w-full md:w-auto">
                           Cancelar
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
                        <Upload className="mr-2" /> Selecionar Arquivo
                      </Button>
                      <Button type="button" variant="outline" size="icon" onClick={() => setShowCamera(true)} className="w-full sm:w-auto">
                          <Camera />
                      </Button>
                    </div>
                  )}
                  </>
                )}
              </div>
            </FormItem>

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Alguma observação adicional?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto" size="lg">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrar Entrega
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
