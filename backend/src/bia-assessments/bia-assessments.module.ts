import { Module } from '@nestjs/common';
import { BiaAssessmentsService } from './bia-assessments.service';
import { BiaAssessmentsController } from './bia-assessments.controller';

@Module({
  controllers: [BiaAssessmentsController],
  providers: [BiaAssessmentsService],
})
export class BiaAssessmentsModule {}
