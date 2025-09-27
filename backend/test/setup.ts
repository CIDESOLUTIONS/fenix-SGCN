// Setup global para tests E2E
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Limpieza después de todos los tests
afterAll(async () => {
  console.log('🧹 Limpiando después de pruebas E2E...');
  await prisma.$disconnect();
});

// Export para uso en tests
export { prisma };
