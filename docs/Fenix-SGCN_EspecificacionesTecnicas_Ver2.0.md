# Especificaciones Técnicas - Fenix-SGCN v2.0

## Plataforma SaaS para Gestión de Continuidad de Negocio ISO 22301
**CIDE SAS - Colombia**

---

## 📋 Información General

**Producto:** Fenix-SGCN (Sistema de Gestión de Continuidad de Negocio)  
**Versión:** 2.0.0  
**Fecha:** 21 Septiembre 2025  
**Empresa:** CIDE SAS  
**Contacto:** comercial@cidesas.com | +57 315 765 1063  
**Estado:** Producción Ready

---

## 🎯 Alcance Funcional

### Cumplimiento Normativo
- **ISO 22301:2019:** 95% de cobertura
- **ISO 31000:** Gestión de Riesgos
- **NIST CSF:** Framework de Ciberseguridad
- **GDPR:** Data Protection Ready

### Módulos Implementados

#### 1. MÓDULO FUNDACIONAL (Requisitos 4, 5, 6 ISO 22301)
- **Setup Wizard:** 4 pasos de configuración inicial
- **Kick-off:** Documentación de reunión de sensibilización
- **Matriz RACI:** Roles y responsabilidades
- **Contexto Organizacional:** Misión, visión, alcance, stakeholders
- **Identificación de Procesos:** Ponderación multi-criterio
- **Política SGCN:** Editor de política configurable

#### 2. ANÁLISIS DE RIESGOS - ARA (Requisito 8.3)
- **Gestión de Riesgos:** CRUD completo
- **Matriz 5x5:** Evaluación probabilidad/impacto
- **Dashboard Resiliencia:** KPIs y scoring
- **Clasificación:** Crítico, Alto, Medio, Bajo
- **Controles:** Preventivos, detectivos, correctivos

#### 3. ANÁLISIS DE IMPACTO - BIA (Requisito 8.2)
- **Evaluaciones BIA:** Gestión completa
- **Asistente IA:** Recomendaciones RTO/RPO automáticas
- **Wizard Inteligente:** Guía paso a paso
- **Cálculos:** RTO, RPO, MTPD automáticos
- **Criticidad:** Ranking de procesos

#### 4. ESTRATEGIAS Y PLANES (Requisitos 8.4, 8.5)
- **Biblioteca Escenarios:** 6 templates sectoriales
  - Financiero, Salud, Gobierno, Tecnología, Manufactura, Retail
- **Tipos de Planes:**
  - BCP (Business Continuity Plan)
  - DRP (Disaster Recovery Plan)
  - IRP (Incident Response Plan)
  - Crisis Management Plan
- **Editor Visual:** Bloques reutilizables
- **Gestión de Crisis:** Big Red Button
- **Timeline:** Eventos en tiempo real
- **Comunicación:** Matriz de stakeholders

#### 5. EJERCICIOS Y MEJORA (Requisitos 8.6, 9, 10)
- **Tipos de Ejercicios:**
  - Tabletop
  - Walkthrough
  - Simulation
  - Full-Scale
- **Scoring:** Evaluación automática
- **Acciones Correctivas:** Workflow completo
- **Mejora Continua:** Dashboard de KPIs
- **Estados:** Open → InProgress → Completed → Closed

#### 6. PORTAL MULTI-TENANT
- **Gestión Empresas:** Dashboard consolidado
- **Métricas Globales:** Agregación de KPIs
- **White-labeling:** Personalización por tenant
- **Navegación:** Switch entre organizaciones

#### 7. PORTAL ADMINISTRATIVO SAAS ⭐ NUEVO
- **Dashboard SaaS:**
  - MRR (Monthly Recurring Revenue)
  - ARR (Annual Recurring Revenue)
  - LTV (Lifetime Value)
  - CAC (Customer Acquisition Cost)
  - Churn Rate
  - Usuarios activos
  - Empresas activas
  
- **Gestión Suscripciones:**
  - Control de licencias
  - Aprobación de nuevas suscripciones
  - Auto-renovación
  - Suspensión/Cancelación
  
- **Facturación e Ingresos:**
  - Dashboard financiero
  - Pasarelas de pago (Stripe, PayPal, Wire Transfer)
  - Transacciones recientes
  - Costos e ingresos
  
- **Gestión de Planes:**
  - Configuración de pricing
  - Planes personalizados
  - Features por plan
  - Activación/Desactivación
  
- **Sistema de Solicitudes:**
  - Licencias adicionales
  - Upgrades de plan
  - Soporte técnico
  - Features personalizados
  - Workflow de aprobación

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

