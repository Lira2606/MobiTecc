'use client';

import type { Delivery, Collection } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PackageOpen, Truck } from 'lucide-react';

interface HistoryListProps {
  deliveries: Delivery[];
  collections: Collection[];
}

export function HistoryList({ deliveries, collections }: HistoryListProps) {
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
        <Card key={item.id} className="bg-slate-800 border-slate-700 text-white">
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
          <CardContent>
            <p className="text-sm text-slate-300">
              <span className="font-semibold">Responsável:</span> {item.responsibleParty} ({item.role})
            </p>
            {item.type === 'delivery' && item.department && (
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
        </Card>
      ))}
    </div>
  );
}
