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
import { MediaService } from './media.service'
import { CreateMediaDto } from './dto/create-media.dto'
import { UpdateMediaDto } from './dto/update-media.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('admin/projects/:projectId/media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.mediaService.findAll(projectId)
  }

  @Post()
  create(@Param('projectId') projectId: string, @Body() dto: CreateMediaDto) {
    return this.mediaService.create(projectId, dto)
  }

  @Put(':mediaId')
  update(
    @Param('projectId') projectId: string,
    @Param('mediaId') mediaId: string,
    @Body() dto: UpdateMediaDto,
  ) {
    return this.mediaService.update(projectId, mediaId, dto)
  }

  @Delete(':mediaId')
  remove(
    @Param('projectId') projectId: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.mediaService.remove(projectId, mediaId)
  }

  @Patch('reorder')
  reorder(
    @Param('projectId') projectId: string,
    @Body('orderedIds') orderedIds: string[],
  ) {
    return this.mediaService.reorder(projectId, orderedIds)
  }
}
