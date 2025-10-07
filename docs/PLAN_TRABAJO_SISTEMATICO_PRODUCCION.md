# 🚀 PLAN DE TRABAJO SISTEMÁTICO COMPLETO - FENIX-SGCN

**Para Ejecución por Agente IA**  
**Duración:** 25 días (5 semanas)  
**Inicio:** 07 octubre 2025  

---

## 📋 ESTRUCTURA DEL PLAN

### **MÓDULOS A IMPLEMENTAR:**

**FASE 0: LANDING Y AUTENTICACIÓN** (3 días)
- Landing page completa
- Registro multi-plan (Trial/Standard/Professional/Premium/Enterprise)
- Login/Logout
- Recuperación contraseña

**FASE 1: CONSOLA ADMINISTRACIÓN** (2 días)
- Dashboard admin
- Gestión tenants
- Gestión suscripciones
- Monitoreo sistema

**FASE 2: CORRECCIONES BASE** (2 días)
- Deudas técnicas
- Verificación backend/frontend

**FASE 3: MÓDULOS FUNCIONALES** (15 días)
- Módulo 1: Planeación ✅ (ya completo)
- Módulos 2-7: Implementación frontend

**FASE 4: TESTING Y DEPLOY** (3 días)
- Tests E2E completos
- Refinamiento UX
- Deploy producción

---

## 🎯 FASE 0: LANDING Y AUTENTICACIÓN (DÍAS 1-3)

### **DÍA 1: LANDING PAGE**

**Objetivo:** Landing page funcional y profesional

#### MAÑANA (4h)

**TAREA 1.1: Validar componentes existentes**
```bash
cd frontend/app
# Verificar estructura:
- page.tsx (landing)
- components/landing/Hero.tsx
- components/landing/Features.tsx
- components/landing/Modules.tsx
- components/landing/Pricing.tsx
```

**TAREA 1.2: Ajustar Hero section**
```typescript
// components/landing/Hero.tsx
- Video/animación de fondo
- CTA principal → "Iniciar Prueba Gratuita"
- CTA secundario → "Ver Demo"
- Estadísticas clave (ISO 22301, usuarios, etc.)
```

**TAREA 1.3: Features section**
```typescript
// components/landing/Features.tsx
- 6 features principales con iconos
- Mapeo visual dependencias
- Editor drag-and-drop planes
- Simulación Montecarlo
- Dashboard ejecutivo
- IA integrada
- Cumplimiento ISO 22301
```

#### TARDE (4h)

**TAREA 1.4: Pricing section interactiva**
```typescript
// components/landing/Pricing.tsx
5 planes visuales:
1. TRIAL (30 días gratis)
   - 10 procesos
   - 5 usuarios
   - Módulos básicos

2. STANDARD ($199/mes)
   - 50 procesos
   - 25 usuarios
   - Todos los módulos

3. PROFESSIONAL ($399/mes)
   - 150 procesos
   - 75 usuarios
   - IA avanzada

4. PREMIUM (Personalizado)
   - Procesos ilimitados
   - Usuarios ilimitados
   - Soporte 24/7

5. ENTERPRISE (Contactar)
   - Multi-empresa
   - White-label
   - SLA garantizado

Botones → Redirigir a /auth/register?plan=X
```

**TAREA 1.5: Módulos showcase**
```typescript
// components/landing/Modules.tsx
- Grid 7 módulos con descripción
- Screenshots de cada uno
- Click → Modal con video demo
```

**TAREA 1.6: CTA y Footer**
```typescript
- Formulario contacto funcional
- Enlaces legales (términos, privacidad)
- Redes sociales
- Newsletter signup
```

**CHECKPOINT DÍA 1:**
✅ Landing page profesional
✅ 5 planes visibles
✅ CTAs funcionales
✅ Screenshots capturados

---

### **DÍA 2: REGISTRO MULTI-PLAN**

**Objetivo:** Sistema registro con selección plan y creación tenant automática

#### MAÑANA (4h)

**TAREA 2.1: Página registro**
```typescript
// app/auth/register/page.tsx

1. Detectar plan desde URL: ?plan=STANDARD
2. Mostrar plan seleccionado destacado
3. Formulario:
   - Nombre completo
   - Email corporativo
   - Contraseña (validación fuerte)
   - Nombre empresa
   - Dominio tenant (auto-generado)
   - País/Industria
   - Aceptar términos

4. Validaciones frontend:
   - Email válido y único
   - Contraseña mínimo 8 caracteres
   - Dominio disponible (verificar en tiempo real)
```

**TAREA 2.2: API registro**
```typescript
// Endpoint: POST /api/auth/register

Backend ya existe, verificar:
1. Crea tenant automáticamente
2. Asigna plan seleccionado
3. Si plan=TRIAL → trialEndsAt = +30 días
4. Crea usuario ADMIN
5. Genera JWT
6. Retorna token + tenant info

Test con curl:
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@empresa.com",
    "password": "Test123!@#",
    "name": "Juan Pérez",
    "companyName": "Empresa Test",
    "plan": "STANDARD"
  }'
```

#### TARDE (4h)

