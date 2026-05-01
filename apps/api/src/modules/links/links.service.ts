import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import type { CreateLinkDto } from './dto/create-link.dto'
import type { UpdateLinkDto } from './dto/update-link.dto'

@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId: string) {
    await this.assertProjectExists(projectId)
    return this.prisma.projectLink.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    })
  }

  async create(projectId: string, dto: CreateLinkDto) {
    await this.assertProjectExists(projectId)
    const maxOrder = await this.prisma.projectLink.aggregate({
      where: { projectId },
      _max: { order: true },
    })

    return this.prisma.projectLink.create({
      data: {
        projectId,
        type: dto.type,
        label: dto.label,
        url: dto.url,
        order: dto.order ?? (maxOrder._max.order ?? -1) + 1,
      },
    })
  }

  async update(projectId: string, linkId: string, dto: UpdateLinkDto) {
    await this.assertLinkExists(projectId, linkId)
    return this.prisma.projectLink.update({
      where: { id: linkId },
      data: dto,
    })
  }

  async remove(projectId: string, linkId: string) {
    await this.assertLinkExists(projectId, linkId)
    await this.prisma.projectLink.delete({ where: { id: linkId } })
    return { message: '링크가 삭제되었습니다.' }
  }

  private async assertProjectExists(projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } })
    if (!project) throw new NotFoundException(`프로젝트를 찾을 수 없습니다: ${projectId}`)
  }

  private async assertLinkExists(projectId: string, linkId: string) {
    const link = await this.prisma.projectLink.findFirst({
      where: { id: linkId, projectId },
    })
    if (!link) throw new NotFoundException(`링크를 찾을 수 없습니다: ${linkId}`)
  }
}
