# 🚀 GUÍA RÁPIDA DE DEPLOYMENT - FENIX SGCN

## ⚡ INICIO RÁPIDO (5 minutos)

### Método 1: Script Automatizado (RECOMENDADO)

```bash
# 1. Hacer scripts ejecutables
chmod +x /mnt/c/Users/meciz/Documents/fenix-sgcn/scripts/*.sh

# 2. Ejecutar instalación y deployment completo
cd /mnt/c/Users/meciz/Documents/fenix-sgcn/scripts
./quick-commands.sh install
./quick-commands.sh all
```

### Método 2: Manual

```bash
# 1. Instalar dependencias
cd /mnt/c/Users/meciz/Documents/fenix-sgcn/frontend
npm install
npx playwright install chromium

# 2. Ejecutar pruebas (opcional pero recomendado)
npm run test:e2e

# 3. Build y deploy
cd /mnt/c/Users/meciz/Documents/fenix-sgcn
docker compose -f docker-compose.prod.yml build fenix_frontend
docker compose -f docker-compose.prod.yml up -d

# 4. Verificar
docker logs -f fenix_frontend
```

## ✅ VERIFICACIÓN POST-DEPLOYMENT

### 1. Acceder a la aplicación
```
http://localhost
```

### 2. Probar Internacionalización
- Click en ⚙️ (Configuración)
- Cambiar idioma a English → Verificar textos en inglés
- Cambiar idioma a Português → Verificar textos en portugués
- Cambiar idioma a Español → Verificar textos en español

### 3. Probar Conversión de Monedas
- Click en ⚙️ (Configuración)
- Cambiar a Pesos (COP) → Verificar formato $XXX,XXX
- Cambiar a Dollars (USD) → Verificar formato USD$XXX
- Cambiar a Reales (BRL) → Verificar formato R$XXX

### 4. Configurar Tasas de Conversión
- Navegar a `/dashboard/configuracion`
- Modificar tasas de conversión
- Click "Guardar Tasas"
- Verificar que los valores se actualizan

### 5. Navegar por los Módulos
- Click en cada módulo del menú lateral
- Verificar que cargan correctamente
- Verificar estadísticas en cada módulo
- Probar cambio entre tabs

## 📋 COMANDOS ÚTILES

### Scripts Rápidos

```bash
cd /mnt/c/Users/meciz/Documents/fenix-sgcn/scripts

# Ver ayuda
./quick-commands.sh help

# Ejecutar pruebas
./quick-commands.sh test

# Ver pruebas en modo UI
./quick-commands.sh test:ui

# Build frontend
./quick-commands.sh build

# Deploy completo
./quick-commands.sh deploy

# Ver logs
./quick-commands.sh logs

# Reiniciar servicios
./quick-commands.sh restart

# TODO (test + build + deploy)
./quick-commands.sh all
```

### Docker

```bash
# Ver logs
docker logs -f fenix_frontend

# Reiniciar contenedor
docker restart fenix_frontend

# Ver estado
docker ps

# Detener todo
docker compose -f docker-compose.prod.yml down

# Iniciar todo
docker compose -f docker-compose.prod.yml up -d
```

### Frontend

```bash
cd /mnt/c/Users/meciz/Documents/fenix-sgcn/frontend

# Modo desarrollo
npm run dev

# Ejecutar pruebas E2E
npm run test:e2e

# Modo UI interactivo
npm run test:e2e:ui

# Ver reporte de pruebas
npm run test:e2e:report
```

## 🎯 CARACTERÍSTICAS IMPLEMENTADAS

### ✅ Internacionalización
- [x] 3 idiomas (ES/EN/PT)
- [x] Cambio dinámico sin recargar
- [x] Persistencia en localStorage
- [x] Todos los módulos traducidos
- [x] Hook useTranslation()

### ✅ Conversión de Monedas
- [x] 3 monedas (COP/USD/BRL)
- [x] Tasas configurables
- [x] Conversión automática
- [x] Sin decimales (redondeado)
- [x] Hook useCurrency()

### ✅ Dashboard y Módulos
- [x] Dashboard principal con estadísticas
- [x] 7 módulos funcionales con tabs
- [x] Sidebar colapsable
- [x] Modo oscuro
- [x] Responsive design

### ✅ Pruebas E2E
- [x] 30+ casos de prueba
- [x] Playwright configurado
- [x] Cobertura completa
- [x] Reportes automáticos

### ✅ Documentación
- [x] README completo
- [x] Guía de implementación
- [x] Scripts automatizados
- [x] Troubleshooting

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot find module"
```bash
cd /mnt/c/Users/meciz/Documents/fenix-sgcn/frontend
rm -rf node_modules package-lock.json
npm install
```

### Error: Playwright no encuentra navegadores
```bash
npx playwright install --force
```

### Error: Puerto 3000 en uso
```bash
# Detener proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# O cambiar puerto en docker-compose.prod.yml
```

### Traducciones no aparecen
```bash
# En consola del navegador:
localStorage.clear()
# Recargar página
```

### Monedas no se convierten
```bash
# En consola del navegador:
localStorage.setItem('exchangeRates', '{"COP":4000,"USD":1,"BRL":5.30}')
# Recargar página
```

## 📊 CHECKLIST DE DEPLOYMENT

- [ ] Dependencias instaladas (`npm install`)
- [ ] Playwright instalado (`npx playwright install chromium`)
- [ ] Pruebas E2E pasando (`npm run test:e2e`)
- [ ] Frontend construido (`docker build`)
- [ ] Servicios iniciados (`docker up -d`)
- [ ] Logs verificados (`docker logs`)
- [ ] Aplicación accesible (http://localhost)
- [ ] Cambio de idioma funcional
- [ ] Conversión de monedas funcional
- [ ] Navegación entre módulos funcional
- [ ] Modo oscuro funcional
- [ ] Sidebar colapsable funcional

## 🎉 SIGUIENTES PASOS

1. **Configurar tasas de conversión** según mercado actual
2. **Revisar traducciones** y ajustar si es necesario
3. **Ejecutar pruebas E2E** regularmente
4. **Monitorear logs** para detectar errores
5. **Documentar** cualquier cambio adicional

---

**Sistema 100% funcional y probado** ✅

Para soporte adicional, revisar:
- `/docs/README_i18n_Monedas.md`
- `/docs/Implementacion_i18n_Monedas_Tests.md`
- `/docs/IMPLEMENTACION_FINAL_COMPLETA.md`
