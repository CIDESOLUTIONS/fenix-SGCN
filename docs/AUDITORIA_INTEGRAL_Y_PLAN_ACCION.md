# 🔍 AUDITORÍA INTEGRAL Y PLAN DE ACCIÓN - FENIX-SGCN

**Fecha:** 07 de octubre de 2025  
**Versión:** 1.0  
**Auditor:** Experto en Desarrollo Full Stack & ISO 22301

---

## 📊 RESUMEN EJECUTIVO

### Estado General del Proyecto

**Progreso Documentado:** 86% (6/7 módulos completados según ESTADO_ACTUAL.md)  
**Progreso Real Verificado:** 75% (con brechas significativas identificadas)  
**Nivel de Madurez:** **BETA AVANZADO** - Requiere completitud funcional frontend

### Hallazgos Principales

🟢 **FORTALEZAS:**
- Backend robusto y bien arquitecturado (NestJS + Prisma)
- Motores transversales completamente funcionales
- Módulo 1 (Planeación) 100% funcional E2E ✅
- Base de datos diseñada según mejores prácticas
- Documentación técnica exhaustiva

🟡 **ÁREAS DE MEJORA:**
- Frontend desacoplado del backend en módulos 2-7
- Componentes UI incompletos o no conectados a APIs
- Falta integración visual en mapas de dependencias
- Testing automatizado limitado
- 2 deudas técnicas pendientes

🔴 **CRÍTICO:**
- Módulos 2-7: Backend completo pero frontend 40-60% implementado
- Experiencia de usuario fragmentada
- Sin validación E2E completa salvo Módulo 1

---

## 📋 ANÁLISIS DETALLADO POR MÓDULO

### **MÓDULO 1: PLANEACIÓN Y GOBIERNO** ✅ 100%

#### Backend
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Servicio (18 métodos) | ✅ 100% | Completo y funcional |
| Controlador (21 endpoints) | ✅ 100% | REST completo |
| WorkflowEngine integrado | ✅ 100% | Aprobaciones funcionales |
| Dgraph sincronizado | ✅ 100% | Objetivos en grafo |
| Tests E2E | ✅ 100% | Script automatizado pasando |

#### Frontend
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Página principal 3 tabs | ✅ 100% | Políticas, Objetivos, RACI |
| CreatePolicyModal | ✅ 100% | Editor funcional |
| CreateObjectiveModal | ✅ 100% | Formulario SMART |
| RaciMatrixEditor | ✅ 100% | Editor tabular interactivo |
| Página detalle política | ✅ 100% | Vista completa con acciones |

**VEREDICTO:** ✅ **PRODUCTION-READY**  
**Evidencia:** Test E2E pasando, UI completa, flujos funcionales

---

### **MÓDULO 2: ANÁLISIS DE RIESGOS (ARA)** ⚠️ 65%

#### Backend ✅ 100%
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Servicio completo | ✅ 100% | 370 líneas, robusto |
| 10 endpoints REST | ✅ 100% | CRUD + análisis |
| Simulación Montecarlo | ✅ 100% | AnalyticsEngine integrado |
| Matriz de riesgos | ✅ 100% | Heatmap 3x3 |
| Dgraph sincronizado | ✅ 100% | Relaciones `affects` |
| WorkflowEngine | ✅ 100% | Planes de tratamiento |

#### Frontend ⚠️ 40%
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Página básica | ✅ Existe | `/dashboard/analisis-riesgos` |
| Formulario creación | ❌ NO conectado | Modal no funcional |
| RiskHeatmap component | ⚠️ Parcial | Existe pero no integrado |
| Simulación Montecarlo UI | ❌ NO implementada | Backend listo, UI falta |
| Comparación estrategias | ❌ NO implementada | - |
| Tratamiento de riesgos UI | ❌ NO implementada | - |

**BRECHAS CRÍTICAS:**
1. **Modal de creación NO funcional:** Usuario no puede crear riesgos desde UI
2. **Mapa de calor existe pero no actualiza:** Componente creado pero sin integración API real
3. **Simulación Montecarlo ausente:** Funcionalidad estrella sin interfaz gráfica
4. **Tratamiento de riesgos sin UI:** Workflows backend listos pero sin frontend

