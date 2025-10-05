# Implementación Manual - Sprint 1: Metodología ICETEX

## Estado Actual
✅ Página de Criterios creada
✅ Migración SQL preparada
✅ Plan de implementación documentado

## Pasos Manuales Requeridos

### 1. Aplicar Migración a Base de Datos

**Conectarse a PostgreSQL:**
```bash
docker exec -it fenix_db_master_prod psql -U fenix_user -d fenix_db
```

**Ejecutar migración:**
```sql
\i /path/to/migrations/manual_add_risk_controls.sql
```

O copiar el contenido manualmente:
```sql
-- Ver archivo: backend/prisma/migrations/manual_add_risk_controls.sql
```

### 2. Actualizar Schema Prisma

**Reemplazar modelo RiskAssessment en `schema.prisma`:**

Buscar el modelo actual y agregar/modificar campos:
```prisma
model RiskAssessment {
  id          String   @id @default(uuid())
  tenantId    String
  processId   String?
  
  // NUEVO
  riskId      String?  @unique
  
  name        String
  description String?
  
  // NUEVO: Metodología ICETEX
  cause       String?  @db.Text
  event       String?  @db.Text
  consequence String?  @db.Text
  
  category    RiskCategory
  
  // NUEVO
  affectedProcesses Json?  @default("[]")
  
  // ... resto de campos existentes
  
  // NUEVO: Relación
  riskControls RiskControl[]
  
  @@map("risk_assessments")
}
```

**Agregar modelo RiskControl al final del archivo:**
```prisma
// Copiar todo el contenido de: backend/prisma/schema-risk-controls.txt
```

### 3. Generar Prisma Client

```bash
cd backend
npx prisma generate
```

### 4. Crear Módulo de Controles (Backend)

Archivos a crear (YO LOS CREO AHORA):

**¿Quieres que continúe creando los archivos del backend o prefieres aplicar primero la migración manualmente?**

## Opción A: Tú aplicas la migración primero
1. Ejecuta el SQL en PostgreSQL
2. Actualiza schema.prisma manualmente
3. Corre `npx prisma generate`
4. Me avisas para continuar con backend

## Opción B: Yo continúo automatizado
Creo todos los archivos de backend necesarios y tú solo ejecutas:
```bash
# Aplicar migración
docker exec -it fenix_db_master_prod psql -U fenix_user -d fenix_db -f /app/prisma/migrations/manual_add_risk_controls.sql

# Generar cliente
docker exec -it fenix_backend_prod npx prisma generate

# Reiniciar
docker compose -f docker-compose.prod.yml restart fenix_backend_prod
```

**¿Qué opción prefieres?**
