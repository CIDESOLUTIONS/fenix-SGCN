import { IsString, IsEnum, IsOptional, IsNotEmpty, IsDateString } from 'class-validator';

export enum ActionType {
  CORRECTIVE = 'CORRECTIVE',
  PREVENTIVE = 'PREVENTIVE',
}

export enum ActionPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export class CreateCorrectiveActionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ActionType)
  @IsNotEmpty()
  actionType: ActionType;

  @IsString()
  @IsNotEmpty()
  assignedTo: string;

  @IsDateString()
  @IsNotEmpty()
  targetDate: string;

  @IsEnum(ActionPriority)
  @IsNotEmpty()
  priority: ActionPriority;

  @IsString()
  @IsOptional()
  estimatedCost?: string;
}