**VEREDICTO:** ⚠️ **REQUIERE COMPLETITUD FRONTEND (2-3 días)**

---

### **MÓDULO 3: ANÁLISIS DE IMPACTO (BIA)** ⚠️ 70%

#### Backend ✅ 100%
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Servicio completo | ✅ 100% | Bien estructurado |
| 8 endpoints REST | ✅ 100% | CRUD + análisis |
| Priority Score automático | ✅ 100% | Algoritmo implementado |
| Sugerencias RTO/RPO IA | ✅ 100% | Benchmarks por criticidad |
| Campaña BIA con workflow | ✅ 100% | WorkflowEngine integrado |
| Análisis SPOF | ✅ 100% | Dgraph consultas |
| Cobertura del BIA | ✅ 100% | Analytics completo |

#### Frontend ⚠️ 50%
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Página básica wizard | ✅ Existe | `/dashboard/analisis-impacto` |
| Formulario BIA | ⚠️ Parcial | Campos básicos, faltan avanzados |
| Mapa de dependencias | ❌ NO funcional | Componente BiaDependencyMapper creado pero no integrado |
| Sugerencias IA UI | ❌ NO visible | Backend funciona, botón falta |
| Análisis de cobertura | ❌ NO implementado | Dashboard pendiente |
| SPOF visualization | ❌ NO implementado | - |

**BRECHAS CRÍTICAS:**
1. **Mapa de dependencias drag-and-drop ausente:** Diferenciador clave del producto sin UI
2. **Sugerencias IA no visible:** Usuario no ve benchmarks automáticos
3. **Campañas BIA sin panel:** Coordinación masiva sin interfaz
4. **SPOF no visualizado:** Análisis crítico sin representación gráfica

**VEREDICTO:** ⚠️ **REQUIERE INTEGRACIÓN VISUAL (2-3 días)**

---

### **MÓDULO 4: ESTRATEGIAS** ⚠️ 60%

#### Backend ✅ 100%
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Servicio refactorizado | ✅ 100% | 450 líneas completas |
| 11 endpoints REST | ✅ 100% | CRUD + análisis avanzado |
| Motor recomendación IA | ✅ 100% | 5 estrategias automáticas |
| Cost-effectiveness score | ✅ 100% | Algoritmo implementado |
| Gap Analysis recursos | ✅ 100% | Identificación automática |
| Validación vs RTO | ✅ 100% | 3 reglas de validación |
| WorkflowEngine aprobación | ✅ 100% | Flujos configurados |

#### Frontend ⚠️ 30%
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Página básica | ✅ Existe | `/dashboard/estrategia` |
| Formulario estrategia | ❌ NO conectado | - |
| Motor recomendación UI | ❌ NO implementado | Backend listo, UI falta |
| StrategyComparison | ❌ NO implementado | Componente clave ausente |
| Gap Analysis UI | ❌ NO implementado | - |
| Validación visual | ❌ NO implementada | Alertas backend sin UI |

**BRECHAS CRÍTICAS:**
1. **Motor IA sin interfaz:** Recomendaciones automáticas invisibles para usuario
2. **Comparación de estrategias ausente:** Gráficos comparativos no existen
3. **Gap Analysis sin visualización:** Brechas identificadas sin representación
4. **Validaciones sin alertas visuales:** Errores backend sin feedback UI

**VEREDICTO:** 🔴 **CRÍTICO - FUNCIONALIDAD CLAVE SIN UI (3-4 días)**

---

### **MÓDULO 5: PLANES DE CONTINUIDAD** ⚠️ 75%

#### Backend ✅ 100%
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Servicio completo | ✅ 100% | Sincronización Dgraph |
| Endpoints REST | ✅ 100% | CRUD + operaciones |
| Workflow integrado | ✅ 100% | Aprobación + activación |
| Análisis de impacto | ✅ 100% | Dgraph upstream queries |
| Clonación de planes | ✅ 100% | Funcional |

