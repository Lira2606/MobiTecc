'use client';

import type { Delivery } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { CheckCircle2, Clock, Phone, User, MessageSquare, Briefcase, Camera } from 'lucide-react';
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
          <CardTitle>Nenhuma entrega registrada</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Comece registrando uma nova entrega no formulário acima.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {deliveries.map(delivery => (
          <AccordionItem value={delivery.id} key={delivery.id} className="border-none">
            <Card className="shadow-none border-none rounded-lg overflow-hidden">
              <AccordionTrigger className="p-6 hover:no-underline data-[state=open]:bg-secondary/50 rounded-t-lg">
                <div className="flex justify-between items-center w-full">
                  <div className="text-left">
                    <p className="font-bold text-lg text-primary">{delivery.schoolName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(delivery.createdAt), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge
                    variant={delivery.synced ? 'default' : 'secondary'}
                    className={cn(
                      'transition-colors',
                      delivery.synced ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                    )}
                  >
                    {delivery.synced ? (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    ) : (
                      <Clock className="mr-2 h-4 w-4" />
                    )}
                    {delivery.synced ? 'Sincronizado' : 'Pendente'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 bg-card rounded-b-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Responsável: <strong>{delivery.responsibleParty}</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>Função: <strong>{delivery.role}</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>Telefone: <strong>{delivery.phoneNumber}</strong></span>
                    </div>
                    {delivery.observations && (
                       <div className="flex items-start gap-3">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                         <div>
                          <p className="font-semibold">Observações:</p>
                          <p className="text-muted-foreground">{delivery.observations}</p>
                        </div>
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
