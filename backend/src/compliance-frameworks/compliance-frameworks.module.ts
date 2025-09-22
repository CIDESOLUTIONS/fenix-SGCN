import { Module } from '@nestjs/common';
import { ComplianceFrameworksService } from './compliance-frameworks.service';
import { ComplianceFrameworksController } from './compliance-frameworks.controller';

@Module({
  controllers: [ComplianceFrameworksController],
  providers: [ComplianceFrameworksService],
})
export class ComplianceFrameworksModule {}
