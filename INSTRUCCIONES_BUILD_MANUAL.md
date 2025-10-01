# 🚀 INSTRUCCIONES PARA BUILD MANUAL - FENIX-SGCN

**Fecha:** 01 de Octubre 2025  
**Versión:** 1.0.0  
**Estado:** LISTO PARA BUILD

---

## ✅ CAMBIOS APLICADOS

### Backend
1. ✅ Campo `aiApiKey` agregado a modelo Tenant (línea 39)
2. ✅ Campo `crossingAnalysis` agregado a modelo SwotAnalysis (línea 866)
3. ✅ DTOs actualizados con campo `crossingAnalysis`
4. ✅ Endpoint `/swot/analyze-with-ai` implementado
5. ✅ Servicio de análisis con IA completado

### Frontend
1. ✅ Modal EditContextModal creado
2. ✅ Componente SwotEditor actualizado con IA
3. ✅ KPIs de procesos agregados
4. ✅ Página de Planeación actualizada

### Base de Datos
1. ✅ Schema Prisma actualizado
2. ⚠️ Requiere migración (se aplica automáticamente en build)

---

## 📝 COMANDOS PARA BUILD

### Opción 1: Build Completo (Recomendado)

```bash
cd /mnt/c/users/meciz/documents/fenix-SGCN

# Build sin cache (tarda ~5 minutos)
docker compose -f docker-compose.prod.yml build --no-cache

# Levantar servicios
docker compose -f docker-compose.prod.yml up -d

# Verificar estado
docker ps

# Ver logs si hay errores
docker logs fenix_backend_prod --tail 50
docker logs fenix_frontend_prod --tail 50
```

### Opción 2: Build Rápido (Si ya funcionaba antes)

```bash
cd /mnt/c/users/meciz/documents/fenix-SGCN

# Build normal (usa cache, más rápido)
docker compose -f docker-compose.prod.yml build

# Levantar servicios
docker compose -f docker-compose.prod.yml up -d
```

---

## 🔍 VERIFICACIÓN POST-BUILD

### 1. Verificar que los contenedores estén corriendo

```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

**Salida esperada:**
```
NAMES                    STATUS
fenix_proxy_prod         Up X seconds (healthy)
fenix_backend_prod       Up X seconds (healthy)
fenix_frontend_prod      Up X seconds (healthy)
fenix_db_master_prod     Up X seconds (healthy)
fenix_redis_prod         Up X seconds (healthy)
fenix_dgraph_prod        Up X seconds
fenix_dgraph_zero_prod   Up X seconds
fenix_storage_prod       Up X seconds (healthy)
```

### 2. Aplicar migración de base de datos

```bash
# Sincronizar schema con BD
docker exec fenix_backend_prod npx prisma db push

