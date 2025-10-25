# Imagen base con Go
FROM golang:1.25-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias
COPY go.mod go.sum ./
RUN go mod download

# Copiamos el resto del código fuente
COPY . .

# Compilamos el binario desde la carpeta cmd/rest_api
RUN go build -o main ./cmd/rest_api

# Exponemos el puerto (ajústalo según tu app)
EXPOSE 8000

# Comando para ejecutar la app
CMD ["./main"]
