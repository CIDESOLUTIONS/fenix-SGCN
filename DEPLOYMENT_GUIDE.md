# ========================================
# FASE 4: DEPLOYMENT GUIDE - FENIX-SGCN
# ========================================

## 📋 Pre-requisitos

- Docker y Docker Compose instalados
- Node.js 20+ (para desarrollo local)
- PostgreSQL 16+
- Dgraph 21+
- Mínimo 4GB RAM disponible
- 10GB de espacio en disco

## 🏗️ Arquitectura de Producción

```
┌─────────────────────────────────────────────────────────┐
│                    NGINX (Puerto 80/443)                │
├─────────────────┬────────────────┬─────────────────────┤
│                 │                 │                     │
│   Frontend      │   Backend API   │    MinIO Storage    │
│   (Next.js)     │   (NestJS)     │    (Archivos)      │
│   Puerto 3000   │   Puerto 3001   │    Puerto 9000     │
└─────────────────┴────────────────┴─────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   PostgreSQL         Dgraph            Redis
   (Datos)           (Grafos)          (Cache)
   Puerto 5432       Puerto 8080       Puerto 6379
```

## 🚀 Despliegue Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/fenix-sgcn/fenix-sgcn.git
cd fenix-sgcn
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Construir y levantar servicios
```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Producción
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Inicializar base de datos
```bash
# Ejecutar migraciones
docker exec fenix_backend_prod npx prisma migrate deploy

# Cargar datos semilla (opcional)
docker exec fenix_backend_prod npm run seed
```

## 🔧 Configuración de Producción

### Variables de Entorno Críticas

```env
# Database
DATABASE_URL=postgresql://user:pass@fenix_db_master:5432/fenix_sgcn

# Security
JWT_SECRET=your-secure-jwt-secret-min-32-chars
JWT_EXPIRES_IN=7d

# Dgraph
DGRAPH_URL=http://fenix_dgraph:8080
DGRAPH_GRPC_URL=fenix_dgraph:9080

# Redis
REDIS_HOST=fenix_redis
REDIS_PORT=6379

# Storage
MINIO_ENDPOINT=fenix_storage
MINIO_PORT=9000
MINIO_ACCESS_KEY=your-minio-access-key
MINIO_SECRET_KEY=your-minio-secret-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@fenix-sgcn.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 📊 Monitoreo y Logs

### Ver logs de servicios
```bash
# Todos los servicios
docker-compose -f docker-compose.prod.yml logs -f

# Servicio específico
docker-compose -f docker-compose.prod.yml logs -f fenix_backend_prod
```

### Health Checks
```bash
# Backend
curl http://localhost:3001/health

# Frontend
curl http://localhost:3000

# Dgraph
curl http://localhost:8080/health

# PostgreSQL
docker exec fenix_db_master_prod pg_isready
```

## 🔒 Seguridad en Producción

### 1. Configurar HTTPS con Let's Encrypt
```bash
# Instalar certbot
docker exec fenix_proxy_prod apk add certbot certbot-nginx

# Obtener certificado
docker exec fenix_proxy_prod certbot --nginx -d yourdomain.com
```

### 2. Configurar Firewall
```bash
# Solo permitir puertos necesarios
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

### 3. Backups Automáticos
```bash
# Script de backup (agregar a cron)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec fenix_db_master_prod pg_dump -U fenix fenix_sgcn > backup_$DATE.sql
```

## 🎯 Optimización de Performance

### 1. Configuración de PostgreSQL
```sql
-- En postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 4MB
```

### 2. Índices de Base de Datos
```sql
-- Índices críticos ya incluidos en migraciones
CREATE INDEX idx_findings_tenant_status ON findings(tenant_id, status);
CREATE INDEX idx_corrective_actions_finding ON corrective_actions(finding_id);
CREATE INDEX idx_business_processes_tenant ON business_processes(tenant_id);
```

### 3. Cache Redis
- TTL configurado: 5 minutos para queries frecuentes
- Invalidación automática en escrituras

## 📈 Escalamiento

### Horizontal Scaling con Docker Swarm
```bash
# Inicializar swarm
docker swarm init

# Desplegar stack
docker stack deploy -c docker-compose.prod.yml fenix

