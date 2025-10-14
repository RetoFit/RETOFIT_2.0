# Guía de Instalación y Ejecución - Posts Service + Frontend

## Backend (Node.js + TypeScript)

### 1. Navegar al directorio del servicio

```bash
cd services/posts-service
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Generar cliente de Prisma

```bash
npx prisma generate
```

### 4. Ejecutar migraciones de base de datos

```bash
npx prisma migrate dev --name init
```

Si te pregunta por el nombre de la migración, usa "init" o "posts_service_initial".

### 5. Iniciar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:8005`

## Frontend (Next.js)

### 1. Navegar al directorio del frontend

```bash
cd front
```

### 2. Instalar dependencias (si no lo has hecho)

```bash
npm install
```

### 3. Instalar date-fns (para formatear fechas)

```bash
npm install date-fns
```

### 4. Reiniciar el servidor de desarrollo

Si ya tenías el servidor corriendo, deténlo (Ctrl+C) y reinícialo:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Verificación

### Backend

1. Abre `http://localhost:8005` en el navegador
2. Deberías ver: `{"message": "Welcome to the Posts Service"}`

### Frontend

1. Inicia sesión en `http://localhost:3000/login`
2. Ve a `http://localhost:3000/dashboard/feed`
3. Deberías ver el feed de publicaciones y poder crear posts

## Estructura del Proyecto

```
services/posts-service/
├── src/
│   ├── index.ts              # Punto de entrada
│   ├── middleware/
│   │   └── auth.ts           # Autenticación JWT
│   ├── config/
│   │   └── multer.ts         # Configuración de subida de archivos
│   └── routes/
│       └── posts.ts          # Rutas de posts, comments, likes
├── prisma/
│   └── schema.prisma         # Esquema de base de datos
├── package.json
├── tsconfig.json
└── .env

front/src/
├── app/dashboard/feed/
│   └── page.tsx              # Página del feed
├── components/
│   ├── create-post.tsx       # Componente para crear posts
│   └── post-card.tsx         # Componente para mostrar posts
└── lib/
    └── api.ts                # Funciones para llamar a la API
```

## Servicios activos

Deberías tener estos servicios corriendo:

- ✅ **auth-service** - Puerto 8001
- ✅ **user-service** - Puerto 8004
- ✅ **posts-service** - Puerto 8005 (NUEVO)
- ✅ **frontend** - Puerto 3000

## Troubleshooting

### Error: "Cannot find module '@prisma/client'"

```bash
cd services/posts-service
npx prisma generate
```

### Error: "Port 8005 is already in use"

Mata el proceso que está usando el puerto:

```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8005).OwningProcess | Stop-Process

# Linux/Mac
lsof -ti:8005 | xargs kill
```

### Error: "No se encontró token de acceso"

1. Asegúrate de haber iniciado sesión
2. Verifica que el servicio `auth-service` esté corriendo
3. Limpia localStorage y vuelve a iniciar sesión

### Error en migraciones de Prisma

Si ya tienes las tablas creadas, puedes usar:

```bash
npx prisma db push
```

O resetear la base de datos (¡cuidado, borra todos los datos!):

```bash
npx prisma migrate reset
```

## Funcionalidades

### ✅ Crear publicación
- Texto (requerido)
- Imagen (opcional)

### ✅ Ver feed de publicaciones
- Paginación (10 posts por página)
- Ordenados por más recientes

### ✅ Interactuar con posts
- Dar/quitar like
- Comentar
- Ver comentarios

### ✅ Gestionar propios posts
- Editar contenido
- Eliminar publicación
- Solo el autor puede modificar/eliminar

## Próximos pasos opcionales

1. Agregar link al feed en la navegación del dashboard
2. Agregar notificaciones cuando recibas likes/comentarios
3. Agregar perfil de usuario con sus publicaciones
4. Agregar búsqueda de publicaciones
5. Agregar hashtags y menciones
