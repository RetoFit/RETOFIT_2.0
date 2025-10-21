# Usa una imagen base de Node.js
FROM node:18-alpine

# Instala openssl, una dependencia de Prisma en Alpine Linux
RUN apk add --no-cache openssl

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY ./services/posts-service/package*.json ./

# Instala las dependencias de npm
RUN npm install

# Copia el schema de Prisma para poder generar el cliente
COPY ./services/posts-service/prisma ./prisma/

# Genera el cliente de Prisma DENTRO del contenedor para el target correcto
RUN npx prisma generate

# Copia el resto del código de la aplicación
COPY ./services/posts-service/ .

# Expone el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "npm", "run", "dev" ]