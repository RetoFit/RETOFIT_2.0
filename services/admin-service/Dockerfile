# Etapa 1: construcción
FROM composer:2.7 AS builder

WORKDIR /app

# Copiamos los archivos de definición de dependencias
COPY composer.json composer.lock ./

# Instalamos dependencias de producción
RUN composer install --no-dev --no-interaction --optimize-autoloader

# Copiamos el resto del código fuente
COPY . .

# Etapa 2: servidor PHP con Apache
FROM php:8.2-apache

# Habilitar módulos necesarios (puedes agregar más si los usas)
RUN docker-php-ext-install pdo pdo_mysql

# Configurar el DocumentRoot para apuntar a la carpeta 'public'
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# Reescribimos la configuración de Apache
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copiamos los archivos desde la etapa builder
COPY --from=builder /app /var/www/html

# Habilitar mod_rewrite (importante para frameworks PHP modernos)
RUN a2enmod rewrite

EXPOSE 8000

CMD ["apache2-foreground"]
