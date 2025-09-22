import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  relatedTo?: string;

  @IsEnum(['Draft', 'Published', 'Archived'])
  @IsOptional()
  status?: 'Draft' | 'Published' | 'Archived';
}
