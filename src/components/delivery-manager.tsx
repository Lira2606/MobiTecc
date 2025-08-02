'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Delivery, Collection } from '@/lib/types';
import { DeliveryForm } from './delivery-form';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Truck, PackageOpen, Users, Plane, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollectionForm } from './collection-form';
import { cn } from '@/lib/utils';
import { Header } from './header';

export function DeliveryManager() {
  const [activeTab, setActiveTab] = useState<'deliveries' | 'collections' | 'visits' | 'shipments'>('deliveries');
  const [deliveries, setDeliveries] = useLocalStorage<Delivery[]>('deliveries', []);
  const [collections, setCollections] = useLocalStorage<Collection[]>('collections', []);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastDelivery, setLastDelivery] = useState<Delivery | null>(null);

  const { toast } = useToast();

  const handleAddDelivery = (newDeliveryData: Omit<Delivery, 'id' | 'createdAt' | 'synced'>) => {
    const newDelivery: Delivery = {
      ...newDeliveryData,
      id: new Date().toISOString() + Math.random(),
      createdAt: new Date().toISOString(),
      synced: false,
    };
    setDeliveries(prev => [newDelivery, ...prev]);
    setLastDelivery(newDelivery);
    setShowSuccess(true);
  };

  const handleAddCollection = (newCollectionData: Omit<Collection, 'id' | 'createdAt' | 'synced'>) => {
    const newCollection: Collection = {
      ...newCollectionData,
      id: new Date().toISOString() + Math.random(),
      createdAt: new Date().toISOString(),
      synced: false,
    };
    setCollections(prev => [newCollection, ...prev]);
    setShowSuccess(true);
  };

  const allSchoolNames = useMemo(() => {
    const deliverySchools = deliveries.map(d => d.schoolName);
    const collectionSchools = collections.map(c => c.schoolName);
    return [...new Set([...deliverySchools, ...collectionSchools])];
  }, [deliveries, collections]);
  
  const resetForm = () => {
    setShowSuccess(false);
  }

  return (
    <div className="flex flex-col flex-grow h-full">
        <Header />
        <main className="flex-grow p-6 pt-2 overflow-y-auto transition-all duration-500">
            {showSuccess ? (
                <SuccessScreen onNewDelivery={resetForm} />
            ) : (
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full max-w-md mx-auto">
                    <TabsContent value="deliveries" className="mt-0">
                       <DeliveryForm onSubmit={handleAddDelivery} allSchoolNames={allSchoolNames} />
                    </TabsContent>
                    <TabsContent value="collections" className="mt-0">
                       <CollectionForm onSubmit={handleAddCollection} allSchoolNames={allSchoolNames} />
                    </TabsContent>
                    <TabsContent value="visits" className="text-white text-center mt-10">Visitas - Em breve</TabsContent>
                    <TabsContent value="shipments" className="text-white text-center mt-10">Envios - Em breve</TabsContent>
                </Tabs>
            )}
        </main>
        
        <nav className="glassmorphism flex justify-around items-center p-3 w-full z-20 mt-auto">
            <button onClick={() => setActiveTab('deliveries')} className={cn("flex flex-col items-center transition-transform duration-200 nav-link", activeTab === 'deliveries' ? 'text-teal-400' : 'text-gray-400' )}>
                <Truck className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Entregas</span>
            </button>
            <button onClick={() => setActiveTab('collections')} className={cn("flex flex-col items-center transition-transform duration-200 nav-link", activeTab === 'collections' ? 'text-teal-400' : 'text-gray-400' )}>
                <PackageOpen className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Recolhimentos</span>
            </button>
            <button onClick={() => setActiveTab('visits')} className={cn("flex flex-col items-center transition-transform duration-200 nav-link", activeTab === 'visits' ? 'text-teal-400' : 'text-gray-400' )}>
                <Users className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Visitas</span>
            </button>
            <button onClick={() => setActiveTab('shipments')} className={cn("flex flex-col items-center transition-transform duration-200 nav-link", activeTab === 'shipments' ? 'text-teal-400' : 'text-gray-400' )}>
                <Plane className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Envios</span>
            </button>
        </nav>
    </div>
  );
}


function SuccessScreen({ onNewDelivery }: { onNewDelivery: () => void }) {
    // Mock functionality for Gemini buttons
    const { toast } = useToast();
    const handleGeminiClick = (type: string) => {
        toast({
            title: `Gerando ${type}...`,
            description: 'Esta funcionalidade será implementada em breve.',
        });
    }

    return (
        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-8 transition-opacity duration-500 z-10">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-16 h-16 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Registrado!</h2>
            <p className="text-gray-400 text-center mb-4">Os detalhes foram guardados com sucesso.</p>
            <div className="w-full space-y-3 mt-4">
                <Button onClick={() => handleGeminiClick('Mensagem')} variant="outline" className="w-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/30 hover:text-sky-200">
                    ✨ Gerar Mensagem
                </Button>
                <Button onClick={() => handleGeminiClick('Resumo')} variant="outline" className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/30 hover:text-purple-200">
                    ✨ Criar Resumo
                </Button>
            </div>
            <Button onClick={onNewDelivery} className="mt-6 bg-slate-700 hover:bg-slate-600 text-white font-bold">
                Novo Registro
            </Button>
        </div>
    );
}

function FloatingLabelInput({ id, label, type = 'text', icon, ...props }: { id: string, label: string, type?: string, icon: React.ReactNode, [key: string]: any }) {
  return (
    <div className="form-group relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {icon}
        </div>
        <input 
            id={id}
            type={type}
            className="form-input w-full p-4 pl-12 bg-[#1e293b] border border-[#334155] text-white rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 peer"
            placeholder=" " 
            {...props}
        />
        <label 
            htmlFor={id} 
            className="form-label absolute left-12 top-4 text-gray-400 pointer-events-none transition-all duration-200 ease-in-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-teal-400 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-teal-400"
        >
            {label}
        </label>
    </div>
  )
}
