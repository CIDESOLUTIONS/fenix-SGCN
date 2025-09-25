# Fase 2: Iteración 2 - Módulo 1: Planeación y Gobierno

## ISO 22301 Cláusula 5: Liderazgo

Este módulo implementa los requisitos de liderazgo y gobierno del SGCN según ISO 22301.

---

## Funcionalidades Implementadas

### 1. Gestión de Políticas del SGCN (Cláusula 5.2)

**Características:**
- ✅ Editor de políticas con control de versiones
- ✅ Flujo de aprobación con WorkflowEngine
- ✅ Publicación y notificación masiva
- ✅ Trazabilidad completa (auditoría)
- ✅ Estados: DRAFT → REVIEW → APPROVED → ACTIVE

**Endpoints:**

```
POST   /governance/policies                    - Crear política
GET    /governance/policies                    - Listar políticas
GET    /governance/policies/:id                - Obtener política
PATCH  /governance/policies/:id                - Actualizar política
POST   /governance/policies/:id/submit-approval - Enviar a aprobación
POST   /governance/policies/:id/approve        - Aprobar política
POST   /governance/policies/:id/publish        - Publicar (activar)
DELETE /governance/policies/:id                - Eliminar política
```

**Flujo de Trabajo:**

```
1. Crear política (DRAFT)
   POST /governance/policies
   {
     "title": "Política de Continuidad de Negocio 2025",
     "content": "...",
     "version": "1.0"
   }

2. Enviar a aprobación (REVIEW)
   POST /governance/policies/{id}/submit-approval
   {
     "approvers": ["ceo@example.com", "ciso@example.com"]
   }
   → Crea workflow automático con notificaciones

3. Aprobar (APPROVED)
   POST /governance/policies/{id}/approve
   {
     "comments": "Política aprobada conforme ISO 22301"
   }
   → Notifica al creador

4. Publicar (ACTIVE)
   POST /governance/policies/{id}/publish
   → Notifica a toda la organización
```

---

### 2. Gestión de Objetivos del SGCN (Cláusula 5.1)

**Características:**
- ✅ Objetivos SMART (específicos, medibles, alcanzables, relevantes, temporales)
- ✅ Asignación de propietarios
- ✅ Seguimiento de progreso (0-100%)
- ✅ Sincronización con Dgraph para análisis
- ✅ Vinculación a procesos de negocio

**Endpoints:**

```
POST   /governance/objectives                  - Crear objetivo
GET    /governance/objectives                  - Listar objetivos
GET    /governance/objectives/:id              - Obtener objetivo
PATCH  /governance/objectives/:id              - Actualizar objetivo
POST   /governance/objectives/:id/link-process - Vincular a proceso
DELETE /governance/objectives/:id              - Eliminar objetivo
```

**Estados de Objetivos:**
- `NOT_STARTED`: No iniciado
- `IN_PROGRESS`: En progreso
- `AT_RISK`: En riesgo
- `COMPLETED`: Completado

**Ejemplo de Objetivo:**

```json
{
  "description": "Reducir el RTO promedio de procesos críticos a menos de 4 horas",
  "measurementCriteria": "RTO promedio de procesos CRITICAL < 4h",
  "targetDate": "2025-12-31",
  "owner": "user_123",
  "status": "IN_PROGRESS",
  "progress": 45
}
```

**Vinculación a Procesos:**
```bash
POST /governance/objectives/{objectiveId}/link-process
{
  "processId": "proc_456"
}
# → Crea relación en Dgraph: Objective --[supportsProcess]--> BusinessProcess
```

---

### 3. Matriz RACI - Roles y Responsabilidades (Cláusula 5.3)

**Características:**
- ✅ Definición de roles y responsabilidades
- ✅ Matriz RACI por proceso/actividad
- ✅ Tipos: Responsible, Accountable, Consulted, Informed
- ✅ Consulta de responsabilidades por usuario

**Endpoints:**

```
POST   /governance/raci-matrix                 - Crear matriz RACI
GET    /governance/raci-matrix                 - Listar matrices
GET    /governance/raci-matrix/:id             - Obtener matriz
PATCH  /governance/raci-matrix/:id             - Actualizar matriz
DELETE /governance/raci-matrix/:id             - Eliminar matriz
GET    /governance/users/:userId/responsibilities - Responsabilidades del usuario
```

**Tipos RACI:**
- **R** (Responsible): Responsable de ejecutar
- **A** (Accountable): Aprobador/Dueño final
- **C** (Consulted): Consultado (input)
- **I** (Informed): Informado (output)

**Ejemplo de Matriz RACI:**

