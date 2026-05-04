import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'

const ADMIN_PROJECT_INCLUDE = {
  category: true,
  secondaryCategory: true,
  tags: { include: { tag: true } },
  media: { orderBy: { order: 'asc' as const } },
  documents: { orderBy: { order: 'asc' as const } },
  links: { orderBy: { order: 'asc' as const } },
}

async function findProject(id: string) {
  const project = await prisma.project.findFirst({
    where: { id, deletedAt: null },
    include: ADMIN_PROJECT_INCLUDE,
  })
  return project
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAuth(req)
    const project = await findProject(params.id)
    if (!project) return apiError(`프로젝트를 찾을 수 없습니다: ${params.id}`, 404)
    return ok({ ...project, tags: project.tags.map((pt) => pt.tag) })
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAuth(req)

    const existing = await findProject(params.id)
    if (!existing) return apiError(`프로젝트를 찾을 수 없습니다: ${params.id}`, 404)

    const body = await req.json()
    const { tagIds, slug, ...projectData } = body

    if (slug && slug !== existing.slug) {
      const conflict = await prisma.project.findFirst({
        where: { slug, deletedAt: null, NOT: { id: params.id } },
      })
      if (conflict) return apiError(`슬러그가 이미 사용 중입니다: ${slug}`, 409)
    }

    if (tagIds !== undefined) {
      await prisma.projectTag.deleteMany({ where: { projectId: params.id } })
      if ((tagIds as string[]).length > 0) {
        await prisma.projectTag.createMany({
          data: (tagIds as string[]).map((tagId) => ({ projectId: params.id, tagId })),
        })
      }
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: { ...projectData, ...(slug ? { slug } : {}) },
      include: ADMIN_PROJECT_INCLUDE,
    })

    return ok({ ...project, tags: project.tags.map((pt) => pt.tag) })
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAuth(req)

    const existing = await findProject(params.id)
    if (!existing) return apiError(`프로젝트를 찾을 수 없습니다: ${params.id}`, 404)

    await prisma.project.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })

    return ok({ message: '프로젝트가 삭제되었습니다.' })
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
