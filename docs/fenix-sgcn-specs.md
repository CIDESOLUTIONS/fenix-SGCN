

# **Fenix-SGCN \- Especificaciones Funcionales para un Sistema de Gestión de Continuidad de Negocio Líder en el Mercado**

## **Parte I: Visión Estratégica y Arquitectura de la Plataforma**

Esta sección fundamental define la filosofía central de Fenix-SGCN. Establece cómo se sintetizan las mejores ideas del mercado en un producto superior y cohesivo, y describe los sistemas transversales de la plataforma que habilitan esta visión.

### **1.1. Resumen Ejecutivo: La Propuesta de Valor de Fenix-SGCN**

**Objetivo:** Articular la posición única de Fenix-SGCN en el mercado. Fenix-SGCN no es simplemente otra herramienta de Gestión de Continuidad de Negocio (BCM); es una *Plataforma de Resiliencia Integrada*.

**Principios Fundamentales:** Fenix-SGCN ofrecerá el **poder de los datos relacionales** de Fusion Risk Management 1, la

**experiencia de usuario intuitiva y guiada** de Veoci 2, y la

**inteligencia impulsada por IA y alineada con GRC** de MetricStream.3

**Contexto de Mercado:** El mercado está evolucionando desde la planificación estática hacia la resiliencia operativa dinámica, una tendencia confirmada por analistas de la industria como Gartner y Forrester.4 Fenix-SGCN está diseñado desde su concepción para satisfacer esta demanda moderna, transformando los programas de resiliencia tradicionales en una ventaja competitiva.7

La siguiente tabla resume cómo Fenix-SGCN se posiciona frente a los líderes del mercado, destacando las áreas donde ofrecerá una funcionalidad superior o única.

**Tabla 1: Matriz de Características Competitivas**

| Característica | Fenix-SGCN | Fusion Risk Management | Veoci | MetricStream |
| :---- | :---- | :---- | :---- | :---- |
| **Modelo de Datos Centralizado** | Grafo de Datos Integrado | Fuerte Mapeo Relacional | Base de Datos Relacional | Base de Datos Relacional |
| **Mapeo Visual de Dependencias** | Interactivo, multinivel, en tiempo real | Soportado, visualizaciones estáticas | Básico, basado en formularios | Soportado, Data Explorer |
| **Editor Visual de Planes (Drag & Drop)** | Sí, con playbooks dinámicos | No (basado en plantillas) | No (basado en formularios) | No (basado en plantillas) |
| **Sugerencias de RTO/RPO con IA** | Sí, basado en benchmarks | No | No | No |
| **Simulación de Riesgos Montecarlo** | Sí, integrada en el módulo ARA | No | No | No |
| **Puntuación Automatizada de Pruebas** | Sí, con captura de evidencia multimedia | Limitado | No | Limitado |
| **Integración Nativa con ITSM/CMDB** | Sí (ServiceNow, etc.) | Soportado (Salesforce) | Soportado (vía API) | Soportado (vía API) |
| **Motor de Flujos de Trabajo (No-Code)** | Sí, visual e integrado | Sí, basado en Salesforce Flow | Sí, plataforma no-code | Sí, workflows configurables |

### **1.2. Sistemas y Arquitectura Transversales de la Plataforma**

#### **1.2.1. Repositorio Central de Datos y Modelo de Datos en Grafo**

**Descripción:** Todos los datos organizacionales (procesos, activos, riesgos, planes, proveedores, personas, ubicaciones) se almacenarán como objetos en un repositorio central. Las relaciones entre estos objetos se gestionarán utilizando un modelo de base de datos en grafo. Este es el motor central que impulsa nuestro diferenciador clave: un mapeo de dependencias profundo y significativo.

**Justificación:** La principal fortaleza de Fusion es su capacidad para mapear relaciones.1 Al adoptar un modelo de grafo, Fenix-SGCN puede visualizar dependencias complejas ascendentes y descendentes de manera más efectiva que las bases de datos relacionales tradicionales. Esto permite a los usuarios "ver cómo funciona realmente su negocio" 9 e identificar puntos únicos de fallo.10 Esta estructura es esencial para los módulos de Riesgo (2), BIA (3) y Planes (5), ya que transforma datos aislados en una red interconectada de inteligencia operativa.11

#### **1.2.2. Motor de Flujos de Trabajo y Automatización**

**Descripción:** Un constructor de flujos de trabajo visual y sin código (no-code) sustentará la plataforma. Esto permitirá a los administradores definir, automatizar y rastrear procesos como aprobaciones, revisiones y notificaciones, una característica clave observada en competidores como MetricStream y Veoci.2

**Funcionalidad:**

* Activar acciones basadas en eventos (p. ej., la presentación de un BIA desencadena un flujo de trabajo de aprobación).  
* Programar tareas recurrentes (p. ej., revisiones anuales de planes).  
* Enviar recordatorios automáticos para reducir la carga administrativa y garantizar que las tareas se completen a tiempo, un factor crucial para mantener la actualidad del programa.2

