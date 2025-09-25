import { Module, Global } from '@nestjs/common';
import { BIDashboardService } from './bi-dashboard.service';
import { BIDashboardController } from './bi-dashboard.controller';
import { DgraphModule } from '../dgraph/dgraph.module';

@Global()
@Module({
  imports: [DgraphModule],
  controllers: [BIDashboardController],
  providers: [BIDashboardService],
  exports: [BIDashboardService],
})
export class BIDashboardModule {}
