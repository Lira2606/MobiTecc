'use client';

import { useOnlineStatus } from '@/hooks/use-online-status';
import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const isOnline = useOnlineStatus();
  return (
    <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto flex h-16 justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-primary">
          MobiTec
        </h1>
        <Badge variant={isOnline ? 'default' : 'destructive'} className="transition-all">
          {isOnline ? (
            <Wifi className="mr-2 h-4 w-4" />
          ) : (
            <WifiOff className="mr-2 h-4 w-4" />
          )}
          <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </Badge>
      </div>
    </header>
  );
}
