# REBUILD EN PROGRESO - PRÓXIMOS PASOS

## ⏳ ESTADO ACTUAL
El rebuild completo está en progreso. Esto puede tomar 8-10 minutos.

---

## 📊 MONITOREAR PROGRESO

Abrir una nueva terminal PowerShell y ejecutar:

```powershell
cd C:\Users\meciz\Documents\fenix-SGCN
.\monitor-build.ps1
```

O verificar manualmente:

```powershell
docker images | Select-String fenix
```

Las nuevas imágenes mostrarán una fecha/hora reciente.

---

## ✅ CUANDO EL BUILD TERMINE

### 1. Verificar que terminó exitosamente

```powershell
docker images | Select-String fenix
```

Deberías ver algo como:
```
fenix-sgcn-fenix_frontend   latest   [ID]   2 minutes ago   XXX MB
fenix-sgcn-fenix_backend    latest   [ID]   5 minutes ago   XXX MB
```

### 2. Iniciar los servicios

```powershell
cd C:\Users\meciz\Documents\fenix-SGCN
docker compose -f docker-compose.prod.yml up -d
```

### 3. Esperar que los servicios inicien (30 segundos)

```powershell
Start-Sleep -Seconds 30
docker compose -f docker-compose.prod.yml ps
```

Todos los servicios deben mostrar status "Up" y "(healthy)"

### 4. Verificar logs

```powershell
docker compose -f docker-compose.prod.yml logs -f fenix_frontend
```

Buscar la línea:
```
ready - started server on 0.0.0.0:3000
```

Presionar Ctrl+C para salir de los logs.

---

## 🌐 PROBAR EN EL NAVEGADOR

### CRÍTICO: Usar Modo Incógnito

**Chrome/Edge:**
1. Presionar: `Ctrl + Shift + N`
2. Ir a: `http://localhost`
3. Iniciar sesión

**Firefox:**
1. Presionar: `Ctrl + Shift + P`
2. Ir a: `http://localhost`
3. Iniciar sesión

### O Limpiar Caché del Navegador Actual

1. Abrir DevTools: `F12`
2. Click derecho en el botón de recargar
3. Seleccionar: "Vaciar caché y recargar de forma forzada"

---

## 🧪 PRUEBAS A REALIZAR

### Test 1: Copiar/Pegar Imágenes en Contexto
1. Ir a: **Planeación > Tab Contexto**
2. Click en "Crear Contexto" o "Editar" uno existente
3. Copiar una imagen cualquiera (Ctrl+C)
4. Click en el campo "Contenido del Contexto"
5. Pegar: `Ctrl+V`

✅ **Resultado esperado:** La imagen debe aparecer en el editor

### Test 2: Gestión de Documentos
1. Click en "Editar" en un contexto existente
2. Scroll hasta la sección "Documentos Adjuntos"

✅ **Resultado esperado:** 
- Si hay archivo, debe mostrarse con botón para eliminar
- Debe haber opción para subir/reemplazar PDF

### Test 3: Editar Análisis FODA
1. Ir a un contexto que tenga análisis FODA
2. Click en "Editar" en el FODA
3. Abrir consola del navegador: `F12` > Tab "Console"

✅ **Resultado esperado:**
- En consola debe aparecer: `Loading existing SWOT: {datos...}`
- Todos los campos deben estar llenos con los datos
- Fortalezas, Debilidades, Oportunidades, Amenazas deben mostrarse

---

## ❌ SI EL BUILD FALLA

Revisar los últimos mensajes de error:

```powershell
docker compose -f docker-compose.prod.yml build --no-cache 2>&1 | Select-Object -Last 50
```

Buscar líneas con:
- `ERROR`
- `Failed to compile`
- `exit code: 1`

Proporcionar el output completo para diagnóstico.

---

## 📞 SOPORTE

Si después de seguir todos estos pasos algún problema persiste:

1. Screenshot de la consola del navegador (F12)
2. Logs del frontend: `docker logs fenix_frontend_prod --tail 100`
3. Descripción específica de qué no funciona

---

## ⏰ TIEMPO ESTIMADO TOTAL

- ✅ Detener servicios: 1 segundo
- ✅ Limpiar caché: 10 segundos
- ✅ Limpiar archivos locales: 5 segundos
- ⏳ Rebuild completo: 8-10 minutos (EN PROGRESO)
- Iniciar servicios: 30 segundos
- Pruebas: 2-3 minutos

**Total: ~10-15 minutos desde el inicio**
