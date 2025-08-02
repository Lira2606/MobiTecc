'use client';

import { useOnlineStatus } from '@/hooks/use-online-status';
import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const isOnline = useOnlineStatus();
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex h-16 justify-between items-center px-4">
        <h1 className="text-xl font-bold text-foreground">
          MobiTec
        </h1>
        <Badge variant={isOnline ? 'outline' : 'destructive'} className="transition-all text-xs font-mono">
          {isOnline ? (
            <Wifi className="mr-2 h-3 w-3 text-green-500" />
          ) : (
            <WifiOff className="mr-2 h-3 w-3" />
          )}
          <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </Badge>
      </div>
    </header>
  );
}
