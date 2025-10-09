const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function queryUsers() {
  const users = await prisma.user.findMany({
    include: {
      tenant: true
    }
  });

  console.log('\n📋 USUARIOS EN LA BASE DE DATOS:\n');
  users.forEach((user, idx) => {
    console.log(`${idx + 1}. Email: ${user.email}`);
    console.log(`   Nombre: ${user.fullName || 'N/A'}`);
    console.log(`   Rol: ${user.role}`);
    console.log(`   Empresa: ${user.tenant.name}`);
    console.log(`   Dominio: ${user.tenant.domain}`);
    console.log(`   Plan: ${user.tenant.subscriptionPlan}`);
    console.log(`   Creado: ${user.createdAt}`);
    console.log('');
  });

  await prisma.$disconnect();
}

queryUsers().catch(console.error);
