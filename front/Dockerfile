# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY ./front/package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY ./front/ .

# Expone el puerto 3001
EXPOSE 3001

# Comando para ejecutar la aplicación en modo de desarrollo
CMD ["npm", "run", "dev", "--", "-p", "3001"]