import { PartialType } from '@nestjs/mapped-types';
import { CreateComplianceFrameworkDto } from './create-compliance-framework.dto';

export class UpdateComplianceFrameworkDto extends PartialType(CreateComplianceFrameworkDto) {}
