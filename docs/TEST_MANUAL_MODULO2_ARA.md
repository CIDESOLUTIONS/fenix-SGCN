# Test Manual E2E - Módulo 2: Análisis de Riesgos

## ✅ FASE 1: INTEGRACIÓN CON PROCESOS DE PLANEACIÓN

### Test 1: Verificar procesos de continuidad
**Endpoint:** `GET /api/business-processes/continuity/selected`

**Pasos:**
1. Login en la aplicación
2. Ir a Módulo 1 - Planeación
3. Crear un proceso de negocio con:
   - Nombre: "Sistema de Pagos Online"
   - Tipo: MISIONAL
   - Incluir en análisis: SÍ
   - Criterios de priorización: Strategic=5, Operational=5, Financial=5, Regulatory=4

**Resultado esperado:**
- Proceso creado con priorityScore calculado automáticamente
- Proceso visible en selector del Módulo 2

---

### Test 2: Crear riesgo vinculado a proceso
**Endpoint:** `POST /api/risk-assessments`

**Pasos:**
1. Ir a Módulo 2 - Riesgos > Registro de Riesgos
2. Clic en "Nuevo Riesgo"
3. Seleccionar proceso "Sistema de Pagos Online"
4. Llenar formulario:
   - Nombre: "Fallo de Servidor de Pagos"
   - Descripción: "Caída del servidor principal de procesamiento de pagos"
   - Categoría: TECHNOLOGICAL
   - Probabilidad Inicial: 4
   - Impacto Inicial: 5
   - Controles: "Monitoreo 24/7, Servidor de respaldo en standby"
   - Probabilidad Residual: 2
   - Impacto Residual: 3
5. Clic en "Crear Riesgo"

**Resultado esperado:**
- Riesgo creado exitosamente
- Score inicial = 26 (4 × 5 × 1.3 para TECHNOLOGICAL)
- Score residual = 7.8 (2 × 3 × 1.3)
- Riesgo vinculado al proceso seleccionado
- Riesgo visible en tabla principal

---

## ✅ FASE 2: SIMULACIÓN MONTECARLO

### Test 3: Ejecutar simulación Montecarlo
**Endpoint:** `POST /api/risk-assessments/:id/monte-carlo`

**Pasos:**
1. En tabla de riesgos, ubicar el riesgo "Fallo de Servidor de Pagos"
2. Clic en botón "Montecarlo"
3. En modal de simulación, configurar:
   - Impacto Mínimo: 10,000,000 COP
   - Impacto Más Probable: 50,000,000 COP
   - Impacto Máximo: 200,000,000 COP
   - Probabilidad Mínima: 0.1
   - Probabilidad Máxima: 0.5
   - Iteraciones: 10,000
4. Clic en "Ejecutar Simulación Montecarlo"

**Resultado esperado:**
- Modal muestra spinner de carga
- Tras 2-5 segundos, aparecen resultados:
  
**Estadísticas:**
- Media: ~75,000,000 COP
- Mediana: ~68,000,000 COP
- Desviación Estándar: ~35,000,000 COP

**Percentiles:**
- P10: ~35,000,000 COP
- P50: ~68,000,000 COP
- P90: ~125,000,000 COP
- P95: ~145,000,000 COP
- P99: ~178,000,000 COP

**Distribución:**
- Gráfico de barras con rangos de impacto
- Porcentajes por rango mostrados visualmente

**Interpretación:**
- "Hay un 90% de probabilidad de que el impacto sea menor a $125,000,000"
- "El valor esperado (media) es $75,000,000"
- "En el peor escenario (P99), el impacto podría alcanzar $178,000,000"

---

## ✅ FASE 3: VISUALIZACIÓN EN MAPA DE CALOR

### Test 4: Verificar mapa de calor
**Endpoint:** `GET /api/risk-assessments/heatmap`

**Pasos:**
1. Ir a Módulo 2 - Riesgos > Matriz de Evaluación
2. Observar matriz 3×3

**Resultado esperado:**
- Matriz muestra 9 celdas (HIGH_HIGH, HIGH_MEDIUM, etc.)
- Riesgo "Fallo de Servidor de Pagos" aparece en celda correspondiente:
  - Probabilidad: 4 (HIGH)
  - Impacto: 5 (HIGH)
  - Ubicación: Celda HIGH_HIGH (roja)
- Contador muestra número de riesgos por celda
- Código de colores:
  - 🔴 Rojo: Crítico (HIGH_HIGH, HIGH_MEDIUM)
  - 🟠 Naranja: Alto (HIGH_LOW, MEDIUM_HIGH)
  - 🟡 Amarillo: Medio (MEDIUM_MEDIUM, MEDIUM_LOW, LOW_HIGH)
  - 🟢 Verde: Bajo (LOW_MEDIUM, LOW_LOW)

---

## ✅ FASE 4: PLAN DE TRATAMIENTO

