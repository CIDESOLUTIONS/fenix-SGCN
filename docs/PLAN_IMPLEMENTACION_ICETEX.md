# Plan de Implementación - Metodología ICETEX para Módulo 2 ARA

## Análisis del Documento ICETEX

### Componentes Identificados

**1. Sistema de Criterios de Evaluación (ISO 31000)**
- Tabla de Probabilidad (5 niveles)
- Tabla de Impacto (5 niveles)  
- Matriz de Nivel de Riesgo (4 niveles: Crítico, Alto, Moderado, Bajo)

**2. Metodología de Controles**
- 5 Variables de Evaluación:
  * Tipo de Control (Preventivo/Detectivo/Correctivo)
  * Criterio de Aplicación (Siempre/Aleatoria)
  * Documentación (Sí/Parcial/No)
  * Efectividad (Efectivo/Requiere Mejoras/No Efectivo)
  * Automatización (Automático/Manual)
- Puntuación total: 0-100 pts
- Sistema de reducción por cuadrantes

**3. Estructura Detallada de Riesgo**
- ID único (ej: RTC-001)
- Nombre descriptivo
- Categoría (Infraestructura, Ciberseguridad, RRHH, etc.)
- Descripción Causa→Evento→Consecuencia
- Procesos críticos afectados
- Riesgo Inherente (P×I)
- Controles con análisis de efectividad
- Riesgo Residual calculado

## Implementaciones Completadas

### ✅ Página de Criterios (`/ara/scoring`)
- Tabla de Probabilidad (basada en ICETEX)
- Tabla de Impacto (basada en ICETEX)
- Niveles de Riesgo configurables
- Botón guardar criterios

## Implementaciones Pendientes

### 🔄 Fase 1: Ampliar Modelo de Datos de Riesgo

#### Backend: Actualizar DTO y Schema
**Archivo:** `backend/src/risk-assessments/dto/create-risk-assessment.dto.ts`

Agregar campos:
```typescript
riskId: string; // ej: RTC-001
cause: string; // Causa del riesgo
event: string; // Evento potencial
consequence: string; // Consecuencia
affectedProcesses: string[]; // IDs de procesos afectados
```

**Archivo:** `backend/prisma/schema.prisma`

```prisma
model RiskAssessment {
  // ... campos existentes
  
  riskId           String?  @unique
  cause            String?
  event            String?
  consequence      String?
  affectedProcesses Json?   @default("[]")
}
```

### 🔄 Fase 2: Sistema de Controles

#### Crear tabla de Controles

```prisma
model RiskControl {
  id                String   @id @default(uuid())
  riskAssessmentId  String
  riskAssessment    RiskAssessment @relation(fields: [riskAssessmentId], references: [id], onDelete: Cascade)
  
  description       String
  
  // Variables de puntuación
  controlType       String   // PREVENTIVE, DETECTIVE, CORRECTIVE
  applicationCriteria String // ALWAYS, RANDOM
  isDocumented      String   // YES, PARTIAL, NO
  effectiveness     String   // EFFECTIVE, NEEDS_IMPROVEMENT, NOT_EFFECTIVE
  automation        String   // AUTOMATIC, MANUAL
  
  score             Int      // Puntuación calculada 0-100
  reductionQuadrants Int     // Cuadrantes a reducir (0, 1, 2)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

#### Service de Controles
**Archivo:** `backend/src/risk-controls/risk-controls.service.ts`

Método clave:
```typescript
calculateControlScore(control: CreateRiskControlDto): {
  score: number;
  quadrants: number;
} {
  let score = 0;
  
  // Tipo de control
  if (control.controlType === 'PREVENTIVE') score += 10;
  else if (control.controlType === 'DETECTIVE') score += 8;
  else if (control.controlType === 'CORRECTIVE') score += 3;
  
  // Criterio de aplicación
  if (control.applicationCriteria === 'ALWAYS') score += 10;
  else if (control.applicationCriteria === 'RANDOM') score += 5;
  
  // Documentación
  if (control.isDocumented === 'YES') score += 15;
  else if (control.isDocumented === 'PARTIAL') score += 7;
  
  // Efectividad
  if (control.effectiveness === 'EFFECTIVE') score += 50;
  else if (control.effectiveness === 'NEEDS_IMPROVEMENT') score += 25;
  
  // Automatización
  if (control.automation === 'AUTOMATIC') score += 15;
  else if (control.automation === 'MANUAL') score += 10;
  
  // Determinar cuadrantes
  let quadrants = 0;
  if (score >= 81) quadrants = 2;
  else if (score >= 61) quadrants = 1;
  
  return { score, quadrants };
}
```

### 🔄 Fase 3: Cálculo Automático de Riesgo Residual

#### Service actualizado
**Archivo:** `backend/src/risk-assessments/risk-assessments.service.ts`

Método:
```typescript
async calculateResidualRisk(
  riskId: string,
  controls: RiskControl[]
): Promise<{ probabilityAfter: number; impactAfter: number; scoreAfter: number }> {
  
  const risk = await this.findOne(riskId);
  
  // Sumar cuadrantes de todos los controles
  const totalQuadrants = controls.reduce((sum, ctrl) => sum + ctrl.reductionQuadrants, 0);
  
  // Aplicar reducción (máximo 2 cuadrantes por métrica)
  const probReduction = Math.min(totalQuadrants, 2);
  const impactReduction = Math.max(0, totalQuadrants - probReduction);
  
  const probabilityAfter = Math.max(1, risk.probabilityBefore - probReduction);
  const impactAfter = Math.max(1, risk.impactBefore - impactReduction);
  const scoreAfter = probabilityAfter * impactAfter;
  
  return { probabilityAfter, impactAfter, scoreAfter };
}
```

### 🔄 Fase 4: Frontend - Formulario Ampliado de Riesgos

**Archivo:** `frontend/app/dashboard/ara/risks/page.tsx`

Secciones del modal:
1. **Información Básica:** ID, Nombre, Categoría
2. **Análisis Causa-Efecto:** Causa, Evento, Consecuencia
3. **Procesos Afectados:** Multi-select
4. **Evaluación Inherente:** Probabilidad e Impacto
5. **Controles:** Lista dinámica con formulario de puntuación
6. **Riesgo Residual:** Calculado automáticamente

### 🔄 Fase 5: Componente de Gestión de Controles

**Archivo:** `frontend/components/RiskControlsManager.tsx`

```tsx
interface RiskControl {
  id?: string;
  description: string;
  controlType: string;
  applicationCriteria: string;
  isDocumented: string;
  effectiveness: string;
  automation: string;
  score?: number;
  reductionQuadrants?: number;
}

