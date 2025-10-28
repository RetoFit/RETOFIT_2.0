# RetoFit 2.0 🏋️‍♂️

Bienvenido al repositorio oficial del proyecto RetoFit 2.0. Este es un monorepo que contiene la aplicación completa, incluyendo el frontend y todos los microservicios del backend.
## Equipo

### Nombre del equipo
<div style="font-size: 24px"><center><p><strong> RetoFit Team </strong></p></center></div>

### Miembros:
- **Cristhian Alejandro Alarcón Florido** (calarconf@unal.edu.co)
- **Andres David Caro Mora** (ancarom@unal.edu.co)
- **Anderson Steven Mateus Lopez** (amateusl@unal.edu.co)
- **Anderson David Morales Chila** (amoralesch@unal.edu.co)
- **Daniel Alejandro Ochoa Ruiz** (daochoar@unal.edu.co)
- **Cristian David Machado Guzmán** (cmachado@unal.edu.co)

## Sistema de Software

### Nombre
<div align="center"><h3><strong> RetoFit </strong></h3>
<img height="250px" width="250px" src="https://raw.githubusercontent.com/RetoFit/Image_Repository/refs/heads/main/svg-export-4x.png" alt="Logo"></div>

### 📜 Descripción

RETOFIT es una plataforma diseñada para ayudar y hacer un seguimiento a los ejercicios físicos de un usuario. Además, se intenta incentivar un mayor ejercicio físico con retos, logros y la creación de comunidades. La arquitectura está basada en microservicios para garantizar la escalabilidad y mantenibilidad del sistema.

## 💻 Pila Tecnológica

