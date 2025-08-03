'use client';

import { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Delivery, Collection, Visit, HistoryItem } from '@/lib/types';
import { DeliveryForm } from './delivery-form';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Truck, PackageOpen, Users, Plane, CheckCircle2, ClipboardList, Bot, ClipboardCopy, Loader2, Send, Map } from 'lucide-react';
import { CollectionForm } from './collection-form';
import { VisitForm } from './visit-form';
import { cn } from '@/lib/utils';
import { Header } from './header';
import { HistoryList } from './history-list';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { generateMessage } from '@/ai/flows/generate-message';
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


export function DeliveryManager() {
  const [activeTab, setActiveTab] = useState<'deliveries' | 'collections' | 'visits' | 'shipments' | 'history'>('deliveries');
  const [deliveries, setDeliveries] = useLocalStorage<Delivery[]>('deliveries', []);
  const [collections, setCollections] = useLocalStorage<Collection[]>('collections', []);
  const [visits, setVisits] = useLocalStorage<Visit[]>('visits', []);
  const [lastItem, setLastItem] = useState<HistoryItem | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { toast } = useToast();
  const isOnline = useOnlineStatus();

  const unsyncedCount = useMemo(() => {
    const unsyncedDeliveries = deliveries.filter(d => !d.synced).length;
    const unsyncedCollections = collections.filter(c => !c.synced).length;
    const unsyncedVisits = visits.filter(v => !v.synced).length;
    return unsyncedDeliveries + unsyncedCollections + unsyncedVisits;
  }, [deliveries, collections, visits]);

  const handleSync = () => {
    if (!isOnline) {
      toast({
        variant: 'destructive',
        title: 'Você está offline!',
        description: 'Conecte-se à internet para salvar os registros.',
      });
      return;
    }

    if (unsyncedCount === 0) {
      toast({
        title: 'Tudo em dia!',
        description: 'Todos os seus registros já estão salvos.',
      });
      return;
    }
    
    // Simulate API call
    toast({
      title: 'Salvando registros...',
      description: `Sincronizando ${unsyncedCount} registro(s).`,
    });

    setTimeout(() => {
      setDeliveries(prev => prev.map(d => ({ ...d, synced: true })));
      setCollections(prev => prev.map(c => ({ ...c, synced: true })));
      setVisits(prev => prev.map(v => ({...v, synced: true})));
      toast({
        title: 'Sucesso!',
        description: 'Todos os registros foram salvos na nuvem.',
      });
    }, 1500);
  };


  const handleAddDelivery = (newDeliveryData: Omit<Delivery, 'id' | 'createdAt' | 'synced' | 'type'>) => {
    const newDelivery: Delivery = {
      ...newDeliveryData,
      id: new Date().toISOString() + Math.random(),
      createdAt: new Date().toISOString(),
      synced: isOnline,
      type: 'delivery',
    };
    setDeliveries(prev => [newDelivery, ...prev]);
    setLastItem(newDelivery);
    setShowSuccess(true);
  };

  const handleAddCollection = (newCollectionData: Omit<Collection, 'id' | 'createdAt' | 'synced' | 'type'>) => {
    const newCollection: Collection = {
      ...newCollectionData,
      id: new Date().toISOString() + Math.random(),
      createdAt: new Date().toISOString(),
      synced: isOnline,
      type: 'collection',
    };
    setCollections(prev => [newCollection, ...prev]);
    setLastItem(newCollection);
    setShowSuccess(true);
  };
  
  const handleAddVisit = (newVisitData: Omit<Visit, 'id' | 'createdAt' | 'synced' | 'type'>) => {
    const newVisit: Visit = {
      ...newVisitData,
      id: new Date().toISOString() + Math.random(),
      createdAt: new Date().toISOString(),
      synced: isOnline,
      type: 'visit',
    };
    setVisits(prev => [newVisit, ...prev]);
    setLastItem(newVisit);
    setShowSuccess(true);
  };

  const handleDeleteDelivery = (id: string) => {
    setDeliveries(prev => prev.filter(d => d.id !== id));
    toast({ title: "Entrega excluída com sucesso!" });
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    toast({ title: "Recolhimento excluído com sucesso!" });
  };
  
  const handleDeleteVisit = (id: string) => {
    setVisits(prev => prev.filter(v => v.id !== id));
    toast({ title: "Visita excluída com sucesso!" });
  };


  const allSchoolNames = useMemo(() => {
    const deliverySchools = deliveries.map(d => d.schoolName);
    const collectionSchools = collections.map(c => c.schoolName);
    const visitSchools = visits.map(v => v.schoolName);
    return [...new Set([...deliverySchools, ...collectionSchools, ...visitSchools])];
  }, [deliveries, collections, visits]);
  
  const resetForm = () => {
    setShowSuccess(false);
    setLastItem(null);
  }

  const renderContent = () => {
    if (showSuccess && lastItem) {
      return <SuccessScreen onNewRecord={resetForm} lastItem={lastItem} />;
    }

    switch (activeTab) {
      case 'deliveries':
        return <DeliveryForm onSubmit={handleAddDelivery} allSchoolNames={allSchoolNames} />;
      case 'collections':
        return <CollectionForm onSubmit={handleAddCollection} allSchoolNames={allSchoolNames} />;
      case 'visits':
        return <VisitForm onSubmit={handleAddVisit} allSchoolNames={allSchoolNames} />;
      case 'shipments':
        return <div className="text-white text-center mt-10">Envios - Em breve</div>;
      case 'history':
        return <HistoryList 
                  deliveries={deliveries} 
                  collections={collections} 
                  visits={visits}
                  onDeleteDelivery={handleDeleteDelivery} 
                  onDeleteCollection={handleDeleteCollection} 
                  onDeleteVisit={handleDeleteVisit}
                />;
      default:
        return null;
    }
  }

  const getButtonClass = (tabName: 'deliveries' | 'collections' | 'visits' | 'shipments' | 'history') => {
    return cn(
      "flex flex-col items-center transition-transform duration-200 nav-link",
       activeTab === tabName ? 'text-green-400' : 'text-white'
    );
  };

  return (
    <div className="flex flex-col flex-grow h-full">
        <Header 
          unsyncedCount={unsyncedCount}
          onSync={handleSync}
          isOnline={isOnline}
        />
        <main className="flex-grow p-6 overflow-y-auto transition-all duration-500 no-scrollbar">
            {renderContent()}
        </main>
        
        <nav className="glassmorphism flex justify-around items-center p-3 mt-auto w-full z-10">
            <button onClick={() => { setActiveTab('deliveries'); resetForm(); }} className={getButtonClass('deliveries')}>
                <Truck className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Entregas</span>
            </button>
            <button onClick={() => { setActiveTab('collections'); resetForm(); }} className={getButtonClass('collections')}>
                <PackageOpen className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Recolhimentos</span>
            </button>
            <button onClick={() => { setActiveTab('visits'); resetForm(); }} className={getButtonClass('visits')}>
                <Users className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Visitas</span>
            </button>
            <button onClick={() => { setActiveTab('shipments'); resetForm(); }} className={getButtonClass('shipments')}>
                <Plane className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Envios</span>
            </button>
             <button onClick={() => { setActiveTab('history'); resetForm(); }} className={getButtonClass('history')}>
                <ClipboardList className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Registros</span>
            </button>
        </nav>
    </div>
  );
}


