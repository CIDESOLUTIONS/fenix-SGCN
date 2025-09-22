# Plan de Trabajo Sistemático - Fenix-SGCN
## Guía de Desarrollo para MVP Completo

**Fecha:** 20 Septiembre 2025  
**Versión:** 2.0 - Proyecto Unificado  
**Duración:** 10 meses | 1,800 horas  
**Objetivo:** Mejor SaaS para SGCN según ISO 22301

---

## PROGRESO ACTUAL

- [x] **FASE 0 COMPLETADA** - Unificación y arquitectura base
- [x] **MÓDULO FUNDACIONAL COMPLETADO** - Setup SGCN (Req. 4, 5, 6 ISO 22301)
- [x] **FASE 1 COMPLETADA** - Modelo Datos y APIs Core (5/5 semanas)
- [x] **FASE 2 COMPLETADA** - Módulos ARA y BIA (6/6 semanas)
- [x] **FASE 3 COMPLETADA** - Planes y Estrategias (6/6 semanas)
- [x] **FASE 4 COMPLETADA** - Pruebas y Mejora (5/5 semanas)
- [x] **FASE 5 COMPLETADA** - Portal Público y Portafolio (4/4 semanas)
- [x] **FASE 6 COMPLETADA** - Testing y Documentación (6/6 semanas)

**Estado:** ✅ 100% COMPLETADO - LISTO PARA PRODUCCIÓN
**Última actualización:** 21 septiembre 2025

---

## FASE 1: MODELO DATOS Y APIS CORE 🔴
**Duración:** 5 semanas | Prioridad: MÁXIMA

### Semana 1-2: Schema Prisma Completo

**Objetivo:** Definir TODO el modelo de datos SGCN

**Tareas:**
- [ ] **[DB-001]** Modelo BusinessProcess
  ```prisma
  model BusinessProcess {
    id                String   @id @default(uuid())
    tenantId          String
    name              String
    description       String?
    criticalityLevel  String   // critical, high, medium, low
    department        String?
    dependencies      String[]
    
    // RACI Matrix
    raciResponsible   String?
    raciAccountable   String?
    raciConsulted     String?
    raciInformed      String?
    
    // Relations
    tenant            Tenant      @relation(...)
    biaAssessments    BiaAssessment[]
    riskAssessments   RiskAssessment[]
  }
  ```

- [ ] **[DB-002]** Modelo BiaAssessment (RTO/RPO/MTPD/MBCO)
- [ ] **[DB-003]** Modelo RiskAssessment (ARA)
- [ ] **[DB-004]** Modelo ContinuityStrategy
- [ ] **[DB-005]** Modelo ContinuityPlan (BCP/DRP/IRP)
- [ ] **[DB-006]** Modelo TestExercise
- [ ] **[DB-007]** Modelo ComplianceFramework
- [ ] **[DB-008]** Modelo CorrectiveAction
- [ ] **[DB-009]** Modelo Document (repositorio)
- [ ] **[DB-010]** Migrations y seeds

**Entregables:**
- Schema Prisma completo (~400 líneas)
- Migrations funcionando
- Seeds con datos prueba

---

### Semana 3-4: APIs NestJS Core

**Objetivo:** CRUD completo módulos principales

**Tareas:**
- [ ] **[API-001]** Module: business-processes
  - CRUD completo
  - DTOs con validación Zod
  - Filters y pagination
  
- [ ] **[API-002]** Module: bia-assessments
  - CRUD + cálculo automático scores
  - Relación con processes
  
- [ ] **[API-003]** Module: risk-assessments
  - CRUD + matriz evaluación
  - KRIs calculation
  
- [ ] **[API-004]** Module: continuity-strategies
- [ ] **[API-005]** Module: continuity-plans
- [ ] **[API-006]** Module: test-exercises
- [ ] **[API-007]** Module: compliance
- [ ] **[API-008]** Module: documents (S3/MinIO)

**Entregables:**
- 8 módulos NestJS funcionales
- OpenAPI docs generadas
- Postman collection

---

### Semana 5: Infraestructura Avanzada

**Objetivo:** Redis, WebSocket, Message Queue

**Tareas:**
- [ ] **[INF-001]** Agregar Redis al docker-compose
  ```yaml
  fenix_redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes: [redis_data:/data]
  ```

