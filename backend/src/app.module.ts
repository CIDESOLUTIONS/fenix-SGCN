import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BusinessProcessesModule } from './business-processes/business-processes.module';
import { BiaAssessmentsModule } from './bia-assessments/bia-assessments.module';
import { RiskAssessmentsModule } from './risk-assessments/risk-assessments.module';
import { ContinuityStrategiesModule } from './continuity-strategies/continuity-strategies.module';
import { ContinuityPlansModule } from './continuity-plans/continuity-plans.module';
import { TestExercisesModule } from './test-exercises/test-exercises.module';
import { ComplianceFrameworksModule } from './compliance-frameworks/compliance-frameworks.module';
import { CorrectiveActionsModule } from './corrective-actions/corrective-actions.module';
import { DocumentsModule } from './documents/documents.module';
import { TenantsModule } from './tenants/tenants.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    TenantsModule,
    BusinessProcessesModule,
    BiaAssessmentsModule,
    RiskAssessmentsModule,
    ContinuityStrategiesModule,
    ContinuityPlansModule,
    TestExercisesModule,
    ComplianceFrameworksModule,
    CorrectiveActionsModule,
    DocumentsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
