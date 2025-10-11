# 🔥 FENIX-SGCN - Sistema de Gestión de Continuidad de Negocio

**Versión:** 2.0.0  
**Estado:** ✅ Listo para Deployment  
**Desarrollado por:** CIDE Solutions

---

## 📋 DESCRIPCIÓN

Plataforma SaaS empresarial completa para la gestión de continuidad de negocio (BCM) conforme a **ISO 22301, ISO 31000, NIST, FFIEC y GDPR**.

### **Ecosistema Completo:**
- **Fenix-SGCN:** Aplicación multi-tenant para empresas
- **Fenix-Admin:** Panel de super-administración para gestión de licencias y clientes

---

## 🚀 INICIO RÁPIDO

### **1. Build Docker (Primera vez)**
```bash
cd C:\Users\meciz\Documents\fenix-SGCN
docker compose -f docker-compose.ecosystem.yml build --no-cache
```

### **2. Iniciar Ecosystem**

**Windows:**
```powershell
.\start-ecosystem.ps1
```

**Linux/Mac:**
```bash
chmod +x start-ecosystem.sh
./start-ecosystem.sh
```

### **3. Acceder a las Aplicaciones**
- 🌐 **SGCN:** http://localhost
- 🔧 **Admin:** http://localhost:8080 (admin@fenix.com / Admin2024!)
- 📊 **Dgraph:** http://localhost:8080/ui
- 💾 **MinIO:** http://localhost:9001

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────┐
│       NGINX PROXY (Puerto 80/8080)      │
└─────────────────────────────────────────┘
              │              │
    ┌─────────▼────┐   ┌────▼──────────┐
    │  FENIX-SGCN  │   │  FENIX-ADMIN  │
    │  (Multi-     │◄──┤  (Super       │
    │   tenant)    │   │   Admin)      │
    └──────┬───────┘   └───────┬───────┘
           │                   │
    ┌──────▼─────┐      ┌──────▼─────┐
    │PostgreSQL  │      │PostgreSQL  │
    │   :5432    │      │   :5433    │
    └────────────┘      └────────────┘
           │
    ┌──────▼──────────────────────┐
    │  Infraestructura Compartida │
    │  - Dgraph, Redis, MinIO     │
    └─────────────────────────────┘
```

---

## 📦 SERVICIOS INCLUIDOS

### **Aplicaciones:**
- `fenix_frontend` - Frontend SGCN (Next.js 14)
- `fenix_backend` - Backend SGCN (NestJS)
- `admin_frontend` - Frontend Admin (Next.js 14)
- `admin_backend` - Backend Admin (NestJS)

### **Bases de Datos:**
- `fenix_db` - PostgreSQL 17 (:5432)
- `admin_db` - PostgreSQL 17 (:5433)
- `fenix_dgraph` - Base de datos en grafo (:8080)

### **Infraestructura:**
- `fenix_redis` - Cache SGCN (:6379)
- `admin_redis` - Cache Admin (:6380)
- `fenix_storage` - MinIO S3 (:9000)
- `fenix_proxy` - Nginx proxy

---

## 🔑 CARACTERÍSTICAS PRINCIPALES

### **Módulos SGCN:**
1. ✅ **Planeación y Gobierno** (ISO 22301 Cl. 5)
2. ✅ **Análisis de Riesgos (ARA)** (ISO 31000)
3. ✅ **Análisis de Impacto (BIA)** (ISO 22317)
4. ✅ **Escenarios y Estrategias** (ISO 22301 Cl. 8.3)
5. ✅ **Planes de Continuidad** (ISO 22301 Cl. 8.4)
6. ✅ **Pruebas y Ejercicios** (ISO 22301 Cl. 8.5)
7. ✅ **Mejora Continua** (ISO 22301 Cl. 10)

### **Motores Transversales:**
- ⚙️ **Workflow Engine** - Automatización de flujos
- 📊 **Analytics Engine** - Análisis avanzado (Montecarlo, SPOF)
- 📄 **Reports Engine** - Generación de PDFs
- 🤖 **AI Integration** - Google Gemini para sugerencias

### **Panel Admin:**
- 👥 Gestión de clientes/tenants
- 🔐 Sistema de licencias
- 📈 Métricas de uso
- 💰 Facturación y planes
- 🔍 Auditoría completa

---

## 🔧 CONFIGURACIÓN

### **Variables de Entorno (.env.ecosystem)**

```bash
# SGCN Database
POSTGRES_USER=fenix
POSTGRES_PASSWORD=fenix_prod_2025_secure
POSTGRES_DB=fenix_sgcn