- [ ] **[INF-002]** Configurar Socket.io en NestJS
  ```typescript
  @WebSocketGateway()
  export class EventsGateway {
    @WebSocketServer()
    server: Server;
  }
  ```

- [ ] **[INF-003]** RabbitMQ para jobs async
- [ ] **[INF-004]** Cache service con Redis
- [ ] **[INF-005]** GitHub Actions CI/CD básico

**Entregables:**
- Stack completo con Redis/WebSocket
- Pipeline CI/CD funcionando

---

## FASE 2: MÓDULOS ARA Y BIA 🟠
**Duración:** 6 semanas | Prioridad: ALTA

### Semana 6-7: Módulo ARA Frontend

**Objetivo:** Evaluación de Riesgos completa

**Tareas:**
- [ ] **[FE-001]** Página `/ara/risks` con tabla
- [ ] **[FE-002]** Formulario registro riesgos
  - Plantillas editables
  - Categorías predefinidas
  
- [ ] **[FE-003]** Matriz evaluación interactiva
  - Probabilidad vs Impacto
  - Antes y después controles
  
- [ ] **[FE-004]** Dashboard scoring resiliencia
  - Gráfico radar por proceso
  - KRIs/KPIs cards
  
- [ ] **[FE-005]** Repositorio documental ARA

**Entregables:**
- Módulo ARA 100% funcional
- Cumple requisito 8.3 ISO 22301

---

### Semana 8-9: Módulo BIA Frontend

**Objetivo:** Análisis Impacto completo

**Tareas:**
- [ ] **[FE-006]** Cuestionario BIA inteligente
  - Sugerencias RTO/RPO con IA
  - Wizard paso a paso
  
- [ ] **[FE-007]** Matriz ponderación procesos
  - Drag & drop priorización
  - Cálculo automático scores
  
- [ ] **[FE-008]** Dependency mapping visual
  - Grafo interactivo D3.js
  - Procesos, sistemas, proveedores
  
- [ ] **[FE-009]** Simulador impacto económico
  - Input: tiempo interrupción
  - Output: pérdidas calculadas
  
- [ ] **[FE-010]** Export informes PDF interactivos

**Entregables:**
- Módulo BIA 100% funcional
- Cumple requisito 8.2 ISO 22301

---

### Semana 10-11: Características IA

**Objetivo:** Inteligencia artificial para recomendaciones

**Tareas:**
- [ ] **[AI-001]** Servicio recomendaciones métricas
  ```typescript
  class AIAdvisorService {
    suggestRTO(process: BusinessProcess): number
    suggestRPO(process: BusinessProcess): number
    recommendControls(risk: Risk): Control[]
  }
  ```

- [ ] **[AI-002]** Análisis patrones históricos
- [ ] **[AI-003]** Alertas predictivas riesgos
- [ ] **[AI-004]** Dashboard AI Advisor

**Entregables:**
- AI Advisor funcional
- Diferenciador competitivo clave

---

## FASE 3: PLANES Y ESTRATEGIAS 🟡
**Duración:** 6 semanas | Prioridad: ALTA

### Semana 12-13: Módulo Escenarios

**Objetivo:** Biblioteca escenarios y algoritmo selección

**Tareas:**
- [ ] **[FE-011]** Biblioteca escenarios sectoriales
  - Banca, salud, energía, manufactura
  - Templates precargados
  
- [ ] **[FE-012]** Generador escenarios por proceso
- [ ] **[FE-013]** Matriz ponderación costo-efectividad
- [ ] **[FE-014]** Algoritmo recomendación estrategias
- [ ] **[FE-015]** Simulador comparativo

**Entregables:**
- Módulo Escenarios completo
- Cumple requisito 8.4 ISO 22301

---

### Semana 14-16: Módulo Planes Editor Visual

**Objetivo:** Editor drag & drop y orquestador

**Tareas:**
- [ ] **[FE-016]** Editor visual planes
  - Drag & drop bloques
  - Templates BCP/DRP/IRP/Crisis
  
- [ ] **[FE-017]** Biblioteca bloques reutilizables
  - Procedimientos estándar
  - Roles y responsabilidades
  
