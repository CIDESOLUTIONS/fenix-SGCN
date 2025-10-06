# DEUDAS TÉCNICAS - Fenix-SGCN

## 🔴 DEUDA TÉCNICA #1: Copiar/Pegar Imágenes en Editor de Contexto

### Descripción del Problema
El componente RichTextEditor (basado en ReactQuill) no permite pegar imágenes desde el clipboard usando Ctrl+V.

### Causa Raíz
- ReactQuill con Next.js dynamic import tiene conflictos con el manejo de refs
- Los event listeners de paste no se pueden registrar correctamente debido a la carga dinámica del componente
- El tipo TypeScript de ReactQuill no acepta ni `ref` ni `forwardedRef` con dynamic imports

### Intentos de Solución Fallidos
1. **useEffect con dependencia en ref.current** - No dispara correctamente
2. **forwardedRef directo** - Error de TypeScript: Property 'forwardedRef' does not exist
3. **Wrapper component con forwarding** - Error de compilación en build

### Solución Temporal (Workaround)
- El botón de imagen en la toolbar funciona correctamente
- Los usuarios pueden insertar imágenes haciendo click en el ícono de imagen

### Solución Propuesta para el Futuro
**Opción A: Cambiar a otro editor**
- TipTap (más moderno, mejor soporte TypeScript)
- Slate.js (más control, pero más complejo)
- Draft.js (de Facebook, robusto)

**Opción B: Upgrade de ReactQuill**
- Actualizar a versión más reciente
- Revisar compatibilidad con Next.js 14+

**Opción C: Editor nativo HTML5**
- contentEditable con manejo manual de paste events
- Mayor control pero más desarrollo

### Impacto
- **Severidad**: Media
- **Impacto UX**: Bajo (hay workaround funcional)
- **Prioridad**: Baja

### Referencias
- Archivos afectados: `frontend/components/RichTextEditor.tsx`
- Issues relacionados: ReactQuill #XXX (por documentar)

---

## 🔴 DEUDA TÉCNICA #2: SWOT No Carga Arrays al Editar

### Descripción del Problema
Al editar un Análisis FODA existente, los campos de arrays (Fortalezas, Debilidades, Oportunidades, Amenazas) aparecen vacíos aunque existen datos en la base de datos.

### Causa Raíz Identificada
El endpoint `/api/business-context/contexts` retorna datos limitados del SWOT:
```typescript
swotAnalyses: {
  select: {
    id: true,
    title: true,
    status: true,
    analysisDate: true,
    // ❌ NO incluye: strengths, weaknesses, opportunities, threats
  }
}
```

### Solución Implementada (Parcial)
1. ✅ Creada función `loadFullSwotData()` que llama a `/api/business-context/swot/${id}`
2. ✅ Agregado parseo robusto de arrays (maneja JSON strings)
3. ✅ onClick actualizado para cargar datos completos

### Problema Persistente
Después de implementar la solución, los arrays aún llegan vacíos. Posibles causas:
- **Prisma Schema**: Los campos pueden estar mal definidos (JSON vs Array)
- **Serialización Backend**: Arrays podrían no estar serializándose correctamente
- **Transformación de datos**: Puede haber un pipe o interceptor modificando la respuesta

### Debugging Necesario
```javascript
// En consola del navegador (F12)
fetch('/api/business-context/swot/[ID]', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})
.then(r => r.json())
.then(data => {
  console.log('Raw SWOT data:', data);
  console.log('Strengths type:', typeof data.strengths);
  console.log('Strengths value:', data.strengths);
});
```

### Verificación Backend Necesaria
1. Revisar el schema de Prisma para `swotAnalysis`:
   ```prisma
   model SwotAnalysis {
     strengths     String[]  // ¿Debería ser Json?
     weaknesses    String[]
     opportunities String[]
     threats       String[]
   }
   ```

2. Verificar el service en backend:
   ```typescript
   // backend/src/business-context/business-context.service.ts
   async findSwotById(id: string) {
     const swot = await this.prisma.swotAnalysis.findUnique({
       where: { id }
     });
     console.log('SWOT from DB:', swot); // Agregar log
     return swot;
   }
   ```

3. Revisar si hay transformación en el controller

### Solución Propuesta
1. **Verificar tipo de datos en BD**:
   ```sql
   SELECT 
     id, 
     title, 
     pg_typeof(strengths) as strengths_type,
     strengths::text as strengths_value
   FROM swot_analyses 
   LIMIT 1;
   ```

2. **Si son JSONB en Postgres**: Ajustar Prisma schema a `Json` y parsear en frontend
3. **Si son Arrays**: Verificar que Prisma los mapea correctamente

### Impacto
- **Severidad**: Alta
- **Impacto UX**: Alto (funcionalidad crítica no funciona)
- **Prioridad**: Alta

### Archivos Afectados
- `frontend/components/business-context/SwotEditor.tsx`
- `frontend/app/dashboard/planeacion/page.tsx`
- `backend/src/business-context/business-context.service.ts`
- `backend/prisma/schema.prisma`

### Next Steps
1. [ ] Ejecutar query SQL para verificar tipo de datos
2. [ ] Agregar logs en backend para ver datos crudos
3. [ ] Revisar schema de Prisma
4. [ ] Ajustar serialización si es necesario
5. [ ] Testing exhaustivo

---

## 📊 Resumen de Deudas Técnicas

| # | Descripción | Severidad | Prioridad | Estimación |
|---|-------------|-----------|-----------|------------|
| 1 | Copiar/Pegar imágenes en editor | Media | Baja | 8-16h |
| 2 | SWOT arrays vacíos al editar | Alta | Alta | 4-8h |

**Total estimado**: 12-24 horas de desarrollo

---

## 🔧 Plan de Acción Inmediato

### Para Deuda #2 (Prioritaria)
**Paso 1**: Diagnóstico (30 min)
```bash
# Conectar a la BD
docker exec -it fenix_db_master_prod psql -U fenix -d fenix_sgcn

# Verificar estructura
\d swot_analyses

# Ver datos reales
SELECT id, title, strengths FROM swot_analyses LIMIT 1;
```

**Paso 2**: Fix Backend (1-2h)
- Ajustar schema si es necesario
- Agregar logs
- Verificar serialización

**Paso 3**: Fix Frontend (30min)
- Ajustar parseo según tipo real de datos
- Testing

### Para Deuda #1 (Futura)
- Planificar migración a TipTap o Slate
- Spike técnico: 4h
- Implementación: 8-12h

---

Fecha: 2025-10-03
Autor: Equipo Desarrollo Fenix-SGCN
