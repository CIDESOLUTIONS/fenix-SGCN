# 📘 Blueprint Técnico y Funcional – Plataforma FENIX-SGCN  
**Sistema Multitenant de Gestión de la Continuidad de Negocio**  
_Alineado a ISO 22301, ISO 22313, ISO 22316, ISO 22317, ISO 22318, ISO 22330, ISO 22331 e ISO 31000_

---

## 1. Introducción  
La plataforma **FENIX-SGCN** es una herramienta **multitenant** que permite a múltiples organizaciones implementar, operar y mantener un **Sistema de Gestión de Continuidad de Negocio (SGCN)** bajo estándares internacionales.  

Objetivos principales:  
- Facilitar la adopción y operación de **ISO 22301** y normas complementarias.  
- Proveer un entorno **seguro, escalable y flexible** para clientes de diferentes sectores.  
- Integrar módulos de **gestión documental, seguridad de la información y parametrización avanzada**.  
- Permitir **configuración personalizada de plantillas, ponderaciones y reportes**.  

---

## 2. Marco Normativo de Referencia  
- **ISO 22301:2019** – Requisitos de SGCN.  
- **ISO 22313:2020** – Guía para implementación de SGCN.  
- **ISO 22316:2017** – Resiliencia organizacional.  
- **ISO 22317:2021** – Análisis de Impacto al Negocio (BIA).  
- **ISO 22318:2021** – Continuidad en la cadena de suministro.  
- **ISO 22330:2021** – Continuidad del recurso humano.  
- **ISO 22331:2018** – Estrategia y planificación de continuidad.  
- **ISO 31000:2018** – Gestión de riesgos.  
- **ISO/IEC 27001:2022** – Seguridad de la información (integración complementaria).  

---

## 3. Modelo de Implementación PHVA  

### 3.1 Planificar (Plan)  
**Objetivo**: Definir el alcance, contexto y planificación estratégica del SGCN.  

**Funcionalidades**:  
- Registro multitenant de clientes, usuarios y roles.  
- Definición de contexto organizacional y alcance del SGCN.  
- Identificación de procesos críticos y dependencias.  
- Parametrización flexible de **plantillas de riesgos, procesos y escenarios**.  
- Configuración de **ponderaciones y escalas** para BIA y matrices de riesgos (customizables por cliente).  
- Gestión documental inicial (carga de políticas, manuales, actas de comité).  

**Entregables**:  
- Documento de Alcance y Contexto del SGCN.  
- Registro de Procesos Críticos.  
- Plantillas de parametrización inicial.  
- Inventario documental inicial.  

---

### 3.2 Hacer (Do)  
**Objetivo**: Implementar las estrategias y controles de continuidad.  

**Funcionalidades**:  
- Módulo de **Análisis de Impacto al Negocio (BIA)** con parametrización dinámica.  
- Módulo de **Gestión de Riesgos** alineado a ISO 31000.  
- Diseño de **estrategias de continuidad y recuperación** (sitios alternos, planes de respaldo, DRP, etc.).  
- Gestión documental avanzada:  
  - Versionamiento automático.  
  - Control de accesos por rol.  
  - Firma electrónica / aprobación digital.  
- Módulo de **Planes de Continuidad y Respuesta a Incidentes**.  
- Integración con **MinIO/S3** para almacenamiento seguro de evidencias.  

**Entregables**:  
- Resultados del BIA y análisis de riesgos.  
- Estrategias y planes documentados.  
- Repositorio documental con control de versiones.  

---

### 3.3 Verificar (Check)  
**Objetivo**: Evaluar desempeño, conformidad y eficacia del SGCN.  

**Funcionalidades**:  
- Dashboard de indicadores clave (RTO, RPO, disponibilidad).  
- Auditorías internas y autoevaluaciones ISO 22301.  
- Registro de no conformidades y acciones correctivas.  
- Ejecución y reporte de **simulacros y pruebas de continuidad**.  
- Exportación de reportes a PDF/Excel para comités y entes externos.  

**Entregables**:  
- Informe de auditoría interna.  
- Registro de hallazgos y acciones correctivas.  
- Reportes de simulacros y pruebas.  
- Indicadores de desempeño del SGCN.  

---

### 3.4 Actuar (Act)  
**Objetivo**: Mejorar de manera continua el sistema.  

**Funcionalidades**:  
- Módulo de **mejoramiento continuo** con registro de acciones preventivas/correctivas.  
- Trazabilidad de acciones y responsables.  
- Revisión de la dirección (inputs/outputs de mejora).  
- Actualización periódica de estrategias y planes con histórico comparativo.  

**Entregables**:  
- Informe de revisión por la dirección.  
- Registro de acciones de mejora.  
- Nueva versión de planes y documentos actualizados.  

---

## 4. Operación y Administración del Sistema  
Además del ciclo PHVA, la plataforma incluirá un núcleo de **gestión operativa transversal**:  

### 4.1 Gestión Multitenant  
- Aislamiento de datos por cliente.  
- Configuración de branding, dominios y políticas propias.  
- Gestión de usuarios, roles y permisos.  

### 4.2 Seguridad de la Información  
- Autenticación multifactor (MFA).  
- Cifrado en tránsito (TLS) y en reposo (AES-256 en MinIO).  
- Registro de accesos y actividades (auditoría).  
- Configuración de retención y clasificación de la información.  

### 4.3 Gestión Documental Robusta  
- Repositorio único con versionamiento automático.  
- Control de cambios con bitácora.  
- Plantillas configurables de políticas, procedimientos y registros.  
- Buscador avanzado con metadatos y etiquetas.  

### 4.4 Configuración de Plantillas y Ponderaciones  
- Motor dinámico para ajustar escalas de calificación (ej. impacto bajo/medio/alto).  
- Personalización de matrices de priorización.  
- Flexibilidad para sectores (ej. financiero, salud, público).  

### 4.5 Reporting y Monitoreo  
- Reportes predefinidos y personalizables.  
- Exportación a PDF, Excel y visualizaciones gráficas.  
- API para integración con herramientas externas (ej. PowerBI, SIEM).  

---

## 5. Actividades y Entregables (Referencia Propuesta Cliente – Sección 3.2)  
Se integran como **hitos del sistema**:  

1. **Planeación del proyecto**  
   - Acta de inicio, cronograma y matriz de responsabilidades.  

2. **Diagnóstico inicial**  
   - Levantamiento de información.  
   - Informe de brechas frente a ISO 22301.  

3. **Diseño e implementación del SGCN**  
   - Configuración del sistema.  
   - Registro de procesos críticos, riesgos y dependencias.  
   - Documentación de estrategias y planes.  

4. **Pruebas y validación**  
   - Ejecución de simulacros.  
   - Reportes de desempeño y mejoras.  

5. **Cierre y transferencia de conocimiento**  
   - Entrega de manuales de usuario.  
   - Capacitación a administradores.  
   - Cierre con revisión de la dirección.  

---

## 6. Roadmap Técnico  
- **Fase 1 – Infraestructura base (completa)**: Docker Dev/Prod, multitenant inicial.  
- **Fase 2 – Módulos núcleo**: BIA, riesgos, gestión documental.  
- **Fase 3 – Planes y simulacros**: diseño, ejecución y reportes.  
- **Fase 4 – Integración y seguridad avanzada**: MFA, cifrado extendido, auditoría.  
- **Fase 5 – Optimización**: analítica avanzada, AI para priorización, dashboards personalizados.  