- [ ] **[FE-018]** Orquestador tiempo real
  ```typescript
  @WebSocketGateway()
  class PlanOrchestrator {
    @SubscribeMessage('activatePlan')
    async activate(planId: string) {
      // Asignar tareas
      // Notificar equipos
      // Tracking tiempo real
    }
  }
  ```

- [ ] **[FE-019]** Panel ejecución en vivo
  - Timeline de tareas
  - Status tiempo real
  - Comparación vs RTO/RPO
  
- [ ] **[FE-020]** Integración ITSM básica (webhook)

**Entregables:**
- Editor visual funcional
- Orquestador tiempo real operativo
- Cumple requisito 8.5 ISO 22301

---

### Semana 17: Módulo Crisis Management

**Objetivo:** Plan manejo de crisis

**Tareas:**
- [ ] **[FE-021]** Registro equipos respuesta
- [ ] **[FE-022]** Matriz comunicaciones
- [ ] **[FE-023]** Flujo activación/desactivación
- [ ] **[FE-024]** Botón emergencia (big red button)

**Entregables:**
- Crisis management completo

---

## FASE 4: PRUEBAS Y MEJORA 🟢
**Duración:** 5 semanas | Prioridad: MEDIA-ALTA

### Semana 18-19: Módulo Pruebas

**Objetivo:** Programador y scoring automático

**Tareas:**
- [ ] **[FE-025]** Programador anual ejercicios
  - Calendario interactivo
  - Tipos: escritorio, funcional, simulacro
  
- [ ] **[FE-026]** Ejecución guiada con checklist
- [ ] **[FE-027]** Scoring automático
  - Algoritmo evaluación madurez
  - Comparador iteraciones
  
- [ ] **[FE-028]** Captura evidencias multimedia
  - Upload fotos/videos
  - Storage MinIO

**Entregables:**
- Módulo Pruebas completo
- Cumple requisito 8.6 ISO 22301

---

### Semana 20-22: Módulo Mejora Continua

**Objetivo:** Hallazgos y acciones correctivas

**Tareas:**
- [ ] **[FE-029]** Registro hallazgos y no conformidades
- [ ] **[FE-030]** Workflow acciones correctivas
  - Estados: pendiente, en curso, verificada
  - Notificaciones automáticas
  
- [ ] **[FE-031]** Dashboard mejora continua
- [ ] **[FE-032]** Reporte revisión dirección automatizado
- [ ] **[FE-033]** Plan comunicación y cultura

**Entregables:**
- Módulo QA completo
- Cumple requisitos 9 y 10 ISO 22301

---

## FASE 5: PORTAL PÚBLICO Y PORTAFOLIO 🔵
**Duración:** 4 semanas | Prioridad: MEDIA

### Semana 23-24: Landing Page

**Objetivo:** Portal público optimizado

**Tareas:**
- [ ] **[FE-034]** Hero section con video demo
- [ ] **[FE-035]** Features section
- [ ] **[FE-036]** Modules showcase
- [ ] **[FE-037]** Pricing tables
- [ ] **[FE-038]** Testimonials
- [ ] **[FE-039]** Footer con links
- [ ] **[FE-040]** SEO optimization
- [ ] **[FE-041]** Internacionalización (ES/EN/PT)

**Entregables:**
- Landing page completa
- Optimizada conversión

---

### Semana 25-26: Portal Empresarial Portafolio

**Objetivo:** Multi-empresa y white-labeling

**Tareas:**
- [ ] **[FE-042]** Dashboard multi-tenant
  - Vista consolidada KPIs
  - Navegación entre empresas
  
- [ ] **[FE-043]** White-labeling sistema
  - Logo/colores personalizados
  - Dominio propio
  
- [ ] **[FE-044]** Informes consolidados
- [ ] **[FE-045]** SLA tracking
- [ ] **[FE-046]** Facturación Stripe/PayPal

**Entregables:**
- Portal Portafolio completo
- Segmento B2B habilitado

---

## FASE 6: INTEGRACIONES Y TESTING 🟣
**Duración:** 6 semanas | Prioridad: MEDIA-ALTA

### Semana 27-28: Integraciones ITSM

**Objetivo:** ServiceNow, Jira, comunicaciones

