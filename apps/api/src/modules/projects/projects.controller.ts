import { Controller, Get, Param, Query } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectsQueryDto } from './dto/projects-query.dto'

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@Query() query: ProjectsQueryDto) {
    return this.projectsService.findAll(query)
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug)
  }
}
