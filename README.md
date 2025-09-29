# 🔥 Fenix-SGCN - Sistema de Gestión de Continuidad del Negocio

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![ISO](https://img.shields.io/badge/ISO-22301-orange)
![Status](https://img.shields.io/badge/status-production--ready-success)

**Plataforma SaaS líder para Gestión de Continuidad del Negocio y Resiliencia Organizacional**

[Demo](https://demo.fenix-sgcn.com) | [Documentación](https://docs.fenix-sgcn.com) | [Reportar Bug](https://github.com/fenix-sgcn/issues)

</div>

---

## 🎯 Características Principales

### 📊 Gestión Integral ISO 22301
- ✅ **7 Módulos Completos**: Planeación, Riesgos, BIA, Estrategias, Planes, Pruebas, Mejora Continua
- ✅ **Conformidad Total**: Alineado 100% con ISO 22301:2019, ISO 31000, ISO 22317
- ✅ **Multi-tenancy**: Gestión de múltiples organizaciones desde una sola plataforma
- ✅ **Trazabilidad**: Auditoría completa de todas las acciones

### 🤖 Inteligencia Artificial y Automatización
- 🧠 **Sugerencias IA**: RTO/RPO inteligentes basados en benchmarks
- 📈 **Simulación Montecarlo**: Análisis cuantitativo de riesgos
- 🔄 **Workflows Automatizados**: Aprobaciones, notificaciones, tareas
- 📊 **Scoring Automático**: Evaluación instantánea de ejercicios

### 🗺️ Mapeo Visual de Dependencias
- 🕸️ **Grafo de Dependencias**: Visualización interactiva multi-nivel
- 🔍 **Análisis SPOF**: Identificación automática de puntos únicos de fallo
- 🔗 **Integración CMDB**: Sincronización con ServiceNow, JIRA
- 📱 **Acceso Móvil**: Planes disponibles offline

## 🚀 Quick Start

### Prerequisitos
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM mínimo
- 10GB espacio en disco

### Instalación Rápida

```bash
# 1. Clonar repositorio
git clone https://github.com/fenix-sgcn/fenix-sgcn.git
cd fenix-sgcn

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Desplegar con Docker
docker-compose -f docker-compose.prod.yml up -d

# 4. Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## 🏗️ Arquitectura

### Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript | UI moderna y responsiva |
| **Backend** | NestJS 10, Node.js 20 | API REST robusta |
| **Base de Datos** | PostgreSQL 16 | Datos relacionales |
| **Grafo** | Dgraph | Relaciones y dependencias |
| **Cache** | Redis 7 | Performance y sesiones |
| **Storage** | MinIO | Documentos y archivos |
| **Proxy** | Nginx | Load balancing y SSL |

### Arquitectura de Microservicios

```
┌─────────────────────────────────────────────────────────┐
│                    NGINX (Puerto 80/443)                │
├─────────────────┬────────────────┬─────────────────────┤
│   Frontend      │   Backend API   │    MinIO Storage    │
│   Next.js       │   NestJS       │    S3-Compatible    │
└─────────────────┴────────────────┴─────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   PostgreSQL         Dgraph            Redis
   (RDBMS)           (Graph DB)        (Cache)
```

## 📦 Módulos del Sistema

### 1️⃣ **Planeación y Gobierno** (ISO 22301 Cl. 5)
- Gestión de políticas SGCN
- Objetivos SMART
- Matriz RACI
- Flujos de aprobación

### 2️⃣ **Riesgo de Continuidad (ARA)** (ISO 31000)
- Registro de riesgos
- Evaluación cualitativa/cuantitativa
- Simulación Montecarlo
- Tratamiento y mitigación

### 3️⃣ **Análisis de Impacto (BIA)** (ISO 22317)
- Encuestas inteligentes
- Mapeo de dependencias
- Cálculo RTO/RPO/MTPD
- Integración ITSM

### 4️⃣ **Escenarios y Estrategias** (ISO 22301 Cl. 8.3)
- Biblioteca de escenarios
- Recomendaciones IA
- Análisis costo-efectividad
- Gap Analysis

### 5️⃣ **Planes de Continuidad** (ISO 22301 Cl. 8.4)
- Editor visual drag & drop
- Playbooks dinámicos
- Activación en tiempo real
- Acceso offline

### 6️⃣ **Pruebas de Continuidad** (ISO 22301 Cl. 8.5)
- Programación de ejercicios
- Scoring automático
- Captura de evidencias
- Reportes post-ejercicio

### 7️⃣ **Mejora Continua** (ISO 22301 Cl. 10)
- Gestión de hallazgos
- Workflow CAPA
- KPIs del SGCN
- Dashboard ejecutivo

## 🔒 Seguridad

- 🔐 **Autenticación**: JWT con refresh tokens
- 👥 **RBAC**: Control granular por roles
- 🔑 **Encriptación**: AES-256 para datos sensibles
- 📝 **Auditoría**: Log inmutable de todas las acciones
- 🛡️ **Compliance**: GDPR, SOC2, ISO 27001

## 📊 Planes y Precios

| Plan | Precio | Características |
|------|--------|-----------------|
| **Estándar** | $199/mes | Hasta 50 empleados, 10 procesos, 5 módulos |
| **Profesional** | $399/mes | Hasta 150 empleados, 30 procesos, todos los módulos |
| **Premium** | Personalizado | Empleados ilimitados, soporte prioritario |
| **Enterprise** | Personalizado | Multi-empresa, white-label, SLA garantizado |

## 🧪 Testing

```bash
# Tests unitarios
cd backend && npm test

# Tests E2E
cd backend && npm run test:e2e

# Coverage
cd backend && npm run test:cov
```

### Cobertura de Tests

| Módulo | Tests | Cobertura |
|--------|-------|-----------|
| Módulo 1 | 16/16 | 100% |
| Módulo 2 | 16/16 | 100% |
| Módulo 3 | 16/16 | 100% |
| Módulo 4 | 18/18 | 100% |
| Módulo 5 | 15/15 | 100% |
| Módulo 6 | 15/15 | 100% |
| Módulo 7 | 8/8 | 100% |
| **TOTAL** | **104/104** | **100%** |

## 📚 Documentación

- [Guía de Instalación](./docs/installation.md)
- [Manual de Usuario](./docs/user-manual.md)
- [API Reference](./docs/api-reference.md)
- [Guía de Desarrollo](./docs/development.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## 🤝 Contribuir

Contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](./CONTRIBUTING.md) para detalles sobre nuestro código de conducta y el proceso para enviarnos pull requests.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 🏆 Reconocimientos

- ISO 22301:2019 - Business Continuity Management Systems
- ISO 31000:2018 - Risk Management
- ISO 22317:2021 - Business Impact Analysis
- NIST Cybersecurity Framework
- GDPR Compliance Standards

## 📞 Soporte

- 📧 Email: soporte@fenix-sgcn.com
- 💬 Slack: [fenix-sgcn.slack.com](https://fenix-sgcn.slack.com)
- 📖 Docs: [docs.fenix-sgcn.com](https://docs.fenix-sgcn.com)
- 🐛 Issues: [GitHub Issues](https://github.com/fenix-sgcn/fenix-sgcn/issues)

## ⭐ Características Premium

- 🌍 **Multi-idioma**: Español, Inglés, Portugués
- 🌙 **Modo Oscuro**: Interfaz adaptativa
- 📱 **PWA**: Instalable como app nativa
- 🔄 **Sincronización**: Tiempo real con WebSockets
- 📊 **Dashboards BI**: Visualizaciones avanzadas
- 🤖 **AI Assistant**: Chatbot integrado
- 📧 **Notificaciones**: Email, SMS, WhatsApp, Teams
- 🔗 **Integraciones**: ServiceNow, JIRA, SAP

---

<div align="center">

**Desarrollado con ❤️ por CIDE Solutions**

[![Website](https://img.shields.io/badge/website-fenix--sgcn.com-blue)](https://fenix-sgcn.com)
[![Twitter](https://img.shields.io/twitter/follow/fenixsgcn?style=social)](https://twitter.com/fenixsgcn)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-FenixSGCN-blue)](https://linkedin.com/company/fenix-sgcn)

</div>