#### **1.2.3. Sistema de Gestión de Documentos y Plantillas**

**Descripción:** Un sistema robusto para crear, almacenar, versionar y gestionar todos los documentos y plantillas. Este sistema debe ir más allá de simples archivos adjuntos para convertirse en un componente activo del SGCN.

**Funcionalidad:**

* **Carga de Documentos:** Soportará la carga de archivos .pdf y .md (Markdown) como materiales de referencia, que pueden adjuntarse a planes, riesgos o activos.  
* **Editor de Plantillas Integrado:** Un editor para crear formularios y encuestas dinámicas (p. ej., para BIA, Evaluaciones de Riesgo). Soportará diversos tipos de campos: texto, número, fecha, menú desplegable, escalas ponderadas, etc.  
* **Importación de Datos:** Capacidad para importar datos de documentos de MS Office directamente a los campos del sistema, no solo como archivos adjuntos, una característica muy valorada en Fusion.10  
* **Control de Versiones:** Control de versiones completo con pistas de auditoría para todos los documentos y plantillas, registrando quién cambió qué y cuándo.  
* **Generación de Informes:** Capacidad para generar informes profesionales en formatos .pdf y .docx a partir de los datos del sistema, utilizando plantillas personalizables.15

#### **1.2.4. Informes, Paneles de Control y Analítica**

**Descripción:** Una suite de informes completa con paneles de control (dashboards) personalizables y basados en roles.

**Funcionalidad:**

* **Biblioteca de Informes:** Una biblioteca de informes predefinidos alineados con los requisitos de ISO 22301 (p. ej., entradas para la Revisión por la Dirección).  
* **Constructor de Paneles de Control:** Un constructor de paneles de control de tipo "arrastrar y soltar" (drag-and-drop) que permita a los usuarios visualizar métricas clave.16  
* **Visibilidad en Tiempo Real:** Los paneles proporcionarán una vista panorámica y en tiempo real del estado del programa, incluyendo el estado de los planes, las acciones correctivas abiertas y los mapas de calor de riesgos.2  
* **Filtrado Avanzado:** Capacidades de filtrado avanzadas en todos los módulos, permitiendo a los usuarios ver datos por uno, varios o todos los procesos de negocio.

#### **1.2.5. Control de Acceso Basado en Roles (RBAC) y Gestión de Usuarios**

**Descripción:** Control granular sobre los permisos de los usuarios para garantizar la seguridad y la segregación de funciones.

**Funcionalidad:**

* Definir roles (p. ej., Gestor del SGCN, Propietario del Plan, Analista de Riesgos, Auditor) con permisos específicos de lectura, escritura y aprobación para cada módulo y objeto de datos. Esta es una característica estándar pero crítica, destacada en el análisis de la competencia.10  
* Integración con sistemas de directorio como Active Directory para sincronizar listas de contactos y facilitar la gestión de usuarios.10

El valor de la plataforma no reside únicamente en la centralización de la documentación, sino en la *integración* de los datos. Un usuario en el módulo de Riesgo (Módulo 2\) debe poder ver que un riesgo de alto impacto está vinculado a un proceso crítico identificado en el BIA (Módulo 3), el cual está cubierto por un plan de recuperación específico (Módulo 5\) que fue probado por última vez hace tres meses (Módulo 6). Esta interconexión, impulsada por nuestro modelo de datos en grafo, crea una visión holística de la resiliencia que los módulos GRC aislados no pueden igualar. Esto transforma la plataforma de un sistema de registro a una herramienta de toma de decisiones estratégicas.8

Además, la base de la plataforma sobre una arquitectura sin código/bajo código (no-code/low-code) es una elección estratégica que garantiza su viabilidad a futuro. Competidores como Veoci y Noggin promueven activamente su personalización sin código.21 Esto permite adaptar la plataforma a las necesidades específicas de los clientes sin el costoso y lento desarrollo personalizado, un punto débil importante en sistemas complejos como Fusion.1 Al construir nuestro motor de flujos de trabajo y editor de plantillas sobre una base sin código, empoderamos a nuestros usuarios para que evolucionen su SGCN a medida que su organización cambia, asegurando un valor a largo plazo y reduciendo la rotación de clientes.

## **Parte II: Especificaciones Funcionales Módulo por Módulo**

### **Módulo 1: Planeación y Gobierno (ISO 22301 Cláusula 5: Liderazgo)**

#### **2.1. Objetivo y Alineación con ISO**

* **Objetivo:** Establecer el marco fundamental del SGCN, asegurando que la alta dirección demuestre liderazgo y compromiso de manera visible y auditable.  
* **Alineación ISO:** Aborda directamente los requisitos de la Cláusula 5 de ISO 22301: 5.1 (Liderazgo y compromiso), 5.2 (Política) y 5.3 (Roles, responsabilidades y autoridades de la organización).23

