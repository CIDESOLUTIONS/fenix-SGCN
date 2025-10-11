# 📋 LÓGICA DE PLANES Y LICENCIAMIENTO - FENIX ECOSYSTEM

## 🔄 FLUJO COMPLETO DE REGISTRO Y LICENCIAMIENTO

### **FASE 1: USUARIO SE REGISTRA EN SGCN**

1. **Usuario accede a landing page** → Selecciona plan → Click "Prueba Gratuita" o plan específico
2. **Formulario de registro** (`/auth/register?plan=trial`)
   - Captura: empresa, email, contraseña, nombre, cargo, teléfono
   - Plan viene en query param: `?plan=trial|standard|professional|premium|enterprise`

3. **Frontend envía registro:**
```javascript
POST /api/auth/signup
{
  tenantName: "Empresa XYZ",
  email: "admin@empresa.com",
  password: "***",
  fullName: "Juan Pérez",
  position: "CEO",
  phone: "+57 300...",
  subscriptionPlan: "TRIAL" // ← Normalizado a MAYÚSCULAS
}
```

### **FASE 2: BACKEND SGCN PROCESA REGISTRO**

**Archivo:** `backend/src/auth/auth.service.ts`

```typescript
async signup(dto: SignupDto) {
  // 1. Normalizar plan
  const subscriptionPlan = dto.subscriptionPlan?.toUpperCase() || 'TRIAL';
  const isTrial = subscriptionPlan === 'TRIAL';
  
  // 2. Calcular fechas
  const trialEndsAt = isTrial ? +30 días : null;
  const gracePeriodEndsAt = isTrial ? +60 días : null;
  
  // 3. Crear en transacción
  const { user, tenant } = await prisma.$transaction(async (tx) => {
    // 3.1 Crear Tenant
    const tenant = await tx.tenant.create({
      subscriptionPlan: 'TRIAL',
      subscriptionStatus: 'ACTIVE', // TRIAL siempre ACTIVE
      trialEndsAt,
      gracePeriodEndsAt
    });
    
    // 3.2 Crear Usuario Admin
    const user = await tx.user.create({
      email, password, fullName,
      role: 'ADMIN',
      tenantId: tenant.id
    });
    
    // 3.3 Log de auditoría
    await tx.auditLog.create({...});
    
    return { user, tenant };
  });
  
  // 4. Registrar en Admin (paso siguiente)
  await fenixAdminClient.registerTenant({...});
}
```

### **FASE 3: SGCN LLAMA A ADMIN PARA REGISTRO**

**Archivo:** `backend/src/fenix-admin-client/fenix-admin-client.service.ts`

```typescript
async registerTenant(tenant) {
  const response = await axios.post(
    'http://admin_backend:3101/api/integration/client/register-from-app',
    {
      tenantId: tenant.id,
      companyName: tenant.companyName,
      contactEmail: tenant.contactEmail,
      plan: tenant.subscriptionPlan  // 'TRIAL', 'STANDARD', etc.
    },
    {
      headers: { 'X-API-Key': 'fenix-integration-key-2025' }
    }
  );
  
  return response.data; // { license: {...} }
}
```

### **FASE 4: ADMIN CREA CLIENT Y LICENCIA**

**Archivo:** `admin-backend/src/integration/integration.service.ts`

```typescript
async registerClientFromApp(dto) {
  // 1. Crear Cliente
  const client = await prisma.client.create({
    id: dto.tenantId,  // MISMO ID que tenant SGCN
    companyName: dto.companyName,
    contactEmail: dto.contactEmail,
    installationType: 'SAAS',
    status: 'ACTIVE'
  });
  
  // 2. Generar Licencia
  const licenseKey = generateLicenseKey(companyName);
  // Formato: FENIX-ACME-2025-X7K9-P2M4
  
  const maxUsers = getMaxUsersByPlan(dto.plan);
  // TRIAL: 5, STANDARD: 25, PROFESSIONAL: 75, PREMIUM: 150, ENTERPRISE: 500
  
  const license = await prisma.license.create({
    clientId: client.id,
    activationKey: licenseKey,
    licenseType: 'SAAS',
    plan: dto.plan,
    maxUsers,
    status: 'ACTIVE',
    expiresAt: +1 año,
    enabledModules: ['bia','risk','plans','exercises','improvements']
  });
  
  // 3. Retornar licencia a SGCN
  return {
    license: {
      licenseKey,
      expiresAt,
      maxUsers,
      status: 'ACTIVE'
    }
  };
}
```

### **FASE 5: SGCN RECIBE Y ALMACENA LICENCIA**

```typescript
// auth.service.ts (continuación)
const adminResponse = await fenixAdminClient.registerTenant({...});

// Guardar licencia en tenant
if (adminResponse.license) {
  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      licenseKey: adminResponse.license.licenseKey
    }
  });
}

// Retornar JWT al usuario
return {
  token: jwt.sign({ sub: user.id, tenantId }),
  user: { email, fullName, ... },
  tenant: { name, subscriptionPlan, licenseKey }
};
```

---

## 🔐 VALIDACIÓN DE LICENCIA (DIARIA)

