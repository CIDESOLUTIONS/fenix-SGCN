import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private prisma: PrismaService) {}

  async getAIConfig(tenantId: string) {
    const config = await this.prisma.aIConfig.findUnique({
      where: { tenantId },
    });

    if (!config) {
      return {
        openaiApiKey: '',
        claudeApiKey: '',
        geminiApiKey: '',
        defaultProvider: 'openai',
      };
    }

    // Devolver keys enmascaradas por seguridad
    return {
      openaiApiKey: config.openaiApiKey ? this.maskApiKey(config.openaiApiKey) : '',
      claudeApiKey: config.claudeApiKey ? this.maskApiKey(config.claudeApiKey) : '',
      geminiApiKey: config.geminiApiKey ? this.maskApiKey(config.geminiApiKey) : '',
      defaultProvider: config.defaultProvider,
    };
  }

  async saveAIConfig(
    dto: {
      openaiApiKey?: string;
      claudeApiKey?: string;
      geminiApiKey?: string;
      defaultProvider: 'openai' | 'claude' | 'gemini';
    },
    tenantId: string,
  ) {
    // Verificar si ya existe configuración
    const existing = await this.prisma.aIConfig.findUnique({
      where: { tenantId },
    });

    const data: any = {
      defaultProvider: dto.defaultProvider,
    };

    // Solo actualizar las keys que no estén enmascaradas (que vengan sin ***)
    if (dto.openaiApiKey && !dto.openaiApiKey.includes('***')) {
      data.openaiApiKey = dto.openaiApiKey;
    }
    if (dto.claudeApiKey && !dto.claudeApiKey.includes('***')) {
      data.claudeApiKey = dto.claudeApiKey;
    }
    if (dto.geminiApiKey && !dto.geminiApiKey.includes('***')) {
      data.geminiApiKey = dto.geminiApiKey;
    }

    if (existing) {
      // Actualizar
      await this.prisma.aIConfig.update({
        where: { tenantId },
        data,
      });
    } else {
      // Crear
      await this.prisma.aIConfig.create({
        data: {
          tenantId,
          ...data,
        },
      });
    }

    this.logger.log(`AI config saved for tenant ${tenantId}`);

    return { success: true, message: 'Configuración guardada exitosamente' };
  }

  private maskApiKey(key: string): string {
    if (!key || key.length < 12) return '***';
    return key.substring(0, 8) + '***' + key.substring(key.length - 4);
  }
}
