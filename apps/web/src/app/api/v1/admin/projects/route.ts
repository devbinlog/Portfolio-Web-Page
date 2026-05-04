import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'
import { generateSlug } from '@portfolio/utils'

const ADMIN_PROJECT_INCLUDE = {
  category: true,
  secondaryCategory: true,
  tags: { include: { tag: true } },
  media: { orderBy: { order: 'asc' as const } },
  documents: { orderBy: { order: 'asc' as const } },
  links: { orderBy: { order: 'asc' as const } },
}

export async function GET(req: NextRequest) {
  try {
    await verifyAuth(req)

    const projects = await prisma.project.findMany({
      where: { deletedAt: null },
      orderBy: [{ isFeatured: 'desc' }, { featuredOrder: 'asc' }, { updatedAt: 'desc' }],
      include: { category: true, secondaryCategory: true },
    })

    return ok(projects)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}

export async function POST(req: NextRequest) {
  try {
    await verifyAuth(req)

    const body = await req.json()
    const { tagIds, slug: rawSlug, ...projectData } = body

    const slug = rawSlug || generateSlug(projectData.title)

    const existing = await prisma.project.findFirst({ where: { slug, deletedAt: null } })
    if (existing) return apiError(`슬러그가 이미 사용 중입니다: ${slug}`, 409)

    const project = await prisma.project.create({
      data: {
        ...projectData,
        slug,
        tags: tagIds?.length
          ? { create: (tagIds as string[]).map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: ADMIN_PROJECT_INCLUDE,
    })

    return ok({ ...project, tags: project.tags.map((pt) => pt.tag) }, 201)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
