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
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExercisesService } from './exercises.service';
import { TenantId } from '../common/tenant-id.decorator';

@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  create(@Body() createDto: any, @TenantId() tenantId: string, @Request() req: any) {
    return this.exercisesService.create(createDto, tenantId, req.user.userId);
  }

  @Get()
  findAll(@TenantId() tenantId: string, @Query() filters?: any) {
    return this.exercisesService.findAll(tenantId, filters);
  }

  @Get('calendar')
  getCalendar(@TenantId() tenantId: string, @Query('year') year?: string) {
    return this.exercisesService.getCalendar(tenantId, year ? parseInt(year) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.exercisesService.findOne(id, tenantId);
  }

  @Post(':id/start')
  startExercise(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.exercisesService.startExercise(id, tenantId, req.user.userId);
  }

  @Post(':id/log-event')
  logEvent(
    @Param('id') exerciseId: string,
    @TenantId() tenantId: string,
    @Body() eventData: any,
    @Request() req: any,
  ) {
    return this.exercisesService.logEvent(exerciseId, tenantId, {
      ...eventData,
      userId: req.user.userId,
    });
  }

  @Post(':id/inject-event')
  injectEvent(
    @Param('id') exerciseId: string,
    @TenantId() tenantId: string,
    @Body() injection: any,
    @Request() req: any,
  ) {
    return this.exercisesService.injectEvent(exerciseId, tenantId, {
      ...injection,
      userId: req.user.userId,
    });
  }

  @Post(':id/complete-task')
  completeTask(
    @Param('id') exerciseId: string,
    @TenantId() tenantId: string,
    @Body() taskData: any,
    @Request() req: any,
  ) {
    return this.exercisesService.completeTask(exerciseId, tenantId, {
      ...taskData,
      completedBy: req.user.userId,
    });
  }

  @Post(':id/finish')
  finishExercise(
    @Param('id') exerciseId: string,
    @TenantId() tenantId: string,
    @Request() req: any,
  ) {
    return this.exercisesService.finishExercise(exerciseId, tenantId, req.user.userId);
  }

  @Get(':id/report')
  generateReport(@Param('id') exerciseId: string, @TenantId() tenantId: string) {
    return this.exercisesService.generateReport(exerciseId, tenantId);
  }

  @Get(':id/gaps')
  identifyGaps(@Param('id') exerciseId: string, @TenantId() tenantId: string) {
    return this.exercisesService.identifyGaps(exerciseId, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() updateDto: any,
    @Request() req: any,
  ) {
    return this.exercisesService.update(id, tenantId, updateDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @TenantId() tenantId: string, @Request() req: any) {
    return this.exercisesService.remove(id, tenantId, req.user.userId);
  }
}
