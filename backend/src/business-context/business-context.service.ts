import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessContextDto, UpdateBusinessContextDto, CreateSwotAnalysisDto, UpdateSwotAnalysisDto } from './dto/business-context.dto';

@Injectable()
export class BusinessContextService {
  private readonly logger = new Logger(BusinessContextService.name);

  constructor(private prisma: PrismaService) {}

  // ============================================
  // CONTEXTO DE NEGOCIO
  // ============================================

  async createContext(dto: CreateBusinessContextDto, tenantId: string, userId: string) {
    const context = await this.prisma.businessContext.create({
      data: {
        tenantId,
        title: dto.title,
        description: dto.description,
        content: dto.content,
        elaborationDate: dto.elaborationDate ? new Date(dto.elaborationDate) : new Date(),
        fileUrl: dto.fileUrl,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
        createdBy: userId,
      },
    });

    this.logger.log(`Business context created: ${context.id} by ${userId}`);
    return context;
  }

  async findAllContexts(tenantId: string) {
    return this.prisma.businessContext.findMany({
      where: { tenantId },
      include: {
        swotAnalyses: {
          select: {
            id: true,
            title: true,
            status: true,
            analysisDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneContext(id: string, tenantId: string) {
    const context = await this.prisma.businessContext.findFirst({
      where: { id, tenantId },
      include: {
        swotAnalyses: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!context) {
      throw new NotFoundException('Business context not found');
    }

    return context;
  }

  async updateContext(id: string, dto: UpdateBusinessContextDto, tenantId: string, userId: string) {
    const context = await this.prisma.businessContext.findFirst({
      where: { id, tenantId },
    });

    if (!context) {
      throw new NotFoundException('Business context not found');
    }

    return this.prisma.businessContext.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: userId,
      },
    });
  }

  async deleteContext(id: string, tenantId: string) {
    const context = await this.prisma.businessContext.findFirst({
      where: { id, tenantId },
    });

    if (!context) {
      throw new NotFoundException('Business context not found');
    }

    await this.prisma.businessContext.delete({
      where: { id },
    });

    this.logger.log(`Business context deleted: ${id}`);
    return { message: 'Business context deleted successfully' };
  }

  async approveContext(id: string, tenantId: string, userId: string) {
    const context = await this.prisma.businessContext.findFirst({
      where: { id, tenantId },
    });

    if (!context) {
      throw new NotFoundException('Business context not found');
    }

    return this.prisma.businessContext.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });
  }

  // ============================================
  // ANÁLISIS FODA (SWOT)
  // ============================================

  async createSwotAnalysis(dto: CreateSwotAnalysisDto, tenantId: string, userId: string) {
    const context = await this.prisma.businessContext.findFirst({
      where: { id: dto.contextId, tenantId },
    });

    if (!context) {
      throw new NotFoundException('Business context not found');
    }

    const swot = await this.prisma.swotAnalysis.create({
      data: {
        tenantId,
        contextId: dto.contextId,
        title: dto.title,
        description: dto.description,
        strengths: dto.strengths || [],
        weaknesses: dto.weaknesses || [],
        opportunities: dto.opportunities || [],
        threats: dto.threats || [],
        strategies: dto.strategies ? dto.strategies : undefined,
        participants: dto.participants || [],
        facilitator: dto.facilitator,
        createdBy: userId,
      },
    });

    this.logger.log(`SWOT analysis created: ${swot.id} by ${userId}`);
    return swot;
  }

  async findAllSwotAnalyses(tenantId: string, contextId?: string) {
    const where: any = { tenantId };
    if (contextId) {
      where.contextId = contextId;
    }

    return this.prisma.swotAnalysis.findMany({
      where,
      include: {
        context: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneSwotAnalysis(id: string, tenantId: string) {
    const swot = await this.prisma.swotAnalysis.findFirst({
      where: { id, tenantId },
      include: {
        context: true,
      },
    });

    if (!swot) {
      throw new NotFoundException('SWOT analysis not found');
    }

    return swot;
  }

  async updateSwotAnalysis(id: string, dto: UpdateSwotAnalysisDto, tenantId: string, userId: string) {
    const swot = await this.prisma.swotAnalysis.findFirst({
      where: { id, tenantId },
    });

    if (!swot) {
      throw new NotFoundException('SWOT analysis not found');
    }

    return this.prisma.swotAnalysis.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: userId,
      },
    });
  }

  async deleteSwotAnalysis(id: string, tenantId: string) {
    const swot = await this.prisma.swotAnalysis.findFirst({
      where: { id, tenantId },
    });

    if (!swot) {
      throw new NotFoundException('SWOT analysis not found');
    }

    await this.prisma.swotAnalysis.delete({
      where: { id },
    });

    this.logger.log(`SWOT analysis deleted: ${id}`);
    return { message: 'SWOT analysis deleted successfully' };
  }

  async completeSwotAnalysis(id: string, tenantId: string) {
    const swot = await this.prisma.swotAnalysis.findFirst({
      where: { id, tenantId },
    });

    if (!swot) {
      throw new NotFoundException('SWOT analysis not found');
    }

    return this.prisma.swotAnalysis.update({
      where: { id },
      data: {
        status: 'COMPLETED',
      },
    });
  }

  async generateStrategies(id: string, tenantId: string) {
    const swot = await this.prisma.swotAnalysis.findFirst({
      where: { id, tenantId },
    });

    if (!swot) {
      throw new NotFoundException('SWOT analysis not found');
    }

    // Generar estrategias basadas en la matriz FODA
    const strategies = {
      FO: [], // Fortalezas + Oportunidades (Estrategias ofensivas)
      FA: [], // Fortalezas + Amenazas (Estrategias defensivas)
      DO: [], // Debilidades + Oportunidades (Estrategias adaptativas)
      DA: [], // Debilidades + Amenazas (Estrategias de supervivencia)
    };

    // Aquí se pueden implementar algoritmos de IA o lógica de negocio
    // para generar recomendaciones automáticas

    return this.prisma.swotAnalysis.update({
      where: { id },
      data: {
        strategies,
      },
    });
  }

  async analyzeSwotWithAI(
    dto: { contextContent: string; contextTitle: string; swotData: any },
    tenantId: string,
  ) {
    try {
      // Obtener API Key de configuración del tenant
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      if (!tenant?.aiApiKey) {
        throw new Error(
          'API Key de IA no configurada. Configure en Configuración > Integraciones',
        );
      }

      // Construir prompt para análisis de cruzamientos FODA
      const prompt = `
Actúa como un consultor estratégico experto en análisis FODA.

Contexto de la Organización: "${dto.contextTitle}"
${dto.contextContent}

Matriz FODA:
- Fortalezas: ${dto.swotData.strengths.join(', ')}
- Debilidades: ${dto.swotData.weaknesses.join(', ')}
- Oportunidades: ${dto.swotData.opportunities.join(', ')}
- Amenazas: ${dto.swotData.threats.join(', ')}

Realiza un análisis detallado de cruzamientos FODA identificando:

1. **Estrategias FO (Fortalezas-Oportunidades)**: Cómo usar fortalezas para aprovechar oportunidades
2. **Estrategias FA (Fortalezas-Amenazas)**: Cómo usar fortalezas para mitigar amenazas
3. **Estrategias DO (Debilidades-Oportunidades)**: Cómo superar debilidades aprovechando oportunidades
4. **Estrategias DA (Debilidades-Amenazas)**: Cómo minimizar debilidades y evitar amenazas

Para cada tipo de estrategia, proporciona 2-3 recomendaciones específicas y accionables.
`;

      // Llamar a API de IA (ejemplo con OpenAI)
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tenant.aiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error?.message || 'Error al comunicarse con la API de IA',
        );
      }

      const result = await response.json();
      const analysis = result.choices[0]?.message?.content || '';

      return {
        success: true,
        analysis,
      };
    } catch (error) {
      this.logger.error('Error analyzing SWOT with AI:', error);
      throw error;
    }
  }
}
