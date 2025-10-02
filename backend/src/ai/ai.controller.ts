import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('ai')
@UseGuards(JwtGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('test-connection')
  async testConnection(
    @Body() dto: {
      provider: 'openai' | 'claude' | 'gemini';
      apiKey: string;
    },
  ) {
    try {
      return await this.aiService.testConnection(dto.provider, dto.apiKey);
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error al probar conexión',
      };
    }
  }
}
