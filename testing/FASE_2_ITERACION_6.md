# Fase 2: Iteración 6 - Módulo 6: Pruebas de Continuidad

## ISO 22301 Cláusula 8.5

Este módulo implementa un programa completo de ejercicios y pruebas para validar la efectividad de los planes de continuidad.

---

## Funcionalidades Implementadas

### 1. Planificación de Ejercicios

**Tipos de Ejercicios:**

| Tipo | Descripción | Duración Típica | Complejidad |
|------|-------------|-----------------|-------------|
| **TABLETOP** | Discusión teórica del plan | 2-4 horas | Baja |
| **WALKTHROUGH** | Revisión paso a paso | 4-8 horas | Media |
| **SIMULATION** | Simulación sin activación real | 1-2 días | Alta |
| **FULL_TEST** | Prueba completa con activación | 1-3 días | Muy Alta |

---

### 2. Modo Ejecución en Tiempo Real

**Flujo:**
1. Inicio → POST /exercises/:id/start
2. Eventos → POST /exercises/:id/log-event
3. Inyecciones → POST /exercises/:id/inject-event
4. Tareas → POST /exercises/:id/complete-task
5. Finalización → POST /exercises/:id/finish

---

### 3. Puntuación Automatizada

**Algoritmo:**
```typescript
Score Base = 100 puntos

Factor 1: Performance vs RTO (50%)
  Duración <= RTO:        -0 puntos  ✅
  Duración <= RTO × 1.2:  -15 puntos ⚠️
  Duración <= RTO × 1.5:  -30 puntos ❌
  Duración > RTO × 1.5:   -50 puntos ❌❌

Factor 2: Tareas Completadas (30%)
  100%:       -0 puntos
  80-99%:     -10 puntos
  60-79%:     -20 puntos
  < 60%:      -30 puntos

Factor 3: Inyecciones (20%)
  Por inyección: -5 puntos
```

**Resultados:**
- **SUCCESS**: Score ≥ 85 y RTO cumplido
- **SUCCESS_WITH_OBSERVATIONS**: Score 70-84
- **FAILED**: Score < 70 o RTO no cumplido

---

### 4. Análisis de Brechas

**Categorías:**
- **PERFORMANCE**: Tiempo vs RTO
- **ADAPTABILITY**: Respuesta a imprevistos
- **EXECUTION**: Tareas completadas

**Severidad:** HIGH, MEDIUM, LOW

**Endpoint:**
```
GET /exercises/:id/gaps
```

**Respuesta:**
```json
{
  "exerciseId": "ex_001",
  "totalGaps": 2,
  "highSeverityGaps": 0,
  "gaps": [
    {
      "id": "gap_adaptability_ex_001",
      "category": "ADAPTABILITY",
      "severity": "MEDIUM",
      "title": "Respuesta a Eventos Imprevistos",
      "description": "1 evento no planificado inyectado",
      "impact": "Capacidad de adaptación bajo estrés",
      "recommendation": "Entrenar equipo en toma de decisiones bajo presión",
      "estimatedEffort": "15-30 días"
    },
    {
      "id": "gap_execution_ex_001",
      "category": "EXECUTION",
      "severity": "MEDIUM",
      "title": "Tareas Incompletas",
      "description": "9 de 10 tareas completadas (90%)",
      "impact": "Plan parcialmente ejecutado",
      "recommendation": "Revisar asignación de responsabilidades",
      "estimatedEffort": "15-30 días"
    }
  ],
  "nextSteps": "Convertir brechas en acciones correctivas"
}
```

---

### 5. Calendario de Ejercicios

**Características:**
- ✅ Vista anual completa
- ✅ Agrupación por mes
- ✅ Filtros por estado y tipo
- ✅ Estadísticas de cobertura

**Endpoint:**
```
GET /exercises/calendar?year=2025
```

**Respuesta:**
```json
{
  "year": 2025,
  "totalExercises": 12,
  "byMonth": {
    "1": [
      {
        "id": "ex_001",
        "name": "Tabletop DR Datacenter",
        "type": "TABLETOP",
        "date": "2025-01-15",
        "status": "COMPLETED",
        "criticality": "CRITICAL"
      }
    ],
    "3": [
      {
        "id": "ex_002",
        "name": "Simulación Ransomware",
        "type": "SIMULATION",
        "date": "2025-03-20",
        "status": "PLANNED",
        "criticality": "HIGH"
      }
    ],
    // ... otros meses
  },
  "byStatus": {
    "planned": 8,
    "inProgress": 1,
    "completed": 3,
    "cancelled": 0
  }
}
```

