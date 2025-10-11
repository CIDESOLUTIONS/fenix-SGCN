# Fase 2: Iteración 3 - Módulo 2: Riesgo de Continuidad (ARA)

## ISO 31000 & ISO 22301 Cláusula 8.2.3

Este módulo implementa un sistema completo de gestión de riesgos alineado con ISO 31000 e ISO 22301.

---

## Funcionalidades Implementadas

### 1. Evaluación de Riesgos con Sincronización a Dgraph

**Características:**
- ✅ Evaluación cualitativa (probabilidad e impacto 1-5)
- ✅ Cálculo automático de score ponderado por categoría
- ✅ Sincronización automática a Dgraph
- ✅ Relaciones `affects` entre riesgo y proceso
- ✅ Evaluación antes y después de controles

**Ponderación por Categoría:**
```typescript
OPERATIONAL: 1.2
TECHNOLOGICAL: 1.3
NATURAL: 1.1
HUMAN: 1.0
EXTERNAL: 1.15
```

**Ejemplo de Creación:**
```bash
POST /risk-assessments
{
  "processId": "proc_123",
  "name": "Fallo de Servidor Principal",
  "description": "Caída del servidor crítico de producción",
  "category": "TECHNOLOGICAL",
  "probabilityBefore": 4,
  "impactBefore": 5,
  "controls": ["Monitoreo 24/7", "Servidor de respaldo"],
  "probabilityAfter": 2,
  "impactAfter": 3
}

# Resultado:
# - scoreBefore = 4 × 5 × 1.3 = 26
# - scoreAfter = 2 × 3 × 1.3 = 7.8
# - Sincronizado a Dgraph automáticamente
# - Relación creada: Risk --[affects]--> BusinessProcess
```

---

### 2. Simulación Montecarlo

**Características:**
- ✅ Análisis cuantitativo de riesgos financieros
- ✅ Distribuciones probabilísticas (triangular)
- ✅ 10,000 iteraciones por defecto
- ✅ Estadísticas: media, mediana, desviación estándar
- ✅ Percentiles: P10, P50, P90, P95, P99

**Endpoint:**
```
POST /risk-assessments/:id/monte-carlo
```

**Ejemplo:**
```bash
POST /risk-assessments/risk_456/monte-carlo
{
  "impactMin": 10000,
  "impactMost": 50000,
  "impactMax": 200000,
  "probabilityMin": 0.1,
  "probabilityMax": 0.5,
  "iterations": 10000
}

# Respuesta:
{
  "risk": {
    "id": "risk_456",
    "name": "Fallo de Servidor Principal",
    "category": "TECHNOLOGICAL"
  },
  "simulation": {
    "statistics": {
      "mean": 75000,
      "median": 68000,
      "stdDev": 35000,
      "min": 12000,
      "max": 195000
    },
    "percentiles": {
      "p10": 35000,
      "p50": 68000,
      "p90": 125000,
      "p95": 145000,
      "p99": 178000
    },
    "distribution": [
      { "range": "0-20k", "count": 850 },
      { "range": "20-40k", "count": 1420 },
      { "range": "40-60k", "count": 2180 },
      // ...
    ]
  }
}
```

**Interpretación:**
- Hay un 90% de probabilidad de que el impacto sea menor a $125,000
- El valor esperado (media) es $75,000
- En el peor escenario (P99), el impacto podría alcanzar $178,000

---

### 3. Mapa de Calor de Riesgos

**Características:**
- ✅ Visualización matricial 3×3
- ✅ Agrupación automática por impacto y probabilidad
- ✅ Código de colores por severidad
- ✅ Click para ver detalles de riesgos

**Endpoint:**
```
GET /risk-assessments/heatmap
```

**Estructura de Respuesta:**
```json
{
  "HIGH_HIGH": [
    {
      "id": "risk_001",
      "name": "Ciberataque Ransomware",
      "process": "Sistema de Pagos",
      "category": "TECHNOLOGICAL",
      "score": 26
    }
  ],
  "HIGH_MEDIUM": [...],
  "HIGH_LOW": [...],
  "MEDIUM_HIGH": [...],
  "MEDIUM_MEDIUM": [...],
  "MEDIUM_LOW": [...],
  "LOW_HIGH": [...],
  "LOW_MEDIUM": [...],
  "LOW_LOW": [...]
}
```

**Colores:**
- 🔴 Rojo (HIGH_HIGH, HIGH_MEDIUM): Riesgos críticos
- 🟠 Naranja (HIGH_LOW, MEDIUM_HIGH): Riesgos altos
- 🟡 Amarillo (MEDIUM_MEDIUM, MEDIUM_LOW, LOW_HIGH): Riesgos moderados
- 🟢 Verde (LOW_MEDIUM, LOW_LOW): Riesgos bajos

