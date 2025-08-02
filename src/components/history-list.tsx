'use client';

import type { Delivery, Collection } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PackageOpen, Truck, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';

interface HistoryListProps {
  deliveries: Delivery[];
  collections: Collection[];
  onDeleteDelivery: (id: string) => void;
  onDeleteCollection: (id: string) => void;
}

export function HistoryList({ deliveries, collections, onDeleteDelivery, onDeleteCollection }: HistoryListProps) {
  const combinedHistory = [
    ...deliveries.map((d) => ({ ...d, type: 'delivery' as const })),
    ...collections.map((c) => ({ ...c, type: 'collection' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (combinedHistory.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        <h3 className="text-xl font-semibold text-white">Nenhum registro encontrado.</h3>
        <p>Comece adicionando uma nova entrega ou recolhimento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-white">Histórico de Registros</h2>
       {combinedHistory.map((item) => (
         <Dialog key={item.id}>
          <Card className="bg-slate-800 border-slate-700 text-white flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {item.type === 'delivery' ? (
                  <Truck className="w-6 h-6 text-primary" />
                ) : (
                  <PackageOpen className="w-6 h-6 text-primary" />
                )}
                <span className="truncate">{item.schoolName}</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                {new Date(item.createdAt).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-slate-300">
                <span className="font-semibold">Item:</span> {item.item}
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-semibold">Responsável:</span> {item.responsibleParty}
              </p>
              {item.department && (
                 <p className="text-sm text-slate-300">
                  <span className="font-semibold">Secretaria:</span> {item.department}
                </p>
              )}
              <p className="text-sm text-slate-300">
                <span className="font-semibold">Telefone:</span> {item.phoneNumber}
              </p>
              {item.observations && (
                <p className="text-sm text-slate-300 mt-2 italic">
                  "{item.observations}"
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-4">
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:text-accent">
                  <Eye className="mr-2 h-4 w-4" />
                  Detalhes
                </Button>
              </DialogTrigger>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita. Isso irá excluir permanentemente o registro.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => item.type === 'delivery' ? onDeleteDelivery(item.id) : onDeleteCollection(item.id)}>
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
           <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                 {item.type === 'delivery' ? (
                  <Truck className="w-6 h-6 text-primary" />
                ) : (
                  <PackageOpen className="w-6 h-6 text-primary" />
                )}
                {item.schoolName}
              </DialogTitle>
              <DialogDescription>
                Detalhes do registro de {item.type === 'delivery' ? 'entrega' : 'recolhimento'}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-4">
              <p><span className="font-semibold">Data:</span> {new Date(item.createdAt).toLocaleString('pt-BR')}</p>
              <p><span className="font-semibold">Item:</span> {item.item}</p>
              <p><span className="font-semibold">Responsável:</span> {item.responsibleParty}</p>
              <p><span className="font-semibold">Função:</span> {item.role}</p>
              {item.department && <p><span className="font-semibold">Secretaria:</span> {item.department}</p>}
              <p><span className="font-semibold">Telefone:</span> {item.phoneNumber}</p>
              {item.observations && <p><span className="font-semibold">Observações:</span> {item.observations}</p>}
              {item.photoDataUri && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Foto:</p>
                  <Image
                    src={item.photoDataUri}
                    alt="Foto do registro"
                    width={500}
                    height={500}
                    className="rounded-lg object-contain"
                  />
                </div>
              )}
            </div>
             <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full transition-transform transform hover:scale-105 bg-accent/90 hover:bg-accent text-accent-foreground border-accent">
                  Fechar
                </Button>
            </DialogClose>
          </DialogContent>
         </Dialog>
      ))}
    </div>
  );
}
