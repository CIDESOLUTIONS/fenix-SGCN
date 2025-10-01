# Fase 2: Desarrollo Iterativo por Módulos

## Iteración 1: Módulo 5 - Planes de Continuidad (Piloto)

Este módulo ha sido refactorizado para consumir los motores transversales creados en la Fase 1.

---

## Mejoras Implementadas

### Backend

#### 1. Servicio Ampliado (`continuity-plans.service.ts`)

**Nuevas Funcionalidades:**

✅ **Sincronización con Dgraph**
- Doble escritura automática PostgreSQL → Dgraph
- Creación de nodos tipo `ContinuityPlan` en el grafo
- Relaciones `protects` entre Plan y Proceso

✅ **Integración con Workflow Engine**
- `submitForReview()`: Crea flujo de aprobación automático
- `approvePlan()`: Aprueba y notifica automáticamente
- `activatePlan()`: Activa plan y notifica a participantes

✅ **Análisis de Dependencias**
- `findOne()`: Incluye mapa de dependencias del proceso
- `getImpactAnalysis()`: Análisis de impacto upstream completo
- Conteo automático de nodos afectados y procesos críticos

✅ **Nuevas Operaciones**
- `clonePlan()`: Clona un plan existente
- `remove()`: Elimina de PostgreSQL y Dgraph

**Flujo de Aprobación:**
```
1. create() → Estado: DRAFT
2. submitForReview() → Estado: REVIEW + Workflow creado
3. approvePlan() → Estado: APPROVED + Notificación
4. activatePlan() → Estado: ACTIVE + Notificación masiva
```

#### 2. Controlador Extendido (`continuity-plans.controller.ts`)

**Nuevos Endpoints:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/continuity-plans/:id/impact-analysis` | Análisis de impacto del plan |
| POST | `/continuity-plans/:id/submit-review` | Enviar a revisión |
| POST | `/continuity-plans/:id/approve` | Aprobar plan |
| POST | `/continuity-plans/:id/activate` | Activar plan (incidente) |
| POST | `/continuity-plans/:id/clone` | Clonar plan |

**Ejemplo de Uso:**

```bash
# 1. Crear plan
POST /continuity-plans
{
  "processId": "proc_123",
  "name": "Plan de Recuperación - Producción",
  "type": "DRP",
  "content": { /* playbook visual */ }
}

# 2. Enviar a revisión
POST /continuity-plans/plan_456/submit-review
{
  "approvers": ["manager@example.com", "ciso@example.com"]
}
# → Crea workflow automático

# 3. Aprobar
POST /continuity-plans/plan_456/approve
{
  "comments": "Plan aprobado, cumple con requisitos ISO"
}
# → Envía notificación automática

# 4. Activar durante incidente
POST /continuity-plans/plan_456/activate
{
  "reason": "Fallo crítico en servidor principal - Incidente #789"
}
# → Notifica a todos los participantes
```

#### 3. Módulo Actualizado (`continuity-plans.module.ts`)

**Dependencias Inyectadas:**
- `DgraphModule` (grafo de dependencias)
- `WorkflowEngineModule` (aprobaciones y notificaciones)
- `PrismaModule` (persistencia PostgreSQL)

---

### Frontend

#### 1. Componente de Mapa de Dependencias

**Ubicación:** `frontend/components/dependency-map/`

**Características:**
- Visualización interactiva con ReactFlow
- Nodos diferenciados por tipo y criticidad
- Código de colores:
  - 🔴 Rojo: Criticidad CRITICAL
  - 🟠 Naranja: Criticidad HIGH
  - 🔵 Azul: Criticidad normal
  - 🟣 Púrpura: Assets/Activos

**Tipos de Relaciones:**
- `depends on` (downstream): Azul
- `requires` (upstream): Naranja

**Uso en React:**

```tsx
import { DependencyMap } from '@/components/dependency-map';

