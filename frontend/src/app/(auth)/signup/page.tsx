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
import { registerUser } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  

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
            Create an account to start your fitness journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="grid gap-2">
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
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
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
