import { Module } from '@nestjs/common';
import { CorrectiveActionsService } from './corrective-actions.service';
import { CorrectiveActionsController } from './corrective-actions.controller';

@Module({
  controllers: [CorrectiveActionsController],
  providers: [CorrectiveActionsService],
})
export class CorrectiveActionsModule {}
