# 🔒 Correcciones de Autenticación y Usuario

## Problemas identificados y resueltos

### ❌ Problemas anteriores:

1. **UserNav hardcodeado**: Siempre mostraba "Alex - alex@example.com"
2. **Signup no funcional**: Solo mock, no registraba usuarios reales
3. **Login con credenciales de prueba**: Email pre-rellenado con datos de ejemplo
4. **Posts asociados al usuario incorrecto**: Por el problema del UserNav

### ✅ Soluciones aplicadas:

#### 1. UserNav dinámico (`front/src/components/user-nav.tsx`)
- Ahora carga el usuario real usando `getCurrentUser()`
- Muestra el nombre y email del usuario autenticado
- Cierra sesión correctamente eliminando el token

#### 2. Signup funcional (`front/src/app/(auth)/signup/page.tsx`)
- Conectado al endpoint `/auth/register`
- Registra usuarios reales en la base de datos
- Inicia sesión automáticamente después del registro
- Manejo de errores y estados de carga

#### 3. Login sin datos hardcodeados (`front/src/app/(auth)/login/page.tsx`)
- Campos de email y password vacíos por defecto
- Usuario debe ingresar sus credenciales reales

#### 4. Nueva función de registro (`front/src/lib/api.ts`)
- `registerUser()` agregada para conectar con el backend

## Cómo probar:

### 1. Crear un nuevo usuario
```
1. Ve a http://localhost:3000/signup
2. Ingresa:
   - Nombre: Tu nombre
   - Apellido: Tu apellido (opcional)
   - Email: tu@email.com
   - Contraseña: tu_contraseña
3. Click en "Crear cuenta"
4. Serás redirigido al dashboard automáticamente
```

### 2. Verificar que el usuario es correcto
```
1. En el dashboard, mira la esquina superior derecha
2. Click en tu avatar
3. Deberías ver TU nombre y email (no "Alex")
```

### 3. Crear un post con el nuevo usuario
```
1. Ve a Dashboard → Feed
2. Crea una publicación
3. Debería aparecer con tu nombre (no "Alex")
```

### 4. Cerrar sesión y volver a iniciar
```
1. Click en tu avatar → Log out
2. Inicia sesión con:
   - Email: tu@email.com
   - Contraseña: tu_contraseña
3. Deberías entrar correctamente
```

### 5. Probar con múltiples usuarios
```
1. Crea Usuario A
2. Crea algunos posts
3. Cierra sesión
4. Crea Usuario B (nuevo email)
5. Verifica que:
   - El UserNav muestre Usuario B
   - Los posts de Usuario A aún aparecen
   - Los nuevos posts de Usuario B aparecen con su nombre
```

## Flujo de autenticación ahora:

```
REGISTRO:
/signup → POST /auth/register → Usuario guardado en DB
       → POST /auth/login → Token JWT generado
       → localStorage.setItem('accessToken', token)
       → Redirect a /dashboard

LOGIN:
/login → POST /auth/login → Token JWT generado
      → localStorage.setItem('accessToken', token)
      → Redirect a /dashboard

DASHBOARD:
UserNav → GET /users/me (con Authorization: Bearer token)
       → Muestra nombre y email real del usuario

POSTS:
CreatePost → POST /posts/posts (con Authorization: Bearer token)
          → Backend extrae el email del token
          → Post asociado al usuario correcto
```

## Notas importantes:

- ⚠️ Reinicia el servidor Next.js después de estos cambios
- ⚠️ Borra el localStorage si tenías sesión anterior:
  ```javascript
  // En la consola del navegador (F12):
  localStorage.clear();
  ```
- ⚠️ Todos los servicios deben estar corriendo:
  - auth-service: 8001
  - user-service: 8004
  - posts-service: 8005
  - frontend: 3000

## Problemas conocidos pendientes:

- 🔄 Google Sign-in no implementado (botón deshabilitado)
- 🔄 Verificación de email no activa
- 🔄 Reset password funcional pero sin email real