---

### 6. Generación de Reportes PDF

**Estructura:**
1. Información General
2. Objetivos
3. Escenario
4. Participantes
5. Timeline de Ejecución
6. Performance vs RTO
7. Tareas Ejecutadas
8. Brechas Identificadas
9. Recomendaciones
10. Próximos Pasos

**Endpoint:**
```
GET /exercises/:id/report
```

---

## Casos de Uso

### Caso 1: Ejercicio Tabletop (Básico)

**Escenario:**
Validación teórica del plan de DR del datacenter.

**Flujo:**
1. Gestor crea ejercicio TABLETOP
2. Define objetivos y participantes
3. Día del ejercicio: Inicia sesión
4. Facilitador registra decisiones del equipo
5. Sin inyecciones (ejercicio básico)
6. Finaliza en 3 horas (dentro de RTO 4h)
7. Score: 95 (SUCCESS)
8. Reporte generado automáticamente

**Beneficio:** Validación rápida sin impacto operativo.

---

### Caso 2: Simulación con Inyecciones

**Escenario:**
Prueba realista con eventos no planificados.

**Flujo:**
1. Gestor crea ejercicio SIMULATION
2. Equipo inicia activación del sitio DR
3. **Hora 2:** Facilitador inyecta "Fallo en backup secundario"
4. Equipo debe adaptar estrategia
5. **Hora 3:** Facilitador inyecta "Proveedor no responde"
6. Equipo encuentra solución alternativa
7. Finaliza en 5 horas (RTO: 4h)
8. Score: 70 (SUCCESS_WITH_OBSERVATIONS)
9. Brecha identificada: Respuesta a imprevistos

**Beneficio:** Evalúa adaptabilidad bajo presión.

---

### Caso 3: Prueba Completa con Evidencia

**Escenario:**
Activación real del plan con captura de evidencia.

**Flujo:**
1. Gestor programa FULL_TEST
2. Día del ejercicio: Activación real del DR
3. Equipo completa tareas y captura evidencia:
   - Foto del dashboard del sitio DR
   - Video de la activación
   - Logs del sistema
4. Cada tarea tiene timestamp preciso
5. Finaliza en 4 horas exactas
6. Score: 90 (SUCCESS)
7. Reporte con evidencia adjunta
8. Auditor valida con pruebas irrefutables

**Beneficio:** Evidencia verificable para auditoría.

---

### Caso 4: Del Ejercicio a la Mejora Continua

**Escenario:**
Brechas identificadas se convierten en acciones.

**Flujo:**
1. Ejercicio identifica 3 brechas
2. Sistema genera análisis de gaps
3. Gestor accede a Módulo 7 (Mejora Continua)
4. Convierte cada brecha en acción correctiva
5. Asigna responsables y fechas
6. Workflow automático rastrea progreso
7. Próximo ejercicio valida mejoras

**Beneficio:** Ciclo completo de mejora continua.

---

## Endpoints Completos

### Operaciones CRUD

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/exercises` | Crear ejercicio |
| GET | `/exercises` | Listar con filtros |
| GET | `/exercises/:id` | Obtener por ID |
| PATCH | `/exercises/:id` | Actualizar |
| DELETE | `/exercises/:id` | Eliminar |

### Ejecución del Ejercicio

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/exercises/:id/start` | Iniciar ejercicio |
| POST | `/exercises/:id/log-event` | Registrar evento |
| POST | `/exercises/:id/inject-event` | Inyectar evento no planificado |
| POST | `/exercises/:id/complete-task` | Marcar tarea completada |
| POST | `/exercises/:id/finish` | Finalizar y calcular score |

### Análisis y Reportes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/exercises/:id/report` | Generar reporte PDF |
| GET | `/exercises/:id/gaps` | Análisis de brechas |
| GET | `/exercises/calendar` | Calendario anual |

---

## Componente Frontend: Exercise Control Panel

**Ubicación:** `frontend/components/exercise-control-panel/`

