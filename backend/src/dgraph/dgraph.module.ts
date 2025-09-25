import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DgraphService } from './dgraph.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DgraphService],
  exports: [DgraphService],
})
export class DgraphModule {}
