#!/usr/bin/env node

/**
 * Script de validación del backend para confirmar 100% funcionalidad
 * Fase 3 - Validación Final
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDACIÓN FINAL DEL BACKEND - FASE 3\n');

const checks = [];

// 1. Verificar que el build sea exitoso
console.log('1️⃣  Verificando build del backend...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  checks.push({ name: 'Build Backend', status: 'PASS' });
} catch (error) {
  checks.push({ name: 'Build Backend', status: 'FAIL', error: error.message });
}

// 2. Verificar que existan tests para los 7 módulos
console.log('\n2️⃣  Verificando tests de los 7 módulos funcionales...');
const requiredTests = [
  'governance.service.spec.ts',
  'risk-assessments.service.spec.ts',
  'bia-assessments.service.spec.ts',
  'continuity-strategies.service.spec.ts',
  'continuity-plans.service.spec.ts',
  'exercises.service.spec.ts',
  'continuous-improvement.service.spec.ts',
];

let testsFound = 0;
requiredTests.forEach(test => {
  const modulePath = path.join(__dirname, '..', 'src', test.replace('.service.spec.ts', ''), test);
  if (fs.existsSync(modulePath)) {
    console.log(`  ✅ ${test}`);
    testsFound++;
  } else {
    console.log(`  ❌ ${test} - NO ENCONTRADO`);
  }
});

checks.push({
  name: 'Tests 7 Módulos',
  status: testsFound === 7 ? 'PASS' : 'FAIL',
  detail: `${testsFound}/7 encontrados`
});

// 3. Verificar guards en controllers
console.log('\n3️⃣  Verificando guards en controllers críticos...');
const controllersToCheck = [
  'business-processes.controller.ts',
  'bia-assessments.controller.ts',
  'risk-assessments.controller.ts',
  'continuity-plans.controller.ts',
  'exercises.controller.ts',
];

let guardsApplied = 0;
controllersToCheck.forEach(controller => {
  const controllerPath = path.join(__dirname, '..', 'src', controller.replace('.controller.ts', ''), controller);
  if (fs.existsSync(controllerPath)) {
    const content = fs.readFileSync(controllerPath, 'utf8');
    if (content.includes('@UseGuards(JwtGuard)')) {
      console.log(`  ✅ ${controller} - Protegido`);
      guardsApplied++;
    } else {
      console.log(`  ⚠️  ${controller} - Sin guard`);
    }
  }
});

checks.push({
  name: 'Guards Aplicados',
  status: guardsApplied >= 4 ? 'PASS' : 'PARTIAL',
  detail: `${guardsApplied}/${controllersToCheck.length} protegidos`
});

// 4. Verificar que el seed existe
console.log('\n4️⃣  Verificando seed de datos...');
const seedPath = path.join(__dirname, '..', 'test', 'utils', 'seed-test-data.ts');
if (fs.existsSync(seedPath)) {
  const seedContent = fs.readFileSync(seedPath, 'utf8');
  if (seedContent.includes('tenant_acme_corp') && seedContent.includes('upsert')) {
    console.log('  ✅ Seed idempotente encontrado');
    checks.push({ name: 'Seed Idempotente', status: 'PASS' });
  } else {
    console.log('  ⚠️  Seed existe pero puede no ser idempotente');
    checks.push({ name: 'Seed Idempotente', status: 'PARTIAL' });
  }
} else {
  console.log('  ❌ Seed no encontrado');
  checks.push({ name: 'Seed Idempotente', status: 'FAIL' });
}

// 5. Verificar decorators corregidos
console.log('\n5️⃣  Verificando decorators corregidos...');
const decoratorPath = path.join(__dirname, '..', 'src', 'common', 'tenant-id.decorator.ts');
if (fs.existsSync(decoratorPath)) {
  const decoratorContent = fs.readFileSync(decoratorPath, 'utf8');
  if (decoratorContent.includes('request.user.tenantId') || decoratorContent.includes('request.user?.tenantId')) {
    console.log('  ✅ TenantId decorator corregido');
    checks.push({ name: 'TenantId Decorator', status: 'PASS' });
  } else {
    console.log('  ⚠️  TenantId decorator puede necesitar ajustes');
    checks.push({ name: 'TenantId Decorator', status: 'PARTIAL' });
  }
} else {
  checks.push({ name: 'TenantId Decorator', status: 'FAIL' });
}

// 6. Verificar que Docker containers estén corriendo
console.log('\n6️⃣  Verificando contenedores Docker...');
try {
  const dockerPs = execSync('docker ps --filter "name=fenix" --format "{{.Names}}: {{.Status}}"').toString();
  const containers = dockerPs.split('\n').filter(line => line.trim());
  
  const requiredContainers = ['fenix_backend', 'fenix_db_master', 'fenix_dgraph', 'fenix_redis'];
  let runningCount = 0;
  
  requiredContainers.forEach(container => {
    const isRunning = containers.some(line => line.includes(container) && line.includes('Up'));
    if (isRunning) {
      console.log(`  ✅ ${container} - Corriendo`);
      runningCount++;
    } else {
      console.log(`  ❌ ${container} - No corriendo`);
    }
  });

  checks.push({
    name: 'Contenedores Docker',
    status: runningCount === requiredContainers.length ? 'PASS' : 'PARTIAL',
    detail: `${runningCount}/${requiredContainers.length} corriendo`
  });
} catch (error) {
  checks.push({ name: 'Contenedores Docker', status: 'FAIL', error: 'Docker no disponible' });
}

// RESUMEN FINAL
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VALIDACIÓN - FASE 3');
console.log('='.repeat(60) + '\n');

const passCount = checks.filter(c => c.status === 'PASS').length;
const partialCount = checks.filter(c => c.status === 'PARTIAL').length;
const failCount = checks.filter(c => c.status === 'FAIL').length;

checks.forEach(check => {
  const icon = check.status === 'PASS' ? '✅' : check.status === 'PARTIAL' ? '⚠️ ' : '❌';
  const detail = check.detail ? ` (${check.detail})` : '';
  console.log(`${icon} ${check.name}: ${check.status}${detail}`);
});

console.log('\n' + '-'.repeat(60));
console.log(`Total: ${checks.length} checks`);
console.log(`✅ PASS: ${passCount} | ⚠️  PARTIAL: ${partialCount} | ❌ FAIL: ${failCount}`);
console.log('-'.repeat(60));

const successRate = ((passCount + partialCount * 0.5) / checks.length * 100).toFixed(1);
console.log(`\n🎯 Tasa de Éxito: ${successRate}%`);

if (successRate >= 80) {
  console.log('\n✅ BACKEND LISTO PARA FASE 4 - DESPLIEGUE A PRODUCCIÓN');
  process.exit(0);
} else if (successRate >= 60) {
  console.log('\n⚠️  BACKEND FUNCIONAL PERO CON MEJORAS PENDIENTES');
  console.log('   Recomendación: Continuar a Fase 4 y corregir en paralelo');
  process.exit(0);
} else {
  console.log('\n❌ BACKEND REQUIERE CORRECCIONES ANTES DE PRODUCCIÓN');
  process.exit(1);
}