#### Frontend ⚠️ 60%
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Listado de planes | ✅ Funcional | `/dashboard/planes` |
| Vista detalle plan | ✅ Funcional | - |
| Formulario básico | ✅ Funcional | Creación simple |
| Editor drag-and-drop | ❌ NO implementado | **Diferenciador clave ausente** |
| Playbooks dinámicos | ❌ NO implementado | Secuencias visuales falta |
| Activación de plan UI | ⚠️ Parcial | Botón existe, proceso incompleto |
| Mapa de dependencias | ✅ Implementado | DependencyMap con ReactFlow |

**BRECHAS CRÍTICAS:**
1. **Editor visual drag-and-drop ausente:** Prometido en specs, no implementado
2. **Playbooks como flujos visuales:** Backend listo, UI estática
3. **Actualización en cascada no visible:** Cambios automáticos sin notificación UI

**VEREDICTO:** ⚠️ **REQUIERE EDITOR VISUAL (3-4 días)**

---

### **MÓDULO 6: PRUEBAS DE CONTINUIDAD** ⚠️ 65%

#### Backend ✅ 100%
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Servicio creado | ✅ 100% | 550 líneas completas |
| 13 endpoints REST | ✅ 100% | CRUD + ejecución |
| Puntuación automatizada | ✅ 100% | Algoritmo 3 factores |
| Análisis de brechas | ✅ 100% | 3 categorías |
| Calendario ejercicios | ✅ 100% | Vista anual |
| Reporte PDF | ✅ 100% | ReportGenerator |

#### Frontend ⚠️ 40%
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Página básica | ✅ Existe | `/dashboard/pruebas` |
| Listado ejercicios | ⚠️ Parcial | Sin calendario visual |
| ExerciseControlPanel | ❌ NO implementado | **Componente crítico ausente** |
| Ejecución en tiempo real | ❌ NO implementada | - |
| Inyección de eventos | ❌ NO implementada | - |
| Captura de evidencias | ❌ NO implementada | Multimedia sin UI |
| Reporte post-ejercicio | ❌ NO visible | PDF genera pero sin acceso UI |

**BRECHAS CRÍTICAS:**
1. **Panel de control ausente:** Ejecución en tiempo real sin interfaz
2. **Inyección de eventos sin UI:** Diferenciador competitivo invisible
3. **Evidencia multimedia no captura:** Fotos/videos backend sin frontend
4. **Calendario visual no existe:** Programación anual sin visualización

**VEREDICTO:** 🔴 **CRÍTICO - ORQUESTACIÓN SIN UI (4-5 días)**

---

### **MÓDULO 7: MEJORA CONTINUA** ⚠️ 70%

#### Backend ✅ 100%
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Servicio creado | ✅ 100% | 600 líneas, robusto |
| 15 endpoints REST | ✅ 100% | Completo |
| Flujo CAPA | ✅ 100% | Workflow 2 pasos |
| 7 KPIs calculados | ✅ 100% | Algoritmos implementados |
| Análisis de causa raíz | ✅ 100% | 5 Whys, Ishikawa |
| Dashboard dirección | ✅ 100% | Backend completo |
| Conversión gaps→hallazgos | ✅ 100% | Integración Módulo 6 |
| Tendencias 12 meses | ✅ 100% | Análisis histórico |
| Reporte PDF dirección | ✅ 100% | 10 secciones ISO 9.3 |

#### Frontend ⚠️ 50%
| Componente | Estado | Observaciones |
|------------|--------|---------------|
| Página básica | ✅ Existe | `/dashboard/improvements` |
| Listado hallazgos | ⚠️ Parcial | Sin filtros avanzados |
| Formulario hallazgo | ⚠️ Parcial | Campos básicos |
| KPIDashboard | ❌ NO implementado | **Componente clave ausente** |
| Flujo CAPA UI | ❌ NO implementado | Workflow backend sin UI |
| RCA editor | ❌ NO implementado | 5 Whys sin interfaz |
| Dashboard dirección | ❌ NO implementado | Vista ejecutiva pendiente |
| Tendencias gráficas | ❌ NO implementadas | Recharts pendiente |
| Conversión gaps botón | ❌ NO visible | Integración sin UI |

