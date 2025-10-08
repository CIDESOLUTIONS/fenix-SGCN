# 🔧 CORRECCIÓN APLICADA - ERROR 500 SIGNUP

## ❌ PROBLEMA IDENTIFICADO:
**Error 500 Internal Server Error** en `/api/auth/signup`

### Causa Root:
1. Frontend enviaba campo `subscriptionPlan` (TRIAL, STANDARD, PROFESSIONAL, etc.)
2. Backend `SignupDto` NO tenía este campo
3. Backend `auth.service` estaba hardcodeado a `subscriptionPlan: 'TRIAL'`
4. JWT token no se generaba correctamente

---

## ✅ SOLUCIÓN IMPLEMENTADA:

### 1. **Actualizado `SignupDto`**
```typescript
// backend/src/auth/dto/signup.dto.ts
@IsString()
@IsOptional()
subscriptionPlan?: string; // TRIAL, STANDARD, PROFESSIONAL, PREMIUM, ENTERPRISE
```

### 2. **Actualizado `auth.service.signup()`**
```typescript
// Lógica condicional por plan:
const subscriptionPlan = dto.subscriptionPlan || 'TRIAL';
const isTrial = subscriptionPlan === 'TRIAL';

// TRIAL: 30 días + 30 grace period
const trialEndsAt = isTrial ? new Date(now + 30 days) : null;
const gracePeriodEndsAt = isTrial ? new Date(trial + 30 days) : null;

// Status según plan:
subscriptionStatus: isTrial ? 'ACTIVE' : 'PENDING'
```

### 3. **Generación JWT Token**
```typescript
const payload = {
  sub: user.id,
  email: user.email,
  tenantId: tenant.id,
  role: 'ADMIN',
};

const token = await this.jwt.signAsync(payload, {
  expiresIn: this.config.get('JWT_EXPIRES_IN') || '7d',
  secret: this.config.get('JWT_SECRET'),
});

return { token, userId, tenantId, user, tenant };
```

---

## 📊 COMPORTAMIENTO POR PLAN:

| Plan | subscriptionStatus | trialEndsAt | gracePeriodEndsAt |
|------|-------------------|-------------|-------------------|
| TRIAL | ACTIVE | hoy + 30 días | trial + 30 días |
| STANDARD | PENDING | null | null |
| PROFESSIONAL | PENDING | null | null |
| PREMIUM | PENDING | null | null |
| ENTERPRISE | PENDING | null | null |

**Nota:** Planes PAID quedan PENDING hasta completar checkout/pago.

---

## 🚀 REBUILD REQUERIDO:

```bash
cd C:\Users\meciz\Documents\fenix-SGCN
docker compose -f docker-compose.prod.yml build fenix_backend
docker compose -f docker-compose.prod.yml up -d fenix_backend
```

---

## ✅ VERIFICACIÓN POST-REBUILD:

```powershell
.\test-signup.ps1
```

**Resultado esperado:**
- Test 4 (Backend directo): ✅ Status 200 o 201 con token
- Test 5 (Via NGINX): ✅ Status 200 o 201 con token

---

## 📦 COMMIT:
```
21617e6 - fix(backend): Add subscriptionPlan support to signup endpoint
```

**DÍA 2 - SIGNUP ERROR RESUELTO** ✅
