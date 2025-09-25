import { Module, Global } from '@nestjs/common';
import { AnalyticsEngineService } from './analytics-engine.service';
import { AnalyticsController } from './analytics.controller';
import { ReportGeneratorService } from './report-generator.service';
import { DgraphModule } from '../dgraph/dgraph.module';

@Global()
@Module({
  imports: [DgraphModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsEngineService, ReportGeneratorService],
  exports: [AnalyticsEngineService, ReportGeneratorService],
})
export class AnalyticsEngineModule {}
