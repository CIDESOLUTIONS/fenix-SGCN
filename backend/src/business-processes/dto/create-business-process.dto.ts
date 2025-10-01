import { IsString, IsOptional, IsEnum, IsArray, IsEmail, IsBoolean, IsObject, IsNumber } from 'class-validator';
import { CriticalityLevel, ProcessType } from '@prisma/client';

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

  // NUEVO: Caracterización de Alto Nivel
  @IsString()
  @IsOptional()
  highLevelCharacterization?: string;

  // NUEVO: Tipo de Proceso
  @IsEnum(ProcessType)
  @IsOptional()
  processType?: ProcessType;

  // NUEVO: Inclusión en Análisis de Continuidad
  @IsBoolean()
  @IsOptional()
  includeInContinuityAnalysis?: boolean;

  // NUEVO: Criterios de Priorización
  @IsObject()
  @IsOptional()
  prioritizationCriteria?: {
    strategic?: number;    // 0-10
    operational?: number;  // 0-10
    financial?: number;    // 0-10
    regulatory?: number;   // 0-10
  };

  // NUEVO: Archivo adjunto
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  fileName?: string;

  @IsNumber()
  @IsOptional()
  fileSize?: number;
}
