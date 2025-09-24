import { PrismaClient, CriticalityLevel, RiskCategory, Severity, ActionStatus, ActionCategory } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Solo crear datos si no existen ya
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('✅ Ya existen usuarios, omitiendo seed');
    return;
  }

  console.log('🌱 Base de datos vacía, creando datos iniciales...');

  // Crear Tenants
  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'Empresa Demo Tecnología',
      domain: 'demo-tech.fenix-sgcn.com',
      logo: '/logos/demo-tech.png',
      colors: { primary: '#4f46e5', secondary: '#10b981' },
    },
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'Empresa Demo Financiera',
      domain: 'demo-finance.fenix-sgcn.com',
      logo: '/logos/demo-finance.png',
      colors: { primary: '#0ea5e9', secondary: '#f59e0b' },
    },
  });

  console.log('✅ Tenants creados');

  // Crear Usuarios
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@demo-tech.com',
        password: hashedPassword,
        fullName: 'Carlos Rodríguez',
        position: 'Director de Continuidad',
        phone: '+57 300 123 4567',
        role: 'ADMIN',
        tenantId: tenant1.id,
      },
      {
        email: 'admin@demo-finance.com',
        password: hashedPassword,
        fullName: 'Ana Martínez',
        position: 'Gerente de Riesgos',
        phone: '+57 301 234 5678',
        role: 'ADMIN',
        tenantId: tenant2.id,
      },
    ],
  });

  console.log('✅ Usuarios creados');

  // Crear Procesos Críticos - Tenant 1
  const process1 = await prisma.businessProcess.create({
    data: {
      tenantId: tenant1.id,
      name: 'Desarrollo de Software',
      description: 'Proceso de desarrollo y mantenimiento de aplicaciones',
      criticalityLevel: CriticalityLevel.CRITICAL,
      department: 'IT',
      dependencies: ['Infraestructura TI', 'Gestión Proyectos'],
      responsiblePerson: 'Juan Pérez',
      raciResponsible: 'Juan Pérez',
      raciResponsibleEmail: 'juan.perez@demo-tech.com',
      raciAccountable: 'Carlos Rodríguez',
      raciAccountableEmail: 'admin@demo-tech.com',
    },
  });

  const process2 = await prisma.businessProcess.create({
    data: {
      tenantId: tenant1.id,
      name: 'Soporte Técnico',
      description: 'Atención y resolución de incidencias',
      criticalityLevel: CriticalityLevel.HIGH,
      department: 'Soporte',
      dependencies: ['Sistema CRM', 'Base Conocimientos'],
      responsiblePerson: 'María González',
    },
  });

  console.log('✅ Procesos críticos creados');

  // Crear BIA Assessments
  await prisma.biaAssessment.create({
    data: {
      tenantId: tenant1.id,
      processId: process1.id,
      rto: 4,
      rpo: 2,
      mtpd: 8,
      mbco: 95.0,
      financialImpact1h: 5000,
      financialImpact24h: 120000,
      financialImpact1w: 840000,
      operationalImpact: 'Alto',
      reputationImpact: 'Crítico',
      regulatoryImpact: 'Medio',
      priorityScore: 9.2,
    },
  });

  console.log('✅ BIA Assessments creados');

  // Crear Risk Assessments
  await prisma.riskAssessment.create({
    data: {
      tenantId: tenant1.id,
      processId: process1.id,
      name: 'Fallo en infraestructura cloud',
      description: 'Pérdida de disponibilidad de servicios cloud',
      category: RiskCategory.TECHNOLOGICAL,
      probabilityBefore: 3,
      impactBefore: 5,
      scoreBefore: 15,
      controls: ['Backup automático', 'Multi-región', 'Monitoreo 24/7'],
      probabilityAfter: 2,
      impactAfter: 3,
      scoreAfter: 6,
      resilienceScore: 7.5,
    },
  });

  console.log('✅ Risk Assessments creados');

  // Crear Continuity Strategies
  await prisma.continuityStrategy.create({
    data: {
      tenantId: tenant1.id,
      processId: process1.id,
      scenario: 'Caída total datacenter principal',
      description: 'Activación de datacenter secundario',
      type: 'RECOVERY',
      cost: 50000,
      effectiveness: 4,
      implementationTime: 2,
      costEffectivenessScore: 8.0,
      recommended: true,
    },
  });

  console.log('✅ Continuity Strategies creadas');

  // Crear Compliance Frameworks
  await prisma.complianceFramework.create({
    data: {
      tenantId: tenant1.id,
      name: 'ISO 22301:2019',
      version: '2019',
      description: 'Sistema de Gestión de Continuidad del Negocio',
      complianceLevel: 65.5,
      lastAssessment: new Date('2025-08-15'),
      nextAssessment: new Date('2026-02-15'),
      requirements: {
        total: 115,
        completed: 75,
        inProgress: 30,
        pending: 10,
      },
    },
  });

  console.log('✅ Compliance Frameworks creados');

  // Crear Corrective Actions
  await prisma.correctiveAction.create({
    data: {
      tenantId: tenant1.id,
      title: 'Actualizar plan de recuperación DR',
      description: 'El plan actual no incluye nuevos sistemas cloud',
      category: ActionCategory.AUDIT_FINDING,
      finding: 'Hallazgo en auditoría interna',
      severity: Severity.MAJOR,
      actionPlan: 'Revisar y actualizar DRP incluyendo servicios AWS',
      responsible: 'Juan Pérez',
      dueDate: new Date('2025-10-30'),
      status: ActionStatus.IN_PROGRESS,
    },
  });

  console.log('✅ Corrective Actions creadas');

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
