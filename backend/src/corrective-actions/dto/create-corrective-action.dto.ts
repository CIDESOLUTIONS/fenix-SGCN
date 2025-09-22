import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateCorrectiveActionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  relatedTo?: string;

  @IsEnum(['Open', 'InProgress', 'Completed', 'Closed'])
  @IsOptional()
  status?: 'Open' | 'InProgress' | 'Completed' | 'Closed';

  @IsEnum(['High', 'Medium', 'Low'])
  @IsOptional()
  priority?: 'High' | 'Medium' | 'Low';

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  implementationNotes?: string;
}
