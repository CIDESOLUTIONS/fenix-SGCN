# 🌐 GUÍA DE VERIFICACIÓN - MÓDULO 1 EN NAVEGADOR

## 🎯 OBJETIVO
Verificar que el Módulo 1: Planeación y Gobierno funciona correctamente en el navegador.

---

## 📋 PASOS DE VERIFICACIÓN

### **1. Acceder a la Aplicación**
```
URL: http://localhost/auth/login
```

### **2. Iniciar Sesión**
```
Email: test@example.com
Password: Test123!@#
```

### **3. Navegar al Módulo 1**
Después del login, serás redirigido al dashboard.
```
Clic en: Sidebar → "1. Planning" 
O navegar directamente a: http://localhost/dashboard/planeacion
```

---

## ✅ CHECKLIST DE FUNCIONALIDADES

### **Tab 1: Políticas del SGCN**

#### ✅ Visualización
- [ ] Se muestra el tab "Políticas del SGCN"
- [ ] Aparece la política creada en las pruebas E2E
- [ ] Título: "Politica de Continuidad de Negocio - Test"
- [ ] Badge de estado visible (Borrador/En Revisión/Aprobado/Activo)
- [ ] Fecha de creación visible

#### ✅ Crear Nueva Política
- [ ] Clic en botón "Nueva Política"
- [ ] Se abre modal con formulario
- [ ] Campos visibles:
  - Título de la Política
  - Versión (prellenado con 1.0)
  - Contenido (textarea grande)
  - Plantilla sugerida ISO 22301
- [ ] Rellenar formulario:
  ```
  Título: Mi Política de Prueba
  Contenido: [Cualquier texto]
  ```
- [ ] Clic en "Crear Política"
- [ ] Modal se cierra
- [ ] Nueva política aparece en el listado

#### ✅ Ver Detalle de Política
- [ ] Clic en "Ver Detalles →" de cualquier política
- [ ] Redirige a: `/dashboard/planeacion/policies/[id]`
- [ ] Se muestra:
  - Título completo
  - Versión
  - Fecha de creación
  - Estado (badge de color)
  - Contenido completo
  - Sección de "Acciones"
- [ ] Si está en DRAFT: Botón "Enviar a Revisión" visible
- [ ] Botón "Volver a Políticas" funciona

---

### **Tab 2: Objetivos SMART**

#### ✅ Visualización
- [ ] Clic en tab "Objetivos SMART"
- [ ] Se muestra el objetivo creado en pruebas E2E
- [ ] Card con:
  - Descripción del objetivo
  - Barra de progreso (0% si es nuevo)
  - Responsable (owner)
  - Fecha objetivo

#### ✅ Crear Nuevo Objetivo
- [ ] Clic en botón "+ Nuevo Objetivo"
- [ ] Modal se abre
- [ ] Cuadro informativo "Objetivos SMART" visible
- [ ] Campos visibles:
  - Descripción del Objetivo
  - Criterios de Medición
  - Fecha Objetivo
  - Responsable
- [ ] Rellenar formulario:
  ```
  Descripción: Mejorar tiempo de respuesta a incidentes
  Criterios: Reducir de 6h a 4h en promedio
  Fecha: 2025-12-31
  Responsable: Gerente de Operaciones
  ```
- [ ] Clic en "Crear Objetivo"
- [ ] Modal se cierra
- [ ] Nuevo objetivo aparece en la grilla

---

### **Tab 3: Matriz RACI**

#### ✅ Visualización
- [ ] Clic en tab "Matriz RACI"
- [ ] Se muestra editor de matriz
- [ ] Cuadro informativo con definiciones R/A/C/I visible

#### ✅ Crear Matriz RACI
- [ ] Campo "Proceso o Actividad" visible
- [ ] Tabla con columnas:
  - Rol
  - Responsabilidad
  - Tipo RACI
  - Acción
- [ ] Una fila por defecto visible
- [ ] Rellenar primera fila:
  ```
  Rol: CIO
  Responsabilidad: Aprobar planes de continuidad
  Tipo RACI: Accountable
  ```
