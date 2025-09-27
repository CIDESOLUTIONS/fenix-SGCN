import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedTestData() {
  console.log('🌱 Iniciando seed idempotente...');

  // 1. Tenant (UPSERT) - Usar MISMO ID que los tests
  const tenant = await prisma.tenant.upsert({
    where: { id: 'tenant_acme_corp' },
    update: {},
    create: {
      id: 'tenant_acme_corp',
      name: 'ACME Corporation',
      domain: 'acme-corp.com',
      subscriptionPlan: 'PROFESSIONAL',
      subscriptionStatus: 'ACTIVE',
    },
  });

  console.log(`✅ Tenant: ${tenant.name}`);

  // 2. Usuarios (UPSERT) - Usar MISMO email que tests
  const hash = await bcrypt.hash('Test123456!', 10);

  const ceo = await prisma.user.upsert({
    where: { email: 'ceo@acme-corp.com' },
    update: {},
    create: {
      id: 'user_ceo',
      email: 'ceo@acme-corp.com',
      fullName: 'Carlos Mendez',
      password: hash,
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  });

  const ciso = await prisma.user.upsert({
    where: { email: 'ciso@acme-corp.com' },
    update: {},
    create: {
      id: 'user_ciso',
      email: 'ciso@acme-corp.com',
      fullName: 'María García',
      password: hash,
      role: 'MANAGER',
      tenantId: tenant.id,
    },
  });

  console.log(`✅ Usuarios: ${ceo.fullName}, ${ciso.fullName}`);

  // 3. Proceso crítico
  const process = await prisma.businessProcess.upsert({
    where: { id: 'process_001' },
    update: {},
    create: {
      id: 'process_001',
      tenantId: tenant.id,
      name: 'Procesamiento de Pagos',
      description: 'Proceso crítico de pagos',
      criticalityLevel: 'HIGH',
      department: 'IT',
      dependencies: ['CRM', 'Payment Gateway'],
      responsiblePerson: ciso.fullName,
    },
  });

  console.log(`✅ Proceso: ${process.name}`);

  // 4. BIA
  const bia = await prisma.biaAssessment.upsert({
    where: { id: 'bia_001' },
    update: {},
    create: {
      id: 'bia_001',
      tenantId: tenant.id,
      processId: process.id,
      rto: 240,
      rpo: 60,
      mtpd: 480,
      financialImpact1h: 10000,
      financialImpact24h: 100000,
      financialImpact1w: 500000,
      operationalImpact: 'Alto impacto en ventas',
      reputationImpact: 'Pérdida de confianza del cliente',
      dependencyMap: {
        apps: ['CRM', 'Gateway'],
        vendors: ['Bank XYZ'],
      },
    },
  });

  console.log(`✅ BIA: RTO=${bia.rto}min`);

  // 5. Riesgo
  const risk = await prisma.riskAssessment.upsert({
    where: { id: 'risk_001' },
    update: {},
    create: {
      id: 'risk_001',
      tenantId: tenant.id,
      name: 'Falla del Gateway de Pagos',
      category: 'TECHNOLOGICAL',
      processId: process.id,
      probabilityBefore: 3,
      impactBefore: 4,
      scoreBefore: 12,
      description: 'Riesgo de falla en el gateway principal',
      controls: ['Redundancia', 'Monitoreo 24/7'],
    },
  });

  console.log(`✅ Riesgo: ${risk.name}`);

  // 6. Estrategia
  const strategy = await prisma.continuityStrategy.upsert({
    where: { id: 'strategy_001' },
    update: {},
    create: {
      id: 'strategy_001',
      tenantId: tenant.id,
      processId: process.id,
      scenario: 'Falla del gateway principal',
      type: 'RECOVERY',
      description: 'Activar gateway secundario',
      cost: 50000,
      effectiveness: 4,
      implementationTime: 2,
    },
  });

  console.log(`✅ Estrategia: ${strategy.scenario}`);

  // 7. Plan
  const plan = await prisma.continuityPlan.upsert({
    where: { id: 'plan_001' },
    update: {},
    create: {
      id: 'plan_001',
      tenantId: tenant.id,
      name: 'Plan DR Gateway Pagos',
      processId: process.id,
      type: 'DRP',
      content: {
        steps: [
          { order: 1, action: 'Notificar al equipo', responsible: ciso.id },
          { order: 2, action: 'Activar gateway secundario', responsible: ceo.id },
        ],
      },
      status: 'APPROVED',
    },
  });

  console.log(`✅ Plan: ${plan.name}`);

  // 8. Exercise
  const exercise = await prisma.exercise.upsert({
    where: { id: 'exercise_001' },
    update: {},
    create: {
      id: 'exercise_001',
      tenantId: tenant.id,
      name: 'Simulacro Gateway Pagos',
      type: 'TABLETOP',
      planId: plan.id,
      scheduledDate: new Date('2025-10-01'),
      facilitator: ciso.id,
      participants: [ceo.id, ciso.id],
      status: 'COMPLETED',
      result: 'SUCCESS_WITH_OBSERVATIONS',
      score: 85.5,
      actualStartTime: new Date('2025-09-20T10:00:00Z'),
      actualEndTime: new Date('2025-09-20T12:30:00Z'),
      actualDuration: 2.5,
      observations: 'El equipo respondió bien, pero la documentación estaba desactualizada',
    },
  });

  console.log(`✅ Exercise: ${exercise.name}`);

  // 9. Finding y CAPA
  const finding = await prisma.finding.upsert({
    where: { id: 'finding_001' },
    update: {},
    create: {
      id: 'finding_001',
      tenantId: tenant.id,
      title: 'Documentación desactualizada',
      description: 'El plan de DR contiene información obsoleta sobre el gateway',
      source: 'EXERCISE',
      severity: 'MINOR',
      category: 'DOCUMENTATION',
      status: 'ACTION_PLAN',
      identifiedBy: ciso.id,
    },
  });

  const capa = await prisma.correctiveAction.upsert({
    where: { id: 'capa_001' },
    update: {},
    create: {
      id: 'capa_001',
      tenantId: tenant.id,
      findingId: finding.id,
      title: 'Actualizar documentación DR',
      description: 'Actualizar el plan DR con la nueva arquitectura del gateway',
      category: 'EXERCISE_RESULT',
      severity: 'MINOR',
      actionPlan: 'Revisar y actualizar toda la documentación del gateway',
      responsible: ciso.fullName || 'CISO',
      assignedTo: ciso.id,
      dueDate: new Date('2025-10-15'),
      targetDate: new Date('2025-10-15'),
      status: 'OPEN',
    },
  });

  console.log(`✅ Finding + CAPA creados`);

  console.log('\n🎉 Seed completado (idempotente) - Datos listos para tests E2E\n');
  return { tenantId: tenant.id };
}

export async function cleanTestData() {
  console.log('🧹 Limpieza opcional (no ejecutar por defecto)');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedTestData()
    .then(() => {
      console.log('✅ Seed exitoso');
      process.exit(0);
    })
    .catch((e) => {
      console.error('❌ Error:', e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
