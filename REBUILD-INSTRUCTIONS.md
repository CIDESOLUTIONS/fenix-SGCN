# INSTRUCCIONES PARA REBUILD COMPLETO Y LIMPIEZA DE CACHÉ

## PROBLEMA DETECTADO
✅ Todos los archivos fuente tienen las correcciones aplicadas
❌ El navegador está usando versiones en caché
❌ O el build de Docker no refleja los cambios

## SOLUCIÓN: REBUILD COMPLETO CON LIMPIEZA TOTAL

### OPCIÓN 1: Usar Script Automático (RECOMENDADO)

```powershell
cd C:\Users\meciz\Documents\fenix-SGCN
.\full-rebuild.ps1
```

Esto hará:
1. Detener servicios
2. Limpiar caché de Docker
3. Eliminar builds antiguos
4. Rebuild completo
5. Iniciar servicios

**Tiempo estimado: 8-10 minutos**

---

### OPCIÓN 2: Manual Paso a Paso

#### Paso 1: Detener todo
```bash
cd C:\Users\meciz\Documents\fenix-SGCN
docker compose -f docker-compose.prod.yml down -v
```

#### Paso 2: Limpiar Docker completamente
```bash
docker system prune -af --volumes
docker rmi fenix-sgcn-fenix_frontend fenix-sgcn-fenix_backend
```

#### Paso 3: Limpiar archivos locales
```powershell
Remove-Item -Recurse -Force frontend\.next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force frontend\node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force backend\dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force backend\node_modules\.cache -ErrorAction SilentlyContinue
```

#### Paso 4: Rebuild sin caché
```bash
docker compose -f docker-compose.prod.yml build --no-cache --pull
```

#### Paso 5: Iniciar servicios
```bash
docker compose -f docker-compose.prod.yml up -d
```

#### Paso 6: Verificar logs
```bash
docker compose -f docker-compose.prod.yml logs -f fenix_frontend
```

---

### PASO CRÍTICO: LIMPIAR CACHÉ DEL NAVEGADOR

Después del rebuild, **DEBE** hacer uno de estos:

**Opción A: Modo Incógnito (RECOMENDADO)**
- Chrome/Edge: Ctrl + Shift + N
- Firefox: Ctrl + Shift + P

**Opción B: Forzar recarga sin caché**
- Presione: Ctrl + Shift + R
- O: Ctrl + F5

**Opción C: Limpiar caché manualmente**
1. F12 para abrir DevTools
2. Click derecho en el botón de recarga
3. Seleccionar "Vaciar caché y recargar de forma forzada"

---

## VERIFICACIÓN POST-REBUILD

### 1. Verificar que el frontend inició correctamente
```bash
docker logs fenix_frontend_prod --tail 50
```

Debe mostrar: `ready - started server on 0.0.0.0:3000`

### 2. Abrir navegador en modo incógnito
```
http://localhost
```

### 3. Probar las 3 funcionalidades:

#### A) Copiar/Pegar Imágenes en Contexto
1. Ir a Planeación > Tab Contexto
2. Copiar una imagen (Ctrl+C)
3. Click en el campo "Contenido"
4. Pegar (Ctrl+V)
5. ✅ La imagen debe aparecer en el editor

#### B) Documentos en Edición
1. Click en "Editar" en un contexto existente
2. ✅ Debe mostrar sección "Documentos Adjuntos"
3. ✅ Si hay archivo, debe mostrar el nombre con botón para eliminar
4. ✅ Debe haber opción para subir nuevo PDF

#### C) Editar SWOT
1. Click en "Editar" en un análisis FODA existente
2. Abrir consola del navegador (F12)
3. ✅ Debe mostrar: "Loading existing SWOT: {datos...}"
4. ✅ Los campos deben estar llenos con los datos

---

## TROUBLESHOOTING

### Si después del rebuild los problemas persisten:

1. **Verificar que el build terminó exitosamente:**
```bash
docker images | grep fenix
```
Debe mostrar imágenes recientes (hace minutos)

2. **Verificar que no hay errores en el frontend:**
```bash
docker logs fenix_frontend_prod | grep -i error
```

3. **Verificar versión del código en el contenedor:**
```bash
docker exec fenix_frontend_prod cat /app/.next/BUILD_ID
```

4. **Forzar recreación completa:**
```bash
docker compose -f docker-compose.prod.yml up -d --force-recreate
```

5. **Verificar en consola del navegador (F12):**
- Tab "Console": Debe mostrar logs de debug
- Tab "Network": Verificar que no hay errores 404
- Tab "Application" > "Clear storage" > "Clear site data"

---

## CONFIRMACIÓN FINAL

Después de seguir TODOS los pasos, los 3 problemas deben estar resueltos:

✅ **Problema 1:** Copiar/pegar imágenes funciona
✅ **Problema 2:** Documentos se muestran y se pueden eliminar/subir
✅ **Problema 3:** SWOT carga datos correctamente al editar

Si algún problema persiste después de esto, proporcionar:
- Screenshot de la consola del navegador (F12)
- Logs del contenedor: `docker logs fenix_frontend_prod --tail 100`
