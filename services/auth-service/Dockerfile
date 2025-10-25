# Dockerfile

# Usa una imagen base de Python
FROM python:3.13.7-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo de requerimientos y los instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de la aplicación
COPY ./app ./app

# Expone el puerto que usará la aplicación

ENV DATABASE_URL="postgresql://postgres:Retofit2025@retofit.cd66iick6o60.us-east-2.rds.amazonaws.com:5432/RetoFit"

# Configuración de email
ENV MAIL_USERNAME: retofitapp@gmail.com
ENV MAIL_PASSWORD: "ubid jqul mzmg nnwh"   
ENV MAIL_FROM: retofitapp@gmail.com
ENV MAIL_PORT: 587
ENV MAIL_SERVER: smtp.gmail.com
ENV MAIL_USE_TLS: true
ENV MAIL_USE_SSL: false

ENV SECRET_KEY: "f40cf292b97e6ec1e40e6a376e035ee9ebd9369c9dc233c474216ec0fe1b54aa"
ENV ALGORITHM: "HS256"

ENV BACKEND_URL="http://localhost:8000"

EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

### Desplegar con Docker: Desde la carpeta auth-service, construye la imagen con "docker build -t auth-service" .
###        y luego ejecútala con "docker run -p 8001:8000 -d --name auth-service auth-service".