---

### 4. Plan de Tratamiento de Riesgos (Workflow)

**Características:**
- ✅ 4 estrategias: Evitar, Mitigar, Transferir, Aceptar
- ✅ Workflow automático para acciones de mitigación
- ✅ Asignación de tareas con fechas de vencimiento
- ✅ Seguimiento de progreso

**Endpoint:**
```
POST /risk-assessments/:id/treatment-plan
```

**Ejemplo:**
```bash
POST /risk-assessments/risk_456/treatment-plan
{
  "strategy": "MITIGATE",
  "owner": "user_ciso",
  "actions": [
    {
      "description": "Implementar sistema de respaldo redundante",
      "assignee": "admin_ti@example.com",
      "dueDate": "2025-03-01"
    },
    {
      "description": "Configurar failover automático",
      "assignee": "devops@example.com",
      "dueDate": "2025-03-15"
    },
    {
      "description": "Realizar prueba de recuperación",
      "assignee": "qa@example.com",
      "dueDate": "2025-03-30"
    }
  ]
}

# Resultado:
{
  "message": "Plan de tratamiento creado",
  "workflowId": "wf_789",
  "strategy": "MITIGATE",
  "actions": 3
}
# → Workflow creado con 3 tareas
# → Notificaciones enviadas a asignados
# → Recordatorios automáticos programados
```

---

### 5. Análisis de Riesgos Críticos

**Características:**
- ✅ Identificación automática de riesgos de alto impacto
- ✅ Análisis de procesos afectados desde Dgraph
- ✅ Recomendaciones de priorización

**Endpoint:**
```
GET /risk-assessments/critical
```

**Respuesta:**
```json
{
  "count": 3,
  "risks": [
    {
      "id": "risk_001",
      "name": "Ciberataque Ransomware",
      "impact": "HIGH",
      "likelihood": "HIGH",
      "category": "TECHNOLOGICAL",
      "affects": [
        {
          "id": "proc_payments",
          "name": "Sistema de Pagos",
          "criticality": "CRITICAL"
        },
        {
          "id": "proc_billing",
          "name": "Facturación",
          "criticality": "HIGH"
        }
      ]
    }
  ],
  "recommendation": "Priorizar tratamiento de riesgos que afectan procesos críticos"
}
```

---

### 6. Vinculación de Riesgos a Procesos

**Endpoint:**
```
POST /risk-assessments/:id/link-process
```

**Ejemplo:**
```bash
POST /risk-assessments/risk_456/link-process
{
  "processId": "proc_secondary"
}

# Crea relación en Dgraph:
# Risk --[affects]--> BusinessProcess
```

---

## Arquitectura e Integración

### Flujo de Datos

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │ 1. Crear Riesgo
       ↓
┌─────────────────────────────────────┐
│   RiskAssessmentsController         │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   RiskAssessmentsService            │
│  ┌──────────────────────────────┐  │
│  │ 2. Calcular Score Ponderado  │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 3. Guardar en PostgreSQL     │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 4. Sincronizar a Dgraph      │  │
│  │    (DgraphService)           │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 5. Crear Relación 'affects'  │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
               │
               ↓
        ┌──────┴──────┐
        │             │
   PostgreSQL      Dgraph
   (datos)      (relaciones)
