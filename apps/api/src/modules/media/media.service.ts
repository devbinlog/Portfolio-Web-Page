import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import type { CreateMediaDto } from './dto/create-media.dto'
import type { UpdateMediaDto } from './dto/update-media.dto'

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId: string) {
    await this.assertProjectExists(projectId)
    return this.prisma.projectMedia.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    })
  }

  async create(projectId: string, dto: CreateMediaDto) {
    await this.assertProjectExists(projectId)

    const maxOrder = await this.prisma.projectMedia.aggregate({
      where: { projectId },
      _max: { order: true },
    })

    return this.prisma.projectMedia.create({
      data: {
        projectId,
        type: dto.type,
        url: dto.url ?? null,
        placeholderLabel: dto.placeholderLabel ?? null,
        embedId: dto.embedId ?? null,
        altText: dto.altText ?? null,
        caption: dto.caption ?? null,
        order: dto.order ?? (maxOrder._max.order ?? -1) + 1,
        isPlaceholder: dto.isPlaceholder ?? !dto.url,
      },
    })
  }

  async update(projectId: string, mediaId: string, dto: UpdateMediaDto) {
    await this.assertMediaExists(projectId, mediaId)

    return this.prisma.projectMedia.update({
      where: { id: mediaId },
      data: {
        ...dto,
        // url이 제공되면 플레이스홀더 해제
        isPlaceholder: dto.url ? false : dto.isPlaceholder,
      },
    })
  }

  async remove(projectId: string, mediaId: string) {
    await this.assertMediaExists(projectId, mediaId)
    await this.prisma.projectMedia.delete({ where: { id: mediaId } })
    return { message: '미디어가 삭제되었습니다.' }
  }

  async reorder(projectId: string, orderedIds: string[]) {
    await this.assertProjectExists(projectId)
    await Promise.all(
      orderedIds.map((id, index) =>
        this.prisma.projectMedia.update({
          where: { id },
          data: { order: index },
        }),
      ),
    )
    return { message: '순서가 변경되었습니다.' }
  }

  private async assertProjectExists(projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } })
    if (!project) throw new NotFoundException(`프로젝트를 찾을 수 없습니다: ${projectId}`)
  }

  private async assertMediaExists(projectId: string, mediaId: string) {
    const media = await this.prisma.projectMedia.findFirst({
      where: { id: mediaId, projectId },
    })
    if (!media) throw new NotFoundException(`미디어를 찾을 수 없습니다: ${mediaId}`)
  }
}
