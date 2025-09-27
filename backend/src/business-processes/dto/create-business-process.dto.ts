import { IsString, IsOptional, IsEnum, IsArray, IsEmail } from 'class-validator';
import { CriticalityLevel } from '@prisma/client';

export class CreateBusinessProcessDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CriticalityLevel)
  criticalityLevel: CriticalityLevel;

  @IsString()
  @IsOptional()
  department?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dependencies?: string[];

  @IsString()
  @IsOptional()
  responsiblePerson?: string;

  @IsString()
  @IsOptional()
  raciResponsible?: string;

  @IsEmail()
  @IsOptional()
  raciResponsibleEmail?: string;

  @IsString()
  @IsOptional()
  raciAccountable?: string;

  @IsEmail()
  @IsOptional()
  raciAccountableEmail?: string;

  @IsString()
  @IsOptional()
  raciConsulted?: string;

  @IsEmail()
  @IsOptional()
  raciConsultedEmail?: string;

  @IsString()
  @IsOptional()
  raciInformed?: string;

  @IsEmail()
  @IsOptional()
  raciInformedEmail?: string;
}
