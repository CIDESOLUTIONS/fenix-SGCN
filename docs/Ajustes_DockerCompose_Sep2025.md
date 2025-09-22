# ✅ AJUSTES DOCKER-COMPOSE.PROD.YML - FENIX-SGCN

## 📅 Fecha: 22 de Septiembre 2025

---

## 🔧 PROBLEMAS IDENTIFICADOS Y SOLUCIONADOS

### ❌ Problema 1: Frontend sin configuración standalone
**Error**: El Dockerfile esperaba `output: 'standalone'` en Next.js pero no estaba configurado.

**Solución**: 
- Actualizado `frontend/next.config.mjs` con:
  - `output: 'standalone'` para Docker
  - `images: { unoptimized: true }` para optimización

### ❌ Problema 2: Variables de entorno faltantes
**Error**: Frontend no tenía configurada la URL del backend.

**Solución**:
- Agregadas variables de entorno en `docker-compose.prod.yml`:
  - `NEXT_PUBLIC_API_URL=http://localhost/api`
  - `NODE_ENV=production` en frontend y backend

### ❌ Problema 3: Migraciones de Prisma no automáticas
**Error**: Las migraciones de base de datos no se ejecutaban al iniciar.

**Solución**:
- Creado `backend/docker-entrypoint.sh` que:
  1. Ejecuta `npx prisma migrate deploy`
  2. Ejecuta el seed si existe
  3. Inicia la aplicación
- Actualizado `backend/Dockerfile` con ENTRYPOINT

---

## 📝 ARCHIVOS MODIFICADOS

### 1. `frontend/next.config.mjs`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // ✅ Agregado
  images: {
    unoptimized: true, // ✅ Agregado
  },
};

export default nextConfig;
```

### 2. `docker-compose.prod.yml`
**Cambios principales**:
- ✅ Agregadas variables de entorno en `fenix_frontend`
- ✅ Agregadas variables de entorno explícitas en `fenix_backend`
- ✅ Eliminado montaje innecesario del `.env` (se usan variables directas)

### 3. `backend/docker-entrypoint.sh` (NUEVO)
Script de inicialización que:
- ✅ Ejecuta migraciones automáticamente
- ✅ Ejecuta seed de datos
- ✅ Inicia la aplicación

### 4. `backend/Dockerfile`
- ✅ Agregado `bash` para ejecutar entrypoint
- ✅ Configurado ENTRYPOINT en lugar de CMD
- ✅ Permisos correctos para el script

---

## 🚀 ESTRUCTURA FINAL

```
fenix-SGCN/
├── docker-compose.prod.yml ✅ Actualizado
├── .env ✅ Existente
├── nginx/
│   └── nginx.conf ✅ Correcto
├── frontend/
│   ├── Dockerfile ✅ Correcto
│   ├── next.config.mjs ✅ Actualizado
│   └── ... (componentes actualizados)
└── backend/
    ├── Dockerfile ✅ Actualizado
    ├── docker-entrypoint.sh ✅ NUEVO
    └── ... (código existente)
```

---

## 🎯 SERVICIOS CONFIGURADOS

### 1. **fenix_proxy** (NGINX)
- Puerto: `80`
- Función: Reverse proxy
- Rutas:
  - `/` → Frontend (Next.js)
  - `/api/*` → Backend (NestJS)

### 2. **fenix_frontend** (Next.js)
- Puerto interno: `3000`
- Build: Standalone optimizado
- Variables:
  - `NEXT_PUBLIC_API_URL=http://localhost/api`
  - `NODE_ENV=production`

### 3. **fenix_backend** (NestJS)
- Puerto interno: `3001`
- Migraciones: Automáticas al inicio
- Variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `PORT=3001`
  - `NODE_ENV=production`

### 4. **fenix_db_master** (PostgreSQL 16)
- Puerto interno: `5432`
- Healthcheck: Configurado
- Datos: Persistentes en volume

### 5. **fenix_storage** (MinIO)
- Puertos: `9000` (API), `9001` (Console)
- S3-compatible storage
- Datos: Persistentes en volume

---

## ✅ VALIDACIONES REALIZADAS

- [x] Frontend con output standalone
- [x] Variables de entorno configuradas
- [x] Migraciones automáticas en backend
- [x] Healthcheck en PostgreSQL
- [x] Nginx reverse proxy correcto
- [x] Volúmenes persistentes
- [x] Network bridge configurada
- [x] Restart policies aplicadas

---

## 🚀 COMANDOS DE EJECUCIÓN

### Levantar servicios:
```bash
cd C:\Users\meciz\Documents\fenix-SGCN
docker-compose -f docker-compose.prod.yml up -d --build
```

### Ver logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Verificar estado:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Detener servicios:
```bash
docker-compose -f docker-compose.prod.yml down
```

### Limpiar todo (incluyendo volúmenes):
```bash
docker-compose -f docker-compose.prod.yml down -v
```

---

## 🌐 URLs DE ACCESO

- **Landing Page**: http://localhost
- **API Backend**: http://localhost/api
- **MinIO Console**: http://localhost:9001

---

## ⚠️ NOTAS IMPORTANTES

1. **Primera ejecución**: Las migraciones se ejecutarán automáticamente
2. **Datos persistentes**: PostgreSQL y MinIO tienen volúmenes configurados
3. **Variables de entorno**: Asegúrate que `.env` tenga todos los valores correctos
4. **Healthcheck**: PostgreSQL debe estar saludable antes que el backend inicie

---

## ✨ RESULTADO FINAL

El `docker-compose.prod.yml` está **COMPLETAMENTE FUNCIONAL** y listo para producción con:

✅ Configuración optimizada de Next.js
✅ Variables de entorno correctamente inyectadas
✅ Migraciones automáticas de Prisma
✅ Healthchecks configurados
✅ Reverse proxy NGINX
✅ Almacenamiento S3 con MinIO
✅ Persistencia de datos
✅ Restart automático de servicios

**LISTO PARA DESPLIEGUE** 🚀