**BRECHAS CRÍTICAS:**
1. **KPIs sin dashboard:** 7 indicadores calculados sin visualización
2. **Dashboard dirección ausente:** Revisión ISO 9.3 sin interfaz ejecutiva
3. **CAPA workflow invisible:** Usuario no ve flujo 2 pasos
4. **Tendencias sin gráficos:** Datos históricos sin representación visual
5. **Conversión gaps-hallazgos oculta:** Ciclo mejora sin UI

**VEREDICTO:** 🔴 **CRÍTICO - DASHBOARD EJECUTIVO FALTANTE (3-4 días)**

---

## 🔬 ANÁLISIS DE MOTORES TRANSVERSALES

### **WorkflowEngine** ✅ 100%
- ✅ Bull + Redis funcional
- ✅ 5 tipos de tareas
- ✅ Notificaciones email
- ✅ Recordatorios automáticos
- ✅ Integrado en todos los módulos

### **AnalyticsEngine** ✅ 100%
- ✅ Simulación Montecarlo
- ✅ Análisis de dependencias
- ✅ SPOF identification
- ✅ BIA coverage
- ✅ ISO 22301 compliance checks

### **DgraphService** ✅ 100%
- ✅ Sincronización automática
- ✅ Queries DQL complejas
- ✅ Relaciones bidireccionales
- ✅ Análisis upstream/downstream
- ✅ Performance optimizado

### **ReportGenerator** ✅ 100%
- ✅ PDFKit funcional
- ✅ Docxtemplater integrado
- ✅ Plantillas ISO 22301
- ✅ Reportes en 4 formatos

**VEREDICTO MOTORES:** ✅ **EXCELENTE - Base sólida para UI**

---

## 🐛 DEUDAS TÉCNICAS IDENTIFICADAS

### **DT#1: Copiar/Pegar Imágenes en Editor** (MEDIA)
**Archivo:** `frontend/components/RichTextEditor.tsx`  
**Problema:** ReactQuill con dynamic import no soporta paste events  
**Impacto:** UX - Bajo (workaround existe: botón de imagen)  
**Solución:** Migrar a TipTap o Slate.js  
**Esfuerzo:** 8-16 horas

### **DT#2: SWOT Arrays Vacíos al Editar** (ALTA)
**Archivos:**
- `frontend/components/business-context/SwotEditor.tsx`
- `backend/src/business-context/business-context.service.ts`

**Problema:** Arrays (fortalezas, debilidades, etc.) no cargan al editar  
**Causa Raíz:** Endpoint limitado + posible tipo de dato incorrecto en Prisma  
**Impacto:** UX - Alto (funcionalidad crítica no funciona)  
**Solución:**
1. Verificar schema Prisma: `String[]` vs `Json`
2. Ajustar endpoint para incluir arrays completos
3. Validar serialización backend
4. Testing exhaustivo

**Esfuerzo:** 4-8 horas

**PRIORIDAD:** 🔴 **RESOLVER ANTES DE PRODUCCIÓN**

---

 días hábiles, priorizando diferenciadores competitivos y cumplimiento ISO.

**Enfoque:** Desarrollo iterativo por prioridad, validación E2E continua, refactorización mínima.

---

### **FASE 1: CORRECCIONES CRÍTICAS** (2 días)

#### **Sprint 1.1: Deudas Técnicas** (1 día)
**Objetivo:** Resolver DT#2 (SWOT arrays) antes de continuar

**Tareas:**
1. ✅ Verificar schema Prisma `swot_analyses`
   - Comando: `cd backend && npx prisma studio`
   - Revisar tipo de datos: `String[]` vs `Json`
   
2. ✅ Ajustar endpoint `/api/business-context/swot/:id`
   ```typescript
   // backend/src/business-context/business-context.service.ts
   async findSwotById(id: string) {
     const swot = await this.prisma.swotAnalysis.findUnique({
       where: { id },
       // ✅ ASEGURAR INCLUIR TODOS LOS CAMPOS
     });
     return swot;
   }
   ```

