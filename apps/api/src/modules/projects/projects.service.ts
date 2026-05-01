import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import type { ProjectsQueryDto } from './dto/projects-query.dto'

const PROJECT_INCLUDE = {
  category: true,
  secondaryCategory: true,
  tags: { include: { tag: true } },
  media: { orderBy: { order: 'asc' as const } },
  documents: { orderBy: { order: 'asc' as const } },
  links: { orderBy: { order: 'asc' as const } },
}

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProjectsQueryDto) {
    const { category, featured, page = 1, limit = 20 } = query
    const skip = (page - 1) * limit

    const where = {
      isPublished: true,
      deletedAt: null,
      ...(category ? { category: { slug: category } } : {}),
      ...(featured ? { isFeatured: true } : {}),
    }

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { featuredOrder: 'asc' }, { year: 'desc' }],
        include: {
          category: true,
          secondaryCategory: true,
          tags: { include: { tag: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ])

    return {
      data: data.map(this.formatSummary),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
      include: PROJECT_INCLUDE,
    })

    if (!project) {
      throw new NotFoundException(`프로젝트를 찾을 수 없습니다: ${slug}`)
    }

    return this.formatDetail(project)
  }

  private formatSummary(project: NonNullable<Awaited<ReturnType<ProjectsService['findBySlug']>>>) {
    return {
      ...project,
      tags: (project as unknown as { tags: { tag: { id: string; name: string; slug: string } }[] }).tags?.map((pt: { tag: unknown }) => pt.tag) || [],
    }
  }

  private formatDetail(project: Awaited<ReturnType<PrismaService['project']['findFirst']>>) {
    if (!project) return null
    // tags M:N 관계를 평탄화
    return {
      ...project,
      tags: (project as unknown as { tags: { tag: { id: string; name: string; slug: string } }[] }).tags?.map((pt: { tag: unknown }) => pt.tag) || [],
    }
  }
}