**TAREA 2.3: Flow post-registro**
```typescript
// Después de registro exitoso:

1. Guardar token en localStorage
2. Redirigir a /dashboard/setup
3. Wizard onboarding:
   - Paso 1: Configurar perfil
   - Paso 2: Agregar procesos iniciales
   - Paso 3: Invitar equipo
   - Paso 4: Tour guiado

4. Implementar página setup:
// app/dashboard/setup/page.tsx
- Wizard 4 pasos
- Barra progreso
- Skip opcional
```

**TAREA 2.4: Email confirmación**
```typescript
// Backend integración:
- Email bienvenida con credenciales
- Link activación cuenta
- Guía inicio rápido PDF
- Video tutorial

Verificar MailService funciona:
- SMTP configurado
- Plantillas email
- Queue Bull procesando
```

**CHECKPOINT DÍA 2:**
✅ Registro funcional 5 planes
✅ Tenant creado automáticamente
✅ Wizard onboarding básico
✅ Email bienvenida enviado

---

### **DÍA 3: LOGIN Y RECUPERACIÓN**

**Objetivo:** Autenticación completa y gestión contraseñas

#### MAÑANA (4h)

**TAREA 3.1: Página login**
```typescript
// app/auth/login/page.tsx

1. Formulario limpio:
   - Email
   - Contraseña
   - Recordarme (opcional)
   - Link "Olvidé contraseña"

2. Validaciones:
   - Campos requeridos
   - Formato email

3. Submit:
   POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "password"
   }

4. Respuesta:
   - Guardar token
   - Guardar userId, tenantId
   - Redirigir a /dashboard

5. Manejo errores:
   - Credenciales inválidas
   - Cuenta suspendida
   - Trial vencido → Mostrar upgrade
```

**TAREA 3.2: Verificar middleware auth**
```typescript
// Confirmar funcionamiento:
- JWT validation en todas rutas /dashboard/*
- Refresh token automático
- Logout limpia localStorage
- Redirección a /auth/login si no autenticado
```

#### TARDE (4h)

**TAREA 3.3: Recuperación contraseña**
```typescript
// app/auth/forgot-password/page.tsx

1. Formulario email
2. POST /api/auth/forgot-password
3. Backend envía email con token
4. Link → /auth/reset-password?token=XXX

// app/auth/reset-password/page.tsx

1. Validar token válido
2. Formulario nueva contraseña (2x)
3. POST /api/auth/reset-password
4. Redirección a login con mensaje éxito
```

**TAREA 3.4: Gestión sesión**
```typescript
// Implementar:
- Timeout 7 días (JWT expires)
- Renovación automática con refresh token
- Logout desde múltiples dispositivos
- Historial de sesiones en /dashboard/configuracion/security
```

**CHECKPOINT DÍA 3:**
✅ Login funcional
✅ Recuperación contraseña operativa
✅ Sesión persistente
✅ Middleware auth verificado

---

## 🎯 FASE 1: CONSOLA ADMINISTRACIÓN (DÍAS 4-5)

### **DÍA 4: DASHBOARD ADMIN**

**Objetivo:** Consola administración para super-admin

#### MAÑANA (4h)

**TAREA 4.1: Verificar estructura**
```bash
# Directorio: frontend/app/admin/

Verificar existen:
- page.tsx (dashboard principal)
- layout.tsx
- subscriptions/page.tsx
- tenants/page.tsx (si no, crear)
- billing/page.tsx
```

**TAREA 4.2: Dashboard principal**
```typescript
// app/admin/page.tsx

Métricas clave:
1. Tenants totales
2. Tenants activos
3. Tenants en trial
4. Tenants suspendidos
5. Revenue MRR
6. Nuevos registros (últimos 30 días)

Gráficos:
- Línea: Registros por día (30 días)
- Pie: Distribución planes
- Barra: Revenue por plan

API necesarias:
GET /api/admin/metrics/overview
GET /api/admin/metrics/registrations?days=30
GET /api/admin/metrics/revenue
```

#### TARDE (4h)

**TAREA 4.3: Listado tenants**
```typescript
// app/admin/tenants/page.tsx (crear si no existe)

Tabla con:
- ID
- Nombre empresa
- Plan actual
- Estado
- Trial ends / Expiry
- Días restantes
- Created at
- Acciones: Ver detalle, Suspender, Eliminar

Filtros:
- Por plan
- Por estado
- Búsqueda nombre/email

Paginación: 50 por página

API: GET /api/admin/tenants?page=1&limit=50&plan=STANDARD
```

**TAREA 4.4: Detalle tenant**
```typescript
// app/admin/tenants/[id]/page.tsx

Información:
1. Datos empresa
2. Usuario admin principal
3. Estadísticas uso:
   - Procesos creados
   - Riesgos registrados
   - Planes activos
   - Ejercicios realizados

4. Historial pagos
5. Logs de actividad

Acciones admin:
- Cambiar plan
- Extender trial
- Suspender/Reactivar
- Exportar datos
- Eliminar tenant
```

**CHECKPOINT DÍA 4:**
✅ Dashboard admin funcional
✅ Listado tenants con filtros
✅ Detalle tenant completo
✅ Métricas en tiempo real

