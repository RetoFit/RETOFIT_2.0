# Dockerfile

# Usa una imagen base de Python
FROM python:3.11-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo de requerimientos y los instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de la aplicación
COPY ./app /app/app

# Expone el puerto que usará la aplicación
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

### Desplegar con Docker: Desde la carpeta auth-service, construye la imagen con "docker build -t auth-service" .
###        y luego ejecútala con "docker run -p 8001:8000 -d --name auth-service auth-service".
### uvicorn app.main:app --reload --port 8003