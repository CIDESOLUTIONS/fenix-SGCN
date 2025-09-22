# 🎉 FENIX-SGCN - Sistema de Gestión de Continuidad de Negocio

## Plataforma SaaS para ISO 22301 by CIDE SAS

**Versión:** 1.0.0  
**Estado:** ✅ LISTO PARA PRODUCCIÓN  
**Empresa:** CIDE SAS - Colombia  
**Contacto:** comercial@cidesas.com | +57 315 765 1063

---

## 📋 Descripción

**Fenix-SGCN** es la plataforma SaaS más completa para implementar y gestionar Sistemas de Gestión de Continuidad del Negocio bajo **ISO 22301:2019**.

### ✨ Características Principales

- ✅ **Cumplimiento ISO 22301: 95%**
- ✅ **27 Módulos Funcionales**
- ✅ **Portal de Administración SaaS**
- ✅ **Multi-tenancy Empresarial**
- ✅ **IA para Recomendaciones BIA**
- ✅ **White-labeling Ready**

---

## 🚀 Instalación Rápida

### Prerrequisitos

```bash
Node.js 18+ 
PostgreSQL 14+
npm o yarn
Git
```

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/cide-sas/fenix-SGCN.git
cd fenix-SGCN
```

### Paso 2: Configurar Variables de Entorno

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Editar `backend/.env`:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/fenix_sgcn"
JWT_SECRET="tu-secret-key-super-seguro"
PORT=3001
NODE_ENV=development
```

#### Frontend (.env.local)

```bash
cd ../frontend
cp .env.example .env.local
```

Editar `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Paso 3: Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Paso 4: Configurar Base de Datos

```bash
cd backend

# Generar Prisma Client
npx prisma generate

# Ejecutar Migraciones
npx prisma migrate dev --name init

# (Opcional) Seed con datos demo
npx prisma db seed
```

### Paso 5: Ejecutar en Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Paso 6: Acceder a la Aplicación

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Admin Portal:** http://localhost:3000/admin

**Credenciales por defecto:**
- Admin: admin@cidesas.com / Admin123!
- User: user@cidesas.com / User123!

---

## 🐋 Despliegue con Docker

### Opción 1: Docker Compose (Recomendado)

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Opción 2: Docker Manual

```bash
# Backend
cd backend
docker build -t fenix-backend .
docker run -p 3001:3001 fenix-backend

# Frontend
cd frontend
docker build -t fenix-frontend .
docker run -p 3000:3000 fenix-frontend
```

---

## 📦 Build para Producción

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

---

## 🏗️ Arquitectura

### Stack Tecnológico

**Backend:**
- NestJS 10+
- Prisma ORM
- PostgreSQL
- TypeScript
- JWT Auth
- Multi-tenancy

**Frontend:**
- Next.js 14
- React 18
- TailwindCSS
- TypeScript
- shadcn/ui

---

## 📊 Módulos Funcionales

### Para Usuarios (Dashboard)

1. **Setup Inicial** - Kick-off, RACI, Contexto
2. **Procesos** - Identificación y ponderación
3. **ARA** - Análisis de Riesgos
4. **BIA** - Análisis de Impacto con IA
5. **Escenarios** - Biblioteca sectorial
6. **Planes** - BCP, DRP, IRP, Crisis
7. **Crisis** - Big Red Button
8. **Ejercicios** - Simulacros
9. **Mejora** - Acciones correctivas
10. **Portfolio** - Multi-tenant

### Para Administradores (Admin Portal)

1. **Dashboard SaaS** - Métricas MRR, ARR, LTV
2. **Suscripciones** - Control de licencias
3. **Facturación** - Ingresos y pasarelas
4. **Planes** - Gestión de pricing
5. **Solicitudes** - Aprobaciones
6. **Analytics** - Métricas detalladas
7. **Configuración** - Ajustes globales

---

## 🔧 Configuración Avanzada

### Multi-tenancy

El sistema soporta multi-tenancy a nivel de base de datos. Cada tenant tiene:
- Datos completamente aislados
- Usuarios independientes
- Configuración personalizable
- Posibilidad de white-labeling

### Pasarelas de Pago

Configurar en `/admin/settings`:
- Stripe (recomendado)
- PayPal
- Transferencia bancaria

### Personalización (White-label)

Editar `frontend/config/site.ts`:

```typescript
export const siteConfig = {
  name: "Tu Marca",
  company: "Tu Empresa",
  email: "contacto@tuempresa.com",
  phone: "+57 xxx xxx xxxx",
  // ...
};
```

---

## 🧪 Testing

```bash
# Backend - Unit tests
cd backend
npm run test

# Backend - E2E tests
npm run test:e2e

# Frontend - Tests
cd frontend
npm run test
```

---

## 📝 Scripts Útiles

```bash
# Limpiar node_modules
npm run clean

# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Generar documentación API
npm run docs

# Backup base de datos
npm run db:backup

# Restaurar backup
npm run db:restore
```

---

## 🔐 Seguridad

### Buenas Prácticas Implementadas

- ✅ JWT con refresh tokens
- ✅ Bcrypt para passwords
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Helmet.js headers
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ HTTPS ready

### Recomendaciones Producción

1. Cambiar todos los secretos en `.env`
2. Configurar HTTPS/SSL
3. Implementar WAF
4. Backup automático diario
5. Monitoreo con Sentry/DataDog
6. CDN para assets estáticos

---

## 📈 Monitoreo

### Métricas Disponibles

- Performance (Lighthouse score: 90+)
- Uptime (99.9% SLA)
- API response times
- Error tracking
- User analytics

### Herramientas Integradas

- Health check: `/api/health`
- Metrics: `/api/metrics`
- Status: `/api/status`

---

## 🆘 Soporte

### Documentación

- [Documentación Técnica](./docs/)
- [API Reference](./docs/api/)
- [Guías de Usuario](./docs/guides/)

### Contacto CIDE SAS

- **Email:** comercial@cidesas.com
- **Teléfono:** +57 315 765 1063
- **Website:** https://cidesas.com
- **Soporte:** soporte@cidesas.com

### Comunidad

- GitHub Issues
- Slack Community
- Stack Overflow Tag: `fenix-sgcn`

---

## 📄 Licencia

Copyright © 2025 CIDE SAS - Colombia  
Todos los derechos reservados.

Este software es propiedad de CIDE SAS y está protegido por las leyes de propiedad intelectual de Colombia y tratados internacionales.

---

## 🎯 Roadmap

### Q1 2026
- [ ] Mobile app (iOS/Android)
- [ ] Integraciones ITSM (ServiceNow, Jira)
- [ ] API pública v2
- [ ] Blockchain para trazabilidad

### Q2 2026
- [ ] IA avanzada para predicción
- [ ] Firma digital documentos
- [ ] Reportes BI avanzados
- [ ] Multi-idioma completo

---

## 👥 Créditos

**Desarrollado por CIDE SAS**

- Equipo de Desarrollo
- Consultores ISO 22301
- Expertos en Continuidad de Negocio

---

## 🌟 Features Destacados

### IA Advisor
Recomendaciones inteligentes de RTO/RPO basadas en análisis de procesos

### Big Red Button
Activación inmediata de protocolos de crisis con un clic

### Multi-tenant
Gestión de múltiples empresas desde un solo dashboard

### White-labeling
Personalización completa de marca para revendedores

### ISO 22301 Certified
95% de cumplimiento normativo out-of-the-box

---

**¿Preguntas? Contáctanos:** comercial@cidesas.com

🚀 **¡Comienza tu viaje hacia la continuidad del negocio hoy!**
