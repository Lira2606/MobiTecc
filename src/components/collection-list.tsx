'use client';

import type { Collection } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { CheckCircle2, Clock, Phone, User, MessageSquare, Briefcase, Camera } from 'lucide-react';
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
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Nenhum recolhimento registrado</CardTitle>
          <CardDescription>Comece registrando um novo recolhimento no formulário acima.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ainda não há registros para exibir.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {collections.map(collection => (
          <AccordionItem value={collection.id} key={collection.id} className="border-none">
            <Card className="shadow-lg border-border/50 rounded-lg overflow-hidden bg-card">
              <AccordionTrigger className="p-6 hover:no-underline data-[state=open]:bg-secondary/50 rounded-t-lg transition-colors">
                <div className="flex justify-between items-center w-full">
                  <div className="text-left">
                    <p className="font-bold text-lg text-foreground">{collection.schoolName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(collection.createdAt), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge
                    variant={collection.synced ? 'default' : 'secondary'}
                    className={cn(
                      'transition-colors',
                      collection.synced ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-amber-900/50 text-amber-300 border-amber-700'
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
              <AccordionContent className="p-6 pt-0 bg-card rounded-b-lg">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 text-sm">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Responsável: <strong>{collection.responsibleParty}</strong></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>Função: <strong>{collection.role}</strong></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>Telefone: <strong>{collection.phoneNumber}</strong></span>
                      </div>
                      {collection.observations && (
                        <div className="flex items-start gap-3">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                           <div>
                            <p className="font-semibold">Observações:</p>
                            <p className="text-muted-foreground">{collection.observations}</p>
                          </div>
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