#### Backend
- **Framework:** NestJS 10.x
- **Lenguaje:** TypeScript 5.x
- **ORM:** Prisma 5.x
- **Base de Datos:** PostgreSQL 14+
- **Autenticación:** JWT + Refresh Tokens
- **Validación:** class-validator, class-transformer
- **Documentación:** Swagger/OpenAPI

#### Frontend
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript 5.x
- **UI Library:** React 18
- **Styling:** TailwindCSS 3.x
- **Componentes:** shadcn/ui
- **State:** React Hooks + Context
- **Forms:** React Hook Form
- **Iconos:** Lucide React

#### Infraestructura
- **Containerización:** Docker + Docker Compose
- **Orquestación:** Kubernetes ready
- **CI/CD:** GitHub Actions
- **Monitoreo:** Prometheus + Grafana
- **Logs:** ELK Stack
- **CDN:** CloudFront / CloudFlare

---

## 📊 Modelo de Datos

### Entidades Principales

```prisma
model Tenant {
  id              String
  name            String
  domain          String
  logo            String?
  subscription    Subscription
  users           User[]
  processes       BusinessProcess[]
  // ... relaciones
}

model User {
  id              String
  email           String
  role            Role
  tenantId        String
  tenant          Tenant
}

model BusinessProcess {
  id              String
  name            String
  criticality     Int
  rto             Int
  rpo             Int
  mtpd            Int
  tenantId        String
  // ... campos
}

model RiskAssessment {
  id              String
  name            String
  probability     Int (1-5)
  impact          Int (1-5)
  level           RiskLevel
  controls        Control[]
  // ... campos
}

model ContinuityPlan {
  id              String
  type            PlanType
  status          PlanStatus
  content         Json
  version         String
  // ... campos
}

model TestExercise {
  id              String
  type            ExerciseType
  status          Status
  score           Int?
  results         String?
  // ... campos
}

model Subscription {
  id              String
  plan            PlanType
  status          Status
  monthlyRevenue  Decimal
  autoRenew       Boolean
  // ... campos
}
```

---

## 🔒 Seguridad

### Autenticación y Autorización
- **JWT Tokens:** Access (15min) + Refresh (7 días)
- **RBAC:** 4 roles (SuperAdmin, Admin, Manager, User)
- **Multi-tenancy:** Aislamiento total de datos
- **2FA:** Opcional vía TOTP

### Protección de Datos
- **Encriptación:** 
  - En tránsito: TLS 1.3
  - En reposo: AES-256
- **Passwords:** Bcrypt (12 rounds)
- **Sanitización:** Prevención SQL Injection/XSS
- **CORS:** Configurado por dominio
- **Rate Limiting:** 100 req/min por IP

### Compliance
- **GDPR:** Right to be forgotten, data portability
- **LGPD:** Cumplimiento ley colombiana
- **Auditoría:** Logs completos de acciones
- **Backup:** Diario automático con retención 30 días

---

## 🚀 Performance

### Optimizaciones Implementadas

#### Backend
- **Caché:** Redis para sesiones y queries
- **DB Pooling:** Conexiones optimizadas
- **Lazy Loading:** Relaciones bajo demanda
- **Índices:** Query optimization
- **Compression:** gzip para responses

#### Frontend
- **Code Splitting:** Chunks por ruta
- **Image Optimization:** Next.js Image
- **Tree Shaking:** Eliminación código muerto
- **Lazy Loading:** Componentes dinámicos
- **CDN:** Assets estáticos optimizados

### Métricas Objetivo
- **First Load JS:** < 100 KB
- **TTI (Time to Interactive):** < 3s
- **Lighthouse Score:** > 90
- **API Response Time:** < 200ms (p95)
- **Uptime:** 99.9% SLA

---

## 📡 APIs

### REST API Endpoints

#### Autenticación
```
POST   /api/auth/signup
POST   /api/auth/signin
POST   /api/auth/refresh
POST   /api/auth/logout
```

