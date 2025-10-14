'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Trophy,
  Footprints,
  Dumbbell,
  Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { getCurrentUser, getAchievementsProgress } from '@/lib/api';


// ¡Ya no importamos datos de prueba!

// Definimos los tipos de datos que esperamos de la API
interface UserData {
  id: number;
  username: string;
}

interface ChallengeData {
  id: number;
  nombre: string;
  meta: number;
  progreso_actual: number;
  porcentaje_completado: number;
  obtenido: boolean;
  tipo_regla: string; // "SUMA_DISTANCIA", "CONTEO_ACTIVIDADES", etc.
}

export default function Dashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [myChallenges, setMyChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener los datos del usuario actual desde el user-service
        const userData = await getCurrentUser();
        // El backend ahora devuelve 'username' en lugar de 'nombre'
        setCurrentUser({ id: userData.id, username: userData.username });

        // 2. Con el ID del usuario, obtener el progreso desde el gamification-service
        const challengesData = await getAchievementsProgress(userData.id);
        setMyChallenges(challengesData);

      } catch (err: any) {
        setError(err.message);
        // La lógica de redirección ya está en fetchWithToken
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Mapea el tipo de regla de tu backend al tipo de ícono del frontend
  const getIcon = (ruleType: string) => {
    const className = "h-4 w-4 text-muted-foreground";
    if (ruleType.includes('DISTANCIA')) {
      return <Timer className={className} />;
    }
    if (ruleType.includes('ACTIVIDADES')) {
      return <Footprints className={className} />;
    }
    // Añade más casos si tienes otros tipos de reglas
    return <Dumbbell className={className} />;
  };
  
  const getUnit = (ruleType: string) => {
    if (ruleType.includes('DISTANCIA')) return 'km';
    if (ruleType.includes('ACTIVIDADES')) return 'actividades';
    return 'unidades';
  }

  const activeChallenges = myChallenges.filter(c => !c.obtenido);
  const completedChallenges = myChallenges.filter(c => c.obtenido);

  if (loading) {
    return <div>Cargando tu dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          ¡Bienvenido de nuevo, {currentUser?.username}!
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Retos Activos
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeChallenges.length}</div>
            <p className="text-xs text-muted-foreground">
              Sigue superando tus límites
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Retos Completados
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedChallenges.length}</div>
            <p className="text-xs text-muted-foreground">
              ¡Sigue así!
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Mis Retos Activos</CardTitle>
          <CardDescription>
            Este es un vistazo a tu progreso actual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reto</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeChallenges.map((challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell>
                    <div className="font-medium">{challenge.nombre}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Meta: {challenge.meta.toLocaleString()} {getUnit(challenge.tipo_regla)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getIcon(challenge.tipo_regla)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Progress value={challenge.porcentaje_completado} aria-label={`${challenge.porcentaje_completado.toFixed(0)}% completado`} />
                      <span className="text-xs text-muted-foreground">{challenge.porcentaje_completado.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* El enlace debe ajustarse si la estructura de tu URL cambia */}
                    <Link href={`/dashboard/challenges/${challenge.id}`}>
                      <Button size="sm" variant="outline">
                        Ver
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}