#### **2.2. Especificaciones Funcionales**

##### **2.2.1. Gestión de la Política del SGCN**

* **Flujo de Usuario:** Un administrador utiliza un editor de texto enriquecido para redactar la Política de Continuidad de Negocio, aprovechando una plantilla predefinida y alineada con la Cláusula 5.2.1 de ISO 22301\.26 La política se envía a través de un flujo de trabajo de aprobación configurable. Una vez aprobada, se publica en la organización y se notifica a las partes interesadas relevantes.  
* **Características:**  
  * Plantillas de políticas con marcadores de posición para el contexto organizacional, los objetivos y el compromiso con la mejora continua.27  
  * Control de versiones con un historial completo de cambios, aprobadores y fechas.  
  * Flujo de trabajo para la revisión y aprobación, incluyendo firmas electrónicas para crear una pista de auditoría trazable del compromiso del liderazgo.23  
  * Capacidad para vincular la política directamente a los objetivos del SGCN definidos en el sistema.

##### **2.2.2. Objetivos del SGCN**

* **Flujo de Usuario:** Un gerente define objetivos específicos, medibles, alcanzables, relevantes y con plazos definidos (SMART) para el SGCN. Cada objetivo puede ser asignado a un propietario y tener una fecha de vencimiento.  
* **Características:**  
  * Un registro central para todos los objetivos del SGCN.  
  * Campos para rastrear el progreso, el estado (p. ej., En curso, En riesgo, Completado) y la vinculación a métricas de rendimiento para la evaluación del desempeño.24

##### **2.2.3. Roles, Responsabilidades y Autoridades (Matriz RACI)**

* **Flujo de Usuario:** El Gestor del SGCN utiliza una herramienta visual y colaborativa para definir roles (p. ej., Líder del Equipo de Gestión de Crisis, Coordinador de BIA) y asignar responsabilidades para las tareas clave del SGCN.  
* **Características:**  
  * Un editor de matriz RACI (Responsable, Aprobador, Consultado, Informado) interactivo.  
  * Integración con el sistema de gestión de usuarios de la plataforma para asignar usuarios específicos a los roles.  
  * Los roles y responsabilidades definidos se propagarán automáticamente a las secciones relevantes en planes y procedimientos, asegurando claridad durante un incidente y eliminando la ambigüedad.27

La Cláusula 5 de ISO 22301 no se trata de redactar una política y archivarla; se trata de *demostrar* el compromiso del liderazgo.23 Mientras que los competidores pueden permitir la carga de políticas, un líder de mercado debe crear un "registro vivo" de la gobernanza. El diseño de Fenix-SGCN, con sus flujos de trabajo de aprobación obligatorios, firmas electrónicas y la vinculación directa entre política, objetivos y roles, transforma el módulo de gobierno de un repositorio estático a un sistema activo y auditable. Un auditor puede ver instantáneamente no solo la política, sino todo el ciclo de vida de su aprobación y la asignación clara de responsabilidades, satisfaciendo así la intención central de la norma.

### **Módulo 2: Riesgo de Continuidad (ARA) (ISO 31000 & ISO 22301 Cl. 8.2.3)**

#### **3.1. Objetivo y Alineación con ISO**

* **Objetivo:** Implementar un proceso sistemático para identificar, analizar, evaluar y tratar los riesgos que podrían interrumpir las actividades priorizadas.  
* **Alineación ISO:** Se alinea con todo el marco de gestión de riesgos de ISO 31000 (Principios, Marco y Proceso) 28 y aborda específicamente el requisito de evaluación de riesgos en la Cláusula 8.2.3 de ISO 22301\.32

#### **3.2. Especificaciones Funcionales**

##### **3.2.1. Configuración del Marco de Riesgos**

* **Flujo de Usuario:** Un administrador configura el marco de gestión de riesgos de la organización.  
* **Características:**  
  * Definir categorías de riesgo personalizadas (p. ej., Operacional, Financiero, Reputacional, Cibernético).29  
  * Crear criterios de evaluación configurables tanto para la probabilidad como para el impacto, con escalas personalizables (p. ej., 1-5) y descripciones claras.  
  * **Criterios Ponderados:** Permitir a los administradores asignar pesos a diferentes categorías de impacto (p. ej., Impacto Financiero tiene un peso del 40%, Reputacional 30%, Operacional 30%) para calcular una puntuación de riesgo única y ponderada. Esto proporciona una evaluación más matizada que una simple matriz.

##### **3.2.2. Registro de Riesgos**

