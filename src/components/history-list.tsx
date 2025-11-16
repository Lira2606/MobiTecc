'use client';

import type { Delivery, Collection, Visit, Shipment, HistoryItem } from '@/lib/types';
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
import { PackageOpen, Truck, Trash2, Eye, Cloud, CloudOff, Users, Map, Plane, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo, useRef, createRef, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface HistoryListProps {
  deliveries: Delivery[];
  collections: Collection[];
  visits: Visit[];
  shipments: Shipment[];
  onDeleteDelivery: (id: string) => void;
  onDeleteCollection: (id:string) => void;
  onDeleteVisit: (id:string) => void;
  onDeleteShipment: (id:string) => void;
}

export function HistoryList({ deliveries, collections, visits, shipments, onDeleteDelivery, onDeleteCollection, onDeleteVisit, onDeleteShipment }: HistoryListProps) {
  type FilterType = 'all' | 'delivery' | 'collection' | 'visit' | 'shipment';
  const [filter, setFilter] = useState<FilterType>('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);

  useEffect(() => {
    const savedFilter = localStorage.getItem('history_filter') as FilterType;
    if (savedFilter) {
      setFilter(savedFilter);
    }
  }, []);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    localStorage.setItem('history_filter', newFilter);
  };
  
  const combinedHistory = useMemo(() => [
    ...deliveries.map((d) => ({ ...d, type: 'delivery' as const })),
    ...collections.map((c) => ({ ...c, type: 'collection' as const })),
    ...visits.map((v) => ({ ...v, type: 'visit' as const })),
    ...shipments.map((s) => ({ ...s, type: 'shipment' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [deliveries, collections, visits, shipments]);

  const dialogContentRefs = useMemo(() => combinedHistory.reduce<{[key: string]: React.RefObject<HTMLDivElement>}>((acc, item) => {
    acc[item.id] = createRef<HTMLDivElement>();
    return acc;
  }, {}), [combinedHistory]);

  const filteredHistory = useMemo(() => {
    if (filter === 'all') return combinedHistory;
    return combinedHistory.filter(item => item.type === filter);
  }, [combinedHistory, filter]);

  const handleOpenRouteMap = () => {
    const visitAddresses = visits.map(v => encodeURIComponent(v.schoolAddress));
    if (visitAddresses.length === 0) return;

    const destination = visitAddresses[0];
    const waypoints = visitAddresses.slice(1).join('|');
    
    let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }

    window.open(url, '_blank');
  };

  const handleDownloadPdf = (itemId: string) => {
    const dialogContentRef = dialogContentRefs[itemId];
    if (!dialogContentRef?.current) return;
    setIsGeneratingPdf(itemId);

    html2canvas(dialogContentRef.current, {
      useCORS: true, 
      backgroundColor: '#1e293b',
      onclone: (document) => {
        const images = document.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++) {
          images[i].style.display = 'block';
        }
      }
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`registro-${itemId}.pdf`);
      setIsGeneratingPdf(null);
    }).catch(err => {
      console.error("Erro ao gerar PDF:", err);
      setIsGeneratingPdf(null);
    });
  };

  if (combinedHistory.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        <h3 className="text-xl font-semibold text-white">Nenhum registro encontrado.</h3>
        <p>Comece adicionando um novo registro.</p>
      </div>
    );
  }

  const renderIcon = (type: 'delivery' | 'collection' | 'visit' | 'shipment') => {
    switch (type) {
      case 'delivery':
        return <Truck className="w-6 h-6 text-primary" />;
      case 'collection':
        return <PackageOpen className="w-6 h-6 text-primary" />;
      case 'visit':
        return <Users className="w-6 h-6 text-primary" />;
      case 'shipment':
        return <Plane className="w-6 h-6 text-primary" />;
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
      case 'shipment':
        onDeleteShipment(item.id);
        break;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Histórico de Registros</h2>
        {filter === 'visit' && visits.length > 0 && (
          <Button onClick={handleOpenRouteMap} size="sm" variant="outline" className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border-orange-500/30 hover:text-orange-200">
            <Map className="mr-2 h-4 w-4" /> Ver Rota
          </Button>
        )}
      </div>
       <Tabs value={filter} onValueChange={(value) => handleFilterChange(value as FilterType)} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="delivery">Entregas</TabsTrigger>
          <TabsTrigger value="collection">Recolhas</TabsTrigger>
          <TabsTrigger value="visit">Visitas</TabsTrigger>
          <TabsTrigger value="shipment">Envios</TabsTrigger>
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
                  <span title="Sincronizado"><Cloud className="w-5 h-5 text-green-400" /></span>
                ) : (
                  <span title="Não sincronizado"><CloudOff className="w-5 h-5 text-gray-500" /></span>
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
               {item.type === 'delivery' || item.type === 'collection' ? (
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold">Responsável:</span> {item.responsibleParty}
                  </p>
               ) : item.type === 'shipment' ? (
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold">Remetente:</span> {item.sender}
                  </p>
               ): null}
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
            <div ref={dialogContentRefs[item.id]}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {renderIcon(item.type)}
                  {item.schoolName}
                </DialogTitle>
                <DialogDescription>
                  Detalhes do registro de {item.type === 'delivery' ? 'entrega' : item.type === 'collection' ? 'recolhimento' : item.type === 'visit' ? 'visita' : 'envio'}.
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
                ) : item.type === 'shipment' ? (
                  <>
                    {item.department && <p><span className="font-semibold">Secretaria:</span> {item.department}</p>}
                    <p><span className="font-semibold">Remetente:</span> {item.sender}</p>
                    <p><span className="font-semibold">Item:</span> {item.item}</p>
                    <p><span className="font-semibold">Método de Envio:</span> {item.shippingMethod}</p>
                    <p><span className="font-semibold">Status:</span> {item.shippingStatus}</p>
                    {item.trackingCode && <p><span className="font-semibold">Cód. Rastreio:</span> {item.trackingCode}</p>}
                    {item.photoDataUri && (
                      <div className="mt-4">
                        <p className="font-semibold mb-2">Foto:</p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.photoDataUri}
                          alt="Foto do registro"
                          className="rounded-lg object-contain w-full h-auto"
                        />
                      </div>
                    )}
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.photoDataUri}
                          alt="Foto do registro"
                          className="rounded-lg object-contain w-full h-auto"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <DialogClose asChild>
                  <Button type="button" variant="outline" className="w-full transition-transform transform hover:scale-105 bg-accent hover:bg-accent/90 text-accent-foreground border-accent">
                    Fechar
                  </Button>
              </DialogClose>
              <Button onClick={() => handleDownloadPdf(item.id)} variant="outline" className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30 hover:text-blue-200" disabled={isGeneratingPdf === item.id}>
                {isGeneratingPdf === item.id ? 'Gerando...' : <><Download className="mr-2 h-4 w-4" /> Baixar PDF</>}
              </Button>
            </div>
          </DialogContent>
         </Dialog>
      ))}
      </div>
    </div>
  );
}
