Después de revisar detalladamente el proyecto, aquí está la guía completa para desplegar en **Google Kubernetes Engine (GKE)**:

## 🚀 Guía de Despliegue en Google Kubernetes Engine (GKE)

### 📋 **Prerequisitos**

1. **Cuenta de Google Cloud Platform (GCP)** con facturación habilitada
2. **gcloud CLI** instalado y configurado
3. **kubectl** instalado
4. **Docker** para construir imágenes
5. **Google Container Registry (GCR) o Artifact Registry** habilitado

---

### **Paso 1: Configurar Google Cloud**

```powershell
# Autenticar con Google Cloud
gcloud auth login

# Configurar proyecto (reemplaza PROJECT_ID con tu proyecto)
gcloud config set project PROJECT_ID

# Habilitar APIs necesarias
gcloud services enable container.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

---

### **Paso 2: Crear Cluster GKE**

```powershell
# Crear cluster GKE (recomendado para producción)
gcloud container clusters create retofit-cluster `
  --zone=us-east1-b `
  --num-nodes=3 `
  --machine-type=e2-standard-2 `
  --disk-size=50GB `
  --enable-autoscaling `
  --min-nodes=2 `
  --max-nodes=5 `
  --enable-autorepair `
  --enable-autoupgrade `
  --network-policy

# Conectar kubectl al cluster
gcloud container clusters get-credentials retofit-cluster --zone=us-east1-b
```

**Opciones del cluster:**
- `e2-standard-2`: 2 vCPUs, 8GB RAM por nodo (ajusta según presupuesto)
- `num-nodes=3`: 3 nodos iniciales (total: 6 vCPUs, 24GB RAM)
- `--enable-autoscaling`: Escala automáticamente entre 2-5 nodos

---

### **Paso 3: Construir y Subir Imágenes a Container Registry**

**Opción A: Google Container Registry (GCR)**

```powershell
# Configurar Docker para GCR
gcloud auth configure-docker

# Tag y push de imágenes (reemplaza PROJECT_ID)
$PROJECT_ID = (gcloud config get-value project)
$REGISTRY = "gcr.io/$PROJECT_ID"

# Construir y pushear cada servicio
docker build -t $REGISTRY/auth-service:latest ./services/auth-service
docker push $REGISTRY/auth-service:latest

docker build -t $REGISTRY/users-service:latest ./services/user-service
docker push $REGISTRY/users-service:latest

docker build -t $REGISTRY/activities-service:latest ./services/physical_activities_service
docker push $REGISTRY/activities-service:latest

docker build -t $REGISTRY/gamification-service:latest ./services/gamification-service
docker push $REGISTRY/gamification-service:latest

docker build -t $REGISTRY/posts-service:latest ./services/posts-service
docker push $REGISTRY/posts-service:latest

docker build -t $REGISTRY/admin-service:latest ./services/admin-service
docker push $REGISTRY/admin-service:latest

docker build -t $REGISTRY/api-gateway:latest ./api_gateway_2.1
docker push $REGISTRY/api-gateway:latest

docker build -t $REGISTRY/landing-page:latest ./landing-page
docker push $REGISTRY/landing-page:latest

docker build -t $REGISTRY/frontend:latest ./front
docker push $REGISTRY/frontend:latest
```

**Opción B: Artifact Registry (Recomendado para nuevos proyectos)**

```powershell
# Crear repositorio de Artifact Registry
gcloud artifacts repositories create retofit-repo `
  --repository-format=docker `
  --location=us-east1 `
  --description="RetoFit container images"

# Configurar autenticación
gcloud auth configure-docker us-east1-docker.pkg.dev

# Usar formato: us-east1-docker.pkg.dev/PROJECT_ID/retofit-repo/SERVICE:TAG
$REGISTRY = "us-east1-docker.pkg.dev/$PROJECT_ID/retofit-repo"
```

---

### **Paso 4: Actualizar Manifiestos para GKE**

**Cambios necesarios en los manifiestos:**

#### **A) Actualizar imágenes en deployments**

Reemplazar `retofit/SERVICE:latest` por `gcr.io/PROJECT_ID/SERVICE:latest` en todos los archivos de `04-deployments/`:

```yaml
# Ejemplo: auth-service-deployment.yaml
spec:
  containers:
  - name: auth-service
    image: gcr.io/PROJECT_ID/auth-service:latest
    imagePullPolicy: Always  # Cambiar a Always para producción
```

#### **B) Ajustar Service de Nginx**

En nginx-service.yaml, GKE creará automáticamente un **Cloud Load Balancer**:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-proxy
  annotations:
    # Opcional: Reservar IP estática
    # cloud.google.com/load-balancer-type: "External"
spec:
  type: LoadBalancer
  loadBalancerSourceRanges:  # Opcional: Restringir acceso por IP
    - 0.0.0.0/0
  selector:
    app: nginx-proxy
  ports:
  - name: http
    port: 80
    targetPort: 80
  - name: https
    port: 443
    targetPort: 443
```

#### **C) Crear IP externa estática (Opcional pero recomendado)**

```powershell
# Reservar IP estática
gcloud compute addresses create retofit-ip --global

