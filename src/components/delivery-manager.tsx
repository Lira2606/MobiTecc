'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useOnlineStatus } from '@/hooks/use-online-status';
import type { Delivery, Collection } from '@/lib/types';
import { DeliveryForm } from './delivery-form';
import { DeliveryList } from './delivery-list';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { CloudUpload, Truck, PackageOpen, User, Briefcase, Users, Plane } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollectionForm } from './collection-form';
import { CollectionList } from './collection-list';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';


export function DeliveryManager() {
  const [activeTab, setActiveTab] = useState<'deliveries' | 'collections' | 'visits' | 'shipments'>('deliveries');
  const [deliveries, setDeliveries] = useLocalStorage<Delivery[]>('deliveries', []);
  const [collections, setCollections] = useLocalStorage<Collection[]>('collections', []);
  const [isSyncing, setIsSyncing] = useState(false);
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  const handleAddDelivery = (newDeliveryData: Omit<Delivery, 'id' | 'createdAt' | 'synced'>) => {
    const newDelivery: Delivery = {
      ...newDeliveryData,
      id: new Date().toISOString() + Math.random(),
      createdAt: new Date().toISOString(),
      synced: false,
    };
    setDeliveries(prev => [newDelivery, ...prev]);
    toast({
      title: 'Entrega Registrada',
      description: 'A entrega foi salva localmente.',
    });
  };

  const handleAddCollection = (newCollectionData: Omit<Collection, 'id' | 'createdAt' | 'synced'>) => {
    const newCollection: Collection = {
      ...newCollectionData,
      id: new Date().toISOString() + Math.random(),
      createdAt: new Date().toISOString(),
      synced: false,
    };
    setCollections(prev => [newCollection, ...prev]);
    toast({
      title: 'Recolhimento Registrado',
      description: 'O recolhimento foi salvo localmente.',
    });
  };

  const syncPendingData = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    const pendingDeliveries = deliveries.filter(d => !d.synced);
    const pendingCollections = collections.filter(c => !c.synced);

    if (pendingDeliveries.length === 0 && pendingCollections.length === 0) return;

    setIsSyncing(true);
    toast({
      title: 'Sincronizando...',
      description: `Sincronizando ${pendingDeliveries.length + pendingCollections.length} item(ns).`,
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setDeliveries(prev => prev.map(d => ({ ...d, synced: true })));
    setCollections(prev => prev.map(c => ({ ...c, synced: true })));

    setIsSyncing(false);
    toast({
      title: 'Sincronização Completa!',
      description: 'Todos os itens foram sincronizados.',
      variant: 'default',
      className: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
    });
  }, [isOnline, deliveries, collections, setDeliveries, setCollections, toast, isSyncing]);

  useEffect(() => {
    if (isOnline) {
      syncPendingData();
    }
  }, [isOnline, syncPendingData]);

  const pendingDeliveriesCount = deliveries.filter(d => !d.synced).length;
  const pendingCollectionsCount = collections.filter(c => !c.synced).length;
  const pendingCount = pendingDeliveriesCount + pendingCollectionsCount;
  const allSchoolNames = useMemo(() => {
    const deliverySchools = deliveries.map(d => d.schoolName);
    const collectionSchools = collections.map(c => c.schoolName);
    return [...new Set([...deliverySchools, ...collectionSchools])];
  }, [deliveries, collections]);


  return (
    <div className="pb-24 md:pb-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'deliveries' | 'collections' | 'visits' | 'shipments')} className="space-y-6">
        <div className="hidden md:flex justify-center">
            <TabsList className="hidden">
            <TabsTrigger value="deliveries">Entregas</TabsTrigger>
            <TabsTrigger value="collections">Recolhimentos</TabsTrigger>
            <TabsTrigger value="visits">Visitas</TabsTrigger>
            <TabsTrigger value="shipments">Envios</TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="deliveries" className="space-y-6 mt-0">
            <DeliveryForm onSubmit={handleAddDelivery} allSchoolNames={allSchoolNames} />
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground px-1 tracking-tight">Entregas Recentes</h2>
              <DeliveryList deliveries={deliveries} />
            </div>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6 mt-0">
            <CollectionForm onSubmit={handleAddCollection} allSchoolNames={allSchoolNames} />
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground px-1 tracking-tight">Recolhimentos Recentes</h2>
              <CollectionList collections={collections} />
            </div>
        </TabsContent>
        
        <TabsContent value="visits" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Visitas</CardTitle>
              <CardDescription>Esta funcionalidade está em desenvolvimento.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Volte em breve para conferir as novidades.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Envios</CardTitle>
              <CardDescription>Esta funcionalidade está em desenvolvimento.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Volte em breve para conferir as novidades.</p>
            </CardContent>
          </Card>
        </TabsContent>

        </Tabs>


       {isOnline && pendingCount > 0 && (
          <div className="fixed bottom-24 md:bottom-6 right-6 z-50">
            <Button onClick={syncPendingData} disabled={isSyncing} className="rounded-full shadow-lg">
              <CloudUpload className="mr-2 h-4 w-4" />
              {isSyncing ? 'Sincronizando...' : `Sincronizar ${pendingCount}`}
            </Button>
          </div>
        )}

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
            <div className="flex justify-around items-center h-16">
                <button
                    onClick={() => setActiveTab('deliveries')}
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors gap-1",
                        activeTab === 'deliveries' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    )}
                >
                    <Truck className="h-5 w-5" />
                    Entregas
                </button>
                <button
                    onClick={() => setActiveTab('collections')}
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors gap-1",
                        activeTab === 'collections' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    )}
                >
                    <PackageOpen className="h-5 w-5" />
                     Recolhimentos
                </button>
                 <button
                    onClick={() => setActiveTab('visits')}
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors gap-1",
                        activeTab === 'visits' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    )}
                >
                    <Users className="h-5 w-5" />
                     Visitas
                </button>
                 <button
                    onClick={() => setActiveTab('shipments')}
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors gap-1",
                        activeTab === 'shipments' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    )}
                >
                    <Plane className="h-5 w-5" />
                     Envios
                </button>
            </div>
        </div>
    </div>
  );
}
