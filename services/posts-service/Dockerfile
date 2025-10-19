# Usa una imagen base estable en lugar de Alpine
FROM node:20-bookworm

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias primero (para aprovechar la cache de Docker)
COPY package*.json ./

# Instala las dependencias de Node.js (sin devDependencies en producción)
RUN npm install 

# Copia el resto del código de la aplicación
COPY . .

# Genera el cliente de Prisma (necesario para que funcione correctamente dentro del contenedor)
RUN npx prisma generate

# Expone el puerto donde corre tu servicio
EXPOSE 8000

# Comando de inicio del servicio
CMD ["npm", "run", "dev"]
