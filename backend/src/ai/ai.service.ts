import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  async testConnection(provider: 'openai' | 'claude' | 'gemini', apiKey: string) {
    try {
      if (provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        if (!response.ok) {
          throw new Error('API key inválida o servicio no disponible');
        }

        return {
          success: true,
          message: 'Conexión exitosa con OpenAI',
        };
      } else if (provider === 'claude') {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'test' }],
          }),
        });

        if (!response.ok) {
          throw new Error('API key inválida o servicio no disponible');
        }

        return {
          success: true,
          message: 'Conexión exitosa con Claude',
        };
      } else if (provider === 'gemini') {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'test' }] }],
            }),
          },
        );

        if (!response.ok) {
          throw new Error('API key inválida o servicio no disponible');
        }

        return {
          success: true,
          message: 'Conexión exitosa con Gemini',
        };
      }

      throw new Error('Proveedor no soportado');
    } catch (error) {
      this.logger.error(`Error testing ${provider} connection:`, error);
      throw error;
    }
  }
}