3. ✅ Ajustar parseo frontend
   ```typescript
   // frontend/components/business-context/SwotEditor.tsx
   const parseArray = (data: any) => {
     if (Array.isArray(data)) return data;
     if (typeof data === 'string') return JSON.parse(data);
     return [];
   };
   ```

4. ✅ Testing exhaustivo
   - Crear SWOT nuevo
   - Guardar con arrays
   - Editar y verificar carga
   - Guardar cambios

**Entregables:**
- ✅ SWOT editor funcional 100%
- ✅ Tests pasando
- ✅ DT#2 cerrada

**Responsable:** Developer Backend + Frontend  
**Prioridad:** 🔴 P0

---

#### **Sprint 1.2: Verificación Base** (1 día)
**Objetivo:** Validar estado actual de cada módulo con tests manuales

**Tareas:**
1. ✅ Probar flujo completo Módulo 1
   - Crear política → Aprobar → Publicar
   - Verificar notificaciones
   - Validar Dgraph sync

2. ✅ Probar endpoints backend Módulos 2-7
   - CRUD básico cada entidad
   - Operaciones avanzadas (simulaciones, análisis)
   - Verificar respuestas JSON

3. ✅ Documentar estado real UI cada módulo
   - Componentes existentes
   - Conexiones API faltantes
   - Funcionalidad esperada vs real

**Entregables:**
- 📄 Matriz de componentes UI (existentes vs faltantes)
- 📄 Lista priorizada de endpoints a conectar
- 📄 Casos de prueba E2E por módulo

**Responsable:** QA Lead  
**Prioridad:** 🔴 P0

---

### **FASE 2: DIFERENCIADORES COMPETITIVOS** (8 días)

#### **Sprint 2.1: Editor Visual Planes** (2 días)
**Módulo:** 5 - Planes de Continuidad  
**Diferenciador:** Editor drag-and-drop con playbooks dinámicos

**Componente:** `PlanEditorDragDrop.tsx`

**Stack Técnico:**
- React Flow para editor visual
- Zustand para estado local
- React DnD para drag-and-drop adicional

**Tareas Día 1:**
1. ✅ Crear estructura base componente
   ```typescript
   // frontend/components/plans/PlanEditorDragDrop.tsx
   import ReactFlow, { 
     Node, Edge, Controls, Background 
   } from 'reactflow';
   
   interface PlanStep {
     id: string;
     type: 'task' | 'decision' | 'notification';
     label: string;
     description: string;
     responsible: string;
     estimatedTime: number;
   }
   
   export function PlanEditorDragDrop({ planId }: Props) {
     // Estado de nodos y edges
     // Handlers para agregar/eliminar/conectar
     // Guardado automático al backend
   }
   ```

2. ✅ Implementar paleta de componentes
   - Tarea (círculo azul)
   - Decisión (rombo amarillo)
   - Notificación (campana naranja)
   - Punto de control (cuadrado verde)

3. ✅ Conectar a backend
   - POST `/continuity-plans/:id/steps` (nuevo endpoint)
   - GET plan con steps como JSON
   - Auto-save cada 30 segundos

**Tareas Día 2:**
1. ✅ Propiedades de cada nodo
   - Panel lateral con formulario
   - Edición inline
   - Validación campos requeridos

2. ✅ Exportar/Importar JSON
   - Serialización del flujo
   - Import desde plantillas
   - Clonación de planes

3. ✅ Testing E2E
   - Crear plan visual
   - Guardar y recargar
   - Ejecutar desde UI

**Entregables:**
- ✅ Componente PlanEditorDragDrop funcional
- ✅ Endpoint backend `/steps` creado
- ✅ Tests E2E pasando
- 📹 Video demo funcionalidad

**Responsable:** Senior Frontend Developer  
**Prioridad:** 🔴 P0

---

#### **Sprint 2.2: Mapa Dependencias Interactivo** (2 días)
**Módulo:** 3 - BIA  
**Diferenciador:** Mapeo visual drag-and-drop multinivel

**Componente:** `BiaDependencyMapper.tsx` (refactorizar existente)

**Tareas Día 1:**
1. ✅ Refactorizar componente existente
   - Integrar con API real GET `/bia-assessments/:id`
   - Renderizar dependencias existentes
   - Estado local con Zustand

