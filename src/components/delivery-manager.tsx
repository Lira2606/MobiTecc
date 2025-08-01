'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useOnlineStatus } from '@/hooks/use-online-status';
import type { Delivery } from '@/lib/types';
import { DeliveryForm } from './delivery-form';
import { DeliveryList } from './delivery-list';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { CloudUpload } from 'lucide-react';

export function DeliveryManager() {
  const [deliveries, setDeliveries] = useLocalStorage<Delivery[]>('deliveries', []);
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

  const syncPendingDeliveries = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    const pendingDeliveries = deliveries.filter(d => !d.synced);
    if (pendingDeliveries.length === 0) return;

    setIsSyncing(true);
    toast({
      title: 'Sincronizando...',
      description: `Sincronizando ${pendingDeliveries.length} entrega(s).`,
    });

    // Simulate network requests
    for (const delivery of pendingDeliveries) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      // In a real app, this would be an API call
      console.log(`Simulating sync for delivery to ${delivery.schoolName}`);
    }

    setDeliveries(prev =>
      prev.map(d => (pendingDeliveries.find(pd => pd.id === d.id) ? { ...d, synced: true } : d))
    );

    setIsSyncing(false);
    toast({
      title: 'Sincronização Completa!',
      description: `${pendingDeliveries.length} entrega(s) foram sincronizadas e as notificações enviadas.`,
      variant: 'default',
      className: 'bg-accent text-accent-foreground',
    });
  }, [isOnline, deliveries, setDeliveries, toast, isSyncing]);

  useEffect(() => {
    if (isOnline) {
      syncPendingDeliveries();
    }
  }, [isOnline, syncPendingDeliveries]);

  const pendingCount = deliveries.filter(d => !d.synced).length;

  return (
    <div className="space-y-8">
      <DeliveryForm onSubmit={handleAddDelivery} allDeliveries={deliveries} />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold font-headline">Entregas Recentes</h2>
          {isOnline && pendingCount > 0 && (
            <Button onClick={syncPendingDeliveries} disabled={isSyncing}>
              <CloudUpload className="mr-2 h-4 w-4" />
              {isSyncing ? 'Sincronizando...' : `Sincronizar ${pendingCount} Entrega(s)`}
            </Button>
          )}
        </div>
        <DeliveryList deliveries={deliveries} />
      </div>
    </div>
  );
}