---

### **DÍA 5: GESTIÓN SUSCRIPCIONES**

**Objetivo:** CRUD suscripciones y facturación

#### MAÑANA (4h)

**TAREA 5.1: Gestión suscripciones admin**
```typescript
// app/admin/subscriptions/page.tsx

Tabla suscripciones:
- Tenant
- Plan actual
- Estado
- Fecha inicio
- Próxima renovación
- MRR
- Acciones

Acciones disponibles:
- Actualizar plan
- Cancelar suscripción
- Aplicar descuento
- Extender período gracia

API: GET /api/admin/subscriptions
```

**TAREA 5.2: Gestión pagos**
```typescript
// app/admin/billing/page.tsx

Listado transacciones:
- Fecha
- Tenant
- Concepto
- Monto
- Estado (Paid/Pending/Failed)
- Método pago

Resumen financiero:
- Revenue total mes actual
- Revenue mes anterior
- Pending payments
- Failed payments

Filtros por:
- Fecha
- Estado
- Plan
```

#### TARDE (4h)

**TAREA 5.3: Actualización planes**
```typescript
// Formulario cambio plan:

1. Modal al hacer click "Cambiar Plan"
2. Seleccionar nuevo plan
3. Calcular prorrateado
4. Confirmar cambio

API: POST /api/admin/tenants/{id}/subscription/update
{
  "plan": "PROFESSIONAL",
  "prorated": true
}

Backend verifica:
- Cálculo prorrateado correcto
- Actualiza subscriptionPlan
- Ajusta subscriptionEndsAt
- Registra en audit log
```

**TAREA 5.4: Suspensión/Reactivación**
```typescript
// Botones en detalle tenant:

Suspender:
- Cambia estado SUSPENDED
- Usuario no puede acceder dashboard
- Mantiene datos intactos
- Mensaje: "Cuenta suspendida, contactar admin"

Reactivar:
- Cambia estado ACTIVE
- Restaura acceso
- Email notificación

API:
POST /api/admin/tenants/{id}/suspend
POST /api/admin/tenants/{id}/reactivate
```

**CHECKPOINT DÍA 5:**
✅ Gestión suscripciones completa
✅ Cambio planes funcional
✅ Suspensión/reactivación operativa
✅ Billing básico implementado

---

## 🎯 FASE 2: CORRECCIONES BASE (DÍAS 6-7)

### **DÍA 6: DEUDA TÉCNICA #2**
[Seguir plan original DÍA 1]

### **DÍA 7: VERIFICACIÓN BASE**
[Seguir plan original DÍA 2]

---

## 🎯 FASE 3: MÓDULOS FUNCIONALES (DÍAS 8-22)

### **Módulo 1: Planeación** ✅ 
Ya completo 100%

### **Módulos 2-7: Días 8-22**
[Seguir plan original días 3-18, ajustados a días 8-22]

- Día 8-9: Editor Visual Planes
- Día 10-11: Mapa Dependencias
- Día 12-13: Motor Estrategias
- Día 14-15: Panel Ejercicios
- Día 16-17: Dashboards KPI
- Día 18-19: Montecarlo + Riesgos
- Día 20-22: Funcionalidades avanzadas

---

## 🎯 FASE 4: TESTING Y DEPLOY (DÍAS 23-25)

### **DÍA 23: TESTING E2E COMPLETO**

#### Tests Críticos Landing/Auth:
```powershell
# test-landing-auth.ps1

Test 1: Landing page carga
Test 2: Registro TRIAL
Test 3: Registro STANDARD
Test 4: Login usuario
Test 5: Recuperación contraseña
Test 6: Wizard onboarding
Test 7: Dashboard admin accesible
Test 8: Listado tenants funcional
Test 9: Cambio plan operativo
Test 10: Suspensión tenant
```

#### Tests Módulos 1-7:
[Scripts individuales ya definidos]

### **DÍA 24: REFINAMIENTO UX**
- Consistencia visual completa
- Estados de carga
- Manejo errores
- Validaciones

### **DÍA 25: DEPLOY PRODUCCIÓN**
```bash
# Build producción
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Verificar
curl https://fenix-sgcn.com/health

# Smoke tests
- Landing page carga
- Registro funciona
- Login exitoso
- Dashboard renderiza
- Admin accesible
```

---

## ✅ CRITERIOS DE COMPLETADO

### Landing/Auth:
- ✅ 5 planes visibles
- ✅ Registro funcional todos los planes
- ✅ Login/logout operativo
- ✅ Recuperación contraseña
- ✅ Wizard onboarding

### Admin:
- ✅ Dashboard métricas
- ✅ Gestión tenants
- ✅ Cambio planes
- ✅ Suspensión/reactivación

### Módulos 1-7:
- ✅ 15 componentes críticos implementados
- ✅ Tests E2E 7 módulos pasando
- ✅ UI consistente

### Deploy:
- ✅ Producción operativa
- ✅ SSL configurado
- ✅ Backups automáticos
- ✅ Monitoreo activo

---

**TOTAL:** 25 días → Sistema completo production-ready

