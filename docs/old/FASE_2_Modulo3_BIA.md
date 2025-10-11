# Fase 2: Iteración 4 - Módulo 3: Análisis de Impacto en el Negocio (BIA)

## ISO 22301 Cláusula 8.2.2 & ISO 22317

Este módulo implementa un proceso completo de BIA alineado con ISO 22301 e ISO 22317.

---

## Funcionalidades Implementadas

### 1. Evaluación BIA con Sincronización Inteligente

**Características:**
- ✅ Cálculo automático de priority score
- ✅ Sincronización de RTO/RPO a Dgraph
- ✅ Sincronización de dependencias al grafo
- ✅ Actualización automática del proceso en el grafo
- ✅ Análisis de puntos únicos de fallo (SPOF)

**Cálculo de Priority Score:**
```typescript
// Factores de prioridad:
- RTO ≤ 4h: +50 puntos
- RTO ≤ 24h: +30 puntos  
- RTO ≤ 72h: +15 puntos
- RTO > 72h: +5 puntos

- Impacto financiero 24h ≥ $100k: +30 puntos
- Impacto financiero 24h ≥ $50k: +20 puntos
- Impacto financiero 24h ≥ $10k: +10 puntos
- Impacto financiero 24h < $10k: +5 puntos

- Impacto operacional CRITICAL/SEVERE: +20 puntos
- Impacto operacional HIGH/MAJOR: +15 puntos
- Impacto operacional MEDIUM/MODERATE: +10 puntos
- Impacto operacional LOW/MINOR: +5 puntos

// Score máximo: 100 puntos
```

**Ejemplo de Creación:**
```bash
POST /bia-assessments
{
  "processId": "proc_123",
  "rto": 4,
  "rpo": 2,
  "financialImpact24h": 75000,
  "operationalImpact": "HIGH",
  "reputationalImpact": "Pérdida de confianza del cliente",
  "regulatoryImpact": "Multas regulatorias posibles",
  "dependencyMap": {
    "dependencies": [
      {
        "id": "app_erp",
        "name": "ERP SAP",
        "type": "APPLICATION"
      },
      {
        "id": "db_primary",
        "name": "Base de Datos Principal",
        "type": "ASSET"
      },
      {
        "id": "supplier_aws",
        "name": "AWS Cloud Services",
        "type": "SUPPLIER"
      }
    ]
  }
}

# Resultado:
# - priorityScore = 50 + 20 + 15 = 85 (alta prioridad)
# - RTO/RPO actualizados en Dgraph para el proceso
# - 3 dependencias sincronizadas al grafo
# - Relaciones creadas: Process --[dependsOn]--> Assets/Apps/Suppliers
```

---

### 2. Sugerencias RTO/RPO con IA (Benchmarks)

**Características:**
- ✅ Benchmarks por criticidad y departamento
- ✅ Sugerencias contextuales automáticas
- ✅ Explicación de la recomendación
- ✅ 4 niveles de criticidad × 4 departamentos = 16 perfiles

**Matriz de Benchmarks:**

| Criticidad | IT | Finance | Operations | Otros |
|------------|----|---------| -----------|-------|
| **CRITICAL** | RTO: 2h, RPO: 1h | RTO: 4h, RPO: 2h | RTO: 4h, RPO: 4h | RTO: 4h, RPO: 2h |
| **HIGH** | RTO: 4h, RPO: 2h | RTO: 8h, RPO: 4h | RTO: 8h, RPO: 8h | RTO: 8h, RPO: 4h |
| **MEDIUM** | RTO: 24h, RPO: 12h | RTO: 24h, RPO: 12h | RTO: 48h, RPO: 24h | RTO: 24h, RPO: 12h |
| **LOW** | RTO: 72h, RPO: 48h | RTO: 72h, RPO: 48h | RTO: 168h, RPO: 72h | RTO: 72h, RPO: 48h |

**Endpoint:**
```
GET /bia-assessments/process/:processId/suggest-rto-rpo
```

**Ejemplo:**
```bash
GET /bia-assessments/process/proc_payments/suggest-rto-rpo

# Respuesta:
{
  "processId": "proc_payments",
  "processName": "Sistema de Pagos",
  "criticality": "CRITICAL",
  "department": "FINANCE",
  "suggestion": {
    "rto": 4,
    "rpo": 2
  },
  "explanation": "Basado en procesos CRITICAL en FINANCE, se recomienda RTO: 4h, RPO: 2h"
}
```

