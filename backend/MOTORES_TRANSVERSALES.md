# Motores Transversales - Fenix-SGCN

Este documento describe la arquitectura de los motores centrales que dan servicio a todos los módulos funcionales de la plataforma.

## Arquitectura Híbrida de Datos

### PostgreSQL (Fuente de Verdad)
- **Propósito**: Almacenamiento de entidades y datos transaccionales
- **Tecnología**: PostgreSQL 16 + Prisma ORM
- **Responsabilidades**:
  - Gestión de usuarios y tenants
  - Datos de negocio (procesos, riesgos, planes)
  - Auditoría y trazabilidad
  - Operaciones CRUD

### Dgraph (Motor de Relaciones)
- **Propósito**: Gestión del grafo de dependencias
- **Tecnología**: Dgraph (standalone)
- **Endpoints**: 
  - HTTP: `http://localhost:8080`
  - gRPC: `localhost:9080`
- **Responsabilidades**:
  - Mapeo de dependencias entre entidades
  - Análisis de impacto en cascada
  - Identificación de puntos únicos de fallo
  - Consultas de grafos complejas

### Sincronización (Doble Escritura)
- **Implementación**: `GraphSyncInterceptor`
- **Estrategia**: Interceptor global en operaciones POST/PUT/PATCH
- **Flujo**:
  1. Operación en PostgreSQL (Prisma)
  2. Éxito → Propagar a Dgraph
  3. Fallo en Dgraph → Log (no bloquea operación principal)

---

## Motor 1: Workflow Engine

**Ubicación**: `backend/src/workflow-engine/`

### Funcionalidades
- ✅ Gestión de estados de flujos de trabajo
- ✅ Flujos de aprobación secuenciales/paralelos
- ✅ Notificaciones automáticas
- ✅ Tareas recurrentes programadas
- ✅ Cola de trabajos con Bull + Redis

### Endpoints Principales
```
POST   /workflows/start              - Iniciar workflow
POST   /workflows/:id/advance        - Avanzar al siguiente paso
POST   /workflows/approval           - Crear flujo de aprobación
POST   /workflows/notify             - Enviar notificación
POST   /workflows/:id/cancel         - Cancelar workflow
```

### Tipos de Tareas
- `APPROVAL`: Aprobaciones
- `NOTIFICATION`: Notificaciones por email
- `REVIEW`: Revisiones periódicas
- `REMINDER`: Recordatorios automáticos
- `ESCALATION`: Escalamiento a nivel superior

### Ejemplo de Uso
```typescript
// Crear flujo de aprobación
const workflow = await workflowService.createApprovalWorkflow(
  'continuity-plan',
  planId,
  ['user1@example.com', 'user2@example.com'],
  tenantId,
  currentUserId
);
```

---

## Motor 2: BI Dashboards

**Ubicación**: `backend/src/bi-dashboards/`

### Funcionalidades
- ✅ Dashboards personalizables por rol
- ✅ Widgets dinámicos
- ✅ KPIs del SGCN en tiempo real
- ✅ Mapas de calor de riesgos
- ✅ Gráficos interactivos

### Endpoints Principales
```
POST   /dashboards                   - Crear dashboard
GET    /dashboards/kpis              - Obtener KPIs generales
GET    /dashboards/ciso              - Dashboard del CISO
GET    /dashboards/process-owner     - Dashboard del propietario
GET    /dashboards/risk-heatmap      - Mapa de calor de riesgos
GET    /dashboards/plan-status       - Estado de planes
```

### Tipos de Widgets
- `KPI_CARD`: Tarjeta de indicador clave
- `BAR_CHART`: Gráfico de barras
- `PIE_CHART`: Gráfico circular
- `LINE_CHART`: Gráfico de líneas
- `HEATMAP`: Mapa de calor
- `TABLE`: Tabla de datos
- `RISK_MATRIX`: Matriz de riesgos

### Ejemplo de Dashboard CISO
```json
{
  "id": "ciso_dashboard",
  "name": "Dashboard del CISO",
  "widgets": [
    {
      "id": "kpi_critical_processes",
      "type": "KPI_CARD",
      "title": "Procesos Críticos"
    },
    {
      "id": "risk_heatmap",
      "type": "HEATMAP",
      "title": "Mapa de Calor de Riesgos"
    }
  ]
}
```

---

## Motor 3: Analytics Engine

**Ubicación**: `backend/src/analytics-engine/`

### Funcionalidades
- ✅ Análisis de dependencias (upstream/downstream)
- ✅ Identificación de SPOF (Single Points of Failure)
- ✅ Análisis de cobertura del BIA
- ✅ Evaluación de cumplimiento ISO 22301
- ✅ Simulación Montecarlo para riesgos
- ✅ Generación de reportes PDF/DOCX

