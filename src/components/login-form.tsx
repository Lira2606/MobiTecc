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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { SplashScreen } from './splash-screen';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
      setShowLogin(true);
    }, 10000); // Duration of the splash animation

    return () => clearTimeout(splashTimer);
  }, []);
  
  useEffect(() => {
    if (!showLogin || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: { x: number; y: number; radius: number; vx: number; vy: number }[] = [];
    
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    setCanvasDimensions();

    const particleCount = 50;
    const maxDistance = 100;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }

    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(204, 251, 241, 0.5)';
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.strokeStyle = 'rgba(94, 234, 212, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function update() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
    }

    let animationFrameId: number;
    function animate() {
        update();
        draw();
        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();

    window.addEventListener('resize', setCanvasDimensions);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasDimensions);
    }

  }, [showLogin]);


  const handleSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Falha no Login',
        description: (error as Error).message || 'Ocorreu um erro. Tente novamente.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full relative">
      <div className={cn("flex-1 flex flex-col items-center justify-center p-8 w-full", showLogin ? 'login-screen-loaded' : 'opacity-0')}>
        <canvas id="particle-canvas" ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0"></canvas>
        
        <div className="login-element text-center mb-8 floating-icon">
             <svg className="w-16 h-16 text-teal-400 mx-auto glowing-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="12" y="12" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="3"/>
                <path d="M26 12V4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M38 12V4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M26 52V60" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M38 52V60" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M52 26H60" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M52 38H60" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M12 26H4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M12 38H4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <path d="M24 24H30V30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M40 40H34V34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-2xl font-bold text-white tracking-wider mt-2">MobiTec</h1>
        </div>

        <div className="login-element text-center w-full"><h2 className="text-3xl font-bold text-white">Bem-vindo!</h2></div>
        <div className="login-element text-center w-full"><p className="text-gray-400 mt-2 mb-8">Entre para continuar.</p></div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-4 z-10">
              <div className="login-element">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                </span>
                                <Input {...field} type="email" placeholder="E-mail" className="w-full pl-11 pr-4 py-3 h-auto glass-effect rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75" />
                            </div>
                        </FormControl>
                          <FormMessage className="text-red-400 pl-2" />
                        </FormItem>
                    )}
                    />
              </div>

              <div className="login-element">
                  <div className="flex justify-end mb-1">
                      <a href="#" className="text-sm text-teal-400 hover:text-teal-300 transition">Esqueceu a senha?</a>
                  </div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                                </span>
                                <Input {...field} type={passwordVisible ? 'text' : 'password'} placeholder="Senha" className="w-full pl-11 pr-10 py-3 h-auto glass-effect rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75" />
                                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 flex items-center pr-3 group">
                                    {passwordVisible ? <EyeOff className="h-5 w-5 text-gray-400 group-hover:text-white transition" /> : <Eye className="h-5 w-5 text-gray-400 group-hover:text-white transition" />}
                                </button>
                            </div>
                        </FormControl>
                        <FormMessage className="text-red-400 pl-2" />
                        </FormItem>
                    )}
                  />
              </div>

              <div className="pt-2 login-element">
                <Button type="submit" disabled={isSubmitting} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 h-auto px-4 rounded-lg transition duration-300 transform active:scale-95">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Entrar'}
                </Button>
              </div>
          </form>
        </Form>
        
        <div className="w-full mt-6 z-10">
            <div className="flex items-center my-6 login-element">
                <hr className="flex-grow border-gray-700" />
                <span className="mx-4 text-gray-500 text-sm font-medium">OU</span>
                <hr className="flex-grow border-gray-700" />
            </div>
            <div className="space-y-3">
                  <button className="w-full flex items-center justify-center py-2.5 px-4 glass-effect rounded-lg transition duration-300 group login-element">
                    <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" /><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" /><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.641-3.657-11.303-8.653l-6.571 4.819C9.656 39.663 16.318 44 24 44z" /><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.574l6.19 5.238C42.012 35.836 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" /></svg>
                    <span className="text-white font-medium text-sm group-hover:text-teal-300 transition">Continuar com Google</span>
                </button>
                  <button className="w-full flex items-center justify-center py-2.5 px-4 glass-effect rounded-lg transition duration-300 group login-element">
                    <svg className="w-5 h-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M17.323,13.013c-0.013-0.013-0.013-0.013-0.026-0.026c-0.687-0.687-1.13-1.638-1.13-2.653c0-1.028,0.443-1.98,1.143-2.666c0.013-0.013,0.013-0.013,0.026-0.026c0.7-0.675,1.614-1.097,2.595-1.13v-0.001c0.013,0,0.026,0,0.039,0c1.002,0,2.103,0.43,2.939,1.253c0.7,0.7,1.156,1.665,1.156,2.692c0,1.002-0.443,2.191-1.156,2.913c-0.736,0.736-1.726,1.202-2.7,1.228h-0.013c-0.013,0-0.026,0-0.039,0C18.924,14.097,18.01,13.688,17.323,13.013z M14.697,6.038c0.013-0.129,0.013-0.258,0.013-0.387c0-2.024-1.29-3.738-3.507-3.738c-1.115,0-2.024,0.455-2.653,1.143c-0.662,0.723-1.104,1.713-1.104,2.728c0,2.115,1.521,3.951,3.751,3.951c0.206,0,0.412-0.013,0.619-0.052C12.983,12.359,14.697,9.62,14.697,6.038z"/></svg>
                    <span className="text-white font-medium text-sm group-hover:text-teal-300 transition">Continuar com Apple</span>
                </button>
            </div>
        </div>

        <div className="login-element w-full z-10"><p className="text-center text-gray-400 text-sm mt-8">
            Não tem uma conta? <a href="#" className="text-teal-400 hover:text-teal-300 font-medium transition">Cadastre-se</a>
        </p></div>
      </div>
    </div>
  );
}