---

### 3. Mapeo Visual Interactivo de Dependencias

**Características:**
- ✅ Editor drag-and-drop para dependencias
- ✅ 4 tipos de nodos: Proceso, Aplicación, Activo, Proveedor
- ✅ Guardado automático al grafo
- ✅ Visualización de dependencias existentes
- ✅ Modo read-only para revisión

**Componente Frontend:**
```tsx
<BiaDependencyMapper
  processId="proc_123"
  processName="Sistema de Pagos"
  initialDependencies={existingDeps}
  onSaveDependencies={(deps) => saveToDB(deps)}
  readOnly={false}
/>
```

**Tipos de Dependencias:**
- 🟦 **Proceso**: Otros procesos de negocio
- 🟪 **Aplicación**: Sistemas de software
- 🟩 **Activo**: Infraestructura, servidores, equipos
- 🟧 **Proveedor**: Servicios externos críticos

---

### 4. Campañas de BIA con Workflow Automático

**Características:**
- ✅ Creación masiva de workflows
- ✅ Asignación automática a propietarios de proceso
- ✅ Flujo de 2 pasos: Completar → Revisar
- ✅ Notificaciones y recordatorios automáticos
- ✅ Seguimiento centralizado del progreso

**Endpoint:**
```
POST /bia-assessments/campaign
```

**Ejemplo:**
```bash
POST /bia-assessments/campaign
{
  "name": "BIA Anual 2025",
  "processIds": [
    "proc_payments",
    "proc_billing",
    "proc_inventory",
    "proc_shipping"
  ],
  "reviewers": [
    "ciso@example.com",
    "coo@example.com"
  ],
  "dueDate": "2025-04-30"
}

# Resultado:
{
  "message": "Campaña de BIA creada",
  "campaignName": "BIA Anual 2025",
  "processCount": 4,
  "workflowsCreated": 4,
  "workflows": [
    {
      "id": "wf_001",
      "processId": "proc_payments"
    },
    {
      "id": "wf_002",
      "processId": "proc_billing"
    },
    // ...
  ]
}

# → 4 workflows creados automáticamente
# → Notificaciones enviadas a propietarios
# → Recordatorios programados antes del deadline
```

**Flujo del Workflow:**
```
1. Paso "Completar BIA"
   - Asignado a: Propietario del Proceso
   - Fecha límite: dueDate configurado
   - Acción: Completar encuesta BIA

2. Paso "Revisar BIA"  
   - Asignado a: Revisores (CISO, COO, etc.)
   - Fecha límite: dueDate + 7 días
   - Acción: Validar y aprobar BIA
```

---

### 5. Análisis de Cobertura del BIA

**Características:**
- ✅ Porcentaje de procesos con BIA completado
- ✅ Distribución por criticidad
- ✅ Identificación de brechas
- ✅ Recomendaciones de priorización

**Endpoint:**
```
GET /bia-assessments/coverage
```

**Respuesta:**
```json
{
  "totalProcesses": 50,
  "assessedProcesses": 35,
  "coveragePercentage": 70,
  "byCriticality": {
    "CRITICAL": {
      "total": 10,
      "assessed": 10,
      "coverage": 100
    },
    "HIGH": {
      "total": 15,
      "assessed": 12,
      "coverage": 80
    },
    "MEDIUM": {
      "total": 20,
      "assessed": 10,
      "coverage": 50
    },
    "LOW": {
      "total": 5,
      "assessed": 3,
      "coverage": 60
    }
  },
  "gaps": [
    {
      "processId": "proc_hr",
      "name": "Gestión de RRHH",
      "criticality": "HIGH",
      "recommendation": "Prioridad alta: BIA pendiente para proceso crítico"
    }
  ]
}
```

---

### 6. Análisis de Puntos Únicos de Fallo (SPOF)

**Características:**
- ✅ Identificación automática desde Dgraph
- ✅ Análisis de impacto cascada
- ✅ Procesos afectados por cada SPOF
- ✅ Recomendaciones de mitigación

