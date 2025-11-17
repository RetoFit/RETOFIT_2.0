# Documentación de Arquitectura - RetoFit

Este documento detalla la estructura arquitectónica del sistema **RetoFit**, desglosando tanto la visión general del sistema como el diseño interno de sus microservicios principales desarrollados en Python.

Los diagramas siguen los lineamientos de **Estructuras de Descomposición** y **Estructuras de Capas** definidos en el curso de Arquitectura de Software.

---

## 1. Arquitectura General del Sistema

### 1.1. Diagrama de Descomposición del Sistema
Muestra la organización de alto nivel del código, dividiendo el sistema en unidades funcionales de implementación (Frontend, Backend Services, API Gateway).

![Diagrama de Descomposición General](diagramas/Diagrama_descomposicion_general.png)

* **Explicación:** El sistema se descompone jerárquicamente en tres grandes módulos: `FRONT` (Web y Móvil), `SERVICES` (Microservicios de negocio) y `API-GATEWAY` (Punto de entrada).
* **Relación:** Define una relación estricta de "parte-todo" (Is part of), donde cada submódulo tiene un único padre, sin dependencias cíclicas.

### 1.2. Diagrama de Capas del Sistema (Layered View)
Representa la separación lógica de responsabilidades y el flujo de uso permitido entre las partes del sistema.

![Diagrama de Capas General](diagramas/Diagrama_capas_general.png)

* **Explicación:** El sistema se estructura en capas horizontales: Presentación, Gateway, Servicios y Datos.
* **Restricción (Allowed-to-use):** Se cumple la restricción de unidireccionalidad. Las capas superiores solo pueden usar las inferiores (ej. `Presentation` -> `Gateway` -> `Services`), garantizando la separación de intereses y evitando ciclos.

---

## 2. Arquitectura de Componentes (Microservicios Python)

A continuación, se detalla el diseño interno de los servicios desarrollados en Python: `auth-service`, `gamification-service` y `user-service`.

### 2.1. Auth Service
Servicio encargado de la autenticación y autorización (Login, Registro).

#### Estructura de Descomposición
![Diagrama Descomposición Auth](diagramas/Diagrama_Descomposicion_Auth.png)
* **Descripción:** El módulo principal `app` contiene submódulos claramente definidos: `api` (endpoints), `core` (utilidades como email), `services` (lógica de registro/login) y `db` (modelos).

#### Estructura de Capas
![Diagrama Capas Auth](diagramas/Diagrama_Capas_Auth.png)
* **Descripción:** Diseño en 3 capas estrictas.
    1.  **Presentation:** Contiene el segmento `API` (`endpoints.py`).
    2.  **Business Logic:** Dividida en segmentos `Services` y `Core`. El segmento `Services` utiliza `Core` para tareas auxiliares.
    3.  **Data Access:** Contiene el segmento `DB` (`models.py`), aislado de la presentación.

### 2.2. Gamification Service
Servicio que gestiona los logros y el sistema de gamificación.

#### Estructura de Descomposición
![Diagrama Descomposición Gamification](diagramas/Diagrama_Descomposicion_Gamification.png)
* **Descripción:** Organización simplificada donde `app` agrupa `api`, `services` (lógica de logros) y `db`.

#### Estructura de Capas
![Diagrama Capas Gamification](diagramas/Diagrama_Capas_Gamification.png)
* **Descripción:** Flujo lineal simple (`API` -> `Services` -> `DB`).
* **Justificación:** Al tener una única responsabilidad (logros), la capa de negocio no requiere segmentación compleja, manteniendo la arquitectura limpia y fácil de mantener.

### 2.3. User Service
Servicio central de usuarios con capacidad de comunicación dual (REST y gRPC).

#### Estructura de Descomposición
![Diagrama Descomposición User](diagramas/Diagrama_Descomposicion_User.png)
* **Descripción:** Destaca por incluir dos módulos de interfaz: `api` (para web) y `grpc` (para comunicación eficiente entre servicios), además de `services` y `db`.

#### Estructura de Capas
![Diagrama Capas User](diagramas/Diagrama_Capas_User.png)
* **Descripción:**
    1.  **Presentation Layer:** Contiene dos segmentos paralelos: `REST Interface` y `gRPC Interface`. Ambos actúan como puntos de entrada.
    2.  **Business Logic Layer:** Ambos segmentos de presentación convergen en el segmento `Domain Services` (`token.py`).
    3.  **Data Access Layer:** Persistencia de datos de usuario.
* **Análisis:** Este diseño demuestra alta cohesión y reutilización, ya que múltiples interfaces de entrada consumen la misma lógica de negocio sin duplicar código.

---

### 2.3. Admin Service

#### Estructura de Descomposición

<img width="1846" height="473" alt="image" src="https://github.com/user-attachments/assets/6e01b3e2-ef30-4ebf-ad45-ae4b5059fa69" />

El admin-service es un microservicio de administración que orquesta las entidades centrales del dominio. Expone una API REST para la gestión completa de Challenges (incluyendo el progreso de usuarios) y Users.

Opera de forma autónoma con su propia base de datos (retofit_retors) y se integra con el user-service para la gestión de datos de usuarios, reflejando una clara separación de responsabilidades en la arquitectura de microservicios.

#### Estructura de Capas

<img width="930" height="908" alt="CapasAdmin" src="https://github.com/user-attachments/assets/c0b335da-3f7b-4506-b625-503f69c0192d" />

Microservicio REST que funciona como orquestador administrativo. Combina capa de presentación con endpoints HTTP y capa de infraestructura con:

Acceso directo a PostgreSQL vía PDO

Integración síncrona con microservicios (Auth, Users) usando Guzzle HTTP

Gestión completa de Challenges y Users mediante APIs REST

Arquitectura de 2 capas funcional: Presentación (rutas HTTP) + Infraestructura (BD y servicios externos).

