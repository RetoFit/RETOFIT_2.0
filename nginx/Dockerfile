# Dockerfile para nginx-proxy en RetoFit
FROM nginx:1.25-alpine

# Copia la configuración principal de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copia la configuración de los servidores (sites)
COPY conf.d/ /etc/nginx/conf.d/

# Copia certificados TLS si existen (opcional)
COPY tls/ /etc/nginx/tls/

# Expone los puertos HTTP y HTTPS
EXPOSE 80 443

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider https://localhost/nginx-health || exit 1