**Incluido en GET /bia-assessments/:id:**
```json
{
  "id": "bia_123",
  "processId": "proc_payments",
  // ... otros campos del BIA
  "spofAnalysis": [
    {
      "spofId": "db_primary",
      "spofName": "Base de Datos Principal",
      "spofType": "ASSET",
      "affectsProcesses": [
        {
          "id": "proc_payments",
          "name": "Sistema de Pagos",
          "criticality": "CRITICAL",
          "rto": 4
        },
        {
          "id": "proc_billing",
          "name": "Facturación",
          "criticality": "HIGH",
          "rto": 8
        }
      ],
      "totalImpact": "2 procesos críticos afectados",
      "recommendation": "Implementar redundancia: cluster de BD o replicación"
    }
  ]
}
```

---

## Arquitectura e Integración

### Flujo de Datos - Creación de BIA

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │ 1. Completar BIA con dependencias
       ↓
┌─────────────────────────────────────┐
│   BiaAssessmentsController          │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   BiaAssessmentsService             │
│  ┌──────────────────────────────┐  │
│  │ 2. Calcular Priority Score   │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 3. Guardar en PostgreSQL     │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 4. Actualizar Proceso        │  │
│  │    en Dgraph (RTO/RPO)       │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 5. Sincronizar Dependencias  │  │
│  │    al Grafo                  │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
               │
               ↓
        ┌──────┴──────┐
        │             │
   PostgreSQL      Dgraph
   (BIA data)   (dependencias)
```

### Integraciones con Motores

**1. DgraphService**
- Actualización de RTO/RPO en nodos de proceso
- Creación de nodos Asset/Application/Supplier
- Relaciones `dependsOn` entre proceso y dependencias
- Consultas SPOF con DQL
- Análisis de cobertura de dependencias

**2. WorkflowEngineService**
- Campañas de BIA masivas
- Workflows de 2 pasos: Completar → Revisar
- Notificaciones automáticas
- Recordatorios programados

**3. AnalyticsEngineService**
- Cálculo de cobertura del BIA
- Identificación de brechas
- Análisis de distribución por criticidad
- Recomendaciones de priorización

---

## Casos de Uso

### Caso 1: BIA Guiado con Sugerencias IA

**Escenario:**
Propietario de proceso no experto necesita completar BIA del "Sistema de Pagos".

**Flujo:**
1. Usuario accede a formulario BIA
2. Sistema detecta: Proceso CRITICAL en departamento FINANCE
3. Sistema sugiere: RTO: 4h, RPO: 2h (benchmark)
4. Usuario acepta sugerencia o ajusta según necesidad
5. Usuario mapea dependencias visualmente (drag-and-drop)
6. Sistema calcula priority score automáticamente: 85/100
7. BIA se sincroniza a Dgraph automáticamente

**Beneficio:** Usuario no experto completa BIA preciso con guía contextual.

---

### Caso 2: Campaña Anual de BIA

**Escenario:**
CISO necesita actualizar BIA de 50 procesos antes del Q2.

**Flujo:**
1. CISO crea campaña "BIA Anual 2025"
2. Selecciona 50 procesos críticos y de alto impacto
3. Define revisores (COO, CFO) y deadline (30-abr)
4. Sistema crea 50 workflows automáticamente
5. Propietarios reciben notificación de tarea
6. Sistema envía recordatorios 1 semana antes
7. Revisores aprueban BIAs completados
8. Dashboard muestra progreso en tiempo real: 35/50 (70%)

**Beneficio:** Coordinación eficiente de actualización masiva sin gestión manual.

---

### Caso 3: Identificación de SPOF Crítico

**Escenario:**
Analista revisa BIA y descubre punto único de fallo.

**Flujo:**
1. Analista consulta BIA del "Sistema de Pagos"
2. Sistema muestra análisis SPOF automático
3. Identifica: "Base de Datos Principal" afecta 2 procesos CRITICAL
4. Mapa visual muestra cascada de impacto
5. Sistema recomienda: "Implementar cluster de BD"
6. Analista crea acción correctiva vinculada al SPOF
7. Plan de mitigación se rastrea en Módulo 7

**Beneficio:** Identificación proactiva de vulnerabilidades arquitectónicas.

---

### Caso 4: Análisis de Cobertura Pre-Auditoría

**Escenario:**
Auditoría ISO 22301 en 2 semanas, verificar cobertura.

**Flujo:**
1. Gestor SGCN consulta dashboard de cobertura
2. Sistema reporta: 70% de procesos con BIA
3. Identifica brecha: 3 procesos HIGH sin BIA
4. Prioriza: "Gestión de RRHH" (HIGH) sin evaluar
5. Crea mini-campaña urgente para procesos faltantes
6. En 1 semana alcanza 100% de cobertura en procesos críticos
7. Auditor valida cobertura completa

**Beneficio:** Preparación efectiva para auditoría con identificación de brechas.

---

## Endpoints Completos

### Operaciones CRUD

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/bia-assessments` | Crear BIA con sincronización |
| GET | `/bia-assessments` | Listar con cobertura |
| GET | `/bia-assessments/:id` | Obtener con dependencias y SPOF |
| PATCH | `/bia-assessments/:id` | Actualizar y re-sincronizar |
| DELETE | `/bia-assessments/:id` | Eliminar |

