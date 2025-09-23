# 🌍 Sistema de Internacionalización y Conversión de Monedas - Fenix SGCN

## 📚 Tabla de Contenidos

1. [Características](#características)
2. [Instalación](#instalación)
3. [Uso del Sistema](#uso-del-sistema)
4. [Pruebas E2E](#pruebas-e2e)
5. [Configuración de Tasas](#configuración-de-tasas)
6. [Deployment](#deployment)

## ✨ Características

### 🌐 Internacionalización (i18n)
- **Idiomas soportados:** Español, English, Português
- **Cambio dinámico:** Sin necesidad de recargar la página
- **Persistencia:** Las preferencias se guardan automáticamente
- **Cobertura completa:** Todos los módulos traducidos

### 💱 Conversión de Monedas
- **Monedas soportadas:** COP, USD, BRL
- **Tasas configurables:** Ajustables desde el panel de administración
- **Formato automático:** Sin decimales, redondeado al entero
- **Actualización en tiempo real:** Cambios instantáneos en toda la app

### 🧪 Pruebas Automatizadas
- **Framework:** Playwright
- **Cobertura:** 30+ casos de prueba
- **Áreas cubiertas:** i18n, monedas, navegación, UI/UX, autenticación

## 📥 Instalación

### Opción 1: Script Automatizado

```bash
# Hacer ejecutable el script
chmod +x /mnt/c/Users/meciz/Documents/fenix-sgcn/scripts/test-and-deploy.sh

# Ejecutar
/mnt/c/Users/meciz/Documents/fenix-sgcn/scripts/test-and-deploy.sh
```

### Opción 2: Paso a Paso

```bash
# 1. Navegar al directorio del frontend
cd /mnt/c/Users/meciz/Documents/fenix-sgcn/frontend

# 2. Instalar dependencias
npm install

# 3. Instalar Playwright
npx playwright install chromium

# 4. Ejecutar pruebas (opcional)
npm run test:e2e

# 5. Build del proyecto
cd /mnt/c/Users/meciz/Documents/fenix-sgcn
docker compose -f docker-compose.prod.yml build fenix_frontend

# 6. Iniciar servicios
docker compose -f docker-compose.prod.yml up -d
```

## 🎯 Uso del Sistema

### Cambiar Idioma

1. Click en el ícono de configuración (⚙️) en el header
2. Seleccionar el idioma deseado:
   - 🇪🇸 Español
   - 🇺🇸 English
   - 🇧🇷 Português
3. El cambio se aplica inmediatamente

### Cambiar Moneda

1. Click en el ícono de configuración (⚙️) en el header
2. Seleccionar la moneda deseada:
   - 💵 Pesos (COP)
   - 💲 Dollars (USD)
   - 🇧🇷 Reales (BRL)
3. Todos los valores monetarios se actualizan automáticamente

### Usar Traducciones en Código

```typescript
import { useTranslation } from '@/lib/i18n/useTranslation';

function MiComponente() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.systemActive')}</p>
    </div>
  );
}
```

### Usar Conversión de Monedas en Código

```typescript
import { useCurrency } from '@/lib/i18n/useCurrency';

function MiComponente() {
  const { formatCurrency, convertAmount } = useCurrency();
  
  const precioUSD = 100;
  
  return (
    <div>
      <p>Precio: {formatCurrency(precioUSD)}</p>
      {/* Mostrará: $400,000 (COP) / USD$100 / R$530 (BRL) */}
    </div>
  );
}
```

## 🧪 Pruebas E2E

### Ejecutar Pruebas

```bash
cd /mnt/c/Users/meciz/Documents/fenix-sgcn/frontend

# Ejecutar todas las pruebas
npm run test:e2e

# Modo UI (interactivo)
npm run test:e2e:ui

# Ver reporte
npm run test:e2e:report
```

### Casos de Prueba Incluidos

✅ **Internacionalización:**
- Cambio a inglés
- Cambio a portugués
- Persistencia de preferencias

✅ **Conversión de Monedas:**
- Cambio a COP
- Cambio a USD
- Cambio a BRL
- Validación de formato

✅ **Navegación:**
- Acceso a todos los módulos
- Verificación de contenido
- Cambio entre tabs

✅ **Configuración:**
- Actualización de tasas
- Guardado de preferencias

✅ **UI/UX:**
- Modo oscuro
- Sidebar colapsable
- Responsive design

✅ **Autenticación:**
- Cierre de sesión
- Redirección

## ⚙️ Configuración de Tasas

### Acceder al Panel de Configuración

1. Navegar a `/dashboard/configuracion`
2. Buscar la sección "Tasas de Conversión"
3. Ajustar los valores:
   - **COP/USD:** Pesos colombianos por dólar (default: 4000)
   - **BRL/USD:** Reales brasileños por dólar (default: 5.30)
4. Click en "Guardar Tasas"

### Valores de Conversión

Los valores se convierten de USD a la moneda seleccionada:

```
Valor en COP = Valor en USD × Tasa COP
Valor en BRL = Valor en USD × Tasa BRL
```

**Ejemplo con valor de USD $100:**
- COP: $100 × 4000 = $400,000 (redondeado)
- USD: $100 × 1 = $100
- BRL: $100 × 5.30 = R$530 (redondeado)

**Nota:** Todos los valores se redondean al entero más cercano y se muestran sin decimales.

## 🚀 Deployment

### Verificar Deployment

```bash
# Ver logs del frontend
docker logs -f fenix_frontend

# Verificar estado de contenedores
docker ps

# Verificar que la app está corriendo
curl http://localhost:3000
```

### Troubleshooting

**Problema: Las traducciones no aparecen**
```bash
# Verificar que el contexto de preferencias está disponible
# Revisar browser console para errores
# Limpiar localStorage y recargar
```

**Problema: Las monedas no se convierten**
```bash
# Verificar tasas en localStorage
localStorage.getItem('exchangeRates')

# Restablecer a valores por defecto
localStorage.removeItem('exchangeRates')
```

**Problema: Pruebas E2E fallan**
```bash
# Asegurar que la app está corriendo
npm run dev

# Reinstalar Playwright
npx playwright install --force
```

## 📊 Estructura de Archivos

```
frontend/
├── lib/
│   └── i18n/
│       ├── translations.ts       # Diccionario de traducciones
│       ├── useTranslation.ts     # Hook de traducciones
│       └── useCurrency.ts        # Hook de conversión de monedas
├── e2e/
│   └── dashboard.spec.ts         # Pruebas E2E
├── app/
│   └── dashboard/
│       ├── page.tsx              # Dashboard con i18n
│       ├── configuracion/
│       │   └── page.tsx          # Panel de configuración de tasas
│       └── [otros módulos]/      # Todos con soporte i18n
└── playwright.config.ts          # Configuración de Playwright
```

## 🎨 Formato de Monedas

| Moneda | Símbolo | Ejemplo | Formato |
|--------|---------|---------|---------|
| COP | $ | $400,000 | Separador de miles |
| USD | USD$ | USD$100 | Sin separador |
| BRL | R$ | R$530 | Sin separador |

## 📝 Notas Importantes

1. **Persistencia:** Las preferencias se guardan en `localStorage`
2. **Sin decimales:** Todos los valores monetarios se redondean
3. **Tasas ajustables:** Solo desde el panel de administración
4. **Base USD:** Todas las conversiones parten de valores en USD
5. **Sincronización:** Los cambios de idioma/moneda son inmediatos

## 🆘 Soporte

Para problemas o preguntas:
1. Revisar la documentación en `/docs/Implementacion_i18n_Monedas_Tests.md`
2. Verificar logs del contenedor: `docker logs fenix_frontend`
3. Ejecutar pruebas E2E para diagnóstico: `npm run test:e2e`

---

**Sistema completamente funcional y probado** ✅
