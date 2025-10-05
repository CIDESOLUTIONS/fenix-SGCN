import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRiskControlDto } from './dto/create-risk-control.dto';
import { ControlType, ApplicationCriteria, DocumentationLevel, EffectivenessLevel, AutomationLevel } from '@prisma/client';

@Injectable()
export class RiskControlsService {
  constructor(private prisma: PrismaService) {}

  calculateControlScore(control: CreateRiskControlDto): {
    score: number;
    quadrants: number;
  } {
    let score = 0;

    if (control.controlType === 'PREVENTIVE') score += 10;
    else if (control.controlType === 'DETECTIVE') score += 8;
    else if (control.controlType === 'CORRECTIVE') score += 3;

    if (control.applicationCriteria === 'ALWAYS') score += 10;
    else if (control.applicationCriteria === 'RANDOM') score += 5;

    if (control.isDocumented === 'YES') score += 15;
    else if (control.isDocumented === 'PARTIAL') score += 7;

    if (control.effectiveness === 'EFFECTIVE') score += 50;
    else if (control.effectiveness === 'NEEDS_IMPROVEMENT') score += 25;

    if (control.automation === 'AUTOMATIC') score += 15;
    else if (control.automation === 'MANUAL') score += 10;

    let quadrants = 0;
    const percentage = score;
    
    if (percentage >= 81) quadrants = 2;
    else if (percentage >= 61) quadrants = 1;

    return { score, quadrants };
  }

  async create(createRiskControlDto: CreateRiskControlDto) {
    const { score, quadrants } = this.calculateControlScore(createRiskControlDto);

    return this.prisma.riskControl.create({
      data: {
        riskAssessmentId: createRiskControlDto.riskAssessmentId,
        description: createRiskControlDto.description,
        controlType: createRiskControlDto.controlType as ControlType,
        applicationCriteria: createRiskControlDto.applicationCriteria as ApplicationCriteria,
        isDocumented: createRiskControlDto.isDocumented as DocumentationLevel,
        effectiveness: createRiskControlDto.effectiveness as EffectivenessLevel,
        automation: createRiskControlDto.automation as AutomationLevel,
        score,
        reductionQuadrants: quadrants,
      },
    });
  }

  async findAll(riskAssessmentId: string) {
    return this.prisma.riskControl.findMany({
      where: { riskAssessmentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.riskControl.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.riskControl.delete({
      where: { id },
    });
  }

  async calculateResidualRisk(riskId: string) {
    const risk = await this.prisma.riskAssessment.findUnique({
      where: { id: riskId },
      include: { riskControls: true },
    });

    if (!risk) throw new Error('Risk not found');

    const totalQuadrants = risk.riskControls.reduce(
      (sum, ctrl) => sum + ctrl.reductionQuadrants,
      0,
    );

    const probReduction = Math.min(totalQuadrants, 2);
    const impactReduction = Math.max(0, totalQuadrants - probReduction);

    const probabilityAfter = Math.max(1, risk.probabilityBefore - probReduction);
    const impactAfter = Math.max(1, risk.impactBefore - impactReduction);
    const scoreAfter = probabilityAfter * impactAfter;

    await this.prisma.riskAssessment.update({
      where: { id: riskId },
      data: {
        probabilityAfter,
        impactAfter,
        scoreAfter,
      },
    });

    return { probabilityAfter, impactAfter, scoreAfter };
  }
}
