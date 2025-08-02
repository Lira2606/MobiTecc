'use client';

import { useState, useMemo } from 'react';
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
  const [showSuccess, setShowSuccess] = useState(false);

  const { toast } = useToast();

  const handleAddDelivery = (newDeliveryData: Omit<Delivery, 'id' | 'createdAt' | 'synced'>) => {
    const newDelivery: Delivery = {
      ...newDeliveryData,
      id: new Date().toISOString() + Math.random(),
      createdAt: new Date().toISOString(),
      synced: false,
    };
    setDeliveries(prev => [newDelivery, ...prev]);
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

  const renderContent = () => {
    if (showSuccess) {
      return <SuccessScreen onNewDelivery={resetForm} />;
    }

    switch (activeTab) {
      case 'deliveries':
        return <DeliveryForm onSubmit={handleAddDelivery} allSchoolNames={allSchoolNames} />;
      case 'collections':
        return <CollectionForm onSubmit={handleAddCollection} allSchoolNames={allSchoolNames} />;
      case 'visits':
        return <div className="text-white text-center mt-10">Visitas - Em breve</div>;
      case 'shipments':
        return <div className="text-white text-center mt-10">Envios - Em breve</div>;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col flex-grow h-full">
        <Header />
        <main className="flex-grow p-6 pt-24 overflow-y-auto transition-all duration-500">
            {renderContent()}
        </main>
        
        <nav className="glassmorphism flex justify-around items-center p-3 mt-auto w-full z-10">
            <button onClick={() => { setActiveTab('deliveries'); setShowSuccess(false); }} className={cn("flex flex-col items-center transition-transform duration-200 nav-link", activeTab === 'deliveries' && !showSuccess ? 'text-teal-400' : 'text-gray-400' )}>
                <Truck className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Entregas</span>
            </button>
            <button onClick={() => { setActiveTab('collections'); setShowSuccess(false); }} className={cn("flex flex-col items-center transition-transform duration-200 nav-link", activeTab === 'collections' && !showSuccess ? 'text-teal-400' : 'text-gray-400' )}>
                <PackageOpen className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Recolhimentos</span>
            </button>
            <button onClick={() => { setActiveTab('visits'); setShowSuccess(false); }} className={cn("flex flex-col items-center transition-transform duration-200 nav-link", activeTab === 'visits' && !showSuccess ? 'text-teal-400' : 'text-gray-400' )}>
                <Users className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Visitas</span>
            </button>
            <button onClick={() => { setActiveTab('shipments'); setShowSuccess(false); }} className={cn("flex flex-col items-center transition-transform duration-200 nav-link", activeTab === 'shipments' && !showSuccess ? 'text-teal-400' : 'text-gray-400' )}>
                <Plane className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">Envios</span>
            </button>
        </nav>
    </div>
  );
}


function SuccessScreen({ onNewDelivery }: { onNewDelivery: () => void }) {
    const { toast } = useToast();
    const handleGeminiClick = (type: string) => {
        toast({
            title: `Gerando ${type}...`,
            description: 'Esta funcionalidade será implementada em breve.',
        });
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 fade-in-up">
                <CheckCircle2 className="w-16 h-16 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 fade-in-up" style={{animationDelay: '100ms'}}>Registrado!</h2>
            <p className="text-gray-400 text-center mb-4 fade-in-up" style={{animationDelay: '200ms'}}>Os detalhes foram guardados com sucesso.</p>
            <div className="w-full space-y-3 mt-4 fade-in-up" style={{animationDelay: '300ms'}}>
                <Button onClick={() => handleGeminiClick('Mensagem')} variant="outline" className="w-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/30 hover:text-sky-200">
                    ✨ Gerar Mensagem
                </Button>
                <Button onClick={() => handleGeminiClick('Resumo')} variant="outline" className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/30 hover:text-purple-200">
                    ✨ Criar Resumo
                </Button>
            </div>
            <Button onClick={onNewDelivery} className="mt-6 bg-slate-700 hover:bg-slate-600 text-white font-bold fade-in-up" style={{animationDelay: '400ms'}}>
                Novo Registro
            </Button>
        </div>
    );
}
