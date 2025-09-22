import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateComplianceFrameworkDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  requirements?: any[];
}
