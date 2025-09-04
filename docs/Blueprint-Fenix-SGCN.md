# **Blueprint Técnico: Plataforma Fénix-SGCN v2.0**

## **1\. Principios y Arquitectura**

* **Visión**: Digitalizar y automatizar el ciclo de vida completo de la implementación y gestión de un SGCN, basado en la metodología de la "Propuesta Comercial y Técnica".  
* **Modelo**: **SaaS Multi-Tenant con Base de Datos Dedicada por Cliente**. Esta arquitectura garantiza el máximo aislamiento y seguridad de los datos. \- **Stack**: React (Next.js) / Node.js (NestJS) / PostgreSQL.  
* **Entorno**: Orquestado y contenerizado con Docker y Docker Compose para desarrollo y producción.

## **2\. Estructura y Orquestación Docker**

La estructura de directorios y el archivo docker-compose.yml permanecen como en la versión anterior, proveyendo una base sólida para los servicios de proxy, frontend, backend, db\_master, y storage.

## **3\. Especificaciones Funcionales Detalladas por Módulo (Ciclo PHVA)**

### **FASE 1: PLANIFICAR \- *Entendimiento y Establecimiento del SGCN***

#### **1.1. Módulo: Contexto de la Organización**

* **Funcionalidad**: Un espacio colaborativo (tipo wiki o editor enriquecido) donde el cliente pueda documentar su contexto.  
* **Campos**:  
  * Partes Interesadas (clientes, reguladores, empleados).  
  * Requisitos Legales y Regulatorios aplicables.  
  * Factores Internos/Externos (Análisis PESTEL/FODA).  
* **Entregable App**: Exportación a PDF del "Documento de Contexto".

#### **1.2. Módulo: Alcance y Política**

* **Funcionalidad**: Un editor de texto enriquecido (WYSIWYG) con plantillas pre-cargadas para la Política de Continuidad.  
* **Características**:  
  * Control de versiones.  
  * Flujo de aprobación simple (Borrador \-\> En Revisión \-\> Aprobado).  
* **Entregable App**: "Declaración de Alcance" y "Política de Continuidad" en PDF.

#### **1.3. Módulo: Gobierno y Roles (Matriz RACI)**

* **Funcionalidad**: Herramienta interactiva para crear una matriz RACI.  
* **Características**:  
  * Lista predefinida de actividades clave del SGCN.  
  * Selección de roles (Sponsor, Gerente SGCN, Líder de Proceso, etc.).  
  * Asignación de R, A, C, I de forma visual.  
* **Entregable App**: Exportación de la "Matriz RACI" a PDF y CSV.

#### **1.4. Módulo: Inventario y Selección de Procesos**

* **Funcionalidad**: Tabla dinámica para listar todos los procesos de la organización.  
* **Características**:  
  * CRUD de procesos (Nombre, Tipo: Misional/Apoyo/Estratégico).  
  * Columnas para una calificación de criticidad inicial (configurable).  
  * Checkbox para marcar "Incluir en BIA y ARA".  
* **Entregable App**: "Matriz de Procesos Seleccionados" en PDF/CSV.

### **FASE 2: HACER \- *Implementación Operativa del SGCN***

#### **2.1. Módulo: Análisis de Impacto al Negocio (BIA)**

* **Funcionalidad**: Un asistente guiado (wizard) que toma los procesos seleccionados en la fase anterior y aplica un formulario detallado.  
* **Características**:  
  * **Configuración de Impactos**: El admin del tenant puede definir y ponderar las categorías de impacto (Financiero, Reputacional, etc.).  
  * **Análisis Cuantitativo y Cualitativo**: Formularios para evaluar los impactos a lo largo del tiempo.  
  * **Cálculo Automático**: El sistema calcula un puntaje de impacto ponderado y sugiere RTO, RPO, MTPD y MBCO.  
  * **Análisis de Dependencias**: Mapeo de dependencias (tecnología, personal, proveedores) para cada proceso.  
* **Entregable App**: "Informe de BIA" consolidado y detallado por proceso.

#### **2.2. Módulo: Análisis y Evaluación de Riesgos (ARA)**

