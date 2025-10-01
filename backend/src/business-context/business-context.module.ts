import { Module } from '@nestjs/common';
import { BusinessContextService } from './business-context.service';
import { BusinessContextController } from './business-context.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BusinessContextController],
  providers: [BusinessContextService],
  exports: [BusinessContextService],
})
export class BusinessContextModule {}