# Generar cliente Prisma
docker exec fenix_backend_prod npx prisma generate
```

**Salida esperada:**
```
🚀  Your database is now in sync with your Prisma schema.
✔ Generated Prisma Client
```

### 3. Verificar logs del backend

```bash
docker logs fenix_backend_prod --tail 30
```

**Buscar:**
- ✅ "Nest application successfully started"
- ✅ "Backend listening on http://0.0.0.0:3001"
- ✅ "Dgraph client initialized"
- ❌ Sin errores de compilación TypeScript
- ❌ Sin errores de Prisma

### 4. Verificar logs del frontend

```bash
docker logs fenix_frontend_prod --tail 20
```

**Buscar:**
- ✅ "Ready in XXXms"
- ✅ "Local: http://localhost:3000"
- ❌ Sin errores de compilación

---

## 🧪 PRUEBAS POST-BUILD

### 1. Acceder a la aplicación
```
http://localhost/dashboard/planeacion
```

### 2. Verificar funcionalidades nuevas

#### ✅ KPI de Procesos
1. Ir a Módulo 1: Planeación
2. Verificar 4 tarjetas KPI en la parte superior
3. La 4ta tarjeta debe mostrar: "Procesos de Negocio"

#### ✅ Crear Proceso de Negocio
1. Tab "Procesos de Negocio"
2. Click "Nuevo Proceso de Negocio"
3. Llenar formulario completo
4. Click "Guardar Proceso"
5. ✅ Debe guardar sin errores
6. ✅ Debe aparecer en la lista
7. ✅ Debe actualizar el KPI superior

#### ✅ Editar Contexto de Negocio
1. Tab "Contexto de Negocio"
2. Crear un contexto nuevo
3. Verificar estado: "Borrador"
4. Click en botón "Editar" (debe aparecer)
5. Modificar contenido
6. Click "Guardar Cambios"
7. Click "Enviar a Aprobación"
8. Verificar estado cambió a "En Revisión"
9. ✅ No debe permitir editar después de aprobar

#### ✅ Análisis FODA con IA
1. Crear contexto de negocio
2. Click "Crear Análisis FODA"
3. Llenar los 4 cuadrantes (Fortalezas, Debilidades, Oportunidades, Amenazas)
4. Click "✨ Analizar con IA"
5. **Nota:** Requiere API Key configurada
6. Si no hay API Key, debe mostrar mensaje: "API Key de IA no configurada"

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### Error: "aiApiKey does not exist"

**Causa:** Prisma Client no regenerado

**Solución:**
```bash
docker exec fenix_backend_prod npx prisma generate
docker restart fenix_backend_prod
```

### Error: "highLevelCharacterization does not exist"

**Causa:** Base de datos no sincronizada

**Solución:**
```bash
docker exec fenix_backend_prod npx prisma db push
docker restart fenix_backend_prod
```

### Backend unhealthy

**Verificar logs:**
```bash
docker logs fenix_backend_prod --tail 100
```

**Reiniciar:**
```bash
docker restart fenix_backend_prod
```

### Frontend no carga

**Verificar logs:**
```bash
docker logs fenix_frontend_prod --tail 50
```

**Rebuild solo frontend:**
```bash
docker compose -f docker-compose.prod.yml build fenix_frontend
docker compose -f docker-compose.prod.yml up -d fenix_frontend
```

---

## 🔐 CONFIGURACIÓN ADICIONAL

### Configurar API Key de OpenAI (Opcional)

Para habilitar el análisis FODA con IA:

1. Obtener API Key de OpenAI (https://platform.openai.com/api-keys)

2. Agregar al tenant en la base de datos:
```bash
docker exec -it fenix_db_master_prod psql -U fenix_user -d fenix_sgcn
```

```sql
UPDATE tenants 
SET "aiApiKey" = 'sk-proj-XXXXXXXXXX' 
WHERE domain = 'localhost';
```

3. Verificar:
```sql
SELECT domain, "aiApiKey" IS NOT NULL as has_key FROM tenants;
```

**O agregar interfaz de configuración en el futuro.**

---

## 📊 TIEMPOS ESTIMADOS

- Build sin cache: ~5-8 minutos
- Build con cache: ~2-3 minutos
- Migración DB: ~5 segundos
- Inicio completo: ~30 segundos

---

## ✨ CARACTERÍSTICAS IMPLEMENTADAS

### 1. KPI Dashboard
- ✅ 4 indicadores principales
- ✅ Métricas en tiempo real
- ✅ Distribución visual de procesos

### 2. Gestión de Contexto
- ✅ Edición de contexto
- ✅ Workflow de aprobación (DRAFT → REVIEW → APPROVED)
- ✅ Validación de estado

### 3. Análisis FODA Inteligente
- ✅ Editor visual completo
- ✅ Integración con OpenAI GPT-4
- ✅ Análisis de cruzamientos automático
- ✅ Estrategias FO, FA, DO, DA

### 4. Gestión de Procesos
- ✅ Formulario completo
- ✅ Criterios de priorización
- ✅ Cálculo de score
- ✅ Upload de archivos

### 5. Internacionalización
- ✅ 3 idiomas (ES/EN/PT)
- ✅ 3 monedas (COP/USD/BRL)
- ✅ Preferencias por usuario

---

## 📝 NOTAS FINALES

1. **Primera vez:** Usar build sin cache
2. **Cambios menores:** Build normal es suficiente
3. **Siempre:** Verificar logs después del build
4. **API Key IA:** Opcional, funcionalidad puede usarse manualmente
5. **Backup:** Los datos no se pierden en rebuild

---

## 🆘 SOPORTE

Si encuentras errores durante el build:

1. Copia el error completo
2. Verifica los logs:
   ```bash
   docker logs fenix_backend_prod --tail 100 > backend_error.log
   docker logs fenix_frontend_prod --tail 100 > frontend_error.log
   ```
3. Revisa sección "Solución de Problemas"

---

**¡LISTO PARA BUILD! 🚀**

Ejecuta los comandos de la sección "Opción 1: Build Completo"
