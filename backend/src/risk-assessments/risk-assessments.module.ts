import { Module } from '@nestjs/common';
import { RiskAssessmentsService } from './risk-assessments.service';
import { RiskAssessmentsController } from './risk-assessments.controller';

@Module({
  controllers: [RiskAssessmentsController],
  providers: [RiskAssessmentsService],
})
export class RiskAssessmentsModule {}