# Ver la IP asignada
gcloud compute addresses describe retofit-ip --global
```

Luego agregar a nginx-service.yaml:
```yaml
spec:
  loadBalancerIP: "IP_ESTATICA_AQUI"
```

---

### **Paso 5: Generar Certificados TLS**

```powershell
cd k8s
.\generate-certs.ps1

# Crear secret en GKE
kubectl create secret generic nginx-tls-secret `
  --from-file=nginx.pem=./nginx/tls/nginx.pem `
  --from-file=nginx-key.pem=./nginx/tls/nginx-key.pem
```

**Para producción con dominio real:**
- Usar **Google-managed SSL certificates** o **cert-manager** con Let's Encrypt
- Ejemplo con Google-managed cert:

```yaml
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: retofit-cert
spec:
  domains:
    - retofit.example.com
```

---

### **Paso 6: Desplegar Aplicación**

```powershell
# 1. Aplicar ConfigMaps
kubectl apply -f k8s/01-configmaps/

# 2. Aplicar Secrets
kubectl apply -f k8s/02-secrets/

# 3. Crear Services
kubectl apply -f k8s/03-services/

# 4. Desplegar aplicaciones
kubectl apply -f k8s/04-deployments/

# 5. Aplicar Network Policies
kubectl apply -f k8s/05-network-policies/

# Verificar estado
kubectl get pods
kubectl get services
```

---

### **Paso 7: Obtener IP Externa**

```powershell
# Ver la IP del Load Balancer (puede tardar 2-3 minutos)
kubectl get service nginx-proxy

# Esperar hasta que EXTERNAL-IP no sea <pending>
# Ejemplo output:
# NAME          TYPE           EXTERNAL-IP      PORT(S)
# nginx-proxy   LoadBalancer   34.123.45.67     80:30080/TCP,443:30443/TCP
```

---

### **Paso 8: Configurar DNS (Producción)**

1. Obtener IP externa del Load Balancer
2. En tu proveedor de DNS (Google Cloud DNS, Cloudflare, etc.):
   - Crear registro A: `retofit.example.com → IP_EXTERNA`
   - Crear registro A: `*.retofit.example.com → IP_EXTERNA`

3. Actualizar variables de entorno en deployments:
```yaml
- name: FRONTEND_URL
  value: "https://retofit.example.com"
```

---

### **Diferencias Clave: GKE vs Minikube**

| Aspecto | Minikube | GKE |
|---------|----------|-----|
| **Imágenes** | `minikube image load` | Push a GCR/Artifact Registry |
| **LoadBalancer** | Requiere `minikube tunnel` | Automático (Cloud Load Balancer) |
| **IP Externa** | `127.0.0.1` | IP pública global |
| **Certificados** | Autofirmados | Usar Google-managed o Let's Encrypt |
| **Costo** | Gratis (local) | ~$150-300/mes (cluster 3 nodos) |
| **Escalado** | Manual | Autoscaling automático |
| **Persistencia** | Local | Google Persistent Disks |

---

### **Monitoreo en GKE**

```powershell
# Ver logs de un pod
kubectl logs -l app=auth-service --tail=100

# Acceder a Cloud Console para monitoreo
# https://console.cloud.google.com/kubernetes/workload

# Habilitar Google Cloud Operations (anteriormente Stackdriver)
gcloud container clusters update retofit-cluster `
  --enable-cloud-logging `
  --enable-cloud-monitoring `
  --zone=us-east1-b
```

---

### **Costos Estimados (GKE)**

**Cluster básico (3 nodos e2-standard-2):**
- Compute: ~$120/mes
- Load Balancer: ~$20/mes
- Persistent Disks: ~$10/mes
- Egress (tráfico): Variable (~$10-50/mes)
- **Total: ~$150-200/mes**

**Optimizaciones:**
- Usar nodos `e2-micro` o `e2-small` para desarrollo: ~$50/mes
- Usar GKE Autopilot (pago por pod, no por nodo): Más económico para cargas variables
- Configurar autoscaling agresivo para reducir nodos en períodos de baja demanda

---

### **Comandos Útiles GKE**

```powershell
# Escalar cluster manualmente
gcloud container clusters resize retofit-cluster --num-nodes=5 --zone=us-east1-b

# Ver logs del cluster
gcloud container clusters list

# SSH a un nodo (debug)
gcloud compute ssh NODE_NAME --zone=us-east1-b

# Eliminar cluster (¡CUIDADO!)
gcloud container clusters delete retofit-cluster --zone=us-east1-b
```

---

### **Consideraciones de Seguridad para Producción**

1. **Secrets Management**: Usar **Google Secret Manager** en lugar de Kubernetes Secrets en texto plano
2. **Network Policies**: Las que tienes son básicas, considerar políticas más restrictivas
3. **Workload Identity**: Vincular service accounts de GKE con Google Cloud IAM
4. **Private Cluster**: Crear cluster con nodos privados (sin IPs públicas)
5. **Binary Authorization**: Verificar que solo se desplieguen imágenes firmadas

---

¿Necesitas ayuda con algún paso específico o quieres que genere scripts de automatización para el despliegue en GKE?