* **Flujo de Usuario:** Un usuario identifica un riesgo, lo describe, lo asigna a una categoría y lo vincula a los procesos de negocio, activos o ubicaciones específicas que afecta, aprovechando el repositorio central de datos.  
* **Características:**  
  * Un registro centralizado, filtrable y con capacidad de búsqueda de todos los riesgos identificados.  
  * Campos para el propietario del riesgo, estado, fecha de identificación y fuente.  
  * Vinculación a controles, incidentes y planes de continuidad.

##### **3.2.3. Evaluación de Riesgos (Cualitativa y Cuantitativa)**

* **Flujo de Usuario:** Para un riesgo dado, el propietario realiza una evaluación. Selecciona las puntuaciones de probabilidad e impacto de las escalas configuradas. El sistema calcula automáticamente la puntuación de riesgo inherente basándose en el marco.  
* **Características:**  
  * Matriz de riesgo interactiva (mapa de calor) para visualizar el panorama general de riesgos.19  
  * Capacidad para evaluar los controles existentes y su eficacia para determinar la puntuación de riesgo residual.  
  * **Análisis Cuantitativo y Simulación Montecarlo:**  
    * Para riesgos específicos (especialmente financieros u operacionales), los usuarios pueden cambiar a un modo cuantitativo.  
    * Pueden definir variables de entrada con distribuciones de probabilidad (p. ej., costo de inactividad por hora como una distribución triangular, probabilidad de fallo como un porcentaje).  
    * El usuario especifica el número de iteraciones para la simulación (p. ej., 10,000).  
    * El sistema ejecuta una simulación Montecarlo para generar una distribución de probabilidad de los posibles resultados (p. ej., pérdida financiera total).  
    * Los resultados se muestran visualmente con histogramas y gráficos de probabilidad acumulada, mostrando, por ejemplo, "Hay una probabilidad del 90% de que el impacto financiero sea inferior a $X".

##### **3.2.4. Tratamiento del Riesgo**

* **Flujo de Usuario:** Basándose en la evaluación del riesgo, el propietario define un plan de tratamiento (Evitar, Mitigar, Transferir, Aceptar). Para la mitigación, crea acciones específicas, las asigna a usuarios y establece fechas de vencimiento.  
* **Características:**  
  * Flujo de trabajo para seguir el progreso de los planes de tratamiento y las acciones.  
  * Recordatorios automáticos para acciones vencidas.  
  * Widgets en el panel de control que muestran el estado del tratamiento de riesgos en toda la organización.

Las evaluaciones de riesgo estándar se basan en mapas de calor subjetivos de 5x5. Aunque útiles, no capturan verdaderamente "el efecto de la incertidumbre en los objetivos", como lo define ISO 31000\.28 Mientras competidores como MetricStream ofrecen evaluaciones cualitativas y cuantitativas 3, proporcionar una simulación Montecarlo integrada y fácil de usar es un diferenciador significativo. Permite a las organizaciones modelar incertidumbres complejas y expresar el riesgo no como una única y arbitraria puntuación "roja", sino como un rango probabilístico de resultados. Esto proporciona a la dirección datos mucho más sofisticados para tomar decisiones sobre la asignación de recursos para el tratamiento de riesgos, alineándose directamente con el principio de "la mejor información disponible" de ISO 31000\.28

### **Módulo 3: Análisis de Impacto en el Negocio (BIA) (ISO 22301 Cl. 8.2.2 & ISO 22317\)**

#### **4.1. Objetivo y Alineación con ISO**

* **Objetivo:** Identificar y priorizar las actividades y recursos críticos de la organización, determinar el impacto de su interrupción a lo largo del tiempo y establecer objetivos de recuperación.  
* **Alineación ISO:** Implementa directamente los requisitos de la Cláusula 8.2.2 de ISO 22301 32 y sigue las directrices exhaustivas de ISO 22317\.34

#### **4.2. Especificaciones Funcionales**

##### **4.2.1. Gestión de Campañas de BIA**

* **Flujo de Usuario:** El Gestor del SGCN crea una campaña de BIA (p. ej., "Revisión Anual de BIA 2024"). Selecciona los procesos de negocio/departamentos a incluir y establece una fecha límite. El sistema envía automáticamente solicitudes de encuesta de BIA a los propietarios de procesos designados.  
* **Características:**  
  * Panel de control para seguir el estado de todos los BIA en una campaña (No iniciado, En progreso, Enviado, Aprobado).  
  * Recordatorios automáticos para los BIA incompletos.

##### **4.2.2. Encuesta de BIA Inteligente**