```json
{
  "processOrActivity": "Activación del Plan de Continuidad",
  "assignments": [
    {
      "role": "Gestor del SGCN",
      "responsibility": "Coordinar activación del plan",
      "raciType": "RESPONSIBLE"
    },
    {
      "role": "Director de Operaciones",
      "responsibility": "Aprobar activación",
      "raciType": "ACCOUNTABLE"
    },
    {
      "role": "Líder Técnico",
      "responsibility": "Proveer evaluación técnica",
      "raciType": "CONSULTED"
    },
    {
      "role": "Equipo de Crisis",
      "responsibility": "Recibir notificación",
      "raciType": "INFORMED"
    }
  ]
}
```

---

## Arquitectura e Integración

### Base de Datos

**Tablas Creadas:**

1. **sgcn_policies**
   - Almacena políticas del SGCN
   - Control de versiones
   - Flujo de aprobación y publicación
   - Auditoría completa

2. **sgcn_objectives**
   - Objetivos SMART del SGCN
   - Seguimiento de progreso
   - Sincronizado con Dgraph

3. **raci_matrices**
   - Matrices de roles y responsabilidades
   - Almacenamiento JSON flexible
   - Consulta por usuario

### Integración con Motores Transversales

**1. WorkflowEngine**
- Flujo de aprobación de políticas
- Notificaciones automáticas
- Recordatorios de revisión

**2. DgraphService**
- Sincronización de objetivos
- Relación `supportsProcess` entre objetivo y proceso
- Análisis de alineación estratégica

**3. Sincronización Automática**
```typescript
// Al crear objetivo, se sincroniza a Dgraph
await this.dgraphService.upsertNode(
  'Objective',
  {
    id: objective.id,
    description: objective.description,
    status: objective.status,
    owner: objective.owner,
    nodeType: 'Objective',
  },
  tenantId,
);
```

---

## Casos de Uso

### Caso 1: Aprobación de Política con Trazabilidad

**Escenario:**
Una organización necesita aprobar su política de continuidad de negocio cumpliendo con trazabilidad ISO 22301.

**Flujo:**
1. Gestor del SGCN crea política (DRAFT)
2. Envía a revisión → Sistema crea workflow
3. Aprobadores reciben notificación automática
4. Cada aprobación queda registrada
5. Al completar aprobaciones → Estado APPROVED
6. Publicación → Notificación masiva a organización
7. Registro completo de auditoría disponible

**Beneficio:** Trazabilidad completa del compromiso del liderazgo (requisito ISO 22301).

---

### Caso 2: Gestión de Objetivos Vinculados

**Escenario:**
La organización define objetivo: "Reducir RTO de procesos críticos a 4 horas".

**Flujo:**
1. Se crea objetivo con criterio de medición
2. Sistema sincroniza a Dgraph
3. Se vincula objetivo a procesos críticos específicos
4. En Dgraph: Objective --[supportsProcess]--> BusinessProcess
5. Dashboards muestran avance en tiempo real
6. Análisis de cumplimiento disponible

**Beneficio:** Alineación clara entre objetivos estratégicos y operaciones.

---

### Caso 3: Definición de Responsabilidades RACI

**Escenario:**
Clarificar roles durante activación de planes de continuidad.

**Flujo:**
1. Se crea matriz RACI para "Activación de Plan"
2. Se asignan roles: Responsible, Accountable, Consulted, Informed
3. Durante incidente, cada miembro consulta sus responsabilidades
4. GET /governance/users/{userId}/responsibilities
5. Sistema muestra todas las matrices donde aparece el usuario

**Beneficio:** Elimina ambigüedad durante crisis (cláusula 5.3).

---

## Cumplimiento ISO 22301

### Cláusula 5.1 - Liderazgo y Compromiso

✅ **Implementado:**
- Flujo de aprobación formal de políticas
- Firmas electrónicas (registro de aprobación)
- Publicación formal con notificación

✅ **Evidencia para Auditoría:**
- Registro completo de aprobaciones (`approvedBy`, `approvedAt`)
- Historial de versiones de políticas
- Log de notificaciones enviadas

### Cláusula 5.2 - Política

✅ **Implementado:**
- Editor de políticas con control de versiones
- Estados que garantizan revisión antes de publicación
- Mecanismo de comunicación (notificaciones)

✅ **Evidencia para Auditoría:**
- Política vigente con estado ACTIVE
- Registro de publicación (`publishedBy`, `publishedAt`)
- Confirmación de recepción (logs de notificación)

### Cláusula 5.3 - Roles, Responsabilidades y Autoridades

✅ **Implementado:**
- Matrices RACI completas
- Asignación clara de responsabilidades
- Consulta por usuario de sus roles

✅ **Evidencia para Auditoría:**
- Matrices RACI documentadas
- Relación de usuarios con responsabilidades
- Propagación automática a planes (futura integración)

---

## Modelo de Datos

