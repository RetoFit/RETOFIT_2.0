export default function AdminDashboardPage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel. Selecciona una opción del menú para comenzar.
        </p>
      </div>
    </div>
  );
}