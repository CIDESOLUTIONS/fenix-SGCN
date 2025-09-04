# Plan de Ejecución Fenix-SGCN

Este documento define la ruta sistemática para el desarrollo, despliegue y puesta en producción de la aplicación **Fenix-SGCN**, basada en el blueprint funcional y técnico aprobado y en la infraestructura Docker establecida.

---

## 1. Preparación Inicial
- [x] Infraestructura base con Docker estable (frontend, backend, DB, MinIO, proxy).
- [x] Blueprint funcional y técnico documentado (`docs/Fenix-SGCN_blueprint.md`).
- [x] Plan de ejecución definido (`docs/Fenix-SGCN_execution_plan.md`).

**Próximos pasos:**
1. Definir ramas en GitHub (`main`, `develop`, `feature/*`).
2. Configurar CI/CD inicial (GitHub Actions) para build y pruebas.

---

## 2. Configuración del Entorno
- [ ] Crear entorno de desarrollo estandarizado (Docker + hot reload).
- [ ] Crear entorno de pruebas (Docker Compose específico).
- [ ] Crear entorno de producción (optimizado con imágenes livianas).
- [ ] Configurar `.gitignore` y manejo de secretos (.env con variables seguras).

---

## 3. Backend (NestJS + Prisma + PostgreSQL)
### 3.1 Fundamentos
- [ ] Estructura base de módulos (auth, users, tenants, roles).
- [ ] Configuración de Prisma + migraciones.
- [ ] Middleware de multi-tenant (separación de esquemas por cliente).
- [ ] Validación de seguridad: JWT + roles + permisos.

### 3.2 Funcionalidades Clave
- [ ] Gestión de usuarios y roles.
- [ ] Gestión de inquilinos (tenants).
- [ ] Configuración de ponderaciones y plantillas dinámicas.
- [ ] Gestión documental robusta (integración con MinIO S3).
- [ ] Auditoría y trazabilidad (logs de acciones).

### 3.3 APIs
- [ ] Endpoints REST + documentación con Swagger.
- [ ] Implementar rate limiting y validaciones.

---

## 4. Frontend (Next.js + Tailwind + i18n)
### 4.1 Fundamentos
- [ ] Estructura inicial con layout base.
- [ ] Integración con API backend (autenticación y consumo de datos).
- [ ] Internacionalización (i18next o alternativa estable).

### 4.2 Funcionalidades Clave
- [ ] Dashboards personalizables por tenant.
- [ ] Formularios dinámicos basados en plantillas configurables.
- [ ] Gestión documental con MinIO (subida, descarga, versionado).
- [ ] Módulo PHVA con vistas intuitivas (Planear, Hacer, Verificar, Actuar).
- [ ] Reportes exportables (PDF/Excel).

---

## 5. Seguridad de la Información
- [ ] Aplicar principios de la ISO 27001 para gestión de información sensible.
- [ ] Asegurar separación de datos entre tenants.
- [ ] Configurar HTTPS (Nginx + certificados SSL).
- [ ] Revisiones periódicas de vulnerabilidades (npm audit, trivy).

---

## 6. Pruebas
- [ ] Unitarias (Vitest en frontend, Jest en backend).
- [ ] Integración (pruebas de API con Supertest).
- [ ] E2E (Playwright).
- [ ] Pruebas de carga y resiliencia.

---

## 7. CI/CD
- [ ] GitHub Actions: build + test automático en cada push.
- [ ] Pipeline para despliegue en staging.
- [ ] Pipeline para despliegue en producción.

---

## 8. Operación y Mantenimiento
- [ ] Monitorización (Prometheus + Grafana).
- [ ] Logging centralizado (ELK stack o Loki).
- [ ] Backups automáticos (DB + MinIO).
- [ ] Documentación de administración para clientes.

---

## 9. Hitos del Proyecto
1. **Base estable (Docker + Blueprint + Plan):** ✅
2. **Módulo de Autenticación y Tenants (MVP):** ⏳
3. **Gestión documental y plantillas:** ⏳
4. **Dashboards y módulo PHVA:** ⏳
5. **Pruebas E2E + CI/CD:** ⏳
6. **Versión piloto en producción:** ⏳
7. **Versión final certificable ISO 22301:** ⏳

---

## 10. Próximas Acciones
1. Crear ramas en GitHub (`main`, `develop`, `feature/*`).
2. Configurar CI/CD inicial (build + test).
3. Implementar módulo de autenticación y tenants en backend.
4. Conectar frontend con API de autenticación.
5. Avanzar en la gestión documental y plantillas.

---

**Este plan se actualizará conforme avancemos en los hitos.**
