import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common'
import { LinksService } from './links.service'
import { CreateLinkDto } from './dto/create-link.dto'
import { UpdateLinkDto } from './dto/update-link.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('admin/projects/:projectId/links')
@UseGuards(JwtAuthGuard)
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.linksService.findAll(projectId)
  }

  @Post()
  create(@Param('projectId') projectId: string, @Body() dto: CreateLinkDto) {
    return this.linksService.create(projectId, dto)
  }

  @Put(':linkId')
  update(
    @Param('projectId') projectId: string,
    @Param('linkId') linkId: string,
    @Body() dto: UpdateLinkDto,
  ) {
    return this.linksService.update(projectId, linkId, dto)
  }

  @Delete(':linkId')
  remove(@Param('projectId') projectId: string, @Param('linkId') linkId: string) {
    return this.linksService.remove(projectId, linkId)
  }
}