* **Flujo de Usuario:** El propietario de un proceso recibe un enlace a su encuesta de BIA. El formulario está precargado con información conocida sobre su proceso desde el repositorio central. Responde preguntas sobre el impacto de una interrupción en incrementos de tiempo predefinidos (p. ej., 4 horas, 24 horas, 3 días).  
* **Características:**  
  * Plantillas de BIA personalizables basadas en las directrices de ISO 22317\.36  
  * Definición de múltiples categorías de impacto (Financiero, Reputacional, Legal/Regulatorio, etc.) con criterios configurables.36  
  * **Sugerencias Impulsadas por IA:** Basándose en datos históricos de procesos similares dentro de la organización o en benchmarks anónimos de la industria, el sistema sugiere posibles valores de RTO/RPO. La sugerencia aparecería como: "Los procesos de este tipo suelen tener un RTO de 4 horas. ¿Le parece apropiado?". Esto guía a los usuarios no expertos, una característica clave de Veoci.2  
  * La encuesta incluye secciones para identificar registros vitales, personal clave y dependencias.

##### **4.2.3. Mapeo Visual de Dependencias**

* **Flujo de Usuario:** Dentro del BIA, el propietario del proceso inicia la herramienta de mapeo de dependencias. Ve su proceso como un nodo central. Puede arrastrar y soltar activos de una biblioteca (Aplicaciones, Proveedores, Instalaciones, otros Procesos) y dibujar conexiones a su proceso.  
* **Características:**  
  * Un lienzo interactivo de "arrastrar y soltar" para visualizar dependencias.16  
  * El mapa no es una imagen estática; es una vista en vivo del modelo de datos en grafo. Al hacer clic en un nodo (p. ej., una aplicación), se revelan sus propias dependencias, permitiendo un análisis de impacto multinivel.11  
  * Integración con ITSM/CMDB (p. ej., ServiceNow) para descubrir y poblar automáticamente las dependencias de aplicaciones e infraestructura, manteniendo el mapa actualizado.39  
  * Codificación por colores para indicar el estado o la criticidad de los activos dependientes.41

##### **4.2.4. Revisión y Aprobación del BIA**

* **Flujo de Usuario:** Una vez enviado, el BIA entra en un flujo de trabajo de aprobación. El Gestor del SGCN revisa los impactos presentados, las dependencias y los RTO/RPO propuestos. Puede aprobar, rechazar con comentarios o modificar.  
* **Características:**  
  * Una vista consolidada que muestra todos los BIA, sus puntuaciones de criticidad calculadas y los RTO/RPO propuestos.  
  * Cálculo automatizado del Período Máximo Tolerable de Interrupción (MTPD) basado en las evaluaciones de impacto.  
  * Los valores de RTO y RPO aprobados se convierten en los objetivos de recuperación oficiales para ese proceso y se transfieren automáticamente al módulo de Planificación (Módulo 5).

El BIA no es un formulario, es un proceso de descubrimiento, y la interfaz de usuario debe reflejarlo. Los competidores ofrecen encuestas de BIA 3, pero tratar el BIA como una mera tarea de entrada de datos ignora su propósito principal: ayudar a la empresa a

*comprenderse a sí misma*. La innovación clave de Fenix-SGCN es la estrecha integración de la encuesta con un mapa de dependencias interactivo y en vivo. Un propietario de proceso no solo *declara* una dependencia, sino que la *visualiza*. Este acto de construcción visual a menudo revela puntos únicos de fallo no reconocidos previamente o interdependencias complejas.11 Esto transforma el BIA de una tarea de cumplimiento a un valioso ejercicio estratégico, un principio fundamental de ISO 22317\.36

Además, la integración con la CMDB es fundamental para la precisión y eficiencia del BIA. Un desafío importante en BCM es que los planes se desactualizan tan pronto como cambia el entorno de TI. La investigación sobre ServiceNow destaca el papel crítico de la CMDB como la fuente de verdad para los activos de TI y sus relaciones.40 Al construir una integración robusta y en tiempo real con las principales plataformas de ITSM, Fenix-SGCN puede automatizar la parte más tediosa y propensa a errores del BIA: la identificación de dependencias tecnológicas. Cuando se agrega un nuevo servidor a una aplicación en ServiceNow, nuestro mapa de dependencias puede reflejar automáticamente ese cambio y marcar el BIA relevante para su revisión. Esto hace que el programa BCM pase de ser reactivo a proactivo y lo integra en las operaciones diarias de TI 39, una característica que posicionaría a Fenix-SGCN en el nivel más alto de madurez del mercado.

### **Módulo 4: Escenarios y Estrategias (ISO 22301 Cl. 8.3)**

#### **5.1. Objetivo y Alineación con ISO**

* **Objetivo:** Definir, analizar y seleccionar estrategias y soluciones de continuidad de negocio apropiadas para cumplir con los requisitos de recuperación (RTO/RPO) identificados en el BIA.  
* **Alineación ISO:** Aborda directamente la Cláusula 8.3 de ISO 22301, que requiere la determinación y selección de estrategias de continuidad de negocio.33

#### **5.2. Especificaciones Funcionales**

##### **5.2.1. Biblioteca de Escenarios de Disrupción**

