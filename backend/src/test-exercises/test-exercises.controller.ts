import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { TestExercisesService } from './test-exercises.service';
import { CreateTestExerciseDto } from './dto/create-test-exercise.dto';
import { UpdateTestExerciseDto } from './dto/update-test-exercise.dto';
import { TenantId } from '../common/tenant-id.decorator';
import { UserId } from '../common/user-id.decorator';

@UseGuards(JwtGuard)
@Controller('test-exercises')
export class TestExercisesController {
  constructor(private readonly testExercisesService: TestExercisesService) {}

  @Post()
  create(
    @Body() createTestExerciseDto: CreateTestExerciseDto,
    @TenantId() tenantId: string,
    @UserId() userId: string,
  ) {
    return this.testExercisesService.create(createTestExerciseDto, tenantId, userId);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.testExercisesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.testExercisesService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() updateTestExerciseDto: UpdateTestExerciseDto,
    @UserId() userId: string,
  ) {
    return this.testExercisesService.update(id, tenantId, updateTestExerciseDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @UserId() userId: string,
  ) {
    return this.testExercisesService.remove(id, tenantId, userId);
  }
}
