import { PartialType } from '@nestjs/mapped-types';
import { CreatePolicyDto, CreateObjectiveDto, CreateRaciMatrixDto } from './create-governance.dto';

export class UpdatePolicyDto extends PartialType(CreatePolicyDto) {}

export class UpdateObjectiveDto extends PartialType(CreateObjectiveDto) {}

export class UpdateRaciMatrixDto extends PartialType(CreateRaciMatrixDto) {}
