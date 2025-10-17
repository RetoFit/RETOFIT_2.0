"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAdminUserRegistrationAnalytics } from "@/lib/admin-api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from "lucide-react";

interface RegistrationData {
  date: string;
  count: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAdminUserRegistrationAnalytics();
        // Formatear los datos para el gráfico
        const formattedData = result.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
          count: Number(item.count),
        }));
        setData(formattedData);
      } catch (err: any) {
        setError(err.message || "No se pudieron cargar las analíticas.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analíticas de la Plataforma</h1>

      <Card>
        <CardHeader>
          <CardTitle>Nuevos Usuarios en los Últimos 30 Días</CardTitle>
          <CardDescription>
            Un vistazo al crecimiento de la comunidad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[350px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="h-[350px] flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : (
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f9fafb' }}
                    labelStyle={{ color: '#d1d5db' }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Nuevos Usuarios" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}