import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateRiskControlDto {
  @IsString()
  @IsNotEmpty()
  riskAssessmentId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['PREVENTIVE', 'DETECTIVE', 'CORRECTIVE'])
  controlType: string;

  @IsEnum(['ALWAYS', 'RANDOM'])
  applicationCriteria: string;

  @IsEnum(['YES', 'PARTIAL', 'NO'])
  isDocumented: string;

  @IsEnum(['EFFECTIVE', 'NEEDS_IMPROVEMENT', 'NOT_EFFECTIVE'])
  effectiveness: string;

  @IsEnum(['AUTOMATIC', 'MANUAL'])
  automation: string;
}