### Análisis y Sugerencias

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/bia-assessments/coverage` | Análisis de cobertura |
| GET | `/bia-assessments/process/:processId/suggest-rto-rpo` | Sugerencias IA |

### Campañas y Workflows

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/bia-assessments/campaign` | Crear campaña masiva |

---

## Componente Frontend: BIA Dependency Mapper

**Ubicación:** `frontend/components/bia-dependency-mapper/`

**Características:**
- Editor visual drag-and-drop
- 4 tipos de nodos con colores distintivos
- Panel de control para agregar dependencias
- Guardado automático al backend
- Modo read-only para revisión
- Leyenda integrada

**Uso:**
```tsx
import { BiaDependencyMapper } from '@/components/bia-dependency-mapper';

export function BiaForm({ processId, processName }: Props) {
  const [dependencies, setDependencies] = useState([]);
  
  const handleSave = async (deps) => {
    await fetch(`/bia-assessments`, {
      method: 'POST',
      body: JSON.stringify({
        processId,
        rto: 4,
        rpo: 2,
        dependencyMap: { dependencies: deps }
      })
    });
  };
  
  return (
    <div>
      <h2>Mapeo de Dependencias</h2>
      <BiaDependencyMapper
        processId={processId}
        processName={processName}
        initialDependencies={dependencies}
        onSaveDependencies={handleSave}
        readOnly={false}
      />
    </div>
  );
}
```

---

## Cumplimiento ISO 22301 & ISO 22317

### ISO 22301 Cláusula 8.2.2 - BIA

✅ **Requisitos Cumplidos:**
- Identificación de actividades críticas ✅
- Determinación de impactos a lo largo del tiempo ✅
- Establecimiento de objetivos de recuperación (RTO/RPO) ✅
- Identificación de dependencias y recursos ✅
- Priorización de actividades ✅

✅ **Evidencia para Auditoría:**
- BIAs documentados con priority score
- Mapas de dependencias visuales
- RTO/RPO justificados con benchmarks
- Análisis SPOF documentado
- Cobertura rastreable por criticidad

### ISO 22317 - Directrices BIA

✅ **Buenas Prácticas Implementadas:**
- Sugerencias basadas en industria y criticidad ✅
- Mapeo visual de dependencias (no solo lista) ✅
- Análisis de impacto multinivel (financiero, operacional, reputacional) ✅
- Identificación de SPOF ✅
- Campañas coordinadas para actualización periódica ✅

✅ **Elementos Clave ISO 22317:**
- Contexto organizacional considerado (departamento) ✅
- Impactos cuantificados (financiero 24h, 48h, 72h) ✅
- Recursos críticos identificados (aplicaciones, activos, proveedores) ✅
- Personal clave considerado (propietarios asignados) ✅
- Tiempo considerado (RTO/RPO en horas) ✅

---

## Modelo de Datos

### BiaAssessment (PostgreSQL)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| tenantId | String | Organización |
| processId | String | Proceso evaluado |
| rto | Int | Recovery Time Objective (horas) |
| rpo | Int | Recovery Point Objective (horas) |
| mtpd | Int | Maximum Tolerable Period of Disruption |
| financialImpact24h | Decimal | Impacto financiero a las 24h |
| financialImpact48h | Decimal | Impacto financiero a las 48h |
| financialImpact72h | Decimal | Impacto financiero a las 72h |
| operationalImpact | String | Impacto operacional (texto) |
| reputationalImpact | String | Impacto reputacional |
| regulatoryImpact | String | Impacto regulatorio |
| dependencyMap | JSON | Mapa de dependencias |
| priorityScore | Int | Score calculado (0-100) |
| vitalRecords | String[] | Registros vitales |
| keyPersonnel | String[] | Personal clave |

