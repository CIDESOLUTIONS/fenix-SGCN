# Plan de Implementación - Metodología ISO 31000 para Módulo 2 ARA

## Análisis del Documento Fuente

### Componentes Identificados (Metodología Genérica)

**1. Sistema de Criterios de Evaluación (ISO 31000)**
- Tabla de Probabilidad (5 niveles)
- Tabla de Impacto (5 niveles)  
- Matriz de Nivel de Riesgo (4 niveles: Crítico, Alto, Moderado, Bajo)

**2. Metodología de Controles**
- 5 Variables de Evaluación:
  * Tipo de Control (Preventivo/Detectivo/Correctivo)
  * Criterio de Aplicación (Siempre/Aleatoria)
  * Documentación (Sí/Parcial/No)
  * Efectividad (Efectivo/Requiere Mejoras/No Efectivo)
  * Automatización (Automático/Manual)
- Puntuación total: 0-100 pts
- Sistema de reducción por cuadrantes

**3. Estructura Detallada de Riesgo**
- ID único (ej: RC-001)
- Nombre descriptivo
- Categoría
- Descripción Causa→Evento→Consecuencia
- Procesos críticos afectados
- Riesgo Inherente (P×I)
- Controles con análisis de efectividad
- Riesgo Residual calculado

## ✅ Implementaciones Completadas - Sprint 1

### Backend
- Migración SQL aplicada
- Schema Prisma actualizado
- Modelo RiskControl creado
- Service con cálculo ISO 31000
- Controller con endpoints CRUD
- Módulo registrado en app.module.ts
- Prisma Client regenerado

### Frontend  
- Página de Criterios ISO 31000
- Documentación completa

## 🔄 Implementaciones Pendientes

### Sprint 2: Frontend - Formulario Ampliado
1. Formulario de riesgos con campos ISO 31000
2. Componente de gestión de controles
3. Cálculo automático de riesgo residual
4. Vista detallada de riesgo

**Estado:** Listo para build y pruebas

---

**NOTA IMPORTANTE:** Toda referencia a empresas específicas ha sido eliminada. El sistema es genérico y aplicable a cualquier organización.