```

### Integraciones con Motores

**1. DgraphService**
- Sincronización de riesgos como nodos
- Relaciones `affects` entre riesgo y proceso
- Consultas de impacto downstream
- Identificación de procesos críticos afectados

**2. AnalyticsEngineService**
- Simulación Montecarlo
- Análisis cuantitativo de riesgos
- Cálculo de percentiles y estadísticas

**3. WorkflowEngineService**
- Planes de tratamiento automatizados
- Notificaciones a responsables
- Recordatorios de acciones pendientes
- Seguimiento de progreso

---

## Casos de Uso

### Caso 1: Evaluación y Visualización de Riesgos

**Escenario:**
Organización necesita evaluar riesgos tecnológicos y visualizar el panorama general.

**Flujo:**
1. Analista crea evaluación de riesgo
2. Sistema calcula score con ponderación TECHNOLOGICAL (1.3x)
3. Riesgo se sincroniza a Dgraph
4. Dashboard muestra mapa de calor actualizado
5. CISO visualiza concentración de riesgos críticos
6. Se identifica necesidad de mitigación urgente

**Beneficio:** Visibilidad inmediata del perfil de riesgo organizacional.

---

### Caso 2: Análisis Cuantitativo con Montecarlo

**Escenario:**
CFO requiere estimación probabilística del impacto financiero de un riesgo.

**Flujo:**
1. Se ejecuta simulación Montecarlo con 10,000 iteraciones
2. Sistema genera distribución de probabilidad
3. Se obtienen percentiles: P50=$68k, P90=$125k, P99=$178k
4. CFO puede presupuestar $125k con 90% de confianza
5. Board recibe informe con análisis cuantitativo

**Beneficio:** Decisiones financieras basadas en probabilidades, no en promedios simples.

---

### Caso 3: Plan de Tratamiento Automatizado

**Escenario:**
Riesgo crítico requiere mitigación urgente con múltiples acciones.

**Flujo:**
1. CISO define estrategia "MITIGATE" con 3 acciones
2. Sistema crea workflow automático
3. Responsables reciben notificaciones
4. Tareas se rastrean con fechas de vencimiento
5. Recordatorios automáticos antes de deadline
6. Al completar todas las acciones → Riesgo reevaluado

**Beneficio:** Coordinación eficiente de tratamiento de riesgos sin intervención manual.

---

### Caso 4: Análisis de Impacto Cascada

**Escenario:**
Identificar todos los procesos afectados por un riesgo tecnológico.

**Flujo:**
1. Usuario consulta riesgo "Fallo de Servidor Principal"
2. Sistema consulta Dgraph: Risk --[affects]--> Procesos
3. Se identifican procesos directamente afectados
4. Análisis de impacto upstream revela procesos dependientes
5. Mapa visual muestra cascada de impacto
6. Se priorizan procesos críticos para tratamiento

**Beneficio:** Comprensión completa del alcance del riesgo.

---

## Endpoints Completos

### Operaciones CRUD

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/risk-assessments` | Crear evaluación |
| GET | `/risk-assessments` | Listar todas |
| GET | `/risk-assessments/:id` | Obtener con análisis de impacto |
| PATCH | `/risk-assessments/:id` | Actualizar |
| DELETE | `/risk-assessments/:id` | Eliminar |

### Análisis y Visualización

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/risk-assessments/heatmap` | Mapa de calor 3×3 |
| GET | `/risk-assessments/critical` | Riesgos críticos con análisis |
| POST | `/risk-assessments/:id/link-process` | Vincular a proceso |

### Análisis Cuantitativo

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/risk-assessments/:id/monte-carlo` | Simulación Montecarlo |

### Tratamiento de Riesgos

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/risk-assessments/:id/treatment-plan` | Crear plan de tratamiento |

---

## Componente Frontend: Risk Heatmap

**Ubicación:** `frontend/components/risk-heatmap/`

**Características:**
- Matriz 3×3 interactiva
- Código de colores por severidad
- Contador de riesgos por celda
- Click para ver detalles
- Resumen de riesgos críticos/altos/bajos

**Uso:**
```tsx
import { RiskHeatmap } from '@/components/risk-heatmap';