### **Background Job en SGCN**
```typescript
@Cron('0 0 * * *') // Cada día a medianoche
async validateAllLicenses() {
  const tenants = await prisma.tenant.findMany({
    where: { licenseKey: { not: null } }
  });
  
  for (const tenant of tenants) {
    const validation = await fenixAdminClient.validateLicense(
      tenant.id,
      tenant.licenseKey
    );
    
    if (!validation.valid) {
      // Suspender tenant
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { subscriptionStatus: 'SUSPENDED' }
      });
    }
  }
}
```

### **Admin Valida Licencia**
```typescript
async validateLicense({ tenantId, licenseKey }) {
  const license = await prisma.license.findFirst({
    where: { clientId: tenantId, activationKey: licenseKey },
    include: { client: true }
  });
  
  const now = new Date();
  const expired = license.expiresAt < now;
  const suspended = license.client.status === 'SUSPENDED';
  
  if (expired) return { valid: false, status: 'EXPIRED' };
  if (suspended) return { valid: false, status: 'SUSPENDED' };
  
  return {
    valid: true,
    maxUsers: license.maxUsers,
    plan: license.plan,
    enabledModules: JSON.parse(license.enabledModules)
  };
}
```

---

## 📊 MÉTRICAS DE USO (SEMANALES)

```typescript
@Cron('0 0 * * 0') // Cada domingo
async sendWeeklyMetrics() {
  const tenants = await prisma.tenant.findMany();
  
  for (const tenant of tenants) {
    const metrics = {
      activeUsers: await countActiveUsers(tenant.id),
      processesCreated: await countProcesses(tenant.id),
      risksRegistered: await countRisks(tenant.id)
    };
    
    await fenixAdminClient.sendUsageMetrics(tenant.id, metrics);
  }
}
```

---

## 💰 PLANES Y LÍMITES

| Plan | Max Usuarios | Max Procesos | Precio/Mes | Duración Trial |
|------|--------------|--------------|------------|----------------|
| **TRIAL** | 5 | 10 | $0 | 30 días |
| **STANDARD** | 25 | 50 | $199 | - |
| **PROFESSIONAL** | 75 | 150 | $399 | - |
| **PREMIUM** | 150 | 500 | $799 | - |
| **ENTERPRISE** | 500+ | Ilimitado | Custom | - |

---

## ⚠️ PROBLEMAS DETECTADOS Y CORRECCIONES APLICADAS

### ❌ **Problema 1: subscriptionPlan en minúsculas**
**Error:** Frontend enviaba `"trial"` pero enum espera `"TRIAL"`

**Solución:**
```typescript
// frontend/app/auth/register/page.tsx
subscriptionPlan: selectedPlan.toUpperCase() // ✅

// backend/src/auth/auth.service.ts
const subscriptionPlan = dto.subscriptionPlan?.toUpperCase() || 'TRIAL'; // ✅
```

### ❌ **Problema 2: Campo licenseKey faltante en schema**
**Estado:** PENDIENTE - Necesita agregarse al schema

**Solución requerida:**
```prisma
// backend/prisma/schema.prisma
model Tenant {
  //... campos existentes
  licenseKey String? // ← AGREGAR ESTE CAMPO
}
```

---

## 🔧 AJUSTES NECESARIOS PARA FUNCIONAMIENTO COMPLETO

### 1. **Agregar campo licenseKey a Tenant**
```bash
# En backend/prisma/schema.prisma
model Tenant {
  licenseKey String?
}

# Luego:
npx prisma migrate dev --name add_license_key
```

### 2. **Habilitar guardado de licencia**
```typescript
// backend/src/auth/auth.service.ts (línea 84)
// Descomentar:
if (adminResponse.license) {
  await this.prisma.tenant.update({
    where: { id: newUser.tenant.id },
    data: {
      licenseKey: adminResponse.license.licenseKey
    }
  });
}
```

### 3. **Crear Background Jobs**
- `@nestjs/schedule` ya está instalado
- Crear servicio `LicenseValidationService`
- Implementar cron jobs de validación diaria

### 4. **Implementar Middleware de Validación**
```typescript
// backend/src/common/guards/license.guard.ts
@Injectable()
export class LicenseGuard implements CanActivate {
  async canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenant = request.user.tenant;
    
    // Verificar estado de suscripción
    if (tenant.subscriptionStatus === 'SUSPENDED') {
      throw new ForbiddenException('Suscripción suspendida');
    }
    
    // Verificar trial expirado
    if (tenant.subscriptionPlan === 'TRIAL' && 
        new Date() > tenant.trialEndsAt) {
      throw new ForbiddenException('Trial expirado');
    }
    
    return true;
  }
}
```

---

## ✅ ESTADO ACTUAL

**Funcionando:**
- ✅ Registro de usuario crea tenant
- ✅ SGCN llama a Admin API
- ✅ Admin crea cliente y genera licencia
- ✅ Licencia se retorna a SGCN
- ✅ Normalización de planes a mayúsculas

**Pendiente:**
- ⚠️ Agregar campo `licenseKey` a schema Tenant
- ⚠️ Guardar licencia en tenant
- ⚠️ Implementar validación diaria automática
- ⚠️ Implementar guard de licencia en rutas
- ⚠️ Crear dashboard de facturación en Admin

---

## 📝 PRÓXIMOS PASOS

1. Agregar campo `licenseKey` al schema
2. Rebuild y migrar BD
3. Probar flujo completo de registro
4. Implementar validación automática
5. Crear interfaz de upgrade de plan
