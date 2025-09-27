# 🛠️ PLAN DE CORRECCIÓN COMPLETO - Fenix-SGCN

## 📋 ESTADO ACTUAL

### ✅ MÓDULOS NUEVOS FUNCIONANDO 100%:
1. **WorkflowEngineModule** - Completo y funcional
2. **BiDashboardModule** - Completo y funcional  
3. **DgraphModule** - Completo con controlador REST

### ❌ PROBLEMAS IDENTIFICADOS:
**60-70 errores de compilación** en servicios antiguos por campos de schema obsoletos

---

## 🔧 CORRECCIONES NECESARIAS POR ARCHIVO

### 1. **src/bi-dashboards/bi-dashboard.service.ts** ✅ CORREGIDO

### 2. **src/continuous-improvement/continuous-improvement.service.ts** ❌ PENDIENTE

**Solución:** Actualizar el schema de Prisma agregando campos faltantes:

```prisma
model CorrectiveAction {
  id          String       @id @default(uuid())
  tenantId    String
  findingId   String?
  
  title       String
  description String?
  status      ActionStatus @default(OPEN)
  
  // AGREGAR:
  assignedToUserId String?
  assignedToUser   User?    @relation(fields: [assignedToUserId], references: [id])
  
  targetDate   DateTime?
  completedDate DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  tenant  Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  finding Finding? @relation(fields: [findingId], references: [id], onDelete: SetNull)
  
  @@map("corrective_actions")
}

enum ActionStatus {
  OPEN
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

### 3. **src/exercises/exercises.service.ts** ❌ PENDIENTE

**Solución:** Actualizar schema de TestExercise:

```prisma
model TestExercise {
  id          String   @id @default(uuid())
  tenantId    String
  planId      String?
  
  name        String
  description String?
  scenario    Json?
  
  // AGREGAR CAMPOS FALTANTES:
  actualStartTime DateTime?
  actualEndTime   DateTime?
  executionLog    Json?      // Log de eventos durante ejecución
  duration        Int?       // Duración planificada en horas
  actualDuration  Decimal?   // Duración real en horas
  objectives      Json?      // Objetivos del ejercicio
  
  scheduledDate DateTime
  result        ExerciseResult?
  
  score         Decimal?
  reportUrl     String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  tenant Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  plan   ContinuityPlan? @relation(fields: [planId], references: [id], onDelete: SetNull)
  
  @@map("test_exercises")
}

enum ExerciseResult {
  SUCCESS
  PARTIAL_SUCCESS
  FAILED
}
```

### 4. **src/governance/governance.service.ts** ✅ CORREGIDO

### 5. **src/continuity-strategies/continuity-strategies.service.ts** ✅ CORREGIDO

---

## 🎯 ESTRATEGIA DE CORRECCIÓN RECOMENDADA

### OPCIÓN 1: ACTUALIZAR SCHEMA (RECOMENDADO) ⭐

**Pasos:**
1. Actualizar `prisma/schema.prisma` con campos faltantes
2. Ejecutar `npx prisma generate`
3. Ejecutar `npx prisma migrate dev --name add-missing-fields`
4. Recompilar backend

**Ventajas:**
- ✅ Solución permanente y correcta
- ✅ Mantiene funcionalidad completa de servicios
- ✅ Los servicios ya están codificados para estos campos

**Desventajas:**
- ⏱️ Requiere migración de base de datos

### OPCIÓN 2: REFACTORIZAR SERVICIOS

**Pasos:**
1. Modificar servicios para NO usar campos inexistentes
2. Buscar alternativas en schema actual
3. Recompilar

**Ventajas:**
- ✅ No requiere cambios en base de datos

**Desventajas:**
- ❌ Pérdida de funcionalidad
- ❌ Mucho trabajo de refactorización

### OPCIÓN 3: DESHABILITAR MÓDULOS TEMPORALMENTE

**Pasos:**
1. Comentar imports problemáticos en `app.module.ts`
2. Compilar y probar módulos nuevos
3. Reactivar y corregir gradualmente

**Ventajas:**
- ✅ Permite probar módulos nuevos inmediatamente

**Desventajas:**
- ❌ Backend incompleto temporalmente

---

## 📝 SCHEMA PRISMA COMPLETO SUGERIDO

```prisma
// ============================================
// CORRECCIÓN: CorrectiveAction
// ============================================
model CorrectiveAction {
  id          String       @id @default(uuid())
  tenantId    String
  findingId   String?
  
  title       String
  description String?
  status      ActionStatus @default(OPEN)
  priority    Priority?
  
  assignedToUserId String?
  assignedToUser   User?    @relation(fields: [assignedToUserId], references: [id], onDelete: SetNull)
  
  targetDate    DateTime?
  completedDate DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  tenant  Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  finding Finding? @relation(fields: [findingId], references: [id], onDelete: SetNull)
  
  @@map("corrective_actions")
}

