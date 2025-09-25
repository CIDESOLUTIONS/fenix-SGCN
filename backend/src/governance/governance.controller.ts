import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GovernanceService } from './governance.service';
import {
  CreatePolicyDto,
  CreateObjectiveDto,
  CreateRaciMatrixDto,
} from './dto/create-governance.dto';
import {
  UpdatePolicyDto,
  UpdateObjectiveDto,
  UpdateRaciMatrixDto,
} from './dto/update-governance.dto';
import { TenantId } from '../common/tenant-id.decorator';

@Controller('governance')
@UseGuards(JwtAuthGuard)
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  // ============================================
  // POLÍTICAS DEL SGCN
  // ============================================

  @Post('policies')
  createPolicy(
    @Body() dto: CreatePolicyDto,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.governanceService.createPolicy(dto, tenantId, req.user.userId);
  }

  @Get('policies')
  findAllPolicies(@TenantId() tenantId: string) {
    return this.governanceService.findAllPolicies(tenantId);
  }

  @Get('policies/:id')
  findOnePolicy(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.governanceService.findOnePolicy(id, tenantId);
  }

  @Patch('policies/:id')
  updatePolicy(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() dto: UpdatePolicyDto,
    @Request() req: any,
  ) {
    return this.governanceService.updatePolicy(id, tenantId, dto, req.user.userId);
  }

  @Post('policies/:id/submit-approval')
  submitPolicyForApproval(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() body: { approvers: string[] },
    @Request() req: any,
  ) {
    return this.governanceService.submitPolicyForApproval(
      id,
      tenantId,
      body.approvers,
      req.user.userId,
    );
  }

  @Post('policies/:id/approve')
  approvePolicy(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() body: { comments?: string },
    @Request() req: any,
  ) {
    return this.governanceService.approvePolicy(
      id,
      tenantId,
      req.user.userId,
      body.comments,
    );
  }

  @Post('policies/:id/publish')
  publishPolicy(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.governanceService.publishPolicy(id, tenantId, req.user.userId);
  }

  @Delete('policies/:id')
  removePolicy(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.governanceService.removePolicy(id, tenantId);
  }

  // ============================================
  // OBJETIVOS DEL SGCN
  // ============================================

  @Post('objectives')
  createObjective(
    @Body() dto: CreateObjectiveDto,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.governanceService.createObjective(dto, tenantId, req.user.userId);
  }

  @Get('objectives')
  findAllObjectives(@TenantId() tenantId: string) {
    return this.governanceService.findAllObjectives(tenantId);
  }

  @Get('objectives/:id')
  findOneObjective(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.governanceService.findOneObjective(id, tenantId);
  }

  @Patch('objectives/:id')
  updateObjective(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() dto: UpdateObjectiveDto,
    @Request() req: any,
  ) {
    return this.governanceService.updateObjective(id, tenantId, dto, req.user.userId);
  }

  @Post('objectives/:id/link-process')
  linkObjectiveToProcess(
    @Param('id') objectiveId: string,
    @TenantId() tenantId: string,
    @Body() body: { processId: string },
  ) {
    return this.governanceService.linkObjectiveToProcess(
      objectiveId,
      body.processId,
      tenantId,
    );
  }

  @Delete('objectives/:id')
  removeObjective(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.governanceService.removeObjective(id, tenantId);
  }

  // ============================================
  // MATRIZ RACI
  // ============================================

  @Post('raci-matrix')
  createRaciMatrix(
    @Body() dto: CreateRaciMatrixDto,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.governanceService.createRaciMatrix(dto, tenantId, req.user.userId);
  }

  @Get('raci-matrix')
  findAllRaciMatrices(@TenantId() tenantId: string) {
    return this.governanceService.findAllRaciMatrices(tenantId);
  }

  @Get('raci-matrix/:id')
  findOneRaciMatrix(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.governanceService.findOneRaciMatrix(id, tenantId);
  }

  @Patch('raci-matrix/:id')
  updateRaciMatrix(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() dto: UpdateRaciMatrixDto,
  ) {
    return this.governanceService.updateRaciMatrix(id, tenantId, dto);
  }

  @Delete('raci-matrix/:id')
  removeRaciMatrix(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.governanceService.removeRaciMatrix(id, tenantId);
  }

  @Get('users/:userId/responsibilities')
  getUserResponsibilities(
    @Param('userId') userId: string,
    @TenantId() tenantId: string,
  ) {
    return this.governanceService.getUserResponsibilities(userId, tenantId);
  }
}
