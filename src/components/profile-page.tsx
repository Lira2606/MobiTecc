'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { LogOut, Settings, Shield } from "lucide-react";

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center text-white p-6 h-full space-y-8">
      <div className="flex flex-col items-center space-y-4 fade-in-up">
        <Avatar className="w-28 h-28 border-4 border-slate-700 shadow-lg">
          <AvatarImage src={user?.avatar || "https://placehold.co/112x112.png"} alt="Avatar do usuário" data-ai-hint="user avatar" />
          <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{user?.name || 'Nome do Usuário'}</h2>
          <p className="text-slate-400">{user?.email || 'usuario@email.com'}</p>
        </div>
      </div>

      <div className="w-full space-y-4 fade-in-up" style={{animationDelay: '200ms'}}>
         <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
                <CardTitle className="text-lg">Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-base py-6">
                    <Settings className="mr-3"/>
                    Configurações da Conta
                </Button>
                 <Button variant="ghost" className="w-full justify-start text-base py-6">
                    <Shield className="mr-3"/>
                    Segurança e Privacidade
                </Button>
            </CardContent>
         </Card>
      </div>

      <div className="w-full mt-auto fade-in-up" style={{animationDelay: '400ms'}}>
        <Button onClick={logout} variant="destructive" className="w-full text-base py-6">
            <LogOut className="mr-3"/>
            Sair
        </Button>
      </div>
    </div>
  );
}