* **Flujo de Usuario:** El administrador del SGCN accede a una biblioteca de escenarios de amenaza predefinidos y puede crear escenarios personalizados.  
* **Características:**  
  * Una biblioteca de escenarios sectoriales y genéricos (p. ej., ciberataque ransomware, fallo de proveedor crítico, indisponibilidad de edificio, pandemia).  
  * Cada escenario puede vincularse a los riesgos identificados en el Módulo 2\.  
  * Los escenarios sirven como base para el desarrollo y la prueba de estrategias y planes.

##### **5.2.2. Motor de Recomendación de Estrategias**

* **Flujo de Usuario:** Para un proceso crítico, el usuario selecciona "Definir Estrategia". El sistema analiza los datos del BIA (RTO, RPO, dependencias) y los recursos disponibles.  
* **Características:**  
  * **Sugerencias basadas en IA:** El sistema propone una lista de estrategias viables (p. ej., "Replicación de datos en sitio alterno", "Activación de contrato con proveedor secundario", "Procedimiento de trabajo manual").  
  * Las recomendaciones se basan en el RTO. Por ejemplo, para un RTO de 4 horas, no se recomendarán estrategias que tarden 24 horas en implementarse.  
  * El motor considera las dependencias: si un proceso depende de una aplicación con un RTO de 2 horas, la estrategia para el proceso debe ser compatible.

##### **5.2.3. Análisis de Costo-Efectividad y Selección**

* **Flujo de Usuario:** El usuario compara las estrategias recomendadas. Para cada una, puede introducir estimaciones de costos (CAPEX y OPEX) y evaluar su efectividad para cumplir el RTO.  
* **Características:**  
  * Una herramienta de análisis comparativo que visualiza el costo frente al tiempo de recuperación para cada opción estratégica.  
  * Permite documentar la justificación de la estrategia seleccionada, creando un registro auditable de la decisión.  
  * La estrategia aprobada se vincula formalmente al proceso y sirve como base para el Módulo 5 (Planes de Continuidad).

##### **5.2.4. Análisis de Brechas de Recursos (Gap Analysis)**

* **Flujo de Usuario:** Una vez seleccionada una estrategia, el sistema la compara con los recursos actualmente catalogados en el repositorio central.  
* **Características:**  
  * Identifica automáticamente las brechas: "La estrategia 'Sitio de Trabajo Alterno' requiere 50 puestos de trabajo, pero solo hay 30 disponibles en la ubicación B".  
  * Genera una lista de requisitos de recursos (personas, información, infraestructura, proveedores) necesarios para implementar la estrategia.42  
  * Estas brechas se pueden convertir en acciones correctivas o proyectos de mitigación, que se gestionan en el Módulo 7\.

Este módulo va más allá de una simple lista de estrategias. El motor de recomendación por IA y la herramienta de análisis de costo-efectividad proporcionan un soporte de decisiones crucial, haciendo el proceso más estratégico y eficiente. Esto ayuda a las organizaciones a evitar la parálisis por análisis y a seleccionar las soluciones más adecuadas y rentables para proteger sus operaciones críticas, alineando la inversión en resiliencia directamente con el impacto en el negocio.

### **Módulo 5: Planes de Continuidad (ISO 22301 Cl. 8.4)**

#### **6.1. Objetivo y Alineación con ISO**

* **Objetivo:** Desarrollar, documentar e implementar planes de continuidad de negocio (BCP) y de recuperación de TI (ITDR) que sean claros, accionables y dinámicos para ejecutar las estrategias seleccionadas.  
* **Alineación ISO:** Cumple con los requisitos de la Cláusula 8.4 de ISO 22301 para establecer e implementar procedimientos de continuidad de negocio.33

#### **6.2. Especificaciones Funcionales**

##### **6.2.1. Editor Visual de Planes y Playbooks**

* **Flujo de Usuario:** El propietario del plan utiliza un editor de "arrastrar y soltar" para construir el flujo de recuperación. Arrastra pasos (p. ej., "Notificar al equipo", "Activar sistema de respaldo", "Contactar al proveedor X") y los conecta para crear un playbook visual.  
* **Características:**  
  * Un editor de flujo de trabajo visual que permite crear secuencias de tareas, decisiones y puntos de control.16  
  * Biblioteca de plantillas de planes (p. ej., Plan de Respuesta a Incidentes, Plan de Recuperación de Aplicación, Plan de Continuidad de Proceso).  
  * Cada paso en el playbook puede contener instrucciones detalladas, listas de verificación y adjuntos.

##### **6.2.2. Contenido Dinámico y Vinculado**

* **Flujo de Usuario:** Al crear un plan para un proceso específico, el sistema rellena automáticamente secciones clave del plan.  
* **Características:**  
  * **Población Automática:** Los contactos del equipo, RTO/RPO, dependencias críticas y recursos necesarios se extraen directamente de los módulos de Gobierno (1), BIA (3) y Estrategias (4).  
  * **Actualización en Cascada:** Si un contacto clave cambia en el módulo de Gobierno o un RTO se actualiza en el BIA, todos los planes vinculados se actualizan automáticamente o se marcan para revisión. Esto elimina el problema de los planes estáticos y desactualizados, un punto débil importante en los enfoos tradicionales basados en documentos.15

