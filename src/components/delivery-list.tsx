'use client';

import type { Delivery } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { CheckCircle2, Clock, Phone, User, MessageSquare, Camera } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface DeliveryListProps {
  deliveries: Delivery[];
}

export function DeliveryList({ deliveries }: DeliveryListProps) {
  if (deliveries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhuma entrega</CardTitle>
          <CardDescription>Ainda não há entregas para exibir.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Accordion type="single" collapsible className="w-full space-y-3">
        {deliveries.map(delivery => (
          <AccordionItem value={delivery.id} key={delivery.id} className="border rounded-lg">
            <Card className="shadow-none border-none rounded-lg overflow-hidden bg-card">
              <AccordionTrigger className="p-4 hover:no-underline data-[state=open]:bg-muted/50 rounded-lg transition-colors">
                <div className="flex justify-between items-center w-full">
                  <div className="text-left">
                    <p className="font-semibold text-base text-foreground">{delivery.schoolName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(delivery.createdAt), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge
                    variant={delivery.synced ? 'outline' : 'secondary'}
                    className={cn(
                      'transition-colors text-xs py-1 px-3 rounded-full',
                      delivery.synced ? 'text-green-700 bg-green-50 border-green-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                    )}
                  >
                    {delivery.synced ? (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    ) : (
                      <Clock className="mr-1 h-3 w-3" />
                    )}
                    {delivery.synced ? 'Sincronizado' : 'Pendente'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0 bg-card rounded-b-lg">
                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <span><strong>{delivery.responsibleParty}</strong> ({delivery.role})</span>
                    </div>
                     <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>{delivery.phoneNumber}</span>
                    </div>
                    {delivery.observations && (
                       <div className="flex items-start gap-3 pt-2">
                        <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                         <p className="text-muted-foreground">{delivery.observations}</p>
                      </div>
                    )}
                  </div>
                   <div className="space-y-2">
                      {delivery.photoDataUri ? (
                        <div className="relative aspect-video">
                           <Image src={delivery.photoDataUri} alt="Foto da entrega" layout="fill" className="rounded-md object-cover"/>
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
