import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import type { CreateDocumentDto } from './dto/create-document.dto'
import type { UpdateDocumentDto } from './dto/update-document.dto'

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId: string) {
    await this.assertProjectExists(projectId)
    return this.prisma.projectDocument.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    })
  }

  async create(projectId: string, dto: CreateDocumentDto) {
    await this.assertProjectExists(projectId)
    const maxOrder = await this.prisma.projectDocument.aggregate({
      where: { projectId },
      _max: { order: true },
    })

    return this.prisma.projectDocument.create({
      data: {
        projectId,
        type: dto.type,
        title: dto.title,
        url: dto.url ?? null,
        placeholderLabel: dto.placeholderLabel ?? null,
        order: dto.order ?? (maxOrder._max.order ?? -1) + 1,
        isPlaceholder: dto.isPlaceholder ?? !dto.url,
      },
    })
  }

  async update(projectId: string, docId: string, dto: UpdateDocumentDto) {
    await this.assertDocumentExists(projectId, docId)
    return this.prisma.projectDocument.update({
      where: { id: docId },
      data: {
        ...dto,
        isPlaceholder: dto.url ? false : dto.isPlaceholder,
      },
    })
  }

  async remove(projectId: string, docId: string) {
    await this.assertDocumentExists(projectId, docId)
    await this.prisma.projectDocument.delete({ where: { id: docId } })
    return { message: '문서가 삭제되었습니다.' }
  }

  async reorder(projectId: string, orderedIds: string[]) {
    await this.assertProjectExists(projectId)
    await Promise.all(
      orderedIds.map((id, index) =>
        this.prisma.projectDocument.update({
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

  private async assertDocumentExists(projectId: string, docId: string) {
    const doc = await this.prisma.projectDocument.findFirst({
      where: { id: docId, projectId },
    })
    if (!doc) throw new NotFoundException(`문서를 찾을 수 없습니다: ${docId}`)
  }
}
