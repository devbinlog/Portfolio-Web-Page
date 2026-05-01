import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { CreateDocumentDto } from './dto/create-document.dto'
import { UpdateDocumentDto } from './dto/update-document.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('admin/projects/:projectId/documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.documentsService.findAll(projectId)
  }

  @Post()
  create(@Param('projectId') projectId: string, @Body() dto: CreateDocumentDto) {
    return this.documentsService.create(projectId, dto)
  }

  @Put(':docId')
  update(
    @Param('projectId') projectId: string,
    @Param('docId') docId: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(projectId, docId, dto)
  }

  @Delete(':docId')
  remove(@Param('projectId') projectId: string, @Param('docId') docId: string) {
    return this.documentsService.remove(projectId, docId)
  }

  @Patch('reorder')
  reorder(
    @Param('projectId') projectId: string,
    @Body('orderedIds') orderedIds: string[],
  ) {
    return this.documentsService.reorder(projectId, orderedIds)
  }
}
