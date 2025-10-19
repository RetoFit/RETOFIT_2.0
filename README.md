# RETOFIT 2.0 🏋️‍♂️

Bienvenido al repositorio oficial del proyecto RETOFIT 2.0. Este es un monorepo que contiene la aplicación completa, incluyendo el frontend y todos los microservicios del backend.

## 📜 Descripción

RETOFIT es una plataforma diseñada para [**aquí puedes añadir una breve descripción del objetivo del proyecto, por ejemplo: "gestionar y gamificar las actividades físicas de los usuarios"**]. La arquitectura está basada en microservicios para garantizar la escalabilidad y mantenibilidad del sistema.

## 💻 Pila Tecnológica

-   **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
-   **Backend:** [Python](https://www.python.org/) con [FastAPI](https://fastapi.tiangolo.com/)
-   **Arquitectura:** Microservicios

## 🚀 Guía de Instalación y Ejecución

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

-   [Node.js](https://nodejs.org/) (versión 18 o superior)
-   [Python](https://www.python.org/downloads/) (versión 3.9 o superior)
-   `npm` (se instala con Node.js) o `yarn`

### 1. Clonar el Repositorio

Primero, clona este repositorio en tu máquina local.

```shell
git clone <URL_DEL_REPOSITORIO_GIT>
cd RETOFIT_2.0
```

### 2. Configurar el Frontend

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

### 3. Configurar el Backend (Microservicios)

El backend consta de varios microservicios independientes. Cada uno debe ser configurado y ejecutado en su propia terminal.

#### Proceso General para cada Servicio

Para cada microservicio (`auth-service`, `activities-service`, etc.), debes seguir estos pasos desde la raíz del proyecto:

1.  **Navegar a la carpeta del servicio**: `cd services/<nombre-del-servicio>`
2.  **Crear un entorno virtual**: `python -m venv venv`
3.  **Activar el entorno virtual**:
    -   En **Windows**: `venv\Scripts\activate`
    -   En **macOS/Linux**: `source venv/bin/activate`
4.  **Instalar las dependencias**: `pip install -r requirements.txt`

Una vez completados estos pasos, puedes ejecutar el servicio específico como se describe a continuación.

---

#### ▶️ Ejecutar los Microservicios

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

**2. Activities Service (`activities-service`)**

```shell
# Navega a la carpeta del servicio
cd services/activities-service

# (Asegúrate de que tu entorno virtual esté activado)
# Ejecuta el servidor
uvicorn app.main:app --reload --port 8002
```
✅ El servicio de actividades estará escuchando en **[http://localhost:8002](http://localhost:8002)**.

**3. Gamification Service (`gamification-service`)**

```shell
# Navega a la carpeta del servicio
cd services/gamification-service

# (Asegúrate de que tu entorno virtual esté activado)
# Ejecuta el servidor
uvicorn app.main:app --reload --port 8003
```
✅ El servicio de gamificación estará escuchando en **[http://localhost:8003](http://localhost:8003)**.

**4. User Service (`user-service`)**

```shell
# Navega a la carpeta del servicio
cd services/user-service

# (Asegúrate de que tu entorno virtual esté activado)
# Ejecuta el servidor
uvicorn app.main:app --reload --port 8004
```
✅ El servicio de usuarios estará escuchando en **[http://localhost:8004](http://localhost:8004)**.

---

## 📁 Estructura del Proyecto

```
RETOFIT_2.0/
├── front/               # Código fuente del Frontend (Next.js)
│   ├── components/
│   ├── pages/
│   └── ...
└── services/            # Contenedor de todos los microservicios
    ├── activities-service/
    ├── auth-service/
    ├── gamification-service/
    └── user-service/
```
