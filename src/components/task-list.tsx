'use client';

import { ClipboardCheck } from "lucide-react";

export function TaskList() {

  // No futuro, aqui você fará a chamada para a sua API para buscar as tarefas
  const tasks: any[] = []; // Começamos com uma lista vazia

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-white fade-in-up">Lista de Tarefas</h2>
      
      {tasks.length === 0 ? (
        <div className="text-center text-gray-400 mt-16 fade-in-up" style={{animationDelay: '200ms'}}>
            <ClipboardCheck className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-white">Nenhuma tarefa pendente.</h3>
            <p>Novas ordens de serviço da sua aplicação web aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-4 pt-4">
          {/* 
            Quando as tarefas existirem, vamos mapeá-las aqui para exibir cada uma.
            Exemplo de como seria um item da lista:
          
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-bold text-white">Nome da Escola</h3>
              <p className="text-slate-300">Item: Notebook</p>
              <p className="text-slate-400 text-sm">Criado em: 20/07/2024</p>
            </div>
          */}
        </div>
      )}
    </div>
  );
}