##### **6.2.3. Integración con ITSM y Gestión de Incidentes**

* **Flujo de Usuario:** Durante un incidente real gestionado en una plataforma ITSM como ServiceNow, se puede activar un plan de Fenix-SGCN directamente desde el ticket del incidente.  
* **Características:**  
  * Integración bidireccional para vincular planes de continuidad a incidentes, problemas o cambios en el CMDB de ServiceNow.39  
  * La activación de un plan puede crear automáticamente subtareas en el sistema ITSM para los equipos técnicos.  
  * El estado de las tareas de recuperación se puede sincronizar entre Fenix-SGCN y la plataforma ITSM, proporcionando una imagen operativa común.

##### **6.2.4. Acceso Móvil y Offline**

* **Flujo de Usuario:** En caso de una interrupción que afecte a la red corporativa, los miembros del equipo pueden acceder a sus planes de continuidad a través de una aplicación móvil nativa.  
* **Características:**  
  * Capacidad para sincronizar y almacenar planes en el dispositivo para acceso sin conexión.3  
  * La aplicación móvil permite ver instrucciones, marcar tareas como completadas y comunicarse con el equipo.

El principal problema de la industria son los planes estáticos en formato Word o PDF, que son difíciles de mantener y poco prácticos durante una crisis. Un editor de planes visual de "arrastrar y soltar", similar a los ofrecidos por Kuali Ready o Noggin 16, hace que la creación de planes sea intuitiva y atractiva. Sin embargo, el verdadero poder reside en el contenido dinámico. Al garantizar que los planes se actualicen automáticamente con los últimos datos de otros módulos, Fenix-SGCN resuelve el problema fundamental de la obsolescencia de los planes y asegura que los equipos de respuesta siempre trabajen con la información más precisa.

### **Módulo 6: Pruebas de Continuidad (ISO 22301 Cl. 8.5)**

#### **7.1. Objetivo y Alineación con ISO**

* **Objetivo:** Validar la efectividad, idoneidad y actualidad de las estrategias y planes de continuidad a través de un programa de ejercicios y pruebas sistemático.  
* **Alineación ISO:** Implementa los requisitos de la Cláusula 8.5 de ISO 22301 sobre el programa de ejercicios.42

#### **7.2. Especificaciones Funcionales**

##### **7.2.1. Planificación y Programación de Ejercicios**

* **Flujo de Usuario:** El Gestor del SGCN planifica el programa anual de pruebas. Para cada ejercicio, crea un plan de prueba detallado.  
* **Características:**  
  * Un calendario para programar y visualizar todas las pruebas planificadas (p. ej., simulacros, ejercicios de mesa, pruebas funcionales).  
  * **Generador de Planes de Prueba:** Una plantilla guiada para definir los objetivos del ejercicio, el escenario, los participantes, el alcance, las métricas de éxito (p. ej., "Recuperar la aplicación X dentro de su RTO de 4 horas") y el cronograma.45

##### **7.2.2. Orquestación de Ejercicios en Vivo**

* **Flujo de Usuario:** Durante la ejecución de un ejercicio (p. ej., un ejercicio de mesa), el facilitador utiliza Fenix-SGCN para guiar el evento.  
* **Características:**  
  * Un "Modo Ejercicio" con un panel de control en tiempo real que muestra el cronograma, los pasos del escenario y un registro de eventos.  
  * El facilitador puede introducir "inyecciones" o eventos no planificados para probar la adaptabilidad del equipo.  
  * Los participantes pueden acceder a sus planes relevantes y registrar decisiones y acciones clave directamente en la plataforma.

##### **7.2.3. Puntuación Automatizada y Captura de Evidencias**

* **Flujo de Usuario:** A medida que los equipos ejecutan las tareas de un plan durante una prueba, marcan su finalización en la aplicación web o móvil.  
* **Características:**  
  * **Seguimiento del Tiempo:** El sistema registra automáticamente la hora de inicio y finalización de cada tarea y del plan en general.  
  * **Puntuación Automática:** Compara los tiempos de recuperación reales con los RTO definidos y asigna una puntuación de éxito (p. ej., Éxito, Éxito con observaciones, Fallo).  
  * **Captura de Evidencia Multimedia:** A través de la aplicación móvil, los participantes pueden cargar fotos, videos cortos o notas de voz como evidencia de que una tarea se completó (p. ej., una foto de un generador de respaldo en funcionamiento). Esto proporciona una prueba irrefutable para los auditores.46

##### **7.2.4. Informes Post-Ejercicio y Seguimiento de Acciones**

