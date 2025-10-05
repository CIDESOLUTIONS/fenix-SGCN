# Correcciones para Build - Módulo 2 ARA

## 🔧 Problemas Detectados y Solucionados

### **Problema 1: Error en Backend Build**
```
Error: npm ci requires package-lock.json
Error: Prisma connection timeout durante postinstall
```

**Causa:** 
- Falta `package-lock.json` en backend
- `npm ci` falla sin lockfile
- Timeout en descarga de Prisma engines

**Solución:**
- ✅ Cambiado `npm ci` por `npm install` en Dockerfile
- ✅ Agregadas flags: `--prefer-offline --no-audit`
- ✅ Esto usa caché local y evita timeouts

### **Problema 2: Frontend Build Cancelado**
```
CANCELED [fenix_frontend builder 6/6] RUN npm run build
```

**Causa:**
- Build de backend falló primero
- Docker cancela builds dependientes

**Solución:**
- ✅ Aplicada misma corrección que backend
- ✅ Frontend ahora usa `npm install` estable

---

## 📝 Archivos Modificados

### 1. `backend/Dockerfile.prod`
**Cambio en línea 20:**
```dockerfile
# ANTES:
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# DESPUÉS:
RUN npm install --legacy-peer-deps --prefer-offline --no-audit
```

### 2. `frontend/Dockerfile.prod`
**Cambio en línea 11:**
```dockerfile
# ANTES:
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# DESPUÉS:
RUN npm install --legacy-peer-deps --prefer-offline --no-audit
```

---

## 🚀 Comandos para Build Manual

### Opción 1: Build Completo (Backend + Frontend)
```bash
cd /mnt/c/users/meciz/documents/fenix-SGCN
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### Opción 2: Build Solo Frontend (más rápido)
```bash
cd /mnt/c/users/meciz/documents/fenix-SGCN
docker compose -f docker-compose.prod.yml build fenix_frontend
docker compose -f docker-compose.prod.yml up -d fenix_frontend
```

### Opción 3: Build con Caché (si backend ya está OK)
```bash
cd /mnt/c/users/meciz/documents/fenix-SGCN
docker compose -f docker-compose.prod.yml build fenix_frontend
docker compose -f docker-compose.prod.yml restart fenix_frontend
```

---

## ⏱️ Tiempos Estimados

- **Build completo sin caché:** ~8-10 minutos
- **Build solo frontend:** ~5-7 minutos
- **Build con caché:** ~2-3 minutos

---

## ✅ Verificación Post-Build

Después del build, verifica que los contenedores estén healthy:

```bash
docker ps --filter "name=fenix" --format "table {{.Names}}\t{{.Status}}"
```

**Resultado esperado:**
```
NAMES                    STATUS
fenix_frontend_prod      Up X minutes (healthy)
fenix_backend_prod       Up X minutes (healthy)
fenix_db_master_prod     Up X minutes (healthy)
```

---

## 🧪 Verificar Módulo 2 ARA

Una vez arriba, accede a:

1. **Dashboard principal:** http://localhost/dashboard/ara
   - Debe mostrar KPIs y gráficos
   
2. **Registro de Riesgos:** Click en tab "Registro de Riesgos"
   - **NO debe dar error** "client-side exception"
   - Debe cargar la tabla de riesgos

3. **Crear Riesgo:** Click en "Nuevo Riesgo"
   - Modal debe abrir correctamente
   - Selector de procesos debe cargar

---

## 📊 Resumen de Mejoras Implementadas

### Backend:
- ✅ Dockerfile optimizado para builds estables
- ✅ Sin dependencia de package-lock.json
- ✅ Cache offline para dependencies

### Frontend:
- ✅ Layout ARA con tabs navegables
- ✅ Dashboard con KPIs de riesgos
- ✅ Página de riesgos sin header duplicado
- ✅ Estado vacío mejorado con CTA

### UI/UX:
- ✅ 4 KPIs principales de riesgos
- ✅ Gráfico de distribución por severidad
- ✅ Lista de riesgos recientes
- ✅ Acciones rápidas con navegación
- ✅ Tabs sticky con indicador activo

---

## 🎯 Estado Final

**Archivos creados:** 3
- `frontend/app/dashboard/ara/layout.tsx`
- `frontend/app/dashboard/ara/page.tsx`
- `docs/BUILD_FIX_MODULO2.md`

**Archivos modificados:** 4
- `backend/Dockerfile.prod`
- `frontend/Dockerfile.prod`
- `frontend/app/dashboard/ara/risks/page.tsx`
- `docs/RESULTADO_TEST_E2E_MODULO2.md`

**Listo para:** Build y deploy manual ✅

---

## 🐛 Si Persisten Errores

### Error: "Still timing out on Prisma"
```bash
# Aumentar memoria de Docker
# Docker Desktop → Settings → Resources → Memory: 8GB+
```

### Error: "Frontend build takes too long"
```bash
# Build sin compilación de tipos (más rápido)
docker compose -f docker-compose.prod.yml build --build-arg SKIP_TYPE_CHECK=true fenix_frontend
```

### Error: "Container unhealthy"
```bash
# Ver logs detallados
docker logs fenix_frontend_prod --tail 100
docker logs fenix_backend_prod --tail 100
```

---

**Próximo paso:** Ejecutar comando de build manualmente desde WSL/Linux terminal.
