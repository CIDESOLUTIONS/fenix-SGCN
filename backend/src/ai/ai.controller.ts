import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('test-connection')
  @UseGuards(JwtAuthGuard)
  async testConnection(
    @Body() dto: { provider: 'openai' | 'claude' | 'gemini'; apiKey: string },
    @Request() req,
  ) {
    try {
      await this.aiService.testConnection(dto.provider, dto.apiKey);
      return {
        success: true,
        message: `Conexión exitosa con ${dto.provider}`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al conectar con el proveedor de IA',
      };
    }
  }

  @Post('analyze')
  @UseGuards(JwtAuthGuard)
  async analyzeWithAI(
    @Body() dto: { prompt: string; context: string },
    @Request() req,
  ) {
    try {
      const analysis = await this.aiService.analyze(
        dto.prompt,
        req.user.tenantId,
      );
      
      return {
        success: true,
        analysis,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al analizar con IA',
      };
    }
  }
}