* **Funcionalidad**: Registro y evaluación de riesgos para los procesos críticos identificados en el BIA.  
* **Características**:  
  * **Biblioteca de Amenazas**: Catálogo de amenazas comunes (naturales, tecnológicas, humanas) para facilitar la identificación.  
  * **Evaluación de Controles**: Documentación de controles existentes y su efectividad.  
  * **Matriz de Riesgo Interactiva**: Visualización del riesgo inherente y, tras aplicar controles, el riesgo residual.  
* **Entregable App**: "Informe de Análisis de Riesgos".

#### **2.3. Módulo: Estrategias de Continuidad (NUEVO Y DETALLADO)**

* **Funcionalidad**: Herramienta para diseñar, proponer y seleccionar estrategias de recuperación.  
* **Características**:  
  * **Catálogo de Estrategias**: Opciones pre-cargadas por categoría (Personas, Tecnología, Instalaciones, Proveedores).  
  * **Formulario de Evaluación**: Cada opción de estrategia se evalúa contra criterios clave:  
    * Costo estimado de implementación.  
    * Tiempo estimado de implementación.  
    * Cobertura del RTO/RPO requerido.  
    * Ventajas y Desventajas.  
  * **Cuadro Comparativo**: Genera una vista comparativa para facilitar la toma de decisiones.  
* **Entregable App**: "Documento de Estrategias de Continuidad Seleccionadas".

#### **2.4. Módulo: Desarrollo de Planes (BCP/DRP) (NUEVO Y DETALLADO)**

* **Funcionalidad**: Un constructor de planes basado en plantillas dinámicas.  
* **Características**:  
  * **Biblioteca de Plantillas**: Plantillas editables para BCP, DRP, Plan de Manejo de Crisis, Plan de Comunicación.  
  * **Constructor Dinámico**: Los planes se auto-completan con información ya registrada en la plataforma (ej: los RTO/RPO del BIA, los equipos definidos en la matriz RACI).  
  * **Estructura Modular**: Los planes se construyen por secciones (Activación, Equipos de Respuesta, Procedimientos de Recuperación, Restauración, etc.).  
  * **Gestión Documental Integrada**: Cada plan es un documento vivo con control de versiones y flujo de aprobación.  
* **Entregable App**: "Planes de Continuidad y Recuperación" listos para ser exportados a PDF.

### **FASE 3: VERIFICAR \- *Pruebas, Ejercicios y Evaluación***

#### **3.1. Módulo: Programa de Pruebas**

* **Funcionalidad**: Planificador para diseñar y programar el ciclo anual de pruebas.  
* **Características**:  
  * Definición de tipos de prueba (escritorio, funcional).  
  * Calendario para programar los ejercicios.  
* **Entregable App**: "Programa Anual de Pruebas".

#### **3.2. Módulo: Ejecución y Resultados de Pruebas**

* **Funcionalidad**: Formularios para documentar la ejecución de cada prueba.  
* **Campos**: Objetivos, escenario, participantes, cronología de eventos, resultados, lecciones aprendidas.  
* **Entregable App**: "Informe de Resultados de Pruebas".

#### **3.3. Módulo: Auditoría Interna**

* **Funcionalidad**: Checklist basado en los controles de la norma ISO 22301 para facilitar la autoevaluación.  
* **Características**:  
  * Registro de hallazgos y no conformidades.  
* **Entregable App**: "Informe de Auditoría Interna".

### **FASE 4: ACTUAR \- *Mantenimiento y Mejora Continua***

#### **4.1. Módulo: Revisión por la Dirección**

* **Funcionalidad**: Dashboard que consolida los KPIs y resultados clave de todo el SGCN para presentar a la dirección.  
* **Entregable App**: "Acta de Revisión por la Dirección" (generada a partir de una plantilla).

#### **4.2. Módulo: Acciones Correctivas (CAPA)**

* **Funcionalidad**: Sistema de seguimiento para todas las no conformidades identificadas (en pruebas, auditorías, incidentes).  
* **Características**: Asignación de responsables, fechas de vencimiento, estado (Abierta, En Proceso, Cerrada).  
* **Entregable App**: "Registro y Estado de Acciones Correctivas".

#### **4.3. Módulo: Comunicación y Divulgación**

* **Funcionalidad**: Herramienta para planificar campañas de sensibilización.  
* **Entregable App**: "Plan de Comunicación y Sensibilización".