* **Flujo de Usuario:** Al finalizar el ejercicio, el facilitador finaliza la sesión en Fenix-SGCN.  
* **Características:**  
  * **Generación Automática de Informes:** El sistema genera un informe post-ejercicio que incluye los objetivos, el escenario, la cronología de eventos, los resultados de la puntuación, las observaciones registradas y las evidencias capturadas.  
  * **Identificación de Brechas:** El informe destaca las áreas donde no se cumplieron los objetivos o los RTO.  
  * **Integración con Mejora Continua:** Las brechas y recomendaciones identificadas pueden convertirse directamente en hallazgos en el Módulo 7, iniciando un flujo de trabajo de acción correctiva.

La automatización de las partes más tediosas de las pruebas (puntuación, generación de informes) es un enorme valor añadido que ahorra tiempo y estandariza la evaluación.46 La capacidad de capturar evidencia multimedia a través de una aplicación móvil es un diferenciador clave, ya que proporciona una prueba rica e innegable de la capacidad para los auditores y la dirección, moviendo las pruebas de un ejercicio teórico a una validación práctica y documentada.

### **Módulo 7: Mejora Continua (ISO 22301 Cl. 10\)**

#### **8.1. Objetivo y Alineación con ISO**

* **Objetivo:** Establecer un proceso sistemático para evaluar el desempeño del SGCN, abordar las no conformidades y mejorar continuamente su idoneidad, adecuación y eficacia.  
* **Alineación ISO:** Aborda directamente la Cláusula 10 (Mejora) y la Cláusula 9 (Evaluación del desempeño) de ISO 22301, cerrando el ciclo Planificar-Hacer-Verificar-Actuar (PDCA).42

#### **8.2. Especificaciones Funcionales**

##### **8.2.1. Registro Centralizado de Hallazgos**

* **Flujo de Usuario:** Los hallazgos (brechas, no conformidades, oportunidades de mejora) se registran en un único lugar, ya sea manualmente o generados automáticamente desde otros módulos.  
* **Características:**  
  * Un registro único que consolida los hallazgos de las pruebas de continuidad (Módulo 6), auditorías internas/externas, revisiones post-incidente y revisiones de la dirección.  
  * Cada hallazgo tiene un propietario, una fuente, una fecha de identificación, una descripción y un nivel de prioridad.

##### **8.2.2. Flujo de Trabajo de Acciones Correctivas y Preventivas (CAPA)**

* **Flujo de Usuario:** Para cada hallazgo que requiere acción, se inicia un flujo de trabajo CAPA. El propietario del hallazgo investiga la causa raíz y define un plan de acción correctiva.  
* **Características:**  
  * Un flujo de trabajo estructurado para la gestión de CAPA, desde la identificación hasta el cierre y la verificación de la eficacia.  
  * Asignación de tareas de remediación a usuarios específicos con fechas de vencimiento.  
  * Recordatorios automáticos y escaladas si las acciones no se completan a tiempo.  
  * Vinculación de los hallazgos a los elementos específicos del SGCN que afectan (p. ej., un plan, un riesgo, un proceso).

##### **8.2.3. Panel de Control para la Revisión por la Dirección**

* **Flujo de Usuario:** Antes de una reunión de revisión por la dirección, el Gestor del SGCN accede a un panel de control específico.  
* **Características:**  
  * Un panel de control que recopila y presenta automáticamente todas las entradas requeridas por la Cláusula 9.3 de ISO 22301\.  
  * Incluye métricas sobre el estado de las acciones correctivas, el rendimiento frente a los objetivos del SGCN, los resultados de las pruebas, los cambios en el panorama de riesgos y la retroalimentación de las partes interesadas.  
  * Capacidad para generar un paquete de informes exportable en .pdf para la reunión.

##### **8.2.4. Analítica de Rendimiento y KPIs**

* **Flujo de Usuario:** Los gerentes y administradores monitorean la salud general del SGCN a través de paneles de control analíticos.  
* **Características:**  
  * Indicadores Clave de Rendimiento (KPIs) visuales sobre la salud del SGCN, como el porcentaje de planes actualizados, el tiempo medio para cerrar acciones correctivas, la tasa de éxito de las pruebas y la cobertura del BIA.  
  * Gráficos de tendencias que muestran la mejora del programa a lo largo del tiempo.

Este módulo cierra el ciclo PDCA. Al centralizar todos los hallazgos y vincularlos a un proceso formal de CAPA, Fenix-SGCN asegura que las lecciones aprendidas se traduzcan en mejoras tangibles. El panel de control de la revisión por la dirección automatiza una de las tareas más laboriosas de la gestión de un SGCN, permitiendo a la dirección centrarse en la toma de decisiones estratégicas en lugar de en la recopilación de datos. Esto demuestra un SGCN maduro y eficaz que no solo cumple con la norma, sino que impulsa una verdadera cultura de resiliencia.

