'use client';

import { useEffect, useState } from 'react';

export function Header() {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
        const now = new Date();
        setTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    }
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-transparent text-white p-6 pt-12 flex justify-between items-center absolute top-0 left-0 w-full z-10">
        <div className="flex items-center space-x-2">
             <svg className="w-8 h-8 text-teal-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 9.5L17 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h1 className="text-2xl font-bold tracking-wider">MobiTec</h1>
        </div>
         <div className="flex items-center space-x-1">
            <span className="text-white font-semibold text-sm">{time}</span>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M17.25 8.5h-3.5a.75.75 0 00-.75.75v5.5a.75.75 0 00.75.75h3.5a.75.75 0 00.75-.75v-5.5a.75.75 0 00-.75-.75zM12.25 10h-2.5a.75.75 0 00-.75.75v3.5a.75.75 0 00.75.75h2.5a.75.75 0 00.75-.75v-3.5a.75.75 0 00-.75-.75zM7.25 12h-2.5a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h2.5a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75zM3.25 13.5h-1.5a.75.75 0 00-.75.75v.5a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75z"/></svg>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M1.343 9.343a8.5 8.5 0 0112.56-7.878l.75-.433a9.5 9.5 0 00-14.06 8.744l.75.567zM18.657 10.657a8.5 8.5 0 01-12.56 7.878l-.75.433a9.5 9.5 0 0014.06-8.744l-.75-.567z" clipRule="evenodd" /></svg>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 16a3.5 3.5 0 01-3.5-3.5V7.5a3.5 3.5 0 013.5-3.5h9A3.5 3.5 0 0118 7.5v5a3.5 3.5 0 01-3.5 3.5h-9zM16.5 7.5a2 2 0 00-2-2h-9a2 2 0 00-2 2v5a2 2 0 002 2h9a2 2 0 002-2v-5z"></path><path d="M18 9.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5z"></path></svg>
        </div>
    </header>
  );
}