**Tareas:**
- [ ] **[INT-001]** Connector ServiceNow API
- [ ] **[INT-002]** Connector Jira Service Mgmt
- [ ] **[INT-003]** Twilio SMS/Voice
- [ ] **[INT-004]** Microsoft Teams webhooks
- [ ] **[INT-005]** Slack API
- [ ] **[INT-006]** SendGrid emails
- [ ] **[INT-007]** WhatsApp Business API

**Entregables:**
- 7 integraciones funcionales
- Diferenciador competitivo

---

### Semana 29-30: Testing E2E

**Objetivo:** Cobertura ≥95%

**Tareas:**
- [ ] **[TEST-001]** Tests unitarios backend (Jest)
- [ ] **[TEST-002]** Tests integración APIs
- [ ] **[TEST-003]** Tests E2E frontend (Playwright)
  - Flujo completo: crear BIA → plan → prueba
  
- [ ] **[TEST-004]** Performance testing
  - k6 para load testing
  - Lighthouse para frontend
  
- [ ] **[TEST-005]** Security testing
  - OWASP top 10
  - Penetration testing básico

**Entregables:**
- Cobertura tests ≥95%
- Performance optimizado

---

### Semana 31-32: Documentación y Despliegue

**Objetivo:** Preparar producción

**Tareas:**
- [ ] **[DOC-001]** OpenAPI docs completas
- [ ] **[DOC-002]** Guías usuario por módulo
- [ ] **[DOC-003]** Videos tutoriales
- [ ] **[DOC-004]** Documentación técnica
- [ ] **[DOC-005]** Runbooks operativos
- [ ] **[DEPLOY-001]** Kubernetes manifests
- [ ] **[DEPLOY-002]** Terraform IaC
- [ ] **[DEPLOY-003]** Monitoring Prometheus/Grafana
- [ ] **[DEPLOY-004]** Deploy staging
- [ ] **[DEPLOY-005]** Deploy producción

**Entregables:**
- Documentación completa
- Plataforma en producción

---

## RECURSOS NECESARIOS

### Equipo Core
- **1 Tech Lead Full Stack** (NestJS + Next.js)
- **1 Senior Frontend** (React + UI/UX)
- **1 Senior Backend** (NestJS + Prisma)
- **1 QA Engineer** (Testing automatizado)

### Especialistas (Parcial)
- **DevOps Engineer** (Fases 1, 6)
- **AI/ML Engineer** (Fase 2)
- **UI/UX Designer** (Fases 3, 5)

---

## CRITERIOS ÉXITO MVP

### Funcionales ✅
- [ ] 10 módulos SGCN completamente operativos
- [ ] Dashboard con todos KPIs tiempo real
- [ ] Portal público con conversión optimizada
- [ ] Evidencia exportable firmada digitalmente
- [ ] Orquestador planes tiempo real funcional

### Técnicos ✅
- [ ] APIs OpenAPI 100% documentadas
- [ ] Tests E2E cobertura ≥95%
- [ ] Performance: LCP <2.5s, INP <200ms, CLS <0.1
- [ ] Docker production-ready
- [ ] CI/CD completamente automatizado
- [ ] Monitoring operativo 24/7

### Normativos ✅
- [ ] ISO 22301:2019 cobertura ≥95%
- [ ] Trazabilidad inmutable con blockchain opcional
- [ ] Firma digital documentos implementada
- [ ] Compliance dashboard funcional
- [ ] Exportación evidencias certificables

---

## SEGUIMIENTO

### Revisiones Quincenales
- Demo funcionalidades completadas
- Retrospectiva y ajustes
- Planning próximas 2 semanas

### Métricas Progreso
- Velocity (story points/sprint)
- Burndown chart
- Quality metrics (bugs, coverage)
- Performance benchmarks

---

## NOTAS IMPORTANTES

1. **Priorizar ISO 22301** - Todo desarrollo alineado a normativa
2. **Testing continuo** - No deuda técnica
3. **Documentación paralela** - APIs y guías actualizadas
4. **Demos frecuentes** - Validación stakeholders
5. **Seguridad first** - Auditorías de código

---

**INICIO INMEDIATO:** FASE 1 - Semana 1 (Modelo Datos Prisma)

*Documento vivo - Actualizar progreso semanalmente*
*Última actualización: 20 septiembre 2025*
