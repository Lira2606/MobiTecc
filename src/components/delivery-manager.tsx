'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useOnlineStatus } from '@/hooks/use-online-status';
import type { Delivery, Collection } from '@/lib/types';
import { DeliveryForm } from './delivery-form';
import { DeliveryList } from './delivery-list';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { CloudUpload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollectionForm } from './collection-form';
import { CollectionList } from './collection-list';

export function DeliveryManager() {
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
      description: 'Sua entrega foi salva localmente e será sincronizada em breve.',
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
      description: 'Seu recolhimento foi salvo localmente e será sincronizado em breve.',
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
      description: `Sincronizando ${pendingDeliveries.length} entrega(s) e ${pendingCollections.length} recolhimento(s).`,
    });

    // Simulate network requests for deliveries
    if (pendingDeliveries.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 400 * pendingDeliveries.length));
      console.log(`Simulating sync for ${pendingDeliveries.length} deliveries`);
      setDeliveries(prev =>
        prev.map(d => (pendingDeliveries.find(pd => pd.id === d.id) ? { ...d, synced: true } : d))
      );
    }
    
    // Simulate network requests for collections
    if (pendingCollections.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 400 * pendingCollections.length));
      console.log(`Simulating sync for ${pendingCollections.length} collections`);
      setCollections(prev =>
          prev.map(c => (pendingCollections.find(pc => pc.id === c.id) ? { ...c, synced: true } : c))
      );
    }

    setIsSyncing(false);
    toast({
      title: 'Sincronização Completa!',
      description: `${pendingDeliveries.length + pendingCollections.length} item(ns) foram sincronizados.`,
      variant: 'default',
      className: 'bg-accent text-accent-foreground',
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
    <Tabs defaultValue="deliveries" className="space-y-8">
      <div className="flex justify-center">
        <TabsList>
          <TabsTrigger value="deliveries">Entregas</TabsTrigger>
          <TabsTrigger value="collections">Recolhimentos</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="deliveries" className="space-y-8">
        <DeliveryForm onSubmit={handleAddDelivery} allSchoolNames={allSchoolNames} />
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold font-headline">Entregas Recentes</h2>
          </div>
          <DeliveryList deliveries={deliveries} />
        </div>
      </TabsContent>

      <TabsContent value="collections" className="space-y-8">
        <CollectionForm onSubmit={handleAddCollection} allSchoolNames={allSchoolNames} />
         <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold font-headline">Recolhimentos Recentes</h2>
          </div>
          <CollectionList collections={collections} />
        </div>
      </TabsContent>

       {isOnline && pendingCount > 0 && (
          <div className="fixed bottom-4 right-4 z-50">
            <Button onClick={syncPendingData} disabled={isSyncing} size="lg" className="shadow-lg">
              <CloudUpload className="mr-2 h-5 w-5" />
              {isSyncing ? 'Sincronizando...' : `Sincronizar ${pendingCount} item(ns)`}
            </Button>
          </div>
        )}
    </Tabs>
  );
}