# Escalar servicios
docker service scale fenix_backend=3
docker service scale fenix_frontend=2
```

### Load Balancing con Nginx
```nginx
upstream backend {
    least_conn;
    server backend1:3001;
    server backend2:3001;
    server backend3:3001;
}
```

## 🔄 Actualizaciones sin Downtime

```bash
# 1. Construir nueva imagen
docker-compose -f docker-compose.prod.yml build --no-cache fenix_backend

# 2. Actualizar servicio con rolling update
docker-compose -f docker-compose.prod.yml up -d --no-deps --build fenix_backend

# 3. Verificar health
docker exec fenix_backend_prod curl http://localhost:3001/health
```

## 📝 Troubleshooting

### Problema: Base de datos no conecta
```bash
# Verificar conectividad
docker exec fenix_backend_prod nc -zv fenix_db_master 5432

# Ver logs de PostgreSQL
docker logs fenix_db_master_prod
```

### Problema: Frontend no carga
```bash
# Verificar build de Next.js
docker exec fenix_frontend_prod npm run build

# Revisar variables de entorno
docker exec fenix_frontend_prod env | grep NEXT_PUBLIC
```

### Problema: Dgraph no sincroniza
```bash
# Reiniciar Dgraph
docker-compose -f docker-compose.prod.yml restart fenix_dgraph

# Verificar schema
curl -X POST http://localhost:8080/admin/schema -d '@dgraph-schema.graphql'
```

## 📊 Métricas de Performance

### Objetivos SLA
- Disponibilidad: 99.95%
- Tiempo de respuesta API: < 200ms (p95)
- Tiempo de carga frontend: < 2s
- RTO: < 1 hora
- RPO: < 15 minutos

### Herramientas de Monitoreo Recomendadas
- **Prometheus + Grafana**: Métricas del sistema
- **ELK Stack**: Logs centralizados
- **Sentry**: Error tracking
- **New Relic**: APM completo

## 🚨 Plan de Recuperación ante Desastres

### Backup Completo
```bash
#!/bin/bash
# backup.sh - Ejecutar diariamente
DATE=$(date +%Y%m%d)

# Backup PostgreSQL
docker exec fenix_db_master_prod pg_dump -U fenix fenix_sgcn | gzip > postgres_$DATE.sql.gz

# Backup Dgraph
docker exec fenix_dgraph dgraph export -o /dgraph/export
docker cp fenix_dgraph:/dgraph/export ./dgraph_$DATE

# Backup archivos MinIO
docker run --rm -v fenix-sgcn_minio_prod_data:/data -v $(pwd):/backup alpine tar czf /backup/minio_$DATE.tar.gz /data

# Subir a S3/Cloud Storage
aws s3 cp postgres_$DATE.sql.gz s3://fenix-backups/
aws s3 cp dgraph_$DATE s3://fenix-backups/ --recursive
aws s3 cp minio_$DATE.tar.gz s3://fenix-backups/
```

### Restauración
```bash
#!/bin/bash
# restore.sh
DATE=$1

# Restaurar PostgreSQL
gunzip < postgres_$DATE.sql.gz | docker exec -i fenix_db_master_prod psql -U fenix fenix_sgcn

# Restaurar Dgraph
docker cp dgraph_$DATE fenix_dgraph:/dgraph/import
docker exec fenix_dgraph dgraph live -f /dgraph/import

# Restaurar MinIO
docker run --rm -v fenix-sgcn_minio_prod_data:/data -v $(pwd):/backup alpine tar xzf /backup/minio_$DATE.tar.gz -C /
```

## 📞 Soporte

- **Documentación**: https://docs.fenix-sgcn.com
- **Issues**: https://github.com/fenix-sgcn/fenix-sgcn/issues
- **Email**: soporte@fenix-sgcn.com
- **Slack**: fenix-sgcn.slack.com

## ✅ Checklist de Producción

- [ ] Variables de entorno configuradas
- [ ] HTTPS habilitado
- [ ] Backups automáticos configurados
- [ ] Monitoreo activo
- [ ] Firewall configurado
- [ ] Logs centralizados
- [ ] Health checks funcionando
- [ ] Plan de DR documentado
- [ ] Equipo de soporte notificado

---

**Versión**: 1.0.0
**Última actualización**: Septiembre 2025
**Licencia**: MIT