# Admin Database
ADMIN_DB_USER=admin_user
ADMIN_DB_PASSWORD=admin_secure_2025
ADMIN_DB_NAME=fenix_admin

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-64-chars
ADMIN_JWT_SECRET=admin-super-secret-key-64-chars

# Integration
ADMIN_API_KEY=fenix-integration-key-2025
ADMIN_API_URL=http://admin_backend:3101

# Storage
MINIO_ACCESS_KEY=fenix_minio_admin
MINIO_SECRET_KEY=fenix_minio_secure_2025

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AI (Opcional)
GOOGLE_AI_API_KEY=your-gemini-api-key
```

---

## 📚 DOCUMENTACIÓN

### **Guías Principales:**
- 📖 `RESUMEN-EJECUTIVO.md` - Resumen para ejecutivos
- 🚀 `INTEGRATION-README.md` - Guía completa de integración
- ✅ `DEPLOYMENT-CHECKLIST.md` - Checklist de despliegue
- 📊 `BUILD-STATUS.md` - Estado de compilación

### **Documentación Técnica:**
- 🔧 `FASE-3-4-RESUMEN.md` - Resumen de implementación
- 📝 `docs/fenix-sgcn-specs.md` - Especificaciones funcionales
- 🏗️ `docs/Fenix-SGCN_EspecificacionesTécnicas_Ver2.0.md` - Specs técnicas

---

## 🔐 PLANES Y LICENCIAS

| Plan | Max Usuarios | Max Procesos | Storage | Precio/Mes |
|------|--------------|--------------|---------|------------|
| **TRIAL** | 5 | 10 | 10GB | $0 |
| **STANDARD** | 25 | 50 | 50GB | $199 |
| **PROFESSIONAL** | 75 | 150 | 200GB | $399 |
| **PREMIUM** | 150 | 500 | 500GB | $799 |
| **ENTERPRISE** | 500+ | Ilimitado | Ilimitado | Custom |

### **Formato de Licencia:**
```
FENIX-{COMP}-{YEAR}-{RAND1}-{RAND2}
Ejemplo: FENIX-ACME-2025-X7K9-P2M4
```

---

## 🔄 INTEGRACIÓN SGCN ↔ ADMIN

### **Flujo de Registro:**
```
1. Usuario se registra en SGCN
   ↓
2. SGCN llama a Admin API (registerTenant)
   ↓
3. Admin crea cliente y genera licencia
   ↓
4. Admin retorna licenseKey
   ↓
5. SGCN almacena licencia en tenant
```

### **Endpoints de Integración:**

**Registro de Cliente:**
```bash
POST /api/integration/client/register-from-app
Headers: X-API-Key: fenix-integration-key-2025
Body: {
  "tenantId": "uuid",
  "companyName": "Empresa XYZ",
  "contactEmail": "admin@empresa.com",
  "plan": "STANDARD"
}
```

**Validación de Licencia:**
```bash
POST /api/integration/licenses/validate
Headers: X-API-Key: fenix-integration-key-2025
Body: {
  "tenantId": "uuid",
  "licenseKey": "FENIX-XXXX-2025-XXXX-XXXX"
}
```

---

## 🛠️ COMANDOS ÚTILES

### **Ver Logs:**
```bash
# Todos los servicios
docker compose -f docker-compose.ecosystem.yml logs -f

