'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
<<<<<<< HEAD:frontend/src/app/(auth)/signup/page.tsx
import { registerUser } from '@/lib/api';
=======
import { Loader2 } from 'lucide-react';
import { registerUser, loginUser } from '@/lib/api';
>>>>>>> main:front/src/app/(auth)/signup/page.tsx

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
<<<<<<< HEAD:frontend/src/app/(auth)/signup/page.tsx
  const [last_name, setLastName] = useState('');
=======
  const [lastName, setLastName] = useState('');
>>>>>>> main:front/src/app/(auth)/signup/page.tsx
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD:frontend/src/app/(auth)/signup/page.tsx
  

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Usamos la función centralizada para hacer la llamada a la API
      const data = await registerUser(name, last_name,email, password);
      console.log('User registered:', data);
      router.push('/login');
    } catch (err: any) {
      // El error que viene de la API ya está formateado
      setError(err.message);
      console.log('Error:', error);
    } finally {
      setIsLoading(false);
    }
      
=======

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Registrar el usuario
      await registerUser(email, password, name, lastName);

      // 2. Iniciar sesión automáticamente después del registro
      const loginData = await loginUser(email, password);
      
      if (loginData.access_token) {
        localStorage.setItem('accessToken', loginData.access_token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
>>>>>>> main:front/src/app/(auth)/signup/page.tsx
  };

  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
           <div className="flex items-center justify-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-headline">Fitness Frontier</CardTitle>
          </div>
          <CardDescription>
            Crea una cuenta para comenzar tu viaje fitness.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="grid gap-2">
<<<<<<< HEAD:frontend/src/app/(auth)/signup/page.tsx
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Nombre" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Name</Label>
              <Input 
                id="last_name" 
                placeholder="Apellido" 
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                required 
=======
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                placeholder="Juan" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Apellido (opcional)</Label>
              <Input 
                id="lastName" 
                placeholder="Pérez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
>>>>>>> main:front/src/app/(auth)/signup/page.tsx
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
<<<<<<< HEAD:frontend/src/app/(auth)/signup/page.tsx
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
=======
                placeholder="juan@example.com"
>>>>>>> main:front/src/app/(auth)/signup/page.tsx
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
<<<<<<< HEAD:frontend/src/app/(auth)/signup/page.tsx
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                disabled={isLoading}
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Create an account
=======
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear cuenta
>>>>>>> main:front/src/app/(auth)/signup/page.tsx
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Registrarse con Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="underline">
              Iniciar sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
