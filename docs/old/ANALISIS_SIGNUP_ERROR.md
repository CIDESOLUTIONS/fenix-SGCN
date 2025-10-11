# 🔍 ANÁLISIS ARQUITECTURA - REGISTRO SIGNUP

## 🏗️ ARQUITECTURA ACTUAL

```
Browser (localhost)
    ↓
NGINX Proxy (puerto 80)
    ↓ routing /api/*
Backend NestJS (puerto 3001)
    ↓
PostgreSQL (puerto 5432)
```

## 📋 FLUJO ESPERADO

### 1. **Request del Browser:**
```
POST http://localhost/api/auth/signup
Body: {
  tenantName: "CIDE SAS",
  email: "vicky.delgado@cidesas.com",
  password: "********",
  fullName: "Vicky Delgado",
  position: "CEO",
  phone: "+57 316 437 9254",
  subscriptionPlan: "PROFESSIONAL"
}
```

### 2. **NGINX recibe y reescribe:**
```nginx
# Configuración actual:
location /api/ {
    rewrite ^/api/(.*)$ /$1 break;
    proxy_pass http://backend;  # → fenix_backend_prod:3001
}

# Transforma:
/api/auth/signup → /auth/signup
# Y envía a: fenix_backend_prod:3001/auth/signup
```

### 3. **Backend NestJS recibe:**
```typescript
@Controller('auth')  // Base: /auth
@Post('signup')      // Ruta: /auth/signup ✅
signup(@Body() dto: SignupDto) {
  return this.authService.signup(dto);
}
```

### 4. **AuthService ejecuta:**
```typescript
async signup(dto: SignupDto) {
  // 1. Crea tenant
  const tenant = await this.prisma.tenant.create({...});
  
  // 2. Crea usuario ADMIN
  const user = await this.prisma.user.create({...});
  
  // 3. Genera JWT token
  const token = await this.signToken(user.id, tenant.id);
  
  // 4. Sincroniza con Dgraph
  await this.dgraphService.createTenant({...});
  
  return { token, userId, tenantId };
}
```

---

## ❌ PROBLEMA IDENTIFICADO

**Error:** `Cannot POST /api/auth/signup`

**Posibles causas:**

### A) NGINX no está escuchando correctamente
```bash
# Verificar que NGINX está corriendo
docker ps | grep fenix_proxy
```

### B) Backend no está accesible desde NGINX
```bash
# Verificar conectividad red Docker
docker exec fenix_proxy_prod ping -c 3 fenix_backend_prod
```

### C) Ruta incorrecta en frontend
```typescript
// Actual en register/page.tsx:
const API_URL = '';  // Relativo
await fetch(`${API_URL}/api/auth/signup`, {...});
// Resultado: POST /api/auth/signup ✅ CORRECTO
```

### D) Backend no tiene ruta /auth/signup
```typescript
// auth.controller.ts:
@Controller('auth')
@Post('signup')
// Ruta final: /auth/signup ✅ CORRECTO
```

---

## 🔍 DIAGNÓSTICO PASO A PASO

### **Test 1: Verificar NGINX**
```bash
docker compose -f docker-compose.prod.yml ps fenix_proxy
# Debe mostrar: Up (healthy)
```

### **Test 2: Verificar Backend**
```bash
docker compose -f docker-compose.prod.yml logs fenix_backend | tail -50
# Buscar: "Nest application successfully started"
```

### **Test 3: Test directo al Backend**
```bash
# Desde WSL o PowerShell:
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "tenantName": "Test Tenant",
    "email": "test@example.com",
    "password": "test123456",
    "fullName": "Test User",
    "position": "CEO",
    "phone": "+57 300 123 4567",
    "subscriptionPlan": "TRIAL"
  }'
```

**Resultado esperado:** JSON con token o error de negocio (not 404)

### **Test 4: Test a través de NGINX**
```bash
curl -X POST http://localhost/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "tenantName": "Test Tenant",
    "email": "test2@example.com",
    "password": "test123456",
    "fullName": "Test User",
    "position": "CEO",
    "phone": "+57 300 123 4567",
    "subscriptionPlan": "TRIAL"
  }'
```

**Resultado esperado:** JSON con token o error de negocio (not 404)

---

## 🔧 SOLUCIONES POSIBLES

### **Solución 1: Verificar logs NGINX**
```bash
docker compose -f docker-compose.prod.yml logs fenix_proxy | grep -i error
```

### **Solución 2: Verificar que backend escuche en 0.0.0.0**
```typescript
// backend/src/main.ts
await app.listen(3001, '0.0.0.0');  // ✅ Debe ser 0.0.0.0 no localhost
```

### **Solución 3: Verificar red Docker**
```bash
docker network inspect fenix-sgcn_fenix-net
# Todos los contenedores deben estar en la misma red
```

### **Solución 4: Reiniciar proxy**
```bash
docker compose -f docker-compose.prod.yml restart fenix_proxy
```

---

## 📊 CHECKLIST DE VERIFICACIÓN

- [ ] Backend corriendo y healthy
- [ ] NGINX corriendo y healthy
- [ ] Ambos en misma red Docker (fenix-net)
- [ ] Backend escucha en 0.0.0.0:3001
- [ ] NGINX config tiene rewrite correcto
- [ ] Endpoint /auth/signup existe en backend
- [ ] Base de datos conectada y migrations aplicadas

---

## 🚀 PLAN DE ACCIÓN

1. **Ejecutar Test 2** (logs backend) para verificar que arrancó
2. **Ejecutar Test 3** (curl directo) para confirmar endpoint funciona
3. **Ejecutar Test 4** (curl via NGINX) para confirmar proxy funciona
4. Si Test 3 falla → problema en backend
5. Si Test 3 pasa pero Test 4 falla → problema en NGINX config

---

**¿Qué test ejecutamos primero?**
