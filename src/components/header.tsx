'use client';

import { useEffect, useState } from 'react';
import { UploadCloud, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HeaderProps {
  unsyncedCount: number;
  onSync: () => void;
  isOnline: boolean;
}

export function Header({ unsyncedCount, onSync, isOnline }: HeaderProps) {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    // Avoids hydration mismatch
    const update = () => setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    update();
    const timerId = setInterval(update, 60000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <header className="relative w-full z-20">
      <div className="px-6 pt-3 flex justify-between items-center">
          <span className="text-white font-semibold text-sm">{time}</span>
          <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M17.25 8.5h-3.5a.75.75 0 00-.75.75v5.5a.75.75 0 00.75.75h3.5a.75.75 0 00.75-.75v-5.5a.75.75 0 00-.75-.75zM12.25 10h-2.5a.75.75 0 00-.75.75v3.5a.75.75 0 00.75.75h2.5a.75.75 0 00.75-.75v-3.5a.75.75 0 00-.75-.75zM7.25 12h-2.5a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h2.5a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75zM3.25 13.5h-1.5a.75.75 0 00-.75.75v.5a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75z"/></svg>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M1.343 9.343a8.5 8.5 0 0112.56-7.878l.75-.433a9.5 9.5 0 00-14.06 8.744l.75.567zM18.657 10.657a8.5 8.5 0 01-12.56 7.878l-.75.433a9.5 9.5 0 0014.06-8.744l-.75-.567z" clipRule="evenodd" /></svg>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 16a3.5 3.5 0 01-3.5-3.5V7.5a3.5 3.5 0 013.5-3.5h9A3.5 3.5 0 0118 7.5v5a3.5 3.5 0 01-3.5 3.5h-9zM16.5 7.5a2 2 0 00-2-2h-9a2 2 0 00-2 2v5a2 2 0 002 2h9a2 2 0 002-2v-5z"></path><path d="M18 9.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5z"></path></svg>
          </div>
      </div>
      <div className="bg-transparent text-white p-6 pb-2 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <svg className="w-9 h-9 text-teal-400 glowing-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2L7 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 2L17 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7L5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 19L7 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 19L17 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 7L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 17L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 14.5L12 14.5L12 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9.5L12 9.5L12 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="5" y="5" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
              <h1 className="text-2xl font-bold tracking-wider">MobiTec</h1>
          </div>
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {isOnline ? <Wifi className="w-5 h-5 text-green-400" /> : <WifiOff className="w-5 h-5 text-red-400" />}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isOnline ? 'Conectado' : 'Offline'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <button onClick={onSync} className="relative">
                <UploadCloud className={cn("w-7 h-7", unsyncedCount > 0 ? "text-green-400 animate-pulse" : "text-gray-500")} />
                {unsyncedCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unsyncedCount}
                    </span>
                )}
            </button>
        </div>
      </div>
    </header>
  );
}
