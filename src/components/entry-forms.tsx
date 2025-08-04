'use client';

import { DeliveryForm } from './delivery-form';
import { CollectionForm } from './collection-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Delivery, Collection } from '@/lib/types';

interface EntryFormsProps {
  onAddDelivery: (data: Omit<Delivery, 'id' | 'createdAt' | 'synced' | 'type'>) => void;
  onAddCollection: (data: Omit<Collection, 'id' | 'createdAt' | 'synced' | 'type'>) => void;
  allSchoolNames: string[];
}

export function EntryForms({ onAddDelivery, onAddCollection, allSchoolNames }: EntryFormsProps) {
  return (
    <div className="fade-in-up">
      <Tabs defaultValue="delivery" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="delivery">Entrega</TabsTrigger>
          <TabsTrigger value="collection">Recolhimento</TabsTrigger>
        </TabsList>
        <TabsContent value="delivery" className="mt-6">
            <DeliveryForm onSubmit={onAddDelivery} allSchoolNames={allSchoolNames} />
        </TabsContent>
        <TabsContent value="collection" className="mt-6">
            <CollectionForm onSubmit={onAddCollection} allSchoolNames={allSchoolNames} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