### Test 5: Crear plan de tratamiento
**Endpoint:** `POST /api/risk-assessments/:id/treatment-plan`

**Pasos:**
1. Seleccionar riesgo "Fallo de Servidor de Pagos"
2. Clic en "Definir Tratamiento"
3. Seleccionar estrategia: MITIGAR
4. Asignar owner: usuario actual
5. Agregar acciones:
   - Acción 1: "Implementar sistema de respaldo redundante" - Asignar a admin@empresa.com - Vencimiento: 30 días
   - Acción 2: "Configurar failover automático" - Asignar a devops@empresa.com - Vencimiento: 45 días
   - Acción 3: "Realizar prueba de recuperación" - Asignar a qa@empresa.com - Vencimiento: 60 días
6. Clic en "Crear Plan de Tratamiento"

**Resultado esperado:**
- Plan creado exitosamente
- Workflow generado automáticamente
- Notificaciones enviadas a asignados
- Recordatorios programados
- Tareas visibles en Módulo 7 - Mejora Continua
- Estado del riesgo actualizado a "En Tratamiento"

---

## ✅ FASE 5: RIESGOS CRÍTICOS

### Test 6: Dashboard de riesgos críticos
**Endpoint:** `GET /api/risk-assessments/critical`

**Pasos:**
1. Ir a Módulo 2 - Riesgos > Dashboard Resiliencia
2. Observar sección "Riesgos Críticos"

**Resultado esperado:**
- Lista de riesgos con score ≥ 15
- Para cada riesgo crítico:
  - Nombre del riesgo
  - Categoría
  - Score
  - Procesos afectados (desde Dgraph)
  - Impacto downstream
- Recomendaciones de priorización
- Botones de acción rápida (Ver, Montecarlo, Tratamiento)

---

## ✅ FASE 6: ACTUALIZACIÓN Y ELIMINACIÓN

### Test 7: Actualizar riesgo
**Endpoint:** `PATCH /api/risk-assessments/:id`

**Pasos:**
1. Seleccionar riesgo
2. Editar:
   - Cambiar Probabilidad Inicial de 4 a 5
   - Cambiar Impacto Inicial de 5 a 5
3. Guardar cambios

**Resultado esperado:**
- Score recalculado automáticamente: 5 × 5 × 1.3 = 32.5
- Posición en mapa de calor actualizada si cambió nivel
- Sincronización con Dgraph

### Test 8: Eliminar riesgo
**Endpoint:** `DELETE /api/risk-assessments/:id`

**Pasos:**
1. Seleccionar riesgo de prueba
2. Clic en "Eliminar"
3. Confirmar eliminación

**Resultado esperado:**
- Riesgo eliminado de PostgreSQL
- Nodo eliminado de Dgraph
- Relaciones eliminadas
- Riesgo desaparece de todas las vistas
- Workflow de tratamiento cancelado

---

## 📊 RESUMEN DE VALIDACIÓN

### Criterios de Éxito:
- ✅ Procesos de continuidad correctamente filtrados
- ✅ Creación de riesgos con cálculo de score ponderado
- ✅ Simulación Montecarlo ejecutándose correctamente
- ✅ Mapa de calor mostrando distribución correcta
- ✅ Plan de tratamiento creando workflows
- ✅ Dashboard de riesgos críticos funcional
- ✅ Actualización recalculando scores
- ✅ Eliminación limpiando todas las referencias

### Métricas de Rendimiento:
- Simulación Montecarlo (10,000 iteraciones): < 5 segundos
- Carga de mapa de calor: < 1 segundo
- Creación de riesgo: < 500ms
- API response time promedio: < 200ms

---

## 🔗 INTEGRACIÓN CON OTROS MÓDULOS

### Validar:
1. **Módulo 1 (Planeación):** Procesos creados alimentan selector de riesgos
2. **Módulo 3 (BIA):** Riesgos vinculados a procesos críticos del BIA
3. **Módulo 7 (Mejora):** Acciones de tratamiento visibles en CAPA
4. **Dgraph:** Consultas de impacto downstream funcionando
5. **Motor de Workflows:** Notificaciones y tareas ejecutándose

---

## ✅ CHECKLIST FINAL

- [ ] Test 1: Procesos de continuidad
- [ ] Test 2: Crear riesgo
- [ ] Test 3: Simulación Montecarlo
- [ ] Test 4: Mapa de calor
- [ ] Test 5: Plan de tratamiento
- [ ] Test 6: Riesgos críticos
- [ ] Test 7: Actualizar riesgo
- [ ] Test 8: Eliminar riesgo
- [ ] Integración Módulo 1
- [ ] Integración Módulo 3
- [ ] Integración Módulo 7
- [ ] Sincronización Dgraph
- [ ] Workflows automáticos
- [ ] Rendimiento < 200ms

---

**Estado:** Listo para pruebas manuales
**Próximo paso:** Ejecutar checklist completo y documentar resultados
