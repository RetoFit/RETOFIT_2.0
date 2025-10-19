```
1. Navega a la carpeta del servicio de administración
cd services/admin-service

2. Instala las dependencias del proyecto con Composer.
Este comando lee el archivo `composer.json` y descarga todas las librerías
necesarias (como Slim Framework y Guzzle) en la carpeta `vendor/`.
composer install

3. Inicia el servidor de desarrollo integrado de PHP.
El servicio se ejecutará en el puerto 8006. El flag `-t public` es
importante porque establece el directorio `public/` como la raíz del

php -S localhost:8006 -t public

Este patrón de comunicación se realiza mediante **Guzzle**, un cliente HTTP para PHP. Esto permite que los microservicios, aunque escritos en diferentes lenguajes, colaboren entre sí de forma transparente.


```shell
# Navega a la carpeta del servicio
cd services/admin-service

# (Asegúrate de que tu entorno virtual esté activado)
# Ejecuta el servidor
php -S localhost:8006 -t public     

