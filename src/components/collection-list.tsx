'use client';

import type { Collection } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { CheckCircle2, Clock, Phone, User, Package, MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';


interface CollectionListProps {
  collections: Collection[];
}

export function CollectionList({ collections }: CollectionListProps) {
  if (collections.length === 0) {
    return (
      <Card className="text-center shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Nenhum recolhimento registrado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Comece registrando um novo recolhimento no formulário acima.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {collections.map(collection => (
          <AccordionItem value={collection.id} key={collection.id} className="border-none">
            <Card className="shadow-md rounded-xl overflow-hidden">
              <AccordionTrigger className="p-6 hover:no-underline data-[state=open]:bg-muted/50">
                <div className="flex justify-between items-center w-full">
                  <div className="text-left">
                    <p className="font-bold text-lg text-primary">{collection.schoolName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(collection.createdAt), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge
                    variant={collection.synced ? 'default' : 'secondary'}
                    className={cn(
                      'transition-colors',
                      collection.synced ? 'bg-accent text-accent-foreground' : ''
                    )}
                  >
                    {collection.synced ? (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    ) : (
                      <Clock className="mr-2 h-4 w-4" />
                    )}
                    {collection.synced ? 'Sincronizado' : 'Pendente'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 bg-white">
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Responsável: <strong>{collection.responsibleParty}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>Telefone: <strong>{collection.phoneNumber}</strong></span>
                  </div>
                   <div className="flex items-start gap-3">
                    <Package className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-muted-foreground">Itens Recolhidos:</p>
                      <p className="font-semibold">{collection.collectedItems}</p>
                    </div>
                  </div>
                  {collection.observations && (
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                       <div>
                        <p className="text-muted-foreground">Observações:</p>
                        <p className="font-semibold">{collection.observations}</p>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
