# Usa una imagen base de PHP con Apache
FROM php:8.1-apache

# Habilita mod_rewrite de Apache para las rutas amigables
RUN a2enmod rewrite

# Instala las dependencias de PHP necesarias
RUN docker-php-ext-install pdo pdo_mysql

# Copia los archivos del proyecto al directorio de Apache
COPY ./services/admin-service/ /var/www/html/

# Establece el DocumentRoot de Apache al directorio 'public'
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Instala Composer y las dependencias del proyecto
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
WORKDIR /var/www/html
RUN composer install --no-interaction --optimize-autoloader

# Cambia la propiedad de los archivos al usuario de Apache
RUN chown -R www-data:www-data /var/www/html

# Expone el puerto 80
EXPOSE 80