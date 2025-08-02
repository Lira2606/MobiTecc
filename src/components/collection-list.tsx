'use client';

import type { Collection } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { CheckCircle2, Clock, Phone, User, MessageSquare, Camera } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import Image from 'next/image';


interface CollectionListProps {
  collections: Collection[];
}

export function CollectionList({ collections }: CollectionListProps) {
  if (collections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum recolhimento</CardTitle>
          <CardDescription>Ainda não há recolhimentos para exibir.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Accordion type="single" collapsible className="w-full space-y-3">
        {collections.map(collection => (
          <AccordionItem value={collection.id} key={collection.id} className="border rounded-lg">
            <Card className="shadow-none border-none rounded-lg overflow-hidden bg-card">
              <AccordionTrigger className="p-4 hover:no-underline data-[state=open]:bg-muted/50 rounded-lg transition-colors">
                <div className="flex justify-between items-center w-full">
                  <div className="text-left">
                    <p className="font-semibold text-base text-foreground">{collection.schoolName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(collection.createdAt), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge
                    variant={collection.synced ? 'outline' : 'secondary'}
                     className={cn(
                      'transition-colors text-xs py-1 px-3 rounded-full',
                      collection.synced ? 'text-green-700 bg-green-50 border-green-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                    )}
                  >
                    {collection.synced ? (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    ) : (
                      <Clock className="mr-1 h-3 w-3" />
                    )}
                    {collection.synced ? 'Sincronizado' : 'Pendente'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0 bg-card rounded-b-lg">
                 <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-4 text-sm">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary" />
                        <span><strong>{collection.responsibleParty}</strong> ({collection.role})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>{collection.phoneNumber}</span>
                      </div>
                      {collection.observations && (
                        <div className="flex items-start gap-3 pt-2">
                          <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                           <p className="text-muted-foreground">{collection.observations}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                        {collection.photoDataUri ? (
                          <div className="relative aspect-video">
                            <Image src={collection.photoDataUri} alt="Foto da coleta" layout="fill" className="rounded-md object-cover"/>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full bg-muted rounded-md aspect-video">
                            <Camera className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                    </div>
                 </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
