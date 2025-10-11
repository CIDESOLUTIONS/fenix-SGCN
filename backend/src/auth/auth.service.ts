import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, SigninDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { FenixAdminClientService } from '../fenix-admin-client/fenix-admin-client.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
    private fenixAdminClient: FenixAdminClientService,
  ) {}

  async signup(dto: SignupDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const now = new Date();
    // Solo aplicar trial si el plan es TRIAL
    const subscriptionPlan = (dto.subscriptionPlan?.toUpperCase() || 'TRIAL') as SubscriptionPlan;
    const isTrial = subscriptionPlan === 'TRIAL';
    const trialEndsAt = isTrial ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) : null;
    const gracePeriodEndsAt = isTrial && trialEndsAt ? new Date(trialEndsAt.getTime() + 30 * 24 * 60 * 60 * 1000) : null;

    const newUser = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: dto.tenantName,
          domain: `${dto.tenantName.toLowerCase().replace(/\s/g, '-')}.fenix-sgcn.com`,
          subscriptionPlan: subscriptionPlan as SubscriptionPlan,
          subscriptionStatus: (isTrial ? 'ACTIVE' : 'EXPIRED') as SubscriptionStatus,
          trialEndsAt,
          gracePeriodEndsAt,
        },
      });

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

      await tx.auditLog.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          action: 'CREATE',
          entity: 'Tenant',
          entityId: tenant.id,
          details: {
            plan: subscriptionPlan,
            trialDays: isTrial ? 30 : 0,
            gracePeriodDays: isTrial ? 30 : 0,
          },
        },
      });

      return { user, tenant };
    });

    // Registrar tenant en fenix-admin
    try {
      const adminResponse = await this.fenixAdminClient.registerTenant({
        id: newUser.tenant.id,
        companyName: newUser.tenant.name,
        contactEmail: newUser.user.email,
        contactName: newUser.user.fullName,
        subscriptionPlan: newUser.tenant.subscriptionPlan
      });

      // Guardar licencia recibida
      if (adminResponse.license) {
        await this.prisma.tenant.update({
          where: { id: newUser.tenant.id },
          data: {
            licenseKey: adminResponse.license.licenseKey
          }
        });
      }

      console.log('✅ Tenant registrado en fenix-admin con licencia:', adminResponse.license?.licenseKey);
    } catch (error) {
      console.error('⚠️ Error registrando en fenix-admin (no crítico):', error.message);
      // No bloquear el registro si falla la comunicación con admin
    }

    const { password, ...userWithoutPassword } = newUser.user;
    
    // Generar JWT token
    const payload = {
      sub: newUser.user.id,
      email: newUser.user.email,
      tenantId: newUser.tenant.id,
      role: 'ADMIN',
    };
    
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRES_IN') || '7d',
      secret: this.config.get('JWT_SECRET'),
    });
    
    return {
      token,
      userId: newUser.user.id,
      tenantId: newUser.tenant.id,
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

  // ========== RECUPERACIÓN DE CONTRASEÑA ==========

  async sendPasswordResetOTP(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Por seguridad, no revelar si el email existe
      return { message: 'Si el email existe, recibirás un código OTP' };
    }

    // Generar OTP de 6 dígitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Guardar OTP en base de datos
    await this.prisma.passwordReset.upsert({
      where: { email },
      create: {
        email,
        otp,
        expiresAt,
      },
      update: {
        otp,
        expiresAt,
        used: false,
      },
    });

    // Enviar email con OTP
    await this.mailService.sendPasswordResetOTP(email, otp);

    return { message: 'Si el email existe, recibirás un código OTP' };
  }

  async verifyOTP(email: string, otp: string) {
    const reset = await this.prisma.passwordReset.findUnique({
      where: { email },
    });

    if (!reset || reset.used || reset.expiresAt < new Date() || reset.otp !== otp) {
      throw new ForbiddenException('Código OTP inválido o expirado');
    }

    return { valid: true, message: 'OTP válido' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const reset = await this.prisma.passwordReset.findUnique({
      where: { email },
    });

    if (!reset || reset.used || reset.expiresAt < new Date() || reset.otp !== otp) {
      throw new ForbiddenException('Código OTP inválido o expirado');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordReset.update({
        where: { email },
        data: { used: true },
      }),
    ]);

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