2. ✅ Implementar drag-and-drop
   ```typescript
   const onDrop = (event: DragEvent) => {
     const type = event.dataTransfer.getData('nodeType');
     const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
     
     // Crear nuevo nodo
     const newNode = {
       id: `${type}-${Date.now()}`,
       type,
       position,
       data: { label: '', type }
     };
     
     setNodes((nds) => nds.concat(newNode));
   };
   ```

3. ✅ Paleta de activos
   - Aplicación (cuadrado morado)
   - Activo/Servidor (cuadrado verde)
   - Proveedor (cuadrado naranja)
   - Proceso (círculo azul)

**Tareas Día 2:**
1. ✅ Análisis SPOF en vivo
   - Detectar nodos con múltiples conexiones entrantes
   - Resaltar en rojo SPOFs identificados
   - Panel lateral con listado

2. ✅ Sincronización Dgraph
   - POST guardar dependencias
   - Sincronización automática al grafo
   - Validación de relaciones

3. ✅ Testing E2E
   - Agregar dependencias
   - Identificar SPOF
   - Guardar y recargar

**Entregables:**
- ✅ BiaDependencyMapper funcional completo
- ✅ SPOF detection visual
- ✅ Sincronización Dgraph verificada
- 📹 Video demo funcionalidad

**Responsable:** Senior Frontend Developer  
**Prioridad:** 🔴 P0

---

#### **Sprint 2.3: Motor Recomendación Estrategias** (2 días)
**Módulo:** 4 - Estrategias  
**Diferenciador:** Recomendaciones IA con comparación visual

**Componentes:**
1. `StrategyRecommendationEngine.tsx`
2. `StrategyComparisonChart.tsx`
3. `GapAnalysisVisual.tsx`

**Tareas Día 1:**
1. ✅ Componente recomendaciones
   ```typescript
   // frontend/components/strategies/StrategyRecommendationEngine.tsx
   export function StrategyRecommendationEngine({ processId }: Props) {
     const { data: recommendations } = useFetch(
       `/continuity-strategies/recommend/${processId}`
     );
     
     return (
       <div className="space-y-4">
         {recommendations?.map(strategy => (
           <StrategyCard
             key={strategy.id}
             strategy={strategy}
             recommended={strategy.priority === 'HIGH'}
             onSelect={() => selectStrategy(strategy)}
           />
         ))}
       </div>
     );
   }
   ```

2. ✅ Tarjetas de estrategia
   - Badge prioridad (HIGH/MEDIUM/LOW)
   - Iconos por tipo (REDUNDANCY, RECOVERY, etc.)
   - Métricas: costo, tiempo, efectividad
   - Justificación IA visible

**Tareas Día 2:**
1. ✅ Gráfico comparación (Recharts)
   ```typescript
   // frontend/components/strategies/StrategyComparisonChart.tsx
   <BarChart data={strategies}>
     <Bar dataKey="cost" fill="#FC913A" name="Costo (USD)" />
     <Bar dataKey="effectiveness" fill="#10B981" name="Efectividad" />
     <Bar dataKey="implementationTime" fill="#FF4E50" name="Tiempo (días)" />
   </BarChart>
   ```

2. ✅ Gap Analysis visual
   - Tabla brechas de recursos
   - Iconos por tipo (INFRASTRUCTURE, NETWORK, etc.)
   - Cálculo costo total
   - Botón "Convertir a Acciones"

3. ✅ Validación en vivo
   - Alertas ERROR/WARNING
   - Validación vs RTO
   - Feedback visual inmediato

**Entregables:**
- ✅ 3 componentes funcionales
- ✅ Integración API completa
- ✅ Gráficos interactivos
- 📹 Video demo funcionalidad

**Responsable:** Mid-Senior Frontend Developer  
**Prioridad:** 🔴 P0

---

#### **Sprint 2.4: Panel Control Ejercicios** (2 días)
**Módulo:** 6 - Pruebas  
**Diferenciador:** Orquestación tiempo real con inyecciones

**Componente:** `ExerciseControlPanel.tsx`