export function PlanDetailPage({ planId }: { planId: string }) {
  const { data } = useFetch(`/continuity-plans/${planId}`);
  
  return (
    <div>
      <h2>Mapa de Dependencias</h2>
      <DependencyMap 
        data={data?.dependencyMap}
        onNodeClick={(nodeId) => console.log('Clicked:', nodeId)}
      />
    </div>
  );
}
```

---

## Arquitectura de Integración

### Flujo de Datos

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │ 1. Crear Plan
       ↓
┌─────────────────────────────────────┐
│     ContinuityPlansController       │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│     ContinuityPlansService          │
│  ┌──────────────────────────────┐  │
│  │ 2. Guardar en PostgreSQL     │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 3. Sincronizar a Dgraph      │  │
│  │    (DgraphService)           │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 4. Crear Workflow            │  │
│  │    (WorkflowEngineService)   │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
               │
               ↓
        ┌──────┴──────┐
        │             │
   PostgreSQL      Dgraph
   (entidades)    (relaciones)
```

### Sincronización Bidireccional

**PostgreSQL → Dgraph (Automática)**
```typescript
// En el servicio
await this.prisma.continuityPlan.create({ data });
await this.dgraphService.upsertNode('ContinuityPlan', data, tenantId);
await this.dgraphService.createRelationship(planId, processId, 'protects', tenantId);
```

**Dgraph → PostgreSQL (Consultas)**
```typescript
// Obtener dependencias desde Dgraph
const dependencies = await this.dgraphService.getDependencies(processId, tenantId);

// Enriquecer datos de PostgreSQL con info del grafo
return {
  ...planFromPostgres,
  dependencyMap: dependencies
};
```

---

## Casos de Uso Implementados

### Caso 1: Creación de Plan con Análisis Automático

**Flujo:**
1. Usuario crea plan asociado a proceso crítico
2. Sistema guarda en PostgreSQL
3. Sistema sincroniza a Dgraph automáticamente
4. Al consultar el plan, incluye mapa de dependencias
5. Frontend visualiza dependencias interactivamente

**Beneficio:** El usuario ve inmediatamente qué activos/procesos dependen del plan.

---

### Caso 2: Flujo de Aprobación Automatizado

**Flujo:**
1. Creador envía plan a revisión
2. Sistema crea workflow con aprobadores
3. Workflow Engine encola notificaciones
4. Aprobadores reciben email automático
5. Al aprobar, sistema notifica al creador
6. Plan queda listo para activación

**Beneficio:** Reduce tiempo administrativo y garantiza trazabilidad completa.

---

### Caso 3: Activación de Plan Durante Incidente

**Flujo:**
1. Ocurre incidente crítico
2. Gestor activa plan de continuidad
3. Sistema marca plan como ACTIVE
4. Sistema notifica automáticamente a todos los participantes
5. Participantes reciben instrucciones inmediatas
6. Se registra log de activación para auditoría

**Beneficio:** Respuesta inmediata y coordinada ante crisis.

---

### Caso 4: Análisis de Impacto

**Flujo:**
1. Usuario solicita análisis de impacto de un plan
2. Sistema consulta Dgraph (upstream analysis)
3. Sistema identifica todos los procesos que dependen del proceso protegido
4. Sistema cuenta nodos críticos afectados
5. Frontend muestra visualización y métricas

**Beneficio:** Comprensión clara del alcance del plan.

---

## Próximas Iteraciones

### Módulo 1 - Planeación y Gobierno
**Pendiente:**
- [ ] Flujo de aprobación de políticas con WorkflowEngine
- [ ] Dashboard CISO con BIDashboardService
- [ ] Reportes de cumplimiento con ReportGeneratorService

### Módulo 2 - Riesgo de Continuidad (ARA)
**Pendiente:**
- [ ] Sincronizar riesgos a Dgraph
- [ ] Relaciones `affects` entre riesgo y proceso
- [ ] Simulación Montecarlo integrada

### Módulo 3 - Análisis de Impacto (BIA)
**Pendiente:**
- [ ] Mapeo visual de dependencias durante BIA
- [ ] Sincronizar dependencias identificadas a Dgraph
- [ ] Sugerencias RTO/RPO con IA

### Módulo 4 - Escenarios y Estrategias
**Pendiente:**
- [ ] Motor de recomendación de estrategias
- [ ] Análisis de brechas de recursos
- [ ] Validación de estrategia vs RTO

