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
<div style="font-size: 24px"><center><p><strong> RetoFit </strong></p></center></div>

<center><img style="width: 50%; height: 50%; border-radius: 50%; object-fit: cover;" src="https://raw.githubusercontent.com/RetoFit/Image_Repository/refs/heads/main/svg-export-4x.png" alt="Logo"></center>

### 📜 Descripción

RETOFIT es una plataforma diseñada para ayudar y hacer un seguimiento a los ejercicios físicos de un usuario. Además, se intenta incentivar un mayor ejercicio físico con retos, logros y la creación de comunidades. La arquitectura está basada en microservicios para garantizar la escalabilidad y mantenibilidad del sistema.

## 💻 Pila Tecnológica

-   **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
-   **Backend:** [Python](https://www.python.org/) con [FastAPI](https://fastapi.tiangolo.com/), Go, Node.js, PHp y Java.
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
- **RNF-10:**
- **RNF-11:**
- **RNF-12:**
- **RNF-13:**
- **RNF-14:**
- **RNF-15:**
- **RNF-16:**
- **RNF-17:**
- **RNF-18:**
- **RNF-19:**

## Estructura arquitectónica
### Estructura de componentes y conectores
---
#### C&C View
<img width="2238" height="1698" alt="image" src="https://github.com/user-attachments/assets/10233695-bb2a-411b-922c-834fad520e5b" />

#### Layered View
<img width="1295" height="1980" alt="image" src="https://github.com/user-attachments/assets/e238ee79-6bf8-4a4f-84c0-5cf85d70242d" />

#### Deployment View
<img width="3304" height="1997" alt="Blank diagram - Page 1" src="https://github.com/user-attachments/assets/a37b41c8-8c9f-408d-b7bd-966b1f58776a" />

#### Decomposition View
<img width="1164" height="1432" alt="image" src="https://github.com/user-attachments/assets/4b5a3a8a-a8ed-4f8d-b16c-bd2aed4c2a72" />

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
