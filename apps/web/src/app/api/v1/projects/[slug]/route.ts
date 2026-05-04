import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { ok, apiError } from '@/lib/server/api-response'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const project = await prisma.project.findFirst({
      where: { slug: params.slug, isPublished: true, deletedAt: null },
      include: {
        category: true,
        secondaryCategory: true,
        tags: { include: { tag: true } },
        media: { orderBy: { order: 'asc' } },
        documents: { orderBy: { order: 'asc' } },
        links: { orderBy: { order: 'asc' } },
      },
    })

    if (!project) {
      return apiError(`프로젝트를 찾을 수 없습니다: ${params.slug}`, 404)
    }

    return ok({ ...project, tags: project.tags.map((pt) => pt.tag) })
  } catch (e) {
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
