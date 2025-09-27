import { Module, Global } from '@nestjs/common';
import { BiDashboardService } from './bi-dashboard.service';
import { BIDashboardController } from './bi-dashboard.controller';
import { DgraphModule } from '../dgraph/dgraph.module';

@Global()
@Module({
  imports: [DgraphModule],
  controllers: [BIDashboardController],
  providers: [BiDashboardService],
  exports: [BiDashboardService],
})
export class BIDashboardModule {}