### Endpoints Principales
```
GET    /analytics/dependencies/:processId    - Analizar dependencias
GET    /analytics/spof                       - Puntos únicos de fallo
GET    /analytics/bia-coverage               - Cobertura del BIA
GET    /analytics/iso-compliance             - Cumplimiento ISO 22301
POST   /analytics/monte-carlo                - Simulación Montecarlo
POST   /analytics/reports/management-review  - Reporte de dirección
POST   /analytics/reports/bia                - Reporte BIA
POST   /analytics/reports/risk-assessment    - Reporte de riesgos
POST   /analytics/reports/test-exercise/:id  - Reporte de ejercicio
```

### Simulación Montecarlo
Análisis cuantitativo de riesgos con distribuciones probabilísticas:

```typescript
const simulation = await analyticsService.runMonteCarloSimulation(
  riskId,
  10000, // iteraciones
  {
    impactMin: 10000,
    impactMost: 50000,
    impactMax: 200000,
    probabilityMin: 0.1,
    probabilityMax: 0.5
  }
);

// Resultado incluye:
// - statistics: { mean, median, stdDev, min, max }
// - percentiles: { p10, p50, p90, p95, p99 }
// - distribution: histograma
```

### Reportes ISO 22301
Reportes predefinidos alineados con los requisitos de la norma:
- **Revisión por la Dirección** (Cláusula 9.3)
- **Reporte BIA** (Cláusula 8.2.2)
- **Evaluación de Riesgos** (Cláusula 8.2.3)
- **Resultados de Ejercicios** (Cláusula 8.5)

---

## Tecnologías Utilizadas

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| Base de Datos Relacional | PostgreSQL | 16 |
| Base de Datos Grafo | Dgraph | latest |
| Cola de Trabajos | Redis + Bull | 7 + 4.x |
| Cliente Dgraph | dgraph-js | 21.3.1 |
| Generación PDF | PDFKit | 0.15.0 |
| Generación DOCX | Docxtemplater | 3.50.0 |

---

## Instrucciones de Despliegue

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Levantar infraestructura
```bash
docker-compose -f docker-compose.dev.yml up -d
```

Servicios levantados:
- PostgreSQL: `localhost:5432`
- Dgraph: `localhost:8080` (UI), `localhost:9080` (gRPC)
- Redis: `localhost:6379`
- MinIO: `localhost:9000` (API), `localhost:9001` (Console)

### 3. Verificar Dgraph
Acceder a la UI de Dgraph:
```
http://localhost:8080
```

### 4. Ejecutar migraciones
```bash
npm run prisma:generate
```

### 5. Iniciar backend
```bash
npm run start:dev
```

---

## Próximos Pasos (Fase 2)

### Módulo 5 - Operación (Piloto)
- [ ] Refactorizar para consumir `WorkflowEngine`
- [ ] Integrar mapa de dependencias con `DgraphService`
- [ ] Implementar dashboards con `BIDashboardService`
- [ ] Generar reportes con `ReportGeneratorService`

### Módulos 1, 2, 3, 4, 6, 7
- [ ] Migrar lógica de workflows a `WorkflowEngine`
- [ ] Centralizar analítica en `AnalyticsEngine`
- [ ] Unificar dashboards en `BIDashboardModule`

---

## Troubleshooting

### Error: Cannot connect to Dgraph
```bash
# Verificar que el contenedor esté corriendo
docker ps | grep dgraph

# Ver logs
docker logs fenix_dgraph

# Reiniciar servicio
docker-compose restart fenix_dgraph
```

### Error: Redis connection refused
```bash
# Verificar Redis
docker logs fenix_redis

# Alternativa: usar Redis local
REDIS_HOST=localhost npm run start:dev
```

### Error: Dgraph schema not initialized
El esquema se crea automáticamente al iniciar el backend. Si falla:
```bash
# Acceder a Dgraph UI
http://localhost:8080

# Ejecutar manualmente el schema desde:
backend/src/dgraph/dgraph.service.ts (método setupSchema)
```

---

## Contribuir

Para agregar nuevos motores transversales:

1. Crear módulo en `backend/src/[nombre-motor]/`
2. Decorar con `@Global()` para disponibilidad global
3. Exportar servicios principales
4. Registrar en `app.module.ts`
5. Documentar endpoints y ejemplos

---

**Última actualización**: Fase 1 completada
**Siguiente fase**: Desarrollo Iterativo por Módulos
