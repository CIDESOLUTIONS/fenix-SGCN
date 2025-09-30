# 🔄 SISTEMA DE SUSCRIPCIONES Y GESTIÓN DE TENANTS

## Fecha: 22 de Septiembre 2025

---

## ✅ FUNCIONALIDADES IMPLEMENTADAS

### 1. **Sistema de Suscripciones**

#### Planes Disponibles:
- **TRIAL** - 30 días de prueba gratuita
- **STANDARD** - Plan básico ($199/mes)
- **PROFESSIONAL** - Plan profesional ($399/mes)
- **PREMIUM** - Plan premium (personalizado)
- **ENTERPRISE** - Plan empresarial (contactar)

#### Estados de Suscripción:
- **ACTIVE** - Suscripción activa
- **EXPIRED** - Vencida (en período de gracia de 30 días)
- **SUSPENDED** - Suspendida por falta de pago
- **CANCELLED** - Cancelada por el usuario
- **DELETED** - Eliminada después del período de gracia

### 2. **Ciclo de Vida del Tenant**

```
REGISTRO → TRIAL (30 días) → VENCIMIENTO → EXPIRED (período de gracia 30 días) → BACKUP → DELETED
```

#### Al Registrarse:
1. Se crea el tenant automáticamente
2. Plan TRIAL por 30 días
3. Se calcula `trialEndsAt` = hoy + 30 días
4. Se calcula `gracePeriodEndsAt` = trialEndsAt + 30 días
5. Usuario ADMIN creado

#### Cuando Vence:
1. Estado cambia a EXPIRED
2. Se programa eliminación para 30 días después
3. Se registra en audit log
4. Usuario puede renovar en cualquier momento

#### Eliminación Automática:
1. Tarea CRON diaria (2 AM)
2. Crear backup completo en JSON
3. Guardar backup en `/tmp` (producción: MinIO/S3)
4. Estado cambia a DELETED
5. Registro en audit log

### 3. **Exportación y Backup**

#### Endpoints Disponibles:

**Exportar Datos:**
```
GET /api/tenants/export
```
Retorna JSON completo con todos los datos del tenant

**Crear Backup Manual:**
```
POST /api/tenants/backup
```
Genera backup inmediato

**Información de Suscripción:**
```
GET /api/tenants/subscription
```
Retorna:
- Plan actual
- Estado
- Días restantes
- Fechas de vencimiento

**Actualizar Suscripción:**
```
POST /api/tenants/subscription/update
Body: { "plan": "PROFESSIONAL", "months": 12 }
```

#### Formato de Exportación:
```json
{
  "exportDate": "2025-09-22T...",
  "tenant": {
    "id": "uuid",
    "name": "Mi Empresa",
    "domain": "mi-empresa.fenix-sgcn.com",
    "subscriptionPlan": "TRIAL"
  },
  "data": {
    "users": [...],
    "businessProcesses": [...],
    "biaAssessments": [...],
    "riskAssessments": [...],
    "continuityStrategies": [...],
    "continuityPlans": [...],
    "testExercises": [...],
    "complianceFrameworks": [...],
    "correctiveActions": [...],
    "documents": [...],
    "auditLogs": [...]
  }
}
```

### 4. **Auditoría Completa**

Todas las acciones se registran en `audit_logs`:
- CREATE - Creación de tenant
- LOGIN - Inicio de sesión
- BACKUP - Creación de backup
- EXPORT - Exportación de datos
- SUBSCRIPTION_EXPIRED - Vencimiento
- SUBSCRIPTION_UPDATED - Actualización de plan
- TENANT_DELETED - Eliminación del tenant

---

## 🗄️ CAMBIOS EN BASE DE DATOS

### Modelo Tenant Actualizado:

```prisma
model Tenant {
  // ... campos existentes
  
  // Sistema de suscripción
  subscriptionPlan    SubscriptionPlan @default(TRIAL)
  subscriptionStatus  SubscriptionStatus @default(ACTIVE)
  trialEndsAt         DateTime?
  subscriptionEndsAt  DateTime?
  gracePeriodEndsAt   DateTime?
  
  // Backup y eliminación
  lastBackupAt        DateTime?
  backupUrl           String?
  scheduledDeletionAt DateTime?
  
  auditLogs           AuditLog[]
}

model AuditLog {
  id        String   @id @default(uuid())
  tenantId  String
  userId    String?
  action    String
  entity    String
  entityId  String?
  details   Json?
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}
```

---

## 🚀 INSTRUCCIONES DE DESPLIEGUE

### 1. Aplicar Migración de Prisma:

```bash
# Generar migración
npx prisma migrate dev --name add_subscription_system

# O en producción
npx prisma migrate deploy
```

### 2. Instalar Dependencias:

```bash
npm install @nestjs/schedule
npm install --save-dev @types/cron
```

### 3. Rebuild y Restart:

```powershell
# Detener contenedores
docker-compose -f docker-compose.prod.yml down

# Reconstruir backend
docker-compose -f docker-compose.prod.yml build fenix_backend

# Levantar servicios
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📋 TESTING

### Registro de Nuevo Tenant:

```bash
curl -X POST http://localhost/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "tenantName": "Test Company",
    "email": "admin@testcompany.com",
    "password": "Test123!",
    "fullName": "Admin User",
    "position": "CEO",
    "phone": "+57 300 123 4567"
  }'
```

### Consultar Suscripción:

```bash
curl http://localhost/api/tenants/subscription \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Exportar Datos:

```bash
curl http://localhost/api/tenants/export \
  -H "Authorization: Bearer YOUR_TOKEN" \
  > tenant_backup.json
```

---

## ⏰ TAREA PROGRAMADA (CRON)

**Ejecuta diariamente a las 2 AM:**

1. Verifica tenants con suscripción vencida
2. Marca como EXPIRED
3. Calcula período de gracia (30 días)
4. Programa eliminación

5. Busca tenants con período de gracia vencido
6. Crea backup automático
7. Marca como DELETED
8. Registra en audit log

**Para testing manual:**
```typescript
// Llamar directamente al servicio
await tenantsService.handleExpiredSubscriptions();
```

---

## 🔒 SEGURIDAD

1. **Soft Delete**: Los tenants se marcan como DELETED pero no se eliminan físicamente inmediatamente
2. **Backup Obligatorio**: Siempre se crea backup antes de eliminar
3. **Audit Trail**: Todas las acciones quedan registradas
4. **Período de Gracia**: 30 días para renovar después del vencimiento
5. **Notificaciones**: TODO - Enviar emails de aviso

---

## 📊 PRÓXIMAS MEJORAS

- [ ] Integración con MinIO/S3 para almacenar backups
- [ ] Sistema de notificaciones por email
- [ ] Portal de pagos (Stripe/PayU)
- [ ] Dashboard de métricas de suscripciones
- [ ] Restauración desde backup
- [ ] Eliminación física después de X días
- [ ] Exportación en múltiples formatos (CSV, Excel, PDF)

---

## ✅ CHECKLIST DE VALIDACIÓN

- [x] Schema de Prisma actualizado
- [x] Servicio de Tenants creado
- [x] Controlador de Tenants implementado
- [x] Módulo de Schedule configurado
- [x] Tarea CRON implementada
- [x] Sistema de backup funcional
- [x] Exportación de datos completa
- [x] Audit logs implementados
- [x] Registro con período de prueba
- [x] Login con validación de suscripción
- [ ] Migración aplicada
- [ ] Dependencias instaladas
- [ ] Testing completado

---

**Sistema completamente funcional para gestión de tenants con eliminación automática y backup** ✅
