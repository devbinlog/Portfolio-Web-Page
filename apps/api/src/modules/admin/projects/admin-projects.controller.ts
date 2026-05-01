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
import { AdminProjectsService } from './admin-projects.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'

@Controller('admin/projects')
@UseGuards(JwtAuthGuard)
export class AdminProjectsController {
  constructor(private readonly service: AdminProjectsService) {}

  @Get('stats')
  stats() {
    return this.service.stats()
  }

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }

  @Patch(':id/publish')
  togglePublish(@Param('id') id: string) {
    return this.service.togglePublish(id)
  }

  @Patch('reorder')
  reorder(@Body('orderedIds') orderedIds: string[]) {
    return this.service.reorder(orderedIds)
  }
}