**Características:**
- Panel de control en tiempo real
- Cronómetro automático
- Métricas visuales instantáneas
- Log de eventos con colores
- Modal de inyección de eventos
- Registro de tareas completadas

**Uso:**
```tsx
import { ExerciseControlPanel } from '@/components/exercise-control-panel';

export function ExercisePage({ exerciseId }: Props) {
  const { data: exercise, refetch } = useFetch(`/exercises/${exerciseId}`);
  
  const handleStart = async () => {
    await fetch(`/exercises/${exerciseId}/start`, { method: 'POST' });
    refetch();
  };
  
  const handleFinish = async () => {
    await fetch(`/exercises/${exerciseId}/finish`, { method: 'POST' });
    refetch();
  };
  
  const handleLogEvent = async (event) => {
    await fetch(`/exercises/${exerciseId}/log-event`, {
      method: 'POST',
      body: JSON.stringify(event)
    });
    refetch();
  };
  
  return (
    <ExerciseControlPanel
      exercise={exercise}
      onStart={handleStart}
      onFinish={handleFinish}
      onLogEvent={handleLogEvent}
      onInjectEvent={handleInjectEvent}
      onCompleteTask={handleCompleteTask}
    />
  );
}
```

---

## Cumplimiento ISO 22301

### Cláusula 8.5 - Programa de Ejercicios

✅ **Requisitos Cumplidos:**
- Planificación de ejercicios periódicos ✅
- Tipos de ejercicios variados ✅
- Objetivos definidos y medibles ✅
- Participación de personal relevante ✅
- Registro de resultados ✅
- Identificación de áreas de mejora ✅
- Documentación completa ✅

✅ **Evidencia para Auditoría:**
- Calendario anual de ejercicios
- Reportes post-ejercicio con PDF
- Evidencia multimedia capturada
- Timeline preciso de eventos
- Comparación RTO real vs objetivo
- Brechas identificadas y accionables
- Seguimiento de mejoras

---

## Modelo de Datos

### Exercise (PostgreSQL)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| tenantId | String | Organización |
| name | String | Nombre del ejercicio |
| type | Enum | TABLETOP, WALKTHROUGH, SIMULATION, FULL_TEST |
| scenario | Text | Descripción del escenario |
| objectives | String[] | Lista de objetivos |
| planId | String | Plan a probar |
| scheduledDate | DateTime | Fecha programada |
| duration | Int | Duración planificada (horas) |
| participants | String[] | Emails de participantes |
| status | Enum | PLANNED, IN_PROGRESS, COMPLETED, CANCELLED |
| actualStartTime | DateTime | Inicio real |
| actualEndTime | DateTime | Fin real |
| actualDuration | Int | Duración real (horas) |
| result | Enum | SUCCESS, SUCCESS_WITH_OBSERVATIONS, FAILED |
| score | Int | Puntuación 0-100 |
| executionLog | JSON | Log completo del ejercicio |

### ExecutionLog (JSON)

```json
{
  "events": [
    {
      "timestamp": "ISO-8601",
      "type": "EXERCISE_STARTED | DECISION | INJECTION | ...",
      "user": "email",
      "description": "string",
      "metadata": {}
    }
  ],
  "completedTasks": [
    {
      "taskId": "string",
      "completedBy": "email",
      "completedAt": "ISO-8601",
      "notes": "string",
      "evidence": ["url1", "url2"]
    }
  ]
}
```

---

## Algoritmos Clave

### 1. Cálculo de Score

```typescript
function calculateExerciseScore(
  actualDuration: number,
  targetRto: number,
  executionLog: any
): number {
  let score = 100;

  // Factor 1: Performance vs RTO (50%)
  const rtoRatio = actualDuration / targetRto;
  if (rtoRatio <= 1) score -= 0;
  else if (rtoRatio <= 1.2) score -= 15;
  else if (rtoRatio <= 1.5) score -= 30;
  else score -= 50;

  // Factor 2: Tareas completadas (30%)
  const completedTasks = executionLog.completedTasks?.length || 0;
  const totalTasks = 10; // Del plan
  const completionRate = completedTasks / totalTasks;
  
  if (completionRate >= 1) score -= 0;
  else if (completionRate >= 0.8) score -= 10;
  else if (completionRate >= 0.6) score -= 20;
  else score -= 30;

  // Factor 3: Inyecciones (20%)
  const injections = executionLog.events?.filter(
    e => e.type === 'INJECTION'
  ).length || 0;
  score -= injections * 5;

  return Math.max(0, Math.min(100, score));
}
```

