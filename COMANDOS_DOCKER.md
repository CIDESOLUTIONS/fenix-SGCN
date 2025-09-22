# ====================================
# GUÍA DE COMANDOS - FENIX-SGCN
# ====================================

## 🚀 DESPLIEGUE INICIAL

### Opción 1: Script Automatizado (RECOMENDADO)
```powershell
# Limpieza completa + reconstrucción + despliegue
.\deploy.ps1
```

### Opción 2: Comandos Manuales
```powershell
# 1. Limpiar todo
docker-compose -f docker-compose.prod.yml down -v --remove-orphans
docker builder prune -f

# 2. Construir imágenes
docker-compose -f docker-compose.prod.yml build --no-cache

# 3. Levantar servicios
docker-compose -f docker-compose.prod.yml up -d

# 4. Ver estado
docker-compose -f docker-compose.prod.yml ps
```

---

## 📊 MONITOREO

### Ver Logs
```powershell
# Todos los servicios
.\logs.ps1

# Solo un servicio específico
.\logs.ps1 -Service backend
.\logs.ps1 -Service frontend
.\logs.ps1 -Service db
.\logs.ps1 -Service proxy

# Alternativa manual
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml logs -f fenix_backend
```

### Estado de Contenedores
```powershell
docker-compose -f docker-compose.prod.yml ps
docker stats
```

---

## 🛠️ GESTIÓN DE SERVICIOS

### Reiniciar Servicios
```powershell
# Reiniciar todo
docker-compose -f docker-compose.prod.yml restart

# Reiniciar un servicio
docker-compose -f docker-compose.prod.yml restart fenix_backend
docker-compose -f docker-compose.prod.yml restart fenix_frontend
```

### Detener/Iniciar
```powershell
# Detener sin eliminar
docker-compose -f docker-compose.prod.yml stop

# Iniciar detenidos
docker-compose -f docker-compose.prod.yml start

# Detener y eliminar contenedores
docker-compose -f docker-compose.prod.yml down

# Detener, eliminar contenedores Y volúmenes (CUIDADO: borra la DB)
docker-compose -f docker-compose.prod.yml down -v
```

---

## 🔍 DEBUGGING

### Entrar a un Contenedor
```powershell
# Backend
docker exec -it fenix_backend sh

# Frontend
docker exec -it fenix_frontend sh

# Base de datos
docker exec -it fenix_db_master sh
```

### Ejecutar Comandos en Contenedor
```powershell
# Ver variables de entorno en backend
docker exec fenix_backend env

# Ejecutar migraciones manualmente
docker exec fenix_backend npx prisma migrate deploy

# Ver archivos en frontend
docker exec fenix_frontend ls -la
```

### Inspeccionar Base de Datos
```powershell
# Conectarse a PostgreSQL
docker exec -it fenix_db_master psql -U meciza64 -d fenix_sgcn

# Ver tablas
docker exec fenix_db_master psql -U meciza64 -d fenix_sgcn -c "\dt"

# Query SQL
docker exec fenix_db_master psql -U meciza64 -d fenix_sgcn -c "SELECT * FROM \"Tenant\" LIMIT 5;"
```

---

## 🧹 LIMPIEZA

### Limpieza Básica
```powershell
# Eliminar contenedores detenidos
docker container prune -f

# Eliminar imágenes sin usar
docker image prune -f

# Eliminar cache de builds
docker builder prune -f
```

### Limpieza Completa (CUIDADO)
```powershell
# Eliminar TODO (contenedores, imágenes, volúmenes, networks)
docker-compose -f docker-compose.prod.yml down -v
docker system prune -a --volumes -f
```

---

## 🔄 ACTUALIZACIÓN DE CÓDIGO

### Rebuild Parcial (cambios menores)
```powershell
# Rebuild solo un servicio
docker-compose -f docker-compose.prod.yml build fenix_backend
docker-compose -f docker-compose.prod.yml up -d fenix_backend

# Rebuild frontend
docker-compose -f docker-compose.prod.yml build fenix_frontend
docker-compose -f docker-compose.prod.yml up -d fenix_frontend
```

### Rebuild Completo (cambios mayores)
```powershell
# Usar el script automatizado
.\deploy.ps1

# O manual
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📦 BACKUP Y RESTORE

### Backup de Base de Datos
```powershell
# Crear backup
docker exec fenix_db_master pg_dump -U meciza64 fenix_sgcn > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql

# Backup comprimido
docker exec fenix_db_master pg_dump -U meciza64 fenix_sgcn | gzip > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql.gz
```

### Restore de Base de Datos
```powershell
# Restaurar desde backup
Get-Content backup_20250922_120000.sql | docker exec -i fenix_db_master psql -U meciza64 -d fenix_sgcn
```

---

## 🌐 URLs DE ACCESO

- **Landing Page**: http://localhost
- **API Backend**: http://localhost/api
- **API Swagger**: http://localhost/api/docs (si está habilitado)
- **MinIO Console**: http://localhost:9001
  - Usuario: `meciza64`
  - Password: `sgcn2025`

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Contenedor no inicia
```powershell
# Ver logs del contenedor
docker-compose -f docker-compose.prod.yml logs fenix_backend

# Ver últimas 50 líneas
docker-compose -f docker-compose.prod.yml logs --tail=50 fenix_backend

# Inspeccionar contenedor
docker inspect fenix_backend
```

### Error de permisos
```powershell
# Reconstruir con permisos correctos
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Puerto ocupado
```powershell
# Ver qué está usando el puerto 80
netstat -ano | findstr :80

# Matar proceso (reemplazar PID)
taskkill /PID <PID> /F
```

### Base de datos no conecta
```powershell
# Verificar estado del healthcheck
docker inspect fenix_db_master | findstr Health

# Reiniciar base de datos
docker-compose -f docker-compose.prod.yml restart fenix_db_master

# Esperar y reiniciar backend
Start-Sleep -Seconds 10
docker-compose -f docker-compose.prod.yml restart fenix_backend
```

---

## 📝 NOTAS IMPORTANTES

1. **Primera ejecución**: Las migraciones se ejecutan automáticamente
2. **Volúmenes persistentes**: Los datos de PostgreSQL y MinIO se mantienen entre reinicios
3. **Variables de entorno**: Definidas en `.env` y `docker-compose.prod.yml`
4. **Logs**: Usar `.\logs.ps1` para monitoreo en tiempo real
5. **Producción**: Este setup está optimizado para producción

---

**Creado para Fenix-SGCN - CIDE SAS © 2025**
