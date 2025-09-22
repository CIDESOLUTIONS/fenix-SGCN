import { Module } from '@nestjs/common';
import { BusinessProcessesService } from './business-processes.service';
import { BusinessProcessesController } from './business-processes.controller';

@Module({
  controllers: [BusinessProcessesController],
  providers: [BusinessProcessesService],
})
export class BusinessProcessesModule {}
