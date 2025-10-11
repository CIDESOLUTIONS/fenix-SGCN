import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    // Credenciales hardcodeadas del super admin
    const SUPER_ADMIN_EMAIL = 'admin@fenix-sgcn.com';
    const SUPER_ADMIN_PASSWORD = 'FenixAdmin2025!';

    // Validar credenciales
    if (email !== SUPER_ADMIN_EMAIL || password !== SUPER_ADMIN_PASSWORD) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    const payload = {
      email: SUPER_ADMIN_EMAIL,
      role: 'SUPER_ADMIN',
      isSuperAdmin: true,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'fenix-secret-key-2025',
      expiresIn: '24h',
    });

    return {
      token,
      user: {
        email: SUPER_ADMIN_EMAIL,
        role: 'SUPER_ADMIN',
        name: 'Super Administrador',
      },
    };
  }
}