export function RiskControlsManager({ 
  riskId, 
  onControlsChange 
}: { 
  riskId: string; 
  onControlsChange: (controls: RiskControl[]) => void;
}) {
  // Formulario para agregar controles
  // Tabla con controles existentes
  // Cálculo automático de score
  // Vista de cuadrantes a reducir
}
```

### 🔄 Fase 6: Vista de Reporte Detallado

**Archivo:** `frontend/app/dashboard/ara/risks/[id]/page.tsx`

Vista detallada de riesgo estilo ICETEX:
- Cabecera con ID y nombre
- Análisis Causa→Evento→Consecuencia
- Tabla de procesos afectados
- Matriz de evaluación inherente
- Lista de controles con análisis
- Cálculo de riesgo residual
- Botón exportar a PDF/DOCX

## Priorización de Desarrollo

### Sprint 1 (Inmediato)
1. ✅ Página de Criterios (completado)
2. 🔄 Actualizar schema Prisma con nuevos campos
3. 🔄 Migración de base de datos

### Sprint 2 (Siguiente)
1. 🔄 Crear modelo y service de Controles
2. 🔄 Endpoint para calcular riesgo residual
3. 🔄 Componente RiskControlsManager

### Sprint 3 (Final)
1. 🔄 Formulario ampliado de riesgos
2. 🔄 Vista detallada de riesgo
3. 🔄 Exportación a PDF/DOCX

## Comandos de Implementación

```bash
# 1. Actualizar schema
cd backend
npx prisma format
npx prisma migrate dev --name add_risk_controls

# 2. Generar cliente
npx prisma generate

# 3. Build y deploy
cd ..
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

## Archivos a Crear/Modificar

### Backend (7 archivos)
- `prisma/schema.prisma` (modificar)
- `src/risk-controls/risk-controls.module.ts` (crear)
- `src/risk-controls/risk-controls.service.ts` (crear)
- `src/risk-controls/risk-controls.controller.ts` (crear)
- `src/risk-controls/dto/create-risk-control.dto.ts` (crear)
- `src/risk-assessments/dto/create-risk-assessment.dto.ts` (modificar)
- `src/risk-assessments/risk-assessments.service.ts` (modificar)

### Frontend (5 archivos)
- `app/dashboard/ara/scoring/page.tsx` (✅ completado)
- `app/dashboard/ara/risks/page.tsx` (modificar)
- `app/dashboard/ara/risks/[id]/page.tsx` (crear)
- `components/RiskControlsManager.tsx` (crear)
- `components/RiskDetailView.tsx` (crear)

## Testing

### Caso de Prueba: RTC-001 ICETEX
```
Riesgo: Falla por Obsolescencia de Infraestructura
P=4, I=5, Score=20 (Crítico)

Controles:
- Tipo: Preventivo+Detectivo (18 pts)
- Aplicación: Siempre (10 pts)
- Documentado: Sí (15 pts)
- Efectividad: Requiere Mejoras (25 pts)
- Automatización: Manual (10 pts)
Total: 78 pts → 1 cuadrante

Resultado Esperado:
P=3, I=5, Score=15 (Alto)
```

## Estado Actual

**Completado:**
- ✅ Página de Criterios con tablas ICETEX
- ✅ Documentación del plan

**Próximo Paso:**
Actualizar schema Prisma y crear modelo de Controles

**¿Desea que proceda con la implementación completa o prefiere hacerlo por fases?**
