import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { TenantId } from '../common/tenant-id.decorator';

@Controller('settings')
@UseGuards(JwtGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('ai-config')
  getAIConfig(@TenantId() tenantId: string) {
    return this.settingsService.getAIConfig(tenantId);
  }

  @Post('ai-config')
  saveAIConfig(
    @Body() dto: {
      openaiApiKey?: string;
      claudeApiKey?: string;
      geminiApiKey?: string;
      defaultProvider: 'openai' | 'claude' | 'gemini';
    },
    @TenantId() tenantId: string,
  ) {
    return this.settingsService.saveAIConfig(dto, tenantId);
  }
}
