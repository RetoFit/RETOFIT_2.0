'use client';

import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import { registerUser, loginUser } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
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
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="juan@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
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

      {/* Modal de verificación */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Verifica tu correo</CardTitle>
              <CardDescription>
                Enviamos un código de verificación a: {userEmail}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Input
                placeholder="* * * * * *"
                maxLength={6}
                value={verificationInput}
                onChange={(e) => setVerificationInput(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono tracking-widest"
                disabled={isSubmittingCode}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowVerificationModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleVerifyCode}
                  disabled={isSubmittingCode}
                >
                  {isSubmittingCode ? 'Verificando...' : 'Verificar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de términos y condiciones */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Términos y condiciones</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="text-sm text-muted-foreground space-y-4">
                <p>
                  Fitness Frontier es una plataforma diseñada para generar rutas de aprendizaje 
                  personalizadas a partir de documentos cargados por los usuarios, quienes son 
                  totalmente responsables del contenido que suben y de su uso, debiendo cumplir 
                  con todas las leyes y regulaciones aplicables.
                </p>
                <p>
                  Fitness Frontier en ningún caso se hace responsable del uso indebido de la 
                  plataforma, incluyendo, pero no limitado a, la generación, difusión o acceso 
                  a información que incite o facilite actividades ilegales, peligrosas o que 
                  atenten contra la seguridad pública.
                </p>
                <p>
                  La plataforma y sus contenidos son propiedad de Fitness Frontier, y su uso 
                  indebido está prohibido. Fitness Frontier no se hace responsable por daños 
                  indirectos derivados del uso de la plataforma.
                </p>
                <p>
                  Fitness Frontier puede modificar los servicios o los términos en cualquier 
                  momento, notificando a los usuarios registrados.
                </p>
              </div>
              <Button onClick={() => setShowTermsModal(false)}>
                Cerrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}