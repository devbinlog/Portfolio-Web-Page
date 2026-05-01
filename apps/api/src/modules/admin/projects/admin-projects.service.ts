import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../../common/prisma/prisma.service'
import { generateSlug } from '@portfolio/utils'
import type { CreateProjectDto } from './dto/create-project.dto'
import type { UpdateProjectDto } from './dto/update-project.dto'

const ADMIN_PROJECT_INCLUDE = {
  category: true,
  secondaryCategory: true,
  tags: { include: { tag: true } },
  media: { orderBy: { order: 'asc' as const } },
  documents: { orderBy: { order: 'asc' as const } },
  links: { orderBy: { order: 'asc' as const } },
}

@Injectable()
export class AdminProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const projects = await this.prisma.project.findMany({
      where: { deletedAt: null },
      orderBy: [{ isFeatured: 'desc' }, { featuredOrder: 'asc' }, { updatedAt: 'desc' }],
      include: { category: true, secondaryCategory: true },
    })
    return projects
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: ADMIN_PROJECT_INCLUDE,
    })
    if (!project) throw new NotFoundException(`프로젝트를 찾을 수 없습니다: ${id}`)
    return {
      ...project,
      tags: project.tags.map((pt) => pt.tag),
    }
  }

  async create(dto: CreateProjectDto) {
    const slug = dto.slug || generateSlug(dto.title)
    await this.assertSlugUnique(slug)

    const { tagIds, ...projectData } = dto

    const project = await this.prisma.project.create({
      data: {
        ...projectData,
        slug,
        tags: tagIds?.length
          ? {
              create: tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      },
      include: ADMIN_PROJECT_INCLUDE,
    })

    return { ...project, tags: project.tags.map((pt) => pt.tag) }
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id)

    if (dto.slug) {
      await this.assertSlugUnique(dto.slug, id)
    }

    const { tagIds, ...projectData } = dto

    // 태그 업데이트: 기존 삭제 후 재생성
    if (tagIds !== undefined) {
      await this.prisma.projectTag.deleteMany({ where: { projectId: id } })
      if (tagIds.length > 0) {
        await this.prisma.projectTag.createMany({
          data: tagIds.map((tagId) => ({ projectId: id, tagId })),
        })
      }
    }

    const project = await this.prisma.project.update({
      where: { id },
      data: projectData,
      include: ADMIN_PROJECT_INCLUDE,
    })

    return { ...project, tags: project.tags.map((pt) => pt.tag) }
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    return { message: '프로젝트가 삭제되었습니다.' }
  }

  async togglePublish(id: string) {
    const project = await this.findOne(id)
    return this.prisma.project.update({
      where: { id },
      data: { isPublished: !project.isPublished },
    })
  }

  async reorder(orderedIds: string[]) {
    await Promise.all(
      orderedIds.map((id, index) =>
        this.prisma.project.update({
          where: { id },
          data: { featuredOrder: index, isFeatured: true },
        }),
      ),
    )
    return { message: 'Featured 순서가 변경되었습니다.' }
  }

  async stats() {
    const [total, published, featured, unread] = await Promise.all([
      this.prisma.project.count({ where: { deletedAt: null } }),
      this.prisma.project.count({ where: { deletedAt: null, isPublished: true } }),
      this.prisma.project.count({ where: { deletedAt: null, isFeatured: true } }),
      this.prisma.contactMessage.count({ where: { isRead: false } }),
    ])
    return { total, published, featured, unreadMessages: unread }
  }

  private async assertSlugUnique(slug: string, excludeId?: string) {
    const existing = await this.prisma.project.findFirst({
      where: { slug, deletedAt: null, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    })
    if (existing) throw new ConflictException(`슬러그가 이미 사용 중입니다: ${slug}`)
  }
}
