import { IsString, IsOptional, IsObject, IsArray } from 'class-validator';

export class PerformRCADto {
  @IsString()
  @IsOptional()
  method?: string; // '5 Whys', 'Fishbone', etc.

  @IsObject()
  analysis: {
    why1?: string;
    why2?: string;
    why3?: string;
    why4?: string;
    why5?: string;
    [key: string]: any;
  };

  @IsString()
  rootCause: string;

  @IsArray()
  @IsOptional()
  contributingFactors?: string[];

  @IsString()
  @IsOptional()
  performedBy?: string;
}