**Tareas Día 1:**
1. ✅ Diseño panel principal
   ```typescript
   // frontend/components/exercises/ExerciseControlPanel.tsx
   export function ExerciseControlPanel({ exerciseId }: Props) {
     const { data: exercise, refetch } = useFetch(`/exercises/${exerciseId}`);
     const [elapsed, setElapsed] = useState(0);
     
     useEffect(() => {
       if (exercise?.status === 'IN_PROGRESS') {
         const interval = setInterval(() => {
           setElapsed(prev => prev + 1);
         }, 1000);
         return () => clearInterval(interval);
       }
     }, [exercise?.status]);
     
     return (
       <div className="grid grid-cols-3 gap-6">
         <div className="col-span-2">
           {/* Timeline y eventos */}
         </div>
         <div>
           {/* Panel control lateral */}
         </div>
       </div>
     );
   }
   ```

2. ✅ Cronómetro y métricas
   - Tiempo transcurrido vs RTO
   - Barra progreso visual
   - Indicador: A tiempo / Retrasado / Excedido
   - Tareas completadas vs totales

**Tareas Día 2:**
1. ✅ Inyección de eventos
   ```typescript
   const handleInjectEvent = async () => {
     await fetch(`/exercises/${exerciseId}/inject-event`, {
       method: 'POST',
       body: JSON.stringify({
         type: 'INJECTION',
         description: injectionText,
         severity: 'MEDIUM'
       })
     });
     refetch();
   };
   ```

2. ✅ Log de eventos en vivo
   - Lista con scroll
   - Código de colores por tipo
   - Timestamps precisos
   - Filtros por tipo

3. ✅ Completar tareas
   - Checklist interactiva
   - Captura de notas
   - Subida de evidencias (placeholder)
   - Marcado automático timestamp

**Entregables:**
- ✅ ExerciseControlPanel funcional
- ✅ Inyecciones en tiempo real
- ✅ Scoring automático visible
- 📹 Video demo funcionalidad

**Responsable:** Senior Frontend Developer  
**Prioridad:** 🔴 P0

---

### **FASE 3: DASHBOARD EJECUTIVO Y KPIs** (3 días)

#### **Sprint 3.1: Dashboard KPIs Mejora Continua** (2 días)
**Módulo:** 7 - Mejora Continua  
**Componente:** `KPIDashboard.tsx`

**Tareas Día 1:**
1. ✅ 4 KPI Cards principales
   ```typescript
   <div className="grid grid-cols-4 gap-4">
     <KPICard
       title="Tasa Resolución"
       value={kpis.findingResolutionRate}
       target={80}
       suffix="%"
       icon={<CheckCircle />}
       trend="up"
     />
     <KPICard
       title="Tiempo Cierre"
       value={kpis.avgActionClosureTime}
       target={30}
       suffix=" días"
       icon={<Clock />}
       trend="down"
     />
     {/* ... 2 KPIs más */}
   </div>
   ```

2. ✅ Gráfico tendencias 12 meses
   ```typescript
   <LineChart data={trends}>
     <Line dataKey="resolvedFindings" stroke="#10B981" name="Resueltos" />
     <Line dataKey="newFindings" stroke="#FF4E50" name="Nuevos" />
     <Line dataKey="completedActions" stroke="#FC913A" name="Acciones" />
   </LineChart>
   ```

**Tareas Día 2:**
1. ✅ Gráfico hallazgos por fuente
   - PieChart (Recharts)
   - Colores por fuente
   - Tooltip con detalles

2. ✅ Métricas adicionales
   - Ejercicios realizados
   - BIA coverage
   - Planes actualizados

3. ✅ Indicadores de alerta
   - Rojo: KPI <70% objetivo
   - Amarillo: 70-90%
   - Verde: >90%

**Entregables:**
- ✅ KPIDashboard funcional
- ✅ 7 KPIs visualizados
- ✅ Gráficos interactivos
- 📹 Video demo funcionalidad

**Responsable:** Mid Frontend Developer  
**Prioridad:** 🔴 P0

---