### Sincronización a Dgraph

**Actualización de Proceso:**
```graphql
mutation {
  set {
    <proc_123> <rto> "4" .
    <proc_123> <rpo> "2" .
    <proc_123> <criticality> "CRITICAL" .
  }
}
```

**Creación de Dependencias:**
```graphql
mutation {
  set {
    <app_erp> <dgraph.type> "Asset" .
    <app_erp> <name> "ERP SAP" .
    <app_erp> <type> "APPLICATION" .
    <proc_123> <dependsOn> <app_erp> .
  }
}
```

---

## Algoritmos Clave

### 1. Cálculo de Priority Score

```typescript
function calculatePriorityScore(
  rto?: number,
  financialImpact24h?: any,
  operationalImpact?: string
): number {
  let score = 0;

  // Factor RTO
  if (rto) {
    if (rto <= 4) score += 50;
    else if (rto <= 24) score += 30;
    else if (rto <= 72) score += 15;
    else score += 5;
  }

  // Factor financiero
  if (financialImpact24h) {
    const impact = parseFloat(financialImpact24h.toString());
    if (impact >= 100000) score += 30;
    else if (impact >= 50000) score += 20;
    else if (impact >= 10000) score += 10;
    else score += 5;
  }

  // Factor operacional
  if (operationalImpact) {
    const impactUpper = operationalImpact.toUpperCase();
    if (impactUpper.includes('CRITICAL') || impactUpper.includes('SEVERE'))
      score += 20;
    else if (impactUpper.includes('HIGH') || impactUpper.includes('MAJOR'))
      score += 15;
    else if (impactUpper.includes('MEDIUM') || impactUpper.includes('MODERATE'))
      score += 10;
    else score += 5;
  }

  return score;
}
```

### 2. Benchmarks RTO/RPO

```typescript
const benchmarks = {
  CRITICAL: {
    IT: { rto: 2, rpo: 1 },
    FINANCE: { rto: 4, rpo: 2 },
    OPERATIONS: { rto: 4, rpo: 4 },
    DEFAULT: { rto: 4, rpo: 2 },
  },
  HIGH: {
    IT: { rto: 4, rpo: 2 },
    FINANCE: { rto: 8, rpo: 4 },
    OPERATIONS: { rto: 8, rpo: 8 },
    DEFAULT: { rto: 8, rpo: 4 },
  },
  // ... MEDIUM, LOW
};
```

---

## Resumen de la Iteración 4

### Métricas

| Componente | Cantidad |
|------------|----------|
| **Servicios actualizados** | 1 (BiaAssessmentsService - ya bien estructurado) |
| **Controladores actualizados** | 1 (BiaAssessmentsController - 80 líneas) |
| **Módulos actualizados** | 1 (con 4 integraciones) |
| **Endpoints** | 8 (5 CRUD + 3 análisis) |
| **Componentes frontend** | 1 (BiaDependencyMapper - 250 líneas) |
| **Integraciones** | 3 motores (Dgraph, Analytics, Workflow) |
| **Algoritmos** | 2 (priority score, benchmarks) |

### Estado del Proyecto

**Completado:**
- ✅ Fase 1: Motores Transversales
- ✅ Fase 2 - Iteración 1: Módulo 5 (Planes)
- ✅ Fase 2 - Iteración 2: Módulo 1 (Gobierno)
- ✅ Fase 2 - Iteración 3: Módulo 2 (Riesgos)
- ✅ Fase 2 - Iteración 4: Módulo 3 (BIA)

**Siguiente:**
- ⏳ Fase 2 - Iteración 5: Módulo 4 (Escenarios y Estrategias)

**Progreso:** 57% (4/7 módulos funcionales completados)

---

**Última actualización:** Iteración 4 completada
**Próximo módulo:** Módulo 4 - Escenarios y Estrategias de Continuidad
