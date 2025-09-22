import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestExercisesService } from './test-exercises.service';
import { CreateTestExerciseDto } from './dto/create-test-exercise.dto';
import { UpdateTestExerciseDto } from './dto/update-test-exercise.dto';
import { TenantId } from '../common/tenant-id.decorator';

@Controller('test-exercises')
export class TestExercisesController {
  constructor(private readonly testExercisesService: TestExercisesService) {}

  @Post()
  create(@Body() createTestExerciseDto: CreateTestExerciseDto, @TenantId() tenantId: string) {
    return this.testExercisesService.create(createTestExerciseDto, tenantId);
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
  update(@Param('id') id: string, @TenantId() tenantId: string, @Body() updateTestExerciseDto: UpdateTestExerciseDto) {
    return this.testExercisesService.update(id, tenantId, updateTestExerciseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.testExercisesService.remove(id, tenantId);
  }
}
