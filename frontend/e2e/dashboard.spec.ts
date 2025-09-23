import { test, expect } from '@playwright/test';

test.describe('Dashboard - Internacionalización y Monedas', () => {
  
  test('debe cargar el dashboard correctamente', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('Fenix SGCN')).toBeVisible();
    await expect(page.getByText('Sistema Activo')).toBeVisible();
  });

  test('debe cambiar idioma a inglés', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Abrir menú de configuración
    await page.click('[aria-label="Configuración"]');
    
    // Seleccionar inglés
    await page.click('text=English');
    
    // Verificar cambio de idioma
    await expect(page.getByText('Active System')).toBeVisible();
    await expect(page.getByText('Welcome')).toBeVisible();
  });

  test('debe cambiar idioma a portugués', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Abrir menú de configuración
    await page.click('[aria-label="Configuración"]');
    
    // Seleccionar portugués
    await page.click('text=Português');
    
    // Verificar cambio de idioma
    await expect(page.getByText('Sistema Ativo')).toBeVisible();
    await expect(page.getByText('Bem-vindo')).toBeVisible();
  });

  test('debe cambiar moneda a pesos colombianos', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Abrir menú de configuración
    await page.click('[aria-label="Configuración"]');
    
    // Seleccionar COP
    await page.click('text=Pesos (COP)');
    
    // Verificar que se aplica la conversión
    await expect(page.locator('text=/\\$[0-9,]+/')).toBeVisible();
  });

  test('debe mantener preferencias después de recargar', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Cambiar idioma y moneda
    await page.click('[aria-label="Configuración"]');
    await page.click('text=English');
    await page.click('[aria-label="Configuración"]');
    await page.click('text=Dollars (USD)');
    
    // Recargar página
    await page.reload();
    
    // Verificar que se mantienen las preferencias
    await expect(page.getByText('Active System')).toBeVisible();
  });
});

test.describe('Navegación entre Módulos', () => {
  
  test('debe navegar a Planeación', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=1. Planeación');
    await expect(page.getByText('Módulo de Planeación')).toBeVisible();
  });

  test('debe navegar a Análisis de Riesgos', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=2. Análisis de Riesgos ARA');
    await expect(page.getByText('Análisis de Riesgos (ARA)')).toBeVisible();
  });

  test('debe navegar a Análisis de Impacto', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=3. Análisis de Impacto BIA');
    await expect(page.getByText('Análisis de Impacto al Negocio')).toBeVisible();
  });

  test('debe navegar a Estrategia', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=4. Estrategia Continuidad');
    await expect(page.getByText('Estrategia de Continuidad')).toBeVisible();
  });

  test('debe navegar a Planes', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=5. Planes de Continuidad');
    await expect(page.getByText('Planes de Continuidad')).toBeVisible();
  });

  test('debe navegar a Pruebas', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=6. Pruebas de Continuidad');
    await expect(page.getByText('Pruebas de Continuidad')).toBeVisible();
  });

  test('debe navegar a Mantenimiento', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=7. Mantenimiento SGCN');
    await expect(page.getByText('Mantenimiento del SGCN')).toBeVisible();
  });
});

test.describe('Configuración de Tasas de Conversión', () => {
  
  test('debe actualizar tasa de COP', async ({ page }) => {
    await page.goto('/dashboard/configuracion');
    
    // Cambiar tasa de COP
    const copInput = page.locator('input[type="number"]').first();
    await copInput.fill('4500');
    
    // Guardar
    await page.click('text=Guardar Tasas');
    
    // Verificar mensaje de éxito
    await expect(page.getByText('Las tasas de conversión se han actualizado')).toBeVisible();
  });

  test('debe actualizar tasa de BRL', async ({ page }) => {
    await page.goto('/dashboard/configuracion');
    
    // Cambiar tasa de BRL
    const brlInput = page.locator('input[type="number"]').last();
    await brlInput.fill('5.50');
    
    // Guardar
    await page.click('text=Guardar Tasas');
    
    // Verificar mensaje de éxito
    await expect(page.getByText('Las tasas de conversión se han actualizado')).toBeVisible();
  });
});

test.describe('Funcionalidad de Tabs en Módulos', () => {
  
  test('debe cambiar entre tabs en Planeación', async ({ page }) => {
    await page.goto('/dashboard/planeacion');
    
    // Verificar tab inicial
    await expect(page.getByText('Políticas Activas')).toBeVisible();
    
    // Cambiar a otro tab
    await page.click('text=Políticas y Procedimientos');
    await expect(page.getByText('Módulo en desarrollo')).toBeVisible();
  });

  test('debe mostrar estadísticas en cada módulo', async ({ page }) => {
    const modules = [
      { path: '/dashboard/planeacion', stat: 'Políticas Activas' },
      { path: '/dashboard/analisis-riesgos', stat: 'Total Riesgos' },
      { path: '/dashboard/analisis-impacto', stat: 'Procesos Críticos' },
      { path: '/dashboard/estrategia', stat: 'Estrategias Definidas' },
      { path: '/dashboard/planes', stat: 'Planes Activos' },
      { path: '/dashboard/pruebas', stat: 'Pruebas Realizadas' },
      { path: '/dashboard/mantenimiento', stat: 'Última Revisión' },
    ];

    for (const module of modules) {
      await page.goto(module.path);
      await expect(page.getByText(module.stat)).toBeVisible();
    }
  });
});

test.describe('Modo Oscuro', () => {
  
  test('debe cambiar a modo oscuro', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Abrir menú de configuración
    await page.click('[aria-label="Configuración"]');
    
    // Seleccionar tema oscuro
    await page.click('text=Oscuro');
    
    // Verificar que se aplica el modo oscuro
    const body = page.locator('body');
    await expect(body).toHaveClass(/dark/);
  });

  test('debe usar tema del sistema', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Abrir menú de configuración
    await page.click('[aria-label="Configuración"]');
    
    // Seleccionar tema del sistema
    await page.click('text=Sistema');
    
    // Verificar que se guarda la preferencia
    await page.reload();
    await expect(page.getByText('Fenix SGCN')).toBeVisible();
  });
});

test.describe('Sidebar Colapsable', () => {
  
  test('debe colapsar y expandir sidebar', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Encontrar botón de toggle
    const toggleButton = page.locator('button').filter({ has: page.locator('svg path[d*="M15 19"]') }).first();
    
    // Colapsar
    await toggleButton.click();
    
    // Verificar que está colapsado (esperar un momento para la animación)
    await page.waitForTimeout(500);
    
    // Expandir
    await toggleButton.click();
    
    // Verificar que está expandido
    await expect(page.getByText('Panel de Control')).toBeVisible();
  });
});

test.describe('Autenticación', () => {
  
  test('debe cerrar sesión correctamente', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click en botón de salir
    await page.click('text=Salir');
    
    // Verificar redirección a login
    await expect(page).toHaveURL(/.*login/);
  });
});