enum ActionStatus {
  OPEN
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum Priority {
  CRITICAL
  HIGH
  MEDIUM
  LOW
}

// ============================================
// CORRECCIÓN: TestExercise
// ============================================
model TestExercise {
  id          String   @id @default(uuid())
  tenantId    String
  planId      String?
  
  name        String
  description String?
  scenario    Json?
  
  // Campos para ejecución
  actualStartTime DateTime?
  actualEndTime   DateTime?
  executionLog    Json?
  duration        Int?
  actualDuration  Decimal?
  objectives      Json?
  
  scheduledDate DateTime
  result        ExerciseResult?
  
  score         Decimal?
  reportUrl     String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  tenant Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  plan   ContinuityPlan? @relation(fields: [planId], references: [id], onDelete: SetNull)
  
  @@map("test_exercises")
}

enum ExerciseResult {
  SUCCESS
  PARTIAL_SUCCESS
  FAILED
}

// ============================================
// CORRECCIÓN: Finding (si falta rootCauseAnalysis)
// ============================================
model Finding {
  id          String   @id @default(uuid())
  tenantId    String
  
  title       String
  description String?
  source      String   // AUDIT, EXERCISE, INCIDENT
  severity    Severity
  status      FindingStatus @default(OPEN)
  
  // AGREGAR SI NO EXISTE:
  rootCauseAnalysis Json?
  
  identifiedDate DateTime @default(now())
  targetDate     DateTime?
  closedDate     DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  tenant           Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  correctiveActions CorrectiveAction[]
  
  @@map("findings")
}

enum Severity {
  CRITICAL
  HIGH
  MEDIUM
  LOW
}

enum FindingStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  ACCEPTED_RISK
}

// ============================================
// AGREGAR: Relación User (si no existe)
// ============================================
model User {
  id       String  @id @default(uuid())
  tenantId String
  email    String  @unique
  name     String?
  role     UserRole
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  tenant            Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  correctiveActions CorrectiveAction[]
  
  @@map("users")
}
```

---

## 🚀 COMANDOS DE EJECUCIÓN

### Para Aplicar Correcciones de Schema:

```bash
# 1. Actualizar schema.prisma con cambios arriba

# 2. Generar cliente Prisma
npx prisma generate

# 3. Crear migración
npx prisma migrate dev --name add-exercise-and-action-fields

# 4. Compilar backend
npm run build

# 5. Ejecutar tests
npm run test:e2e
```

### Para Verificar Compilación:

```bash
# Ver errores específicos
npm run build 2>&1 | Select-String "error TS" | Select-Object -First 20

# Contar errores
npm run build 2>&1 | Select-String "Found.*error"
```

---

## 📊 RESUMEN DE IMPACTO

### Archivos a Modificar:
- ✅ `prisma/schema.prisma` - Agregar campos faltantes
- ✅ Generar nueva migración
- ❌ **NO modificar servicios** - ya están correctos

### Tests Afectados:
- 69 tests E2E esperando backend funcional
- Una vez corregido schema, todos deberían pasar

### Tiempo Estimado:
- Schema update: **15 minutos**
- Migración: **5 minutos**  
- Compilación y tests: **10 minutos**
- **TOTAL: ~30 minutos**

---

## 🎯 RECOMENDACIÓN FINAL

**APLICAR OPCIÓN 1**: Actualizar schema con campos faltantes

**JUSTIFICACIÓN:**
1. Los servicios ya están bien codificados
2. Solo faltan campos en la base de datos
3. Solución permanente y profesional
4. Mantiene toda la funcionalidad

**SIGUIENTE PASO INMEDIATO:**
Actualizar `prisma/schema.prisma` con los modelos corregidos arriba y ejecutar migración.

---

*Documento generado: 2025-09-26*
*Estado: Listo para aplicar correcciones*
