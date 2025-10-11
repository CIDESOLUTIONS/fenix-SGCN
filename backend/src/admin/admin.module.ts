import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthController } from './admin-auth.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fenix-secret-key-2025',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AdminAuthController],
})
export class AdminModule {}