function SuccessScreen({ onNewRecord, lastItem }: { onNewRecord: () => void, lastItem: HistoryItem }) {
    const { toast } = useToast();
    const [generatedContent, setGeneratedContent] = useState('');
    const [telegramLink, setTelegramLink] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleGenerateMessage = async () => {
        if (lastItem.type === 'visit') {
            toast({
                variant: 'destructive',
                title: 'Ação não disponível',
                description: 'Não é possível gerar mensagem para registros de visita.',
            });
            return;
        }

        setIsGenerating(true);
        setTelegramLink('');
        
        try {
            const result = await generateMessage({
                type: lastItem.type,
                responsibleParty: lastItem.responsibleParty,
                item: lastItem.item,
                schoolName: lastItem.schoolName,
            });
            setGeneratedContent(result.message);
            if (result.telegramLink) {
                setTelegramLink(result.telegramLink);
            }
            setDialogOpen(true);
        } catch (error) {
            console.error('Error generating content:', error);
            toast({
                variant: 'destructive',
                title: 'Erro ao gerar conteúdo',
                description: 'Não foi possível se conectar à IA. Tente novamente.',
            });
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generatedContent);
        toast({
            title: 'Copiado!',
            description: 'O conteúdo foi copiado para a área de transferência.',
        });
    };

    const handleOpenMap = () => {
      if (lastItem.type !== 'visit') return;
      const address = encodeURIComponent(lastItem.schoolAddress);
      const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
      window.open(url, '_blank');
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 fade-in-up">
                    <CheckCircle2 className="w-16 h-16 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 fade-in-up" style={{animationDelay: '100ms'}}>Registrado!</h2>
                <p className="text-gray-400 text-center mb-4 fade-in-up" style={{animationDelay: '200ms'}}>Os detalhes foram guardados com sucesso.</p>
                <div className="w-full space-y-3 mt-4 fade-in-up" style={{animationDelay: '300ms'}}>
                    <Button onClick={handleGenerateMessage} disabled={isGenerating || lastItem.type === 'visit'} variant="outline" className="w-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/30 hover:text-sky-200">
                         {isGenerating ? <Loader2 className="animate-spin" /> : '✨ Gerar Mensagem'}
                    </Button>
                    {lastItem.type === 'visit' && (
                       <Button onClick={handleOpenMap} variant="outline" className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border-orange-500/30 hover:text-orange-200">
                         <Map className="mr-2"/> Ver no Mapa
                      </Button>
                    )}
                </div>
                <Button onClick={onNewRecord} className="mt-6 bg-slate-700 hover:bg-slate-600 text-white font-bold fade-in-up" style={{animationDelay: '400ms'}}>
                    Novo Registro
                </Button>
            </div>

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                           <Bot className="text-primary" /> Mensagem Gerada
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Abaixo está o conteúdo gerado pela IA. Você pode copiá-lo para usar onde precisar.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4 p-4 bg-slate-700/50 rounded-md text-sm text-slate-200 whitespace-pre-wrap">
                        {generatedContent}
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleCopyToClipboard}>
                            <ClipboardCopy className="mr-2" /> Copiar
                        </AlertDialogAction>
                        {telegramLink && (
                            <AlertDialogAction asChild>
                               <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30">
                                    <Send className="mr-2"/> Enviar via Telegram
                                </a>
                            </AlertDialogAction>
                        )}
                        <AlertDialogCancel>Fechar</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