### SgcnPolicy

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| tenantId | String | Organización |
| title | String | Título de la política |
| content | Text | Contenido completo |
| version | String | Versión (ej: "1.0", "2.1") |
| status | Enum | DRAFT, REVIEW, APPROVED, ACTIVE, ARCHIVED |
| approvedBy | String | Usuario que aprobó |
| approvedAt | DateTime | Fecha de aprobación |
| publishedBy | String | Usuario que publicó |
| publishedAt | DateTime | Fecha de publicación |
| createdBy | String | Creador |
| updatedBy | String | Último editor |

### SgcnObjective

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| tenantId | String | Organización |
| description | String | Descripción del objetivo |
| measurementCriteria | String | Criterio de medición |
| targetDate | DateTime | Fecha objetivo |
| owner | String | Propietario del objetivo |
| status | Enum | NOT_STARTED, IN_PROGRESS, AT_RISK, COMPLETED |
| progress | Int | Progreso 0-100% |

### RaciMatrix

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| tenantId | String | Organización |
| processOrActivity | String | Proceso o actividad |
| assignments | JSON | Array de asignaciones RACI |

**Estructura de assignments:**
```json
[
  {
    "role": "Nombre del rol",
    "responsibility": "Descripción de responsabilidad",
    "raciType": "RESPONSIBLE|ACCOUNTABLE|CONSULTED|INFORMED"
  }
]
```

---

## Endpoints Completos

### Políticas

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/governance/policies` | Crear política |
| GET | `/governance/policies` | Listar todas |
| GET | `/governance/policies/:id` | Obtener por ID |
| PATCH | `/governance/policies/:id` | Actualizar |
| POST | `/governance/policies/:id/submit-approval` | Enviar a revisión |
| POST | `/governance/policies/:id/approve` | Aprobar |
| POST | `/governance/policies/:id/publish` | Publicar |
| DELETE | `/governance/policies/:id` | Eliminar |

### Objetivos

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/governance/objectives` | Crear objetivo |
| GET | `/governance/objectives` | Listar todos |
| GET | `/governance/objectives/:id` | Obtener por ID |
| PATCH | `/governance/objectives/:id` | Actualizar |
| POST | `/governance/objectives/:id/link-process` | Vincular a proceso |
| DELETE | `/governance/objectives/:id` | Eliminar |

### Matriz RACI

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/governance/raci-matrix` | Crear matriz |
| GET | `/governance/raci-matrix` | Listar todas |
| GET | `/governance/raci-matrix/:id` | Obtener por ID |
| PATCH | `/governance/raci-matrix/:id` | Actualizar |
| DELETE | `/governance/raci-matrix/:id` | Eliminar |
| GET | `/governance/users/:userId/responsibilities` | Responsabilidades del usuario |

---

## Próximas Iteraciones

### Módulo 2 - Riesgo de Continuidad (ARA)
**Pendiente:**
- [ ] Sincronizar riesgos a Dgraph
- [ ] Relaciones `affects` entre riesgo y proceso
- [ ] Simulación Montecarlo integrada
- [ ] Mapas de calor dinámicos

### Módulo 3 - Análisis de Impacto (BIA)
**Pendiente:**
- [ ] Mapeo visual de dependencias durante BIA
- [ ] Sincronizar dependencias identificadas a Dgraph
- [ ] Sugerencias RTO/RPO con IA
- [ ] Integración CMDB

---

## Migración de Base de Datos

**Archivo:** `prisma/migrations/20250126_governance_module/migration.sql`

**Ejecución:**
```bash
# Generar cliente Prisma
npm run prisma:generate

# Aplicar migración (desarrollo)
npx prisma migrate dev

# Aplicar migración (producción)
npx prisma migrate deploy
```

**Verificación:**
```sql
-- Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('sgcn_policies', 'sgcn_objectives', 'raci_matrices');

-- Verificar enums
SELECT typname FROM pg_type 
WHERE typname IN ('PolicyStatus', 'ObjectiveStatus');
```

---

## Resumen de la Iteración 2

### Métricas

| Componente | Cantidad |
|------------|----------|
| **Servicios creados** | 1 (GovernanceService - 391 líneas) |
| **Controladores** | 1 (GovernanceController - 204 líneas) |
| **DTOs** | 6 (Create/Update para 3 entidades) |
| **Tablas DB** | 3 (policies, objectives, raci_matrices) |
| **Endpoints** | 24 (8 políticas, 6 objetivos, 6 RACI, 4 auxiliares) |
| **Integraciones** | 2 motores (WorkflowEngine, DgraphService) |

### Estado del Proyecto

**Completado:**
- ✅ Fase 1: Motores Transversales
- ✅ Fase 2 - Iteración 1: Módulo 5 (Planes)
- ✅ Fase 2 - Iteración 2: Módulo 1 (Gobierno)

**Siguiente:**
- ⏳ Fase 2 - Iteración 3: Módulo 2 (Riesgos)

---

**Última actualización:** Iteración 2 completada
**Próximo módulo:** Módulo 2 - Riesgo de Continuidad (ARA)
