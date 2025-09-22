import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { TenantId } from '../common/tenant-id.decorator';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto, @TenantId() tenantId: string) {
    return this.documentsService.create(createDocumentDto, tenantId);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.documentsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.documentsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @TenantId() tenantId: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, tenantId, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.documentsService.remove(id, tenantId);
  }
}
