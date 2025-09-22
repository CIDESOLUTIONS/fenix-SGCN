import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateContinuityStrategyDto {
  @IsString()
  @IsNotEmpty()
  processId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['Immediate', 'Short-term', 'Long-term'])
  @IsOptional()
  recoveryTimeframe?: 'Immediate' | 'Short-term' | 'Long-term';

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @IsString()
  @IsOptional()
  implementationSteps?: string;

  @IsString()
  @IsOptional()
  requiredResources?: string;
}