export function RiskDashboard() {
  const { data } = useFetch('/risk-assessments/heatmap');
  
  return (
    <div>
      <h2>Mapa de Calor de Riesgos</h2>
      <RiskHeatmap 
        data={data}
        onRiskClick={(riskId) => router.push(`/risks/${riskId}`)}
      />
    </div>
  );
}
```

---

## Cumplimiento ISO 31000 & ISO 22301

### ISO 31000 - Gestión de Riesgos

✅ **Principios:**
- Integrado (riesgos vinculados a procesos)
- Estructurado (marco sistemático)
- Basado en mejor información (análisis cuantitativo)
- Dinámico (sincronización en tiempo real)

✅ **Marco:**
- Liderazgo y compromiso (workflows de aprobación)
- Integración (Dgraph conecta riesgos con toda la organización)
- Mejora continua (planes de tratamiento rastreables)

✅ **Proceso:**
- Identificación ✅
- Análisis (cualitativo y cuantitativo) ✅
- Evaluación (matrices, scores) ✅
- Tratamiento (4 estrategias, workflows) ✅
- Monitoreo (dashboards en tiempo real) ✅

### ISO 22301 Cláusula 8.2.3 - Evaluación de Riesgos

✅ **Requisitos Cumplidos:**
- Identificación de riesgos que pueden afectar procesos críticos ✅
- Análisis de probabilidad e impacto ✅
- Evaluación de riesgos antes y después de controles ✅
- Priorización basada en criterios definidos ✅
- Documentación completa y auditable ✅

✅ **Evidencia para Auditoría:**
- Registro completo de evaluaciones de riesgos
- Ponderación documentada por categoría
- Mapas de calor que muestran priorización
- Planes de tratamiento con acciones y responsables
- Trazabilidad de sincronización con procesos

---

## Modelo de Datos

### RiskAssessment (PostgreSQL)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| tenantId | String | Organización |
| processId | String | Proceso afectado |
| name | String | Nombre del riesgo |
| description | String | Descripción detallada |
| category | Enum | OPERATIONAL, TECHNOLOGICAL, NATURAL, HUMAN, EXTERNAL |
| probabilityBefore | Int | Probabilidad sin controles (1-5) |
| impactBefore | Int | Impacto sin controles (1-5) |
| scoreBefore | Decimal | Score calculado (ponderado) |
| controls | String[] | Controles existentes |
| probabilityAfter | Int | Probabilidad con controles (1-5) |
| impactAfter | Int | Impacto con controles (1-5) |
| scoreAfter | Decimal | Score residual |
| kris | JSON | Indicadores clave de riesgo |
| resilienceScore | Decimal | Puntuación de resiliencia |

### Risk (Dgraph)

```graphql
type Risk {
  id: string
  name: string
  impact: string  # HIGH, MEDIUM, LOW
  likelihood: string  # HIGH, MEDIUM, LOW
  category: string
  nodeType: string
  tenantId: string
  affects: [BusinessProcess]  # Relación hacia procesos
}
```

---

## Algoritmos Clave

### 1. Cálculo de Score Ponderado

```typescript
function calculateRiskScore(
  probability: number,
  impact: number,
  category: string
): number {
  const baseScore = probability * impact;
  
  const weights = {
    OPERATIONAL: 1.2,
    TECHNOLOGICAL: 1.3,
    NATURAL: 1.1,
    HUMAN: 1.0,
    EXTERNAL: 1.15,
  };
  
  return baseScore * (weights[category] || 1.0);
}
```

### 2. Clasificación de Niveles

```typescript
function getImpactLevel(value: number): string {
  if (value >= 4) return 'HIGH';
  if (value >= 2) return 'MEDIUM';
  return 'LOW';
}
```

### 3. Agrupación para Heatmap

```typescript
const key = `${impact}_${likelihood}`;
// Ejemplo: "HIGH_MEDIUM"

heatmap[key].push(risk);
```

---

## Próximas Iteraciones

### Módulo 3 - BIA
**Pendiente:**
- [ ] Mapeo visual de dependencias durante BIA
- [ ] Sincronizar dependencias identificadas a Dgraph
- [ ] Sugerencias RTO/RPO con IA
- [ ] Integración CMDB

### Módulo 4 - Escenarios y Estrategias
**Pendiente:**
- [ ] Motor de recomendación de estrategias
- [ ] Análisis de brechas de recursos
- [ ] Validación de estrategia vs RTO

### Módulo 6 - Pruebas
**Pendiente:**
- [ ] Orquestación de ejercicios
- [ ] Puntuación automatizada
- [ ] Reportes post-ejercicio

### Módulo 7 - Mejora Continua
**Pendiente:**
- [ ] CAPA workflows automáticos
- [ ] Dashboard de revisión por dirección
- [ ] KPIs ISO 22301

---

## Resumen de la Iteración 3

### Métricas

| Componente | Cantidad |
|------------|----------|
| **Servicios refactorizados** | 1 (RiskAssessmentsService - 370 líneas) |
| **Controladores actualizados** | 1 (RiskAssessmentsController - 140 líneas) |
| **Módulos actualizados** | 1 (con 4 integraciones) |
| **Endpoints** | 10 (5 CRUD + 5 análisis) |
| **Componentes frontend** | 1 (RiskHeatmap) |
| **Integraciones** | 3 motores (Dgraph, Analytics, Workflow) |
| **Algoritmos** | 3 (score, niveles, agrupación) |

### Estado del Proyecto

**Completado:**
- ✅ Fase 1: Motores Transversales
- ✅ Fase 2 - Iteración 1: Módulo 5 (Planes)
- ✅ Fase 2 - Iteración 2: Módulo 1 (Gobierno)
- ✅ Fase 2 - Iteración 3: Módulo 2 (Riesgos)

**Siguiente:**
- ⏳ Fase 2 - Iteración 4: Módulo 3 (BIA)

---

**Última actualización:** Iteración 3 completada
**Próximo módulo:** Módulo 3 - Análisis de Impacto en el Negocio (BIA)