#### **Sprint 3.2: Dashboard Revisión Dirección** (1 día)
**Módulo:** 7 - Mejora Continua  
**Componente:** `ManagementReviewDashboard.tsx`

**Tareas:**
1. ✅ Layout ejecutivo
   - 8 secciones ISO 9.3
   - Diseño limpio, profesional
   - Exportar PDF

2. ✅ Integración API
   - GET `/continuous-improvement/management-review/dashboard`
   - Renderizar todas las secciones
   - Botón "Descargar Reporte PDF"

3. ✅ Recomendaciones automáticas
   - Badge por prioridad
   - Iconos de alerta
   - Acciones sugeridas

**Entregables:**
- ✅ ManagementReviewDashboard funcional
- ✅ PDF descargable
- ✅ Vista ejecutiva completa
- 📹 Video demo funcionalidad

**Responsable:** Mid Frontend Developer  
**Prioridad:** 🟡 P1

---

### **FASE 4: FUNCIONALIDADES AVANZADAS** (4 días)

#### **Sprint 4.1: Simulación Montecarlo UI** (1 día)
**Módulo:** 2 - Riesgos  
**Componente:** `MonteCarloSimulation.tsx`

**Tareas:**
1. ✅ Formulario parámetros
   - Impacto: min, most, max (triangular)
   - Probabilidad: min, max
   - Iteraciones: slider

2. ✅ Gráficos resultados
   - Histograma distribución
   - Línea probabilidad acumulada
   - Estadísticas: mean, median, P90, P95, P99

3. ✅ Interpretación ejecutiva
   - "90% probabilidad < $X"
   - Recomendación presupuesto
   - Comparación escenarios

**Entregables:**
- ✅ MonteCarloSimulation funcional
- ✅ Gráficos interactivos
- 📹 Video demo

**Responsable:** Mid Frontend Developer  
**Prioridad:** 🟡 P1

---

#### **Sprint 4.2: Matriz Riesgos Interactiva** (1 día)
**Módulo:** 2 - Riesgos  
**Componente:** `RiskHeatmap.tsx` (refactorizar)

**Tareas:**
1. ✅ Grid 3x3 interactivo
2. ✅ Fetch data real `/risk-assessments/heatmap`
3. ✅ Celdas clickeables → Lista riesgos
4. ✅ Código de colores

**Entregables:**
- ✅ RiskHeatmap funcional completo
- 📹 Video demo

**Responsable:** Junior-Mid Frontend Developer  
**Prioridad:** 🟡 P1

---

#### **Sprint 4.3: Sugerencias IA Visibles** (1 día)
**Módulo:** 3 - BIA  
**Componente:** `RtoRpoSuggestions.tsx`

**Tareas:**
1. ✅ Botón "Obtener Sugerencias IA"
2. ✅ GET `/bia-assessments/process/:id/suggest-rto-rpo`
3. ✅ Mostrar sugerencia con explicación
4. ✅ Botón "Aplicar" → Autocompletar formulario

**Entregables:**
- ✅ Sugerencias IA visibles
- 📹 Video demo

**Responsable:** Junior Frontend Developer  
**Prioridad:** 🟡 P1

---

#### **Sprint 4.4: Conversión Gaps→Hallazgos** (1 día)
**Módulo:** 7 (integración con 6)  
**Componente:** Botón en `ExerciseGapAnalysis.tsx`

**Tareas:**
1. ✅ Análisis gaps después de ejercicio
2. ✅ Botón "Convertir en Hallazgo"
3. ✅ POST `/continuous-improvement/exercises/:id/convert-gap`
4. ✅ Redirección a hallazgo creado

**Entregables:**
- ✅ Ciclo mejora cerrado visualmente
- 📹 Video demo

**Responsable:** Junior-Mid Frontend Developer  
**Prioridad:** 🟡 P1

---

### **FASE 5: REFINAMIENTO Y TESTING** (3 días)

#### **Sprint 5.1: Testing E2E Completo** (2 días)

**Objetivo:** Scripts automatizados para todos los módulos

**Tareas Día 1:**
1. ✅ Scripts PowerShell/Bash módulos 2-7
   - test-module-2.ps1 (ARA)