- [ ] Clic en "+ Agregar Fila"
- [ ] Nueva fila aparece
- [ ] Rellenar segunda fila:
  ```
  Rol: Gerente de TI
  Responsabilidad: Ejecutar planes
  Tipo RACI: Responsible
  ```
- [ ] Clic en "Guardar Matriz"
- [ ] Mensaje de éxito
- [ ] Sección "Matrices Guardadas" aparece abajo con la matriz creada

---

## 🎨 ELEMENTOS VISUALES A VERIFICAR

### **Diseño General**
- [ ] Sidebar izquierdo con logo Fenix visible
- [ ] Header superior con:
  - Logo CIDE SAS
  - Nombre de empresa
  - Icono de alertas
  - Menú de configuración (engranaje)
  - Nombre de usuario
  - Botón de logout
- [ ] Tabs tienen indicador activo (línea azul índigo abajo)
- [ ] Colores consistentes (azul índigo y verde esmeralda)
- [ ] Modo claro/oscuro funcional

### **Estados de UI**
- [ ] Loading spinners aparecen al cargar datos
- [ ] Empty states informativos cuando no hay datos
- [ ] Mensajes de error en rojo si algo falla
- [ ] Badges de estado con colores apropiados:
  - Gris: Borrador
  - Amarillo: En Revisión
  - Verde: Aprobado
  - Azul: Activo

---

## 🐛 PROBLEMAS COMUNES Y SOLUCIONES

### **"No puedo ver datos"**
✅ Solución: Ejecutar script de prueba primero
```powershell
cd C:\Users\meciz\Documents\fenix-SGCN
powershell -ExecutionPolicy Bypass -File test-module-1.ps1
```

### **"Error 401 Unauthorized"**
✅ Solución: Volver a hacer login
```
Logout → Login con test@example.com
```

### **"Modal no se abre"**
✅ Solución: Verificar que el frontend esté corriendo
```powershell
docker ps | Select-String "fenix_frontend"
```

### **"Datos no se guardan"**
✅ Solución: Verificar logs del backend
```powershell
docker logs fenix_backend_prod --tail 20
```

---

## 📸 CAPTURAS ESPERADAS

### **Vista Principal - Tab Políticas**
```
+----------------------------------------------------------+
|  [Logo]  Empresa Test                    [🔔] [⚙️] [👤] |
+----------------------------------------------------------+
| [Fenix]                                                  |
| SGCN                                                     |
|                                                          |
| 🏠 Panel de Control                                      |
| 📋 1. Planning      ← (seleccionado)                    |
| ⚠️ 2. Risk Analysis                                     |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  Planeación y Gobierno                                  |
|  ISO 22301 Cláusula 5: Liderazgo y Compromiso          |
|                                                          |
|  [Políticas] [Objetivos SMART] [Matriz RACI]           |
|  ─────────────────────────────────────────              |
|                                                          |
|  Gestión de Políticas               [Nueva Política]    |
|                                                          |
|  ┌────────────────────────────────────────────┐        |
|  │ Política de Continuidad de Negocio - Test  │        |
|  │ Versión 1.0  •  Creado: 30/09/2025 [DRAFT]│        |
|  │                            [Ver Detalles →]│        |
|  └────────────────────────────────────────────┘        |
|                                                          |
+----------------------------------------------------------+
```

---

## ✅ RESULTADO ESPERADO

Si todos los checkboxes están marcados:
```
✅ MÓDULO 1 VERIFICADO Y FUNCIONAL
```

Si hay problemas:
```
⚠️ Documentar el error específico y continuar con el siguiente módulo
```

---

## 📞 SOPORTE

Si encuentras algún problema durante la verificación:
1. Captura pantalla del error
2. Copia logs del navegador (F12 → Console)
3. Copia logs del backend:
   ```powershell
   docker logs fenix_backend_prod --tail 50
   ```

---

**Próximo Paso:** Una vez verificado, continuar con Módulo 2: Análisis de Riesgos (ARA)
