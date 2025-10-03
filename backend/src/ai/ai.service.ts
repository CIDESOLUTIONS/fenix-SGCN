import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(private prisma: PrismaService) {}

  async testConnection(
    provider: 'openai' | 'claude' | 'gemini',
    apiKey: string,
  ): Promise<void> {
    const testPrompt = 'Responde con "OK" si puedes leer este mensaje.';

    try {
      switch (provider) {
        case 'openai':
          await this.testOpenAI(apiKey);
          break;
        case 'gemini':
          await this.testGemini(apiKey);
          break;
        case 'claude':
          await this.testClaude(apiKey);
          break;
        default:
          throw new Error(`Provider desconocido: ${provider}`);
      }
    } catch (error) {
      this.logger.error(`Test connection failed for ${provider}: ${error.message}`);
      throw error;
    }
  }

  private async testOpenAI(apiKey: string): Promise<void> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Test' }],
        max_tokens: 5,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error de conexión con OpenAI');
    }
  }

  private async testGemini(apiKey: string): Promise<void> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Test' }] }],
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error de conexión con Gemini');
    }
  }

  private async testClaude(apiKey: string): Promise<void> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Test' }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error de conexión con Claude');
    }
  }

  async analyze(prompt: string, tenantId: string): Promise<string> {
    // Obtener configuración de IA
    const config = await this.prisma.aIConfig.findUnique({
      where: { tenantId },
    });

    if (!config) {
      throw new Error(
        'No hay configuración de IA. Configure las API keys en Configuración.',
      );
    }

    // Intentar con el provider por defecto primero
    try {
      return await this.callProvider(
        config.defaultProvider,
        prompt,
        config,
      );
    } catch (error) {
      this.logger.warn(
        `Provider ${config.defaultProvider} falló: ${error.message}`,
      );

      // Intentar con otros providers como fallback
      const providers = ['openai', 'gemini', 'claude'].filter(
        (p) => p !== config.defaultProvider,
      );

      for (const provider of providers) {
        try {
          this.logger.log(`Intentando fallback con ${provider}...`);
          return await this.callProvider(provider, prompt, config);
        } catch (fallbackError) {
          this.logger.warn(
            `Fallback ${provider} falló: ${fallbackError.message}`,
          );
        }
      }

      throw new Error(
        'No se pudo completar el análisis. Verifique que al menos una API key esté configurada correctamente.',
      );
    }
  }

  private async callProvider(
    provider: string,
    prompt: string,
    config: any,
  ): Promise<string> {
    switch (provider) {
      case 'openai':
        return await this.analyzeWithOpenAI(prompt, config.openaiApiKey);
      case 'gemini':
        return await this.analyzeWithGemini(prompt, config.geminiApiKey);
      case 'claude':
        return await this.analyzeWithClaude(prompt, config.claudeApiKey);
      default:
        throw new Error(`Provider desconocido: ${provider}`);
    }
  }

  private async analyzeWithOpenAI(
    prompt: string,
    apiKey: string,
  ): Promise<string> {
    if (!apiKey) {
      throw new Error('OpenAI API key no configurada');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Eres un consultor experto en análisis FODA y planificación estratégica. Proporciona análisis detallados, específicos y accionables.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async analyzeWithGemini(
    prompt: string,
    apiKey: string,
  ): Promise<string> {
    if (!apiKey) {
      throw new Error('Gemini API key no configurada');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [
              {
                text: 'Eres un consultor experto en análisis FODA y planificación estratégica. Proporciona análisis detallados, específicos y accionables.',
              },
            ],
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error('Gemini: Respuesta vacía o formato inesperado');
  }

  private async analyzeWithClaude(
    prompt: string,
    apiKey: string,
  ): Promise<string> {
    if (!apiKey) {
      throw new Error('Claude API key no configurada');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system:
          'Eres un consultor experto en análisis FODA y planificación estratégica. Proporciona análisis detallados, específicos y accionables.',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Claude Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (data.content && data.content[0]?.text) {
      return data.content[0].text;
    }

    throw new Error('Claude: Respuesta vacía o formato inesperado');
  }
}
