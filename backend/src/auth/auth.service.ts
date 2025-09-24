import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, SigninDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // Calcular fechas de suscripción
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días
    const gracePeriodEndsAt = new Date(trialEndsAt.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 días más

    const newUser = await this.prisma.$transaction(async (tx) => {
      // Crear tenant con período de prueba
      const tenant = await tx.tenant.create({
        data: {
          name: dto.tenantName,
          domain: `${dto.tenantName.toLowerCase().replace(/\s/g, '-')}.fenix-sgcn.com`,
          subscriptionPlan: 'TRIAL',
          subscriptionStatus: 'ACTIVE',
          trialEndsAt,
          gracePeriodEndsAt,
        },
      });

      // Crear usuario administrador
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          fullName: dto.fullName,
          position: dto.position,
          phone: dto.phone,
          role: 'ADMIN',
          tenantId: tenant.id,
        },
      });

      // Registrar en audit log
      await tx.auditLog.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          action: 'CREATE',
          entity: 'Tenant',
          entityId: tenant.id,
          details: {
            plan: 'TRIAL',
            trialDays: 30,
            gracePeriodDays: 30,
          },
        },
      });

      return { user, tenant };
    });

    const { password, ...userWithoutPassword } = newUser.user;
    return {
      user: userWithoutPassword,
      tenant: {
        id: newUser.tenant.id,
        name: newUser.tenant.name,
        plan: newUser.tenant.subscriptionPlan,
        trialEndsAt: newUser.tenant.trialEndsAt,
      },
    };
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { tenant: true },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    // Verificar estado de suscripción
    const now = new Date();
    if (user.tenant.subscriptionStatus === 'DELETED') {
      throw new ForbiddenException('Tenant has been deleted');
    }

    if (user.tenant.gracePeriodEndsAt && now > user.tenant.gracePeriodEndsAt) {
      throw new ForbiddenException('Subscription expired. Please contact support.');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new ForbiddenException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET'),
    });

    // Registrar login en audit log
    await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
      },
    });

    return { 
      accessToken,
      tenant: {
        subscriptionStatus: user.tenant.subscriptionStatus,
        subscriptionPlan: user.tenant.subscriptionPlan,
        trialEndsAt: user.tenant.trialEndsAt,
        subscriptionEndsAt: user.tenant.subscriptionEndsAt,
      },
    };
  }

  // NUEVO: Método para obtener datos del usuario actual
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        position: true,
        role: true,
        tenant: {
          select: {
            name: true,
            subscriptionPlan: true,
            subscriptionStatus: true,
          }
        }
      }
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    return user;
  }
}