# Servicio específico
docker compose -f docker-compose.ecosystem.yml logs -f fenix_backend
```

### **Reiniciar Servicios:**
```bash
# Todo
docker compose -f docker-compose.ecosystem.yml restart

# Específico
docker compose -f docker-compose.ecosystem.yml restart fenix_backend
```

### **Detener:**
```bash
# Sin eliminar datos
docker compose -f docker-compose.ecosystem.yml down

# Eliminar todo (¡CUIDADO!)
docker compose -f docker-compose.ecosystem.yml down -v
```

### **Estado:**
```bash
docker compose -f docker-compose.ecosystem.yml ps
```

---

## 💾 BACKUPS

### **Manual:**
```bash
# PostgreSQL SGCN
docker exec fenix_db_prod pg_dump -U fenix fenix_sgcn > backup-sgcn.sql

# PostgreSQL Admin
docker exec admin_db_prod pg_dump -U admin_user fenix_admin > backup-admin.sql
```

### **Automático:**
Los backups se configuran en cron (ver `DEPLOYMENT-CHECKLIST.md`)

---

## 🧪 TESTING

### **Test de Registro:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@empresa.com",
    "password": "Test123!",
    "companyName": "Empresa Test",
    "fullName": "Usuario Test"
  }'
```

### **Test de Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@empresa.com",
    "password": "Test123!"
  }'
```

---

## 🐛 TROUBLESHOOTING

### **Error: Puerto en uso**
```bash
# Windows
netstat -ano | findstr :3001

# Linux/Mac
lsof -i :3001
```

### **Error: No se conecta a Admin**
```bash
# Verificar servicio
docker compose -f docker-compose.ecosystem.yml ps admin_backend

# Ver logs
docker compose -f docker-compose.ecosystem.yml logs admin_backend
```

### **Error: Build falla**
```bash
# Limpiar caché
docker system prune -a

# Rebuild
docker compose -f docker-compose.ecosystem.yml build --no-cache
```

---

## 🔒 SEGURIDAD

### **Antes de Producción:**
1. ✅ Cambiar todos los passwords
2. ✅ Rotar JWT secrets (64 chars random)
3. ✅ Cambiar API keys
4. ✅ Configurar SSL/HTTPS
5. ✅ Configurar firewall
6. ✅ Habilitar 2FA para Admin

### **SSL/HTTPS:**
```bash
# Generar certificados
certbot certonly --standalone -d sgcn.empresa.com
certbot certonly --standalone -d admin.empresa.com

# Copiar a nginx
cp /etc/letsencrypt/live/sgcn.empresa.com/*.pem nginx/ssl/
```

---

## 📞 SOPORTE

**Equipo de Desarrollo:**
- **Email:** soporte@cidesolutions.com
- **WhatsApp:** +57 315 765 1063
- **Ubicación:** Bogotá, Colombia

**Horario de Soporte:**
- Lunes a Viernes: 8:00 AM - 6:00 PM (COT)
- Sábados: 9:00 AM - 1:00 PM (COT)
- Emergencias 24/7: WhatsApp

---

## 🤝 CONTRIBUCIÓN

Este es un proyecto propietario de CIDE Solutions.  
Para contribuciones o mejoras, contactar al equipo de desarrollo.

---

## 📄 LICENCIA

Copyright © 2025 CIDE Solutions  
Todos los derechos reservados.

---

## 🎯 ROADMAP

### **v2.1 (Q1 2026)**
- [ ] Dashboard de métricas en Admin
- [ ] Sistema de notificaciones push
- [ ] Integración con Teams/Slack
- [ ] App móvil nativa

### **v2.2 (Q2 2026)**
- [ ] ML para predicción de riesgos
- [ ] Blockchain para auditoría
- [ ] Multi-región deployment
- [ ] Advanced analytics

---

**Versión:** 2.0.0  
**Última actualización:** Octubre 10, 2025  
**Estado:** ✅ Listo para Deployment
