# 🔥 FENIX ECOSYSTEM - Integración Completa

Sistema completo integrado de **Fenix-SGCN** (aplicación multi-tenant) + **Fenix-Admin** (panel de administración)

## 📋 Arquitectura del Ecosistema

```
┌─────────────────────────────────────────────────────────────┐
│                     NGINX PROXY                              │
│  Puerto 80 (SGCN) │ Puerto 8080 (Admin)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
         ┌───────▼────────┐       ┌───────▼────────┐
         │  FENIX-SGCN    │       │  FENIX-ADMIN   │
         │                │       │                │
         │ Frontend:3000  │       │ Frontend:3000  │
         │ Backend:3001   │◄──────┤ Backend:3101   │
         └────────┬───────┘       └────────┬───────┘
                  │                        │
         ┌────────▼────────┐      ┌────────▼────────┐
         │  PostgreSQL     │      │  PostgreSQL     │
         │  Port: 5432     │      │  Port: 5433     │
         └─────────────────┘      └─────────────────┘
                  │
         ┌────────▼────────────────────┐
         │  Infraestructura Compartida │
         │  - Dgraph (Grafo)           │
         │  - Redis (Cache)            │
         │  - MinIO (Storage)          │
         └─────────────────────────────┘
```

## 🚀 Inicio Rápido

### Opción 1: Script Automatizado (Recomendado)

**Windows (PowerShell):**
```powershell
.\start-ecosystem.ps1
```

**Linux/Mac:**
```bash
chmod +x start-ecosystem.sh
./start-ecosystem.sh
```

### Opción 2: Manual

```bash
# 1. Configurar variables de entorno
cp .env.ecosystem .env

# 2. Construir imágenes
docker compose -f docker-compose.ecosystem.yml build

# 3. Iniciar servicios
docker compose -f docker-compose.ecosystem.yml up -d

# 4. Ver logs
docker compose -f docker-compose.ecosystem.yml logs -f
```

## 🌐 URLs de Acceso

### Aplicación Principal (FENIX-SGCN)
- **Frontend:** http://localhost
- **Backend API:** http://localhost:3001
- **Usuarios:** Multi-tenant, cada empresa tiene su espacio

### Panel de Administración (FENIX-ADMIN)
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3101
- **Usuario por defecto:** 
  - Email: `admin@fenix.com`
  - Password: `Admin2024!`

### Infraestructura
- **PostgreSQL SGCN:** `localhost:5432`
- **PostgreSQL Admin:** `localhost:5433`
- **Dgraph UI:** http://localhost:8080/ui
- **MinIO Console:** http://localhost:9001
- **Redis SGCN:** `localhost:6379`
- **Redis Admin:** `localhost:6380`

## 🔗 Integración entre Aplicaciones

### Flujo de Registro de Cliente

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│ Usuario se  │      │ Fenix-SGCN   │      │ Fenix-Admin │
│ registra    │─────►│ POST /auth   │─────►│ POST /api/  │
│             │      │ /register    │      │ integration │
└─────────────┘      └──────────────┘      │ /client/    │
                             │              │ register    │
                             │              └─────────────┘
                             │                     │
                     ┌───────▼─────────────────────▼───────┐
                     │ 1. Crear tenant en SGCN             │
                     │ 2. Registrar cliente en Admin       │
                     │ 3. Generar licencia                 │
                     │ 4. Retornar datos de activación     │
                     └─────────────────────────────────────┘
```

### API de Integración

**Endpoint de registro (Admin):**
```http
POST /api/integration/client/register-from-app
Headers: X-API-Key: fenix-integration-key-2025
Body: {
  "tenantId": "uuid",
  "companyName": "Empresa XYZ",
  "contactEmail": "admin@empresa.com",
  "contactName": "Juan Pérez",
  "plan": "STANDARD"
}
```

**Endpoint de validación de licencia:**
```http
POST /api/integration/licenses/validate
Headers: X-API-Key: fenix-integration-key-2025
Body: {
  "tenantId": "uuid",
  "licenseKey": "FENIX-XXXX-2025-XXXX-XXXX"
}
```

**Endpoint de métricas de uso:**
```http
POST /api/integration/metrics/usage
Headers: X-API-Key: fenix-integration-key-2025
Body: {
  "tenantId": "uuid",
  "date": "2025-10-10",
  "activeUsers": 15,
  "processesCreated": 20,
  "risksRegistered": 35
}
```

## 🔐 Seguridad

### Variables de Entorno Críticas

**Cambiar SIEMPRE en producción:**

```bash
# SGCN
JWT_SECRET=your-super-secret-jwt-key-2025
POSTGRES_PASSWORD=fenix_prod_secure_2025

# Admin
ADMIN_JWT_SECRET=admin-super-secret-key-2025
ADMIN_DB_PASSWORD=admin_secure_2025
ADMIN_API_KEY=fenix-integration-key-unique-2025

