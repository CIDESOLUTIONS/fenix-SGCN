import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
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
import { ContactModule } from './contact/contact.module';
import { DashboardModule } from './dashboard/dashboard.module';

// === MOTORES TRANSVERSALES ===
import { DgraphModule } from './dgraph/dgraph.module';
import { WorkflowEngineModule } from './workflow-engine/workflow-engine.module';
import { BIDashboardModule } from './bi-dashboards/bi-dashboard.module';
import { AnalyticsEngineModule } from './analytics-engine/analytics-engine.module';
import { GovernanceModule } from './governance/governance.module';
import { ContinuousImprovementModule } from './continuous-improvement/continuous-improvement.module';
import { ExercisesModule } from './exercises/exercises.module';
import { ReportGeneratorModule } from './report-generator/report-generator.module';
import { BusinessContextModule } from './business-context/business-context.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    
    // === MOTORES TRANSVERSALES ===
    DgraphModule,
    WorkflowEngineModule,
    BIDashboardModule,
    AnalyticsEngineModule,
    
    // === MÓDULOS FUNCIONALES ===
    PrismaModule,
    AuthModule,
    TenantsModule,
    GovernanceModule,
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
    ContactModule,
    DashboardModule,
    ContinuousImprovementModule,
    ExercisesModule,
    ReportGeneratorModule,
    BusinessContextModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