#### Usuarios
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id
```

#### Procesos de Negocio
```
GET    /api/business-processes
POST   /api/business-processes
PATCH  /api/business-processes/:id
DELETE /api/business-processes/:id
```

#### BIA
```
GET    /api/bia-assessments
POST   /api/bia-assessments
POST   /api/bia-assessments/wizard (IA)
```

#### Riesgos
```
GET    /api/risk-assessments
POST   /api/risk-assessments
GET    /api/risk-assessments/matrix
```

#### Planes
```
GET    /api/continuity-plans
POST   /api/continuity-plans
PUT    /api/continuity-plans/:id
```

#### Ejercicios
```
GET    /api/test-exercises
POST   /api/test-exercises
PATCH  /api/test-exercises/:id/score
```

#### Admin SaaS
```
GET    /api/admin/metrics
GET    /api/admin/subscriptions
POST   /api/admin/subscriptions/:id/approve
GET    /api/admin/billing
PATCH  /api/admin/plans/:id
GET    /api/admin/requests
POST   /api/admin/requests/:id/approve
```

### WebSocket (Tiempo Real)
```
ws://api/events         # Crisis events
ws://api/notifications  # System notifications
```

---

## 🎨 UI/UX

### Componentes Principales

#### Dashboard SGCN
- Sidebar con navegación jerárquica
- 6 secciones principales
- Breadcrumbs contextuales
- Búsqueda global

#### Admin Portal
- Sidebar independiente
- 8 módulos administrativos
- Métricas en tiempo real
- Gráficos interactivos

### Design System
- **Colores:** Blue-600 (primary), Purple-600 (accent)
- **Tipografía:** Inter (sans-serif)
- **Espaciado:** 4px grid
- **Shadows:** Tailwind default
- **Animaciones:** Framer Motion

### Responsive
- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+
- **Wide:** 1920px+

---

## 📦 Despliegue

### Ambientes

#### Desarrollo
- **Backend:** http://localhost:3001
- **Frontend:** http://localhost:3000
- **DB:** localhost:5432

#### Staging
- **Backend:** https://api-staging.fenix-sgcn.com
- **Frontend:** https://staging.fenix-sgcn.com
- **DB:** RDS PostgreSQL

#### Producción
- **Backend:** https://api.fenix-sgcn.com
- **Frontend:** https://app.fenix-sgcn.com
- **DB:** RDS PostgreSQL (Multi-AZ)

### CI/CD Pipeline

```yaml
1. Git Push
2. GitHub Actions
   - Lint & Type Check
   - Unit Tests
   - Build Docker Images
   - Push to Registry
3. Deploy to K8s
   - Rolling Update
   - Health Checks
   - Smoke Tests
4. Monitoring Alerts
```

---

## 🧪 Testing

### Cobertura
- **Unit Tests:** > 80%
- **Integration Tests:** > 70%
- **E2E Tests:** Critical paths
- **Performance Tests:** Load testing

### Herramientas
- **Backend:** Jest, Supertest
- **Frontend:** Jest, React Testing Library
- **E2E:** Playwright
- **Load:** K6, Artillery

---

## 📈 Monitoreo y Observabilidad

### Métricas
- **APM:** Datadog / New Relic
- **Logs:** ELK Stack / CloudWatch
- **Traces:** Jaeger / OpenTelemetry
- **Errors:** Sentry

### Alertas
- API errors > 5%
- Response time > 500ms
- CPU usage > 80%
- Memory > 90%
- Disk space < 10%

---

## 🔄 Integraciones Planeadas

### ITSM
- ServiceNow
- Jira Service Management
- Zendesk

### Comunicaciones
- Twilio (SMS/Voice)
- Microsoft Teams
- Slack
- WhatsApp Business API

### Almacenamiento
- AWS S3
- Google Drive
- OneDrive
- Dropbox

---

## 📚 Documentación

### Técnica
- Architecture Decision Records (ADR)
- API Reference (Swagger)
- Database Schema (ERD)
- Component Storybook

### Usuario
- Guías de inicio rápido
- Tutoriales paso a paso
- Videos instructivos
- FAQ

---

## 👥 Equipo

### CIDE SAS
- **Development Team:** Full Stack Engineers
- **QA Team:** Test Engineers
- **DevOps:** Infrastructure Engineers
- **Consultores:** ISO 22301 Experts

---

## 📄 Licenciamiento

### Modelo SaaS
- **Basic:** $299/mes (10 users, 20 processes)
- **Professional:** $799/mes (50 users, 100 processes)
- **Enterprise:** $2,499/mes (unlimited, white-label)
- **Custom:** Pricing personalizado

---

## 🗺️ Roadmap Técnico

### Q4 2025
- [x] Portal Admin SaaS
- [x] Sistema de facturación
- [x] Multi-tenancy avanzado
- [ ] API pública v1

### Q1 2026
- [ ] Mobile app (React Native)
- [ ] Integraciones ITSM
- [ ] Blockchain trazabilidad
- [ ] IA predictiva avanzada

---

**Documento preparado por:** CIDE SAS  
**Contacto técnico:** desarrollo@cidesas.com  
**Soporte:** comercial@cidesas.com | +57 315 765 1063

**Última actualización:** 21 Septiembre 2025  
**Versión documento:** 2.0