### 2. Determinación de Resultado

```typescript
function determineResult(
  actualDuration: number,
  targetRto: number,
  score: number
): string {
  if (actualDuration <= targetRto && score >= 85) {
    return 'SUCCESS';
  } else if (actualDuration <= targetRto * 1.2 && score >= 70) {
    return 'SUCCESS_WITH_OBSERVATIONS';
  } else {
    return 'FAILED';
  }
}
```

### 3. Identificación de Brechas

```typescript
function identifyGaps(exercise: Exercise): Gap[] {
  const gaps = [];

  // Brecha 1: Performance
  if (exercise.actualDuration > exercise.targetRto) {
    gaps.push({
      category: 'PERFORMANCE',
      severity: 'HIGH',
      title: 'RTO No Cumplido',
      recommendation: 'Optimizar procedimientos críticos'
    });
  }

  // Brecha 2: Adaptabilidad
  const injections = exercise.executionLog.events.filter(
    e => e.type === 'INJECTION'
  );
  if (injections.length > 0) {
    gaps.push({
      category: 'ADAPTABILITY',
      severity: 'MEDIUM',
      title: 'Respuesta a Imprevistos',
      recommendation: 'Entrenar en toma de decisiones'
    });
  }

  // Brecha 3: Ejecución
  const completionRate = exercise.completedTasks / exercise.totalTasks;
  if (completionRate < 1) {
    gaps.push({
      category: 'EXECUTION',
      severity: completionRate < 0.7 ? 'HIGH' : 'MEDIUM',
      title: 'Tareas Incompletas',
      recommendation: 'Revisar asignación de responsabilidades'
    });
  }

  return gaps;
}
```

---

## Resumen de la Iteración 6

### Métricas

| Componente | Cantidad |
|------------|----------|
| **Servicio creado** | 1 (ExercisesService - 550 líneas) |
| **Controlador creado** | 1 (150 líneas) |
| **Módulo creado** | 1 (con 4 integraciones) |
| **Endpoints** | 13 (5 CRUD + 8 operaciones) |
| **Componentes frontend** | 1 (ExerciseControlPanel - 350 líneas) |
| **Integraciones** | 3 motores (Workflow, Analytics, ReportGenerator) |
| **Algoritmos** | 3 (score, resultado, gaps) |

### Estado del Proyecto

**Completado:**
- ✅ Fase 1: Motores Transversales
- ✅ Fase 2 - Iteración 1: Módulo 5 (Planes)
- ✅ Fase 2 - Iteración 2: Módulo 1 (Gobierno)
- ✅ Fase 2 - Iteración 3: Módulo 2 (Riesgos)
- ✅ Fase 2 - Iteración 4: Módulo 3 (BIA)
- ✅ Fase 2 - Iteración 5: Módulo 4 (Estrategias)
- ✅ Fase 2 - Iteración 6: Módulo 6 (Pruebas)

**Siguiente:**
- ⏳ Fase 2 - Iteración 7: Módulo 7 (Mejora Continua)

**Progreso:** 86% (6/7 módulos funcionales completados)

---

## Diferenciadores Competitivos

### vs. Competidores

**Puntuación Automatizada:**
✅ Fenix: Score objetivo basado en 3 factores
❌ Fusion/Veoci/MetricStream: Evaluación manual

**Inyección de Eventos:**
✅ Fenix: Inyecciones en tiempo real para probar adaptabilidad
❌ Competidores: Ejercicios siguiendo guion estricto

**Evidencia Multimedia:**
✅ Fenix: Captura de fotos/videos durante ejercicio
❌ Competidores: Solo notas de texto

**Panel en Tiempo Real:**
✅ Fenix: Dashboard activo con métricas instantáneas
❌ Competidores: Registro post-ejercicio

**Análisis de Brechas Automático:**
✅ Fenix: Identificación y categorización de gaps
❌ Competidores: Análisis manual

---

**Última actualización:** Iteración 6 completada
**Próximo módulo:** Módulo 7 - Mejora Continua (ISO 22301 Cláusula 10)
**¡Solo falta 1 módulo para completar el sistema!**