-   **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
-   **Backend:** 
    - [Python](https://www.python.org/) + [FastAPI](https://fastapi.tiangolo.com/).
    - Go.
    - Node.js.
    - PHP.
    - Java.
-   **Arquitectura:** Microservicios

## Requisitos funcionales y no funcionales

### Requisitos funcionales
---
- **RF-1:** Registrar nuevos usuarios mediante correo electrónico, redes sociales o autenticación federada (OAuth2, Google, Facebook).
- **RF-2:** Permitir login seguro y recuperación de contraseña.
- **RF-3:** Gestionar perfiles (edad, peso, altura, nivel de condición física).
- **RF-4:** Guardar historial de entrenamientos y métricas de progreso.
- **RF-5:** Crear y unirse a retos individuales o grupales.
- **RF-6:** Notificar avances, asignar puntos y medallas por logros alcanzados.
- **RF-7:** Registrar actividades físicas manualmente.
- **RF-8:** Permitir compartir/publicar logros.
- **RF-9:** Permitir interacción básica (likes, comentarios en logros).
- **RF-10:** Administración de contenidos (retos oficiales, banners de campañas).
- **RF-11:** Monitoreo de estadísticas de uso (usuarios activos, actividades registradas).

### Requisitos no funcionales
---
- **RNF-1:** Integrar autenticación con JWT.
- **RNF-2:** Generar token seguro de recuperación (con expiración).
- **RNF-3:** Asegurar que las rutas /login y /password/* solo funcionen sobre HTTPS.
- **RNF-4:** Añadir seguridad: solo el usuario dueño puede editar/consultar su perfil.
- **RNF-5:** Validar consistencia de datos antes de guardarlos (ej. duración > 0, fecha válida).
- **RNF-6:** Validar que un usuario no se pueda unir dos veces al mismo reto. 
- **RNF-7:** Definir reglas para asignación de puntos (ej. 10 puntos por cada actividad registrada, 50 por completar un reto).
- **RNF-8:** Definir reglas para asignación de medallas (ej. medalla por primer reto completado, medalla por 100 km acumulados).
- **RNF-9:** Implementar validaciones de fechas para la activación de retos y banners.
- **RNF-10:** El software debe seguir una arquitectura distribuida.
- **RNF-11:** El software debe incluir al menos dos componentes diferentes de tipo presentación.
- **RNF-12:** El front-end web debe seguir una subarquitectura SSR (Server-Side Rendering).
- **RNF-13:** El software debe incluir al menos 4 componentes de tipo lógico.
- **RNF-14:** El software debe incluir al menos un componente que permita la comunicación/orquestación entre los componentes lógicos.
- **RNF-15:** El software debe incluir al menos 4 componentes del tipo de datos (incluyendo bases de datos relacionales y no relacionales).
- **RNF-16:** El software debe incluir al menos un componente que sea responsable de manejar procesos asincrónicos dentro del sistema.
- **RNF-17:** El software debe incluir al menos dos tipos diferentes de conectores basados en HTTP.
- **RNF-18:** El software debe construirse usando al menos 5 lenguajes de programación diferentes de proposito general.
- **RNF-19:** El despliegue del software debe ser orientado a contenedores.

## Estructura arquitectónica
### Estructura de componentes y conectores
---
#### C&C View
<div align="center"><img width="80%" alt="image" src="https://raw.githubusercontent.com/RetoFit/Image_Repository/refs/heads/main/Blank%20diagram%20-%20Page%201.png" /></div>

#### **Estilos y patrones arquitectónicos usados**

#### Estilos arquitectónicos


El estilo arquitectónico usado es el de ***microservicios*** ya que el sistema de software se divide en pequeños servicios o componentes de backend con una responsabilidad y función específicas. Consta de 6 de estos microservicios que se describiran más adelante.

#### Patrones arquitectónicos

El principal patrón usado fue el ***api gateway***, el cual consiste en que desde el exterior del sistema solo hay un único punto de acceso, que en este caso es el ***api gateway***.

#### **Elementos y relaciones arquitectónicas**
Consta de 15 componentes y 16 conectores. En este caso, se tienen 2 componentes de presentación:

- **Frontend web:**

    Interfaz gráfica del sistema que se usa desde el navegador web.

- **Frontend móvil:**

    Interfaz gráfica del que se usa específicamente desde dispositivos moviles. Por ende, esta mejor optimizada para estos dispositivos.

Adicionalmente, se tiene un componente de comunicación:

- **Api Gateway**:

    Único punto de entrada al sistema desde el exterior, encargado de enrutar al microservicio al que se le ha pedido la solicitud. También, ayuda en la enrutación dentro del sistema cuando algunos servicios necesitan información de otros.

Tiene 6 componentes de lógica de negocio:

- **Auth:** 
    
    Este microservicio se encarga del registro, autenticación y autorización (login) del sistema.

- **Users:**

    Se encarga de la gestión de la base de datos de usuarios. En él, se registran y modifican los perfiles de los usuarios que tenga el sistema.

- **Physical_activities:**

    Se encarga de registrar las actividades físicas (como correr, ciclismo, caminar) de los usuarios registrados en el sistema.

- **Admin:**

    Se encarga de suspender o eliminar usuarios, ver las estadísticas de estos (por ejemplo, cuántos hay, qué condición física tienen, su género, etc). También, es el encargado de crear y mostrar los retos dentro de la plataforma.

- **Gamification:**

    Se encarga de asignar y calcular los puntos, de acuerdo a la actividad del usuario dentro del sistema.

- **Posts:**

    Servicio encargado de las publicaciones de los usuarios, asi como la interacción entre ellos (me gusta y responder).

A su vez cada componente de lógica de negocio tiene su base de datos, es decir que hay 6 componentes de datos.

- **retofit_auth_db:**

    Tiene la información de las cuentas de los usuarios como el correo y la contraseña.

- **retofit_users_db:**

    Tiene la información de los perfiles de los usuarios con datos como la edad, estado físico, deporte favorito, etc.

- **retofit_activities_db:**

    Tiene la información de las actividades físicas realizadas por el usuarrio como los kilómetros recorridos y en cuánto tiempo los recorrió.

- **retofit_retos_db:**

    Tiene la información de todos los retos creados por el administrador, asi como el porcentaje de avance de los usuarios.

- **retofit_gamification_db:**

    Tiene los puntos que tiene cada usuario por la realización de actividades.

- **retofit_posts_db:**

    Contiene la información relacionada al contenido de los posts, ya sea el texto escrito o la imagen compartida. Además de los *me gusta* y las respuestas hechas a cada post.

En cuanto a los conectores, existen los siguientes: 

- **HTTP:**

    Conecta directamente el navegador con el frontend web.

- **Rest:**

    Existen 8 de estos conectores dentro del sistema, de los cuales 2 se utilizan para comunicarse los dos componentes de presentación con el ***Api Gateway***, y los 6 restantes para la comunicación entre el ***api gateway*** y cada uno de los microservicios.

- **TCP:** 

    Los conectores TCP, se usaron para comunicar cada microservicio con su base de datos. Cada lenguaje utilizó su propio controlador para la respectiva base de datos.

- **gRPC:**

    Este conector se utilizó para realizar una petición desde el microservicio ***Physical_activities*** directamente hacia el microservicio ***Users***. Esto se hizó para confirmar que el usuario exista realmente en la base de datos.


---

## Layered View
<div align="center"><img width="80%" alt="image" src="https://raw.githubusercontent.com/RetoFit/Image_Repository/refs/heads/main/vista_layer.png" /></div>

### Capa de Presentación (Presentation Layer)

Es la interfaz con la que interactúa el usuario final. Se compone de las aplicaciones cliente que consumen la API.

* **Front web (Next.js):** Aplicación web principal, construida con Next.js.
* **Front mobil (...):** Aplicación móvil (iOS/Android).

### API Gateway

Actúa como el **punto de entrada único** (Single Point of Entry) para todas las peticiones que vienen de la Capa de Presentación. Sus responsabilidades principales incluyen:

* **Enrutamiento:** Redirige las peticiones al microservicio correspondiente en la Capa de Servicios.
* **Agregación:** Puede combinar respuestas de múltiples servicios en una sola.
* **Gestión Transversal:** Maneja tareas comunes como la autenticación inicial, el balanceo de carga y la limitación de tasa (rate limiting).

### Capa de Servicios (Services Layer)

El núcleo de la lógica de negocio de la aplicación. Está dividida en microservicios independientes, cada uno enfocado en una única responsabilidad de negocio.

* **Auth:** Maneja la autenticación (inicio de sesión, registro, gestión de tokens).
* **User:** Gestiona toda la información y operaciones relacionadas con los perfiles de usuario.
* **Activities:** Administra las actividades que los usuarios realizan.
* **Posts:** Se encarga de las publicaciones (crear, leer, actualizar, borrar).
* **Admin:** Contiene la lógica para las tareas de administración del sistema.
* **Gamification:** Implementa la lógica de ludificación (puntos, insignias, niveles, tablas de clasificación).

*Nota: Los servicios pueden comunicarse entre sí (como se indica entre `User` y `Activities`) para operaciones que requieren datos de diferentes dominios.*

### Capa de Datos (Data Layer)

Gestiona la persistencia de los datos. Esta arquitectura sigue el patrón **"Database per Service"** (Base de Datos por Servicio), lo que significa que cada microservicio es dueño de sus propios datos y tiene su propia base de datos.

Esto asegura que los servicios estén desacoplados y puedan evolucionar de forma independiente. Se utilizan dos tecnologías de bases de datos:

#### Cluster PostgreSQL (SQL)

Utilizado para datos estructurados y relacionales:

* **`retofit_auth_db`** (pertenece al servicio `Auth`)
* **`retofit_users_db`** (pertenece al servicio `User`)
* **`retofit_activities_db`** (pertenece al servicio `Activities`)
* **`retofit_posts_db`** (pertenece al servicio `Posts`)
* **`retofit_retos_db`** (pertenece a un servicio de Retos, probablemente `Activities` o `Gamification`)

#### Cluster MongoDB (NoSQL)

Utilizado para datos con mayor flexibilidad, esquemas dinámicos o alta volúmenes de escritura, como los de ludificación:

* **`retofit_gamification_db`** (pertenece al servicio `Gamification`)

---

#### Deployment View
<div align="center"><img width="80%" alt="image" src="https://github.com/user-attachments/assets/a0245f32-a43c-4133-bcf1-b23d236068b9" /></div>

#### Decomposition View
<div align="center"><img width="80%" alt="image" src="https://github-production-user-asset-6210df.s3.amazonaws.com/143036159/506176222-4b5a3a8a-a8ed-4f8d-b16c-bd2aed4c2a72.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20251027%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251027T230954Z&X-Amz-Expires=300&X-Amz-Signature=4a519e9ed9d857eab986cf3968577adcfc697b2b2e316e102ee49444deb6deb9&X-Amz-SignedHeaders=host" /></div>

#### Description of architectural elements and relations

**1. Presentation Module**

Este módulo agrupa todos los componentes responsables de la interfaz de usuario y la interacción con los usuarios finales.

**Elementos:**

**a) Front web (Next.js)**
- **Descripción:** Aplicación web desarrollada con Next.js que implementa Server-Side Rendering (SSR)
- **Responsabilidades:**
  - Renderizar interfaces de usuario responsivas
  - Gestionar el estado de la aplicación cliente
  - Realizar peticiones HTTP al API Gateway
  - Validar datos de entrada del lado del cliente
  - Implementar rutas y navegación de la aplicación
- **Tecnología:** Next.js 14 + React + TypeScript
- **Ubicación:** `/front`
- **Componentes internos:**
  - Páginas (dashboard, challenges, posts, profile)
  - Componentes UI reutilizables
  - Servicios de API (api.ts)
  - Configuración de autenticación (auth.js)

**b) Front móvil**
- **Descripción:** Aplicación móvil optimizada para dispositivos móviles (en desarrollo futuro)
- **Responsabilidades:**
  - Proveer experiencia de usuario nativa para dispositivos móviles
  - Consumir los mismos endpoints que el front web
  - Implementar características específicas de móviles (notificaciones push, geolocalización)
- **Estado:** Planificado para desarrollo futuro

**Relaciones del módulo Presentation:**
- Se comunica únicamente con el API Gateway (no tiene acceso directo a Services)
- Utiliza protocolo HTTP/HTTPS para todas las comunicaciones
- Implementa autenticación basada en JWT recibidos del backend

---

**2. Services Module**

Este módulo contiene todos los microservicios que implementan la lógica de negocio del sistema. Cada servicio es independiente y autónomo.

**Elementos:**

**a) Auth**
- **Descripción:** Microservicio de autenticación y autorización
- **Responsabilidades:**
  - Registro de usuarios (RF-1)
  - Autenticación con JWT (RNF-1)
  - Gestión de sesiones
  - Recuperación de contraseñas (RF-2, RNF-2)
  - Validación de tokens
- **Tecnología:** Python + FastAPI
- **Puerto:** 8001
- **Base de datos asociada:** retofit_auth_db
- **Endpoints principales:**
  - `POST /register` - Registro de usuarios
  - `POST /login` - Autenticación
  - `POST /password-reset` - Recuperación de contraseña
  - `POST /verify-token` - Validación de tokens

**b) User**
- **Descripción:** Microservicio de gestión de perfiles de usuario
- **Responsabilidades:**
  - Gestión de perfiles (RF-3)
  - Almacenamiento de datos personales (edad, peso, altura, nivel de condición física)
  - Historial de entrenamientos (RF-4)
  - Métricas de progreso de usuarios
  - Sincronización con Auth Service
- **Tecnología:** Python + FastAPI
- **Puerto:** 8004
- **Base de datos asociada:** retofit_users_db
- **Endpoints principales:**
  - `GET /me` - Obtener perfil del usuario actual
  - `PUT /profile` - Actualizar perfil
  - `GET /analytics/users` - Estadísticas de usuarios

**c) Activities**
- **Descripción:** Microservicio de gestión de actividades físicas
- **Responsabilidades:**
  - Registro de actividades físicas (RF-7)
  - Almacenamiento de métricas (distancia, tiempo, calorías, tipo de actividad)
  - Validación de consistencia de datos (RNF-5)
  - Comunicación con User Service vía gRPC para validación
  - Notificación a Gamification Service de nuevas actividades
- **Tecnología:** Go + Gin Framework
- **Puerto:** 8002
- **Base de datos asociada:** retofit_activities_db
- **Comunicación especial:** Implementa cliente gRPC para validar usuarios
- **Endpoints principales:**
  - `POST /activities` - Registrar actividad
  - `GET /activities/user/:id` - Obtener actividades de un usuario
  - `GET /activities/stats` - Estadísticas de actividades

**d) Posts**
- **Descripción:** Microservicio de publicaciones y red social
- **Responsabilidades:**
  - Crear y gestionar publicaciones (RF-8)
  - Gestionar interacciones sociales: likes y comentarios (RF-9)
  - Almacenar contenido multimedia
  - Moderar contenido
  - Feed de publicaciones personalizado
- **Tecnología:** Node.js + TypeScript + Express + Prisma ORM
- **Puerto:** 8005
- **Base de datos asociada:** retofit_posts_db
- **Endpoints principales:**
  - `POST /posts` - Crear publicación
  - `GET /posts` - Listar publicaciones
  - `POST /posts/:id/like` - Dar like
  - `POST /posts/:id/comments` - Comentar

**e) Admin**
- **Descripción:** Microservicio de administración del sistema
- **Responsabilidades:**
  - Crear y gestionar retos (RF-5, RF-10)
  - Administración de contenidos (banners, campañas)
  - Monitoreo de estadísticas del sistema (RF-11)
  - Dashboard administrativo
  - Gestión de progreso de usuarios en retos
  - Comunicación con Auth y User services para obtener datos
- **Tecnología:** PHP + Slim Framework + Guzzle HTTP Client
- **Puerto:** 8006
- **Base de datos asociada:** retofit_retos_db
- **Comunicación especial:** Usa Guzzle para comunicarse con otros servicios vía HTTP
- **Endpoints principales:**
  - `POST /admin/challenges` - Crear reto
  - `GET /admin/challenges` - Listar retos
  - `GET /admin/dashboard-stats` - Estadísticas del sistema
  - `PATCH /admin/challenges/:id/progress/:userId` - Actualizar progreso

**f) Gamification**
- **Descripción:** Microservicio de gamificación y logros
- **Responsabilidades:**
  - Asignar y calcular puntos (RF-6, RNF-7)
  - Otorgar medallas y logros (RF-6, RNF-8)
  - Calcular rankings y leaderboards
  - Procesamiento asíncrono de eventos (RNF-16)
  - Notificaciones de avances
- **Tecnología:** Python + FastAPI
- **Puerto:** 8003
- **Base de datos asociada:** retofit_gamification_db (MongoDB)
- **Comunicación especial:** Recibe eventos de Activities Service
- **Endpoints principales:**
  - `GET /users/:id/points` - Obtener puntos de usuario
  - `GET /users/:id/achievements` - Obtener logros
  - `POST /process-activity` - Procesar actividad para gamificación
  - `GET /leaderboard` - Ranking de usuarios

**Relaciones entre servicios:**
- **Auth ↔ User:** Sincronización al crear cuentas
- **Activities → User:** Validación de existencia de usuarios (gRPC)
- **Activities → Gamification:** Notificación de actividades para asignar puntos
- **Admin → Auth:** Consulta de usuarios registrados
- **Admin → User:** Estadísticas de perfiles de usuarios
- Todos los servicios se comunican vía REST API excepto Activities-User que usa gRPC

---

**3. Data Module**

Este módulo contiene todos los componentes de persistencia de datos, organizados en dos clusters según la tecnología de base de datos.

**a) PostgreSQL Cluster**

Agrupa todas las bases de datos relacionales del sistema.

**Elementos:**

**1. retofit_activities_db**
- **Asociado a:** Activities Service
- **Tipo:** Base de datos relacional
- **Contenido:**
  - Tabla `activities`: Registros de actividades físicas
  - Tabla `activity_types`: Tipos de actividades (correr, ciclismo, natación)
  - Campos: id, user_id, type, distance, duration, calories, date
- **Esquema:** Relaciones con usuarios para tracking de actividades

**2. retofit_retos_db**
- **Asociado a:** Admin Service
- **Tipo:** Base de datos relacional
- **Contenido:**
  - Tabla `challenges`: Retos creados
  - Tabla `progress_logs`: Progreso de usuarios en retos
  - Campos de challenges: id, name, description, type, target, unit, start_date, end_date
  - Validaciones de fechas (RNF-9)
- **Esquema:** Relaciones entre retos y progreso de usuarios

**3. retofit_auth_db**
- **Asociado a:** Auth Service
- **Tipo:** Base de datos relacional
- **Contenido:**
  - Tabla `users`: Credenciales de autenticación
  - Tabla `tokens`: Tokens de sesión y recuperación
  - Campos: id, email, password_hash, created_at, last_login
  - Tokens con expiración (RNF-2)
- **Seguridad:** Contraseñas hasheadas, tokens con TTL

**4. retofit_users_db**
- **Asociado a:** User Service
- **Tipo:** Base de datos relacional
- **Contenido:**
  - Tabla `profiles`: Perfiles de usuarios
  - Tabla `training_history`: Historial de entrenamientos
  - Campos: id, user_id, age, weight, height, fitness_level, favorite_sport
  - Métricas de progreso
- **Esquema:** Relaciones con historial y estadísticas

**5. retofit_posts_db**
- **Asociado a:** Posts Service
- **Tipo:** Base de datos relacional
- **Contenido:**
  - Tabla `posts`: Publicaciones de usuarios
  - Tabla `likes`: Likes en publicaciones
  - Tabla `comments`: Comentarios en publicaciones
  - Campos: id, user_id, content, image_url, created_at
- **Esquema:** Relaciones entre posts, likes y comentarios

**Proveedor:** AWS RDS (PostgreSQL 14)

**Conectores:** Cada servicio usa su driver específico:
- Python services: `psycopg2`
- Node.js service: `pg` (vía Prisma)
- PHP service: `PDO PostgreSQL`
- Go service: `pq`

**b) MongoDB Cluster**

Contiene la base de datos NoSQL para datos no estructurados.

**Elementos:**

**1. retofit_gamification_db**
- **Asociado a:** Gamification Service
- **Tipo:** Base de datos NoSQL (MongoDB)
- **Contenido:**
  - Colección `user_points`: Puntos de usuarios
  - Colección `achievements`: Logros desbloqueados
  - Colección `events`: Eventos de procesamiento asíncrono (RNF-16)
  - Colección `leaderboard`: Rankings calculados
  - Documentos con estructura flexible para diferentes tipos de logros
- **Ventaja:** Permite almacenar estructuras de datos variables para diferentes tipos de logros y eventos
- **Procesamiento:** Implementa cola de eventos para procesamiento asíncrono

**Proveedor:** Railway (MongoDB Atlas)

**Conector:** `pymongo` desde Python

---

**Relaciones entre módulos:**

1. **Presentation → Services:**
   - Todas las peticiones pasan por el API Gateway
   - Protocolo: REST over HTTP/HTTPS
   - Formato: JSON

2. **Services → Data:**
   - Cada servicio tiene acceso exclusivo a su base de datos
   - No hay acceso cruzado entre bases de datos
   - Protocolo: TCP con drivers específicos
   - Cada servicio gestiona sus propias migraciones y esquemas

3. **Services ↔ Services:**
   - REST API para la mayoría de comunicaciones
   - gRPC para Activities → User (validación rápida)
   - HTTP Client (Guzzle) para Admin → Auth/User

---

## Prototipo
## 🚀 Guía de Instalación y Ejecución
**========== Docker NO sirve ==========**

Recordar tener docker instalado y ejecutandose.

Para iniciar la aplicación en docker, se tiene que seguir los siguientes pasos:

**1. Contruir todos los contenedores**

```shell
docker compose build
```

**2. Lanzar todos los contenedores**

```shell
docker compose up -d
```

Abre la siguiente url en el navegador:

- http://localhost:3000


---
**Ver el estado de todos los contenedores**

```shell
docker compose ps
```

**Ver logs de un servicio específico**

```shell
docker compose logs -f [nombre-servicio]
```
**Para apagar y borrar todos los contenedores**

```shell
docker compose down
```
---

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno de desarrollo local.

### ✅ Requisitos Previos

Asegúrate de tener instalado lo siguiente:

- Java (versión 17.+). Ni superior ni inferior.
- Maven.
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [Python](https://www.python.org/downloads/) (versión 3.9 o superior)
- `npm` (se instala con Node.js) o `yarn`
- PHP (versión 8.0 o superior)
- Composer (gestor de dependencias para PHP)

### Clonar el Repositorio

Primero, clona este repositorio en tu máquina local.

```shell
git clone <URL_DEL_REPOSITORIO_GIT>
cd RETOFIT_2.0
```

### Opción automática de instalación y ejecución

#### Linux

Ejecutar los siguientes comandos en la raíz del proyecto:

1. Dar permisos de ejecución a los archivos ```instalaciones.sh``` y a ```arrance_sin_docker.sh```.

```bash
chmod +x arrance_sin_docker.sh

chmod +x instalaciones.sh
```

2. Ejecutar ```instalaciones.sh```

```bash
./instalaciones.sh
```

3. Ejecutar ```arrance_sin_docker.sh```

```bash
./arrance_sin_docker.sh
```

#### Windows

Ejecutar los siguientes comandos en la raíz del proyecto y como administrador en el ```Powershell```:

1. Ejecutar ```instalaciones.ps1```

```powershell
.\instalaciones.ps1
```

2. Ejecutar ```arrance_sin_docker.ps1```

```powershell
.\arrance_sin_docker.ps1
```

Si hay errores de permisos:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

3. En el navegador poner la dirección: **http://localhost:3000/**

### Opción manual

En caso de que los scripts no se ejecuten correctamente, este proceso, se puede hacer de forma manual. Debe seguir los siguientes pasos:

### 1. Configurar el Frontend

El frontend es una aplicación de Next.js. Para ejecutarla, sigue estos pasos:

```shell
# 1. Navega a la carpeta del frontend
cd front

# 2. Instala todas las dependencias del proyecto
npm install

# 3. Ejecuta el servidor de desarrollo
npm run dev
```

✨ ¡Listo! La aplicación de frontend estará disponible en **[http://localhost:3000](http://localhost:3000)**.

### 2. Configurar el Backend (Microservicios)

El backend consta de varios microservicios independientes. Cada uno debe ser configurado y ejecutado en su propia terminal.

### a. Proceso General para cada servicio en FastApi

Para los microservicios: `auth-service`, `gamification-service` y `user-service`, debes seguir estos pasos desde la raíz del proyecto:

1.  **Navegar a la carpeta del servicio**: `cd services/<nombre-del-servicio>`
2.  **Crear un entorno virtual**: 
    - En **Windows**: `python -m venv venv`
    - En **Linux**: `python3 -m venv venv`
3.  **Activar el entorno virtual**:
    -   En **Windows**: `venv\Scripts\activate`
    -   En **macOS/Linux**: `source venv/bin/activate`
4.  **Instalar las dependencias**: `pip install -r requirements.txt`

Una vez completados estos pasos, puedes ejecutar el servicio específico como se describe a continuación.

#### ▶️ Ejecutar los Microservicios en FastApi

Abre una terminal separada para cada servicio.

**1. Authentication Service (`auth-service`)**

```shell
# Navega a la carpeta del servicio
cd services/auth-service

# (Asegúrate de que tu entorno virtual esté activado)
# Ejecuta el servidor
uvicorn app.main:app --reload --port 8001
```
✅ El servicio de autenticación estará escuchando en **[http://localhost:8001](http://localhost:8001)**.

**2. Gamification Service (`gamification-service`)**

```shell
# Navega a la carpeta del servicio
cd services/gamification-service

# (Asegúrate de que tu entorno virtual esté activado)
# Ejecuta el servidor
uvicorn app.main:app --reload --port 8003
```
✅ El servicio de gamificación estará escuchando en **[http://localhost:8003](http://localhost:8003)**.

**3. User Service (`user-service`)**

```shell
# Navega a la carpeta del servicio
cd services/user-service

# (Asegúrate de que tu entorno virtual esté activado)
# Ejecuta el servidor
uvicorn app.main:app --reload --port 8004
```
✅ El servicio de usuarios estará escuchando en **[http://localhost:8004](http://localhost:8004)**.

### b. Proceso para el servicio de actividades en `Go`

Primero, te ubicas en la carpeta de ***physical_activities_service***-

```shell
# Navega a la carpeta del servicio
cd services/user-physical_activities_service
```

Luego, ejecutas los siguientes comandos para instalar las librerias y dependencias, y ejecutar el servicio:

```shell
# Instalar librerías
go mod tidy

# Ejecutar servicio
go run cmd/rest_api/main.go
```

### c. Proceso para el servicio de administración en `PHP`

Nos ubicamos en la carpeta ***admin-service***.

```shell
cd services/admin-service
```

Luego, instala las dependencias del proyecto con Composer.

Este comando lee el archivo `composer.json` y descarga todas las librerías necesarias (como Slim Framework y Guzzle) en la carpeta `vendor/`.

```shell
composer install
```

Despues, inicia el servidor de desarrollo integrado de PHP.

El servicio se ejecutará en el puerto 8006. El flag `-t public` es
importante porque establece el directorio `public/` como la raíz del servicio.

```shell
php -S localhost:8006 -t public
```

Este patrón de comunicación se realiza mediante **Guzzle**, un cliente **HTTP** para **PHP**. Esto permite que los microservicios, aunque escritos en diferentes lenguajes, colaboren entre sí de forma transparente.

### d. Proceso para el servicio de administración en `Node.js + TypeScript`

#### 1. Navegar al directorio del servicio

```bash
cd services/posts-service
```

#### 2. Instalar dependencias

```bash
npm install
```

#### 3. Generar cliente de Prisma

```bash
npx prisma generate
```
#### 4. Ejecutar migraciones de base de datos (OPCIONAL)

```bash
npx prisma migrate dev --name init
```

Si te pregunta por el nombre de la migración, usa "init" o "posts_service_initial".

#### 5. Iniciar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:8005`

### 3. Configurar el Api Gateway

#### 1. Navegar al directorio del api gateway

```bash
cd api_gateway
```

#### 2. Compilar api gateway

```bash
mvn clean package -DskipTests
```

#### 3. Ejecutar ***.jar***

```bash
java -jar target/*.jar
```

## 📁 Estructura del Proyecto

```
RETOFIT_2.0/
├── api_gateway/                     # Api Gateway (Java)
│   ├── src/
|   |   └── main/ 
|   |       ├── java/
|   |       |   └── com/
|   |       |       └── example/
|   |       |           └── api_gateway/
|   |       |               ├── config/
|   |       |               |   └── CorsConfig.java
|   |       |               ├── filter/
|   |       |               |   └── LoggingFilter.java
|   |       |               └── Application.java
│   |       └── resources/
|   |           └── application.yml
│   ├── pom.xml
├── front/                     # Frontend (Next.js)
│   ├── components/
│   ├── pages/
│   └── ...
├── services/                  # Microservicios
|    ├── activities-service/    # (Deprecated)
|    ├── auth-service/          # (Python) Servicio de Autenticación
|    ├── admin-service/         # (PHP) Servicio de Administración
|    ├── gamification-service/  # (Python) Servicio de Gamificación
|    ├── physical_activities_service/  # (Go) Servicio de actividades
|    ├── posts-service          # (Node.js + TypeScript) Servicio de foro
|    └── user-service/          # (Python) Servicio de Usuarios
├── .gitignore
└── README.md
```