# Storage
MINIO_ACCESS_KEY=custom_admin
MINIO_SECRET_KEY=custom_secure_2025
```

### API Keys

La comunicación entre SGCN y Admin usa API Key (`X-API-Key` header):
- Definida en `ADMIN_API_KEY`
- Debe ser única por instalación
- Se valida en el middleware de Admin

## 📊 Gestión de Licencias

### Planes Disponibles

| Plan | Max Usuarios | Max Procesos | Precio/Mes | Módulos |
|------|--------------|--------------|------------|---------|
| **TRIAL** | 5 | 10 | Gratis | Básicos |
| **STANDARD** | 25 | 50 | $199 | Todos menos QA |
| **PROFESSIONAL** | 75 | 150 | $399 | Todos + QA |
| **PREMIUM** | 150 | 500 | $799 | Todos + Soporte |
| **ENTERPRISE** | 500+ | Ilimitado | Custom | Personalizado |

### Generación de Licencias

Las licencias se generan automáticamente al registrar un cliente:

```
Formato: FENIX-{COMP}-{YEAR}-{RAND1}-{RAND2}
Ejemplo: FENIX-ACME-2025-X7K9-P2M4
```

### Validación de Licencias

El backend de SGCN valida licencias:
1. Al iniciar sesión del usuario
2. Cada 24 horas (background job)
3. Al realizar acciones críticas

**Modos de validación:**
- **Online:** Consulta API de Admin
- **Degradado:** Si Admin no responde, permite acceso temporal

## 💾 Backups

### Automáticos (Configurados en Admin)

```bash
# Backup diario de PostgreSQL SGCN
docker exec fenix_db_prod pg_dump -U fenix fenix_sgcn > backups/sgcn/backup-$(date +%Y%m%d).sql

# Backup diario de PostgreSQL Admin
docker exec admin_db_prod pg_dump -U admin_user fenix_admin > backups/admin/backup-$(date +%Y%m%d).sql
```

### Restauración

```bash
# Restaurar SGCN
docker exec -i fenix_db_prod psql -U fenix fenix_sgcn < backups/sgcn/backup-20251010.sql

# Restaurar Admin
docker exec -i admin_db_prod psql -U admin_user fenix_admin < backups/admin/backup-20251010.sql
```

## 🔧 Mantenimiento

### Ver Logs en Tiempo Real

```bash
# Todos los servicios
docker compose -f docker-compose.ecosystem.yml logs -f

# Solo SGCN backend
docker compose -f docker-compose.ecosystem.yml logs -f fenix_backend

# Solo Admin backend
docker compose -f docker-compose.ecosystem.yml logs -f admin_backend
```

### Reiniciar Servicios

```bash
# Reiniciar todo
docker compose -f docker-compose.ecosystem.yml restart

# Reiniciar solo backend SGCN
docker compose -f docker-compose.ecosystem.yml restart fenix_backend

# Reiniciar solo Admin
docker compose -f docker-compose.ecosystem.yml restart admin_backend
```

### Detener Sistema

```bash
# Detener sin eliminar volúmenes
docker compose -f docker-compose.ecosystem.yml down

# Detener y eliminar TODO (¡CUIDADO!)
docker compose -f docker-compose.ecosystem.yml down -v
```

## 🐛 Troubleshooting

### Error: Puerto ya en uso

```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Linux/Mac

# Cambiar puerto en .env.ecosystem
PORT=3002
```

### Error: No se puede conectar a Admin

1. Verificar que Admin esté corriendo:
   ```bash
   docker compose -f docker-compose.ecosystem.yml ps admin_backend
   ```

2. Verificar logs:
   ```bash
   docker compose -f docker-compose.ecosystem.yml logs admin_backend
   ```

3. Verificar variables de entorno:
   ```bash
   docker compose -f docker-compose.ecosystem.yml exec fenix_backend env | grep ADMIN
   ```

### Error: Frontend no compila

```bash
# Limpiar caché de Next.js
docker compose -f docker-compose.ecosystem.yml exec fenix_frontend rm -rf .next
docker compose -f docker-compose.ecosystem.yml restart fenix_frontend
```

### Error: Base de datos no inicia

```bash
# Ver logs de PostgreSQL
docker compose -f docker-compose.ecosystem.yml logs fenix_db

# Verificar permisos de volúmenes
docker volume inspect fenix_postgres_data
```

## 📈 Monitoreo

### Health Checks

Todos los servicios tienen health checks configurados:

```bash
# Ver estado de salud
docker compose -f docker-compose.ecosystem.yml ps

# Estado: healthy, unhealthy, starting
```

### Métricas de Uso

Admin recopila métricas automáticamente:
- Usuarios activos por tenant
- Procesos creados
- Riesgos registrados
- Planes ejecutados
- Ejercicios completados

**Ver en:** http://localhost:8080/metrics

## 🚢 Despliegue en Producción

### 1. Configurar dominio

```nginx
# nginx.conf
server_name sgcn.empresa.com;  # SGCN
server_name admin.empresa.com; # Admin
```

### 2. Configurar SSL

```bash
# Generar certificados (Let's Encrypt)
certbot certonly --webroot -w /var/www/html -d sgcn.empresa.com
certbot certonly --webroot -w /var/www/html -d admin.empresa.com

# Copiar certificados
cp /etc/letsencrypt/live/sgcn.empresa.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/sgcn.empresa.com/privkey.pem nginx/ssl/
```

### 3. Variables de producción

```bash
# .env.ecosystem
NODE_ENV=production
POSTGRES_PASSWORD=super_secure_random_password
JWT_SECRET=super_secure_random_jwt_secret
ADMIN_API_KEY=super_secure_random_api_key
```

### 4. Iniciar en producción

```bash
docker compose -f docker-compose.ecosystem.yml up -d --build
```

## 📞 Soporte

- **Documentación:** https://docs.fenix-sgcn.com
- **Email:** soporte@cidesolutions.com
- **WhatsApp:** +57 315 765 1063

---

**Versión:** 2.0.0  
**Última actualización:** Octubre 2025  
**Desarrollado por:** CIDE Solutions
