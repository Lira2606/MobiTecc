'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { suggestSchool } from '@/ai/flows/suggest-school';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';


const formSchema = z.object({
  schoolName: z.string().min(2, { message: 'O nome da escola é obrigatório.' }),
  responsibleParty: z.string().min(2, { message: 'O nome do responsável é obrigatório.' }),
  role: z.string().min(2, { message: 'A função é obrigatória.' }),
  phoneNumber: z.string().min(8, { message: 'O número de telefone é obrigatório.' }),
  observations: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof formSchema>;

interface DeliveryFormProps {
  onSubmit: (data: DeliveryFormValues) => void;
  allSchoolNames: string[];
}

export function DeliveryForm({ onSubmit, allSchoolNames }: DeliveryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: '',
      responsibleParty: '',
      role: '',
      phoneNumber: '',
      observations: '',
    },
  });

  const previousSchoolNames = useMemo(() => {
    return [...new Set(allSchoolNames)];
  }, [allSchoolNames]);

  const schoolNameValue = form.watch('schoolName');

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const result = await suggestSchool({
        partialSchoolName: query,
        previousSchoolNames: previousSchoolNames,
      });
      setSuggestions(result.suggestedSchoolNames);
    } catch (error) {
      console.error('Error fetching school suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [previousSchoolNames]);


  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSuggestions(schoolNameValue);
    }, 300);
    return () => clearTimeout(debounce);
  }, [schoolNameValue, fetchSuggestions]);


  const handleSubmit = (data: DeliveryFormValues) => {
    setIsSubmitting(true);
    onSubmit(data);
    form.reset();
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <Card className="w-full shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline">Nova Entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Escola</FormLabel>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? previousSchoolNames.find(
                                  (name) => name === field.value
                                )
                              : "Selecione ou digite o nome da escola"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                         <Command shouldFilter={false}>
                          <CommandInput 
                            placeholder="Buscar escola..."
                            value={field.value}
                            onValueChange={(search) => {
                              form.setValue("schoolName", search)
                            }}
                          />
                          <CommandList>
                            {isLoadingSuggestions && <div className="p-2 text-center text-sm">Carregando...</div>}
                            <CommandEmpty>Nenhuma escola encontrada.</CommandEmpty>
                            <CommandGroup>
                              {[...new Set([...suggestions, ...previousSchoolNames])].map((name) => (
                                <CommandItem
                                  value={name}
                                  key={name}
                                  onSelect={() => {
                                    form.setValue("schoolName", name)
                                    setPopoverOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      name === field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="responsibleParty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome de quem recebeu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Professor(a), Coordenador(a)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(XX) XXXXX-XXXX" {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </div>
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Alguma observação adicional?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrar Entrega
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