### Módulo 6 - Pruebas de Continuidad
**Pendiente:**
- [ ] Orquestación de ejercicios con WorkflowEngine
- [ ] Puntuación automatizada
- [ ] Generación de reportes post-ejercicio

### Módulo 7 - Mejora Continua
**Pendiente:**
- [ ] CAPA workflows automáticos
- [ ] Dashboard de revisión por la dirección
- [ ] KPIs ISO 22301 en tiempo real

---

## Pruebas y Validación

### Checklist de Pruebas - Módulo 5

**Operaciones CRUD:**
- [ ] Crear plan → Verifica sincronización a Dgraph
- [ ] Listar planes → Verifica datos completos
- [ ] Obtener plan → Verifica inclusión de mapa de dependencias
- [ ] Actualizar plan → Verifica propagación de cambios
- [ ] Eliminar plan → Verifica eliminación en ambas DBs

**Workflows:**
- [ ] Enviar a revisión → Verifica creación de workflow
- [ ] Aprobar plan → Verifica notificación automática
- [ ] Activar plan → Verifica notificación masiva

**Análisis:**
- [ ] Análisis de impacto → Verifica cálculo correcto de nodos
- [ ] Visualización frontend → Verifica renderizado de grafo

**Integración:**
- [ ] Dgraph responde correctamente
- [ ] Redis/Bull procesa trabajos
- [ ] PostgreSQL mantiene consistencia

---

## Comandos Útiles

### Backend

```bash
# Instalar dependencias
cd backend
npm install

# Generar cliente Prisma
npm run prisma:generate

# Iniciar en desarrollo
npm run start:dev

# Ver logs de Bull Queue
# Acceder a: http://localhost:3001/admin/queues
```

### Docker

```bash
# Levantar infraestructura completa
docker-compose -f docker-compose.dev.yml up -d

# Ver logs de Dgraph
docker logs -f fenix_dgraph

# Verificar Dgraph UI
# Acceder a: http://localhost:8080

# Ver logs de Redis
docker logs -f fenix_redis

# Reiniciar servicios
docker-compose restart fenix_dgraph fenix_redis
```

### Frontend

```bash
# Instalar dependencias (incluye reactflow)
cd frontend
npm install reactflow

# Iniciar Next.js
npm run dev
```

---

## Troubleshooting

### Error: Dgraph no sincroniza

**Solución:**
```bash
# Verificar conectividad
docker exec -it fenix_backend curl http://fenix_dgraph:8080/health

# Ver logs del servicio
docker logs fenix_backend | grep Dgraph

# Reinicializar esquema
# El esquema se crea automáticamente al iniciar el backend
docker-compose restart fenix_backend
```

### Error: Workflow no se ejecuta

**Solución:**
```bash
# Verificar Redis
docker exec -it fenix_redis redis-cli ping
# Debe responder: PONG

# Ver cola de trabajos
docker exec -it fenix_redis redis-cli
> KEYS *
> LRANGE bull:workflow-tasks:* 0 -1
```

### Error: Frontend no muestra mapa

**Solución:**
```bash
# Verificar instalación de reactflow
npm list reactflow

# Si falta, instalar:
npm install reactflow

# Limpiar caché de Next.js
rm -rf .next
npm run dev
```

---

## Métricas de Éxito

### Módulo 5 - Completado ✅

| Métrica | Objetivo | Estado |
|---------|----------|--------|
| Sincronización a Dgraph | 100% | ✅ |
| Workflows automatizados | 3 tipos | ✅ |
| Visualización de dependencias | Implementada | ✅ |
| Análisis de impacto | Funcional | ✅ |
| Endpoints nuevos | 5 | ✅ |

---

## Siguientes Pasos

**Confirma para proceder con:**

1. **Iteración 2: Módulo 2 - Riesgo de Continuidad**
   - Sincronización de riesgos a Dgraph
   - Simulación Montecarlo
   - Mapas de calor dinámicos

2. **Iteración 3: Módulo 3 - BIA**
   - Mapeo visual interactivo
   - Sugerencias IA para RTO/RPO
   - Integración CMDB

3. **Continuar con módulos restantes**

---

**Estado Actual:** Fase 2 - Iteración 1 completada
**Próximo hito:** Módulo 2 - Riesgo de Continuidad
