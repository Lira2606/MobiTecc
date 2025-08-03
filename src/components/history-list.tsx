'use client';

import type { Delivery, Collection, Visit, HistoryItem } from '@/lib/types';
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
import { PackageOpen, Truck, Trash2, Eye, Cloud, CloudOff, Users } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


interface HistoryListProps {
  deliveries: Delivery[];
  collections: Collection[];
  visits: Visit[];
  onDeleteDelivery: (id: string) => void;
  onDeleteCollection: (id:string) => void;
  onDeleteVisit: (id:string) => void;
}

export function HistoryList({ deliveries, collections, visits, onDeleteDelivery, onDeleteCollection, onDeleteVisit }: HistoryListProps) {
  const [filter, setFilter] = useState<'all' | 'delivery' | 'collection' | 'visit'>('all');
  
  const combinedHistory = useMemo(() => [
    ...deliveries.map((d) => ({ ...d, type: 'delivery' as const })),
    ...collections.map((c) => ({ ...c, type: 'collection' as const })),
    ...visits.map((v) => ({ ...v, type: 'visit' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [deliveries, collections, visits]);

  const filteredHistory = useMemo(() => {
    if (filter === 'all') return combinedHistory;
    return combinedHistory.filter(item => item.type === filter);
  }, [combinedHistory, filter]);


  if (combinedHistory.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        <h3 className="text-xl font-semibold text-white">Nenhum registro encontrado.</h3>
        <p>Comece adicionando um novo registro.</p>
      </div>
    );
  }

  const renderIcon = (type: 'delivery' | 'collection' | 'visit') => {
    switch (type) {
      case 'delivery':
        return <Truck className="w-6 h-6 text-primary" />;
      case 'collection':
        return <PackageOpen className="w-6 h-6 text-primary" />;
      case 'visit':
        return <Users className="w-6 h-6 text-primary" />;
    }
  }

  const handleDelete = (item: HistoryItem) => {
    switch (item.type) {
      case 'delivery':
        onDeleteDelivery(item.id);
        break;
      case 'collection':
        onDeleteCollection(item.id);
        break;
      case 'visit':
        onDeleteVisit(item.id);
        break;
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-white">Histórico de Registros</h2>
       <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="delivery">Entregas</TabsTrigger>
          <TabsTrigger value="collection">Recolha</TabsTrigger>
          <TabsTrigger value="visit">Visitas</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="space-y-4 pt-4">
       {filteredHistory.map((item) => (
         <Dialog key={item.id}>
          <Card className="bg-slate-800 border-slate-700 text-white flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {renderIcon(item.type)}
                <span className="truncate flex-1">{item.schoolName}</span>
                 {item.synced ? (
                  <Cloud className="w-5 h-5 text-green-400" title="Sincronizado" />
                ) : (
                  <CloudOff className="w-5 h-5 text-gray-500" title="Não sincronizado" />
                )}
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
               {item.type !== 'visit' && 'item' in item && (
                 <p className="text-sm text-slate-300">
                  <span className="font-semibold">Item:</span> {item.item}
                </p>
               )}
               {item.type !== 'visit' && 'responsibleParty' in item && (
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold">Responsável:</span> {item.responsibleParty}
                  </p>
               )}
               {item.type === 'visit' && 'schoolAddress' in item && (
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold">Endereço:</span> {item.schoolAddress}
                  </p>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-4">
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground text-white">
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
                    <AlertDialogAction onClick={() => handleDelete(item)}>
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
                 {renderIcon(item.type)}
                {item.schoolName}
              </DialogTitle>
              <DialogDescription>
                Detalhes do registro de {item.type === 'delivery' ? 'entrega' : item.type === 'collection' ? 'recolhimento' : 'visita'}.
                 <span className={cn('ml-2 text-xs font-bold', item.synced ? 'text-green-400' : 'text-gray-500')}>
                  ({item.synced ? 'Salvo na nuvem' : 'Pendente de envio'})
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-4">
              <p><span className="font-semibold">Data:</span> {new Date(item.createdAt).toLocaleString('pt-BR')}</p>
              {item.type === 'visit' ? (
                <>
                  {item.inep && <p><span className="font-semibold">INEP:</span> {item.inep}</p>}
                  <p><span className="font-semibold">Endereço:</span> {item.schoolAddress}</p>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
             <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full transition-transform transform hover:scale-105 bg-accent hover:bg-accent/90 text-accent-foreground border-accent">
                  Fechar
                </Button>
            </DialogClose>
          </DialogContent>
         </Dialog>
      ))}
      </div>
    </div>
  );
}
