import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DgraphService } from './dgraph.service';
import { DgraphController } from './dgraph.controller';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [DgraphController],
  providers: [DgraphService],
  exports: [DgraphService],
})
export class DgraphModule {}
