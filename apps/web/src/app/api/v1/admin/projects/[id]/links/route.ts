import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAuth(req)

    const project = await prisma.project.findUnique({ where: { id: params.id } })
    if (!project) return apiError(`프로젝트를 찾을 수 없습니다: ${params.id}`, 404)

    const links = await prisma.projectLink.findMany({
      where: { projectId: params.id },
      orderBy: { order: 'asc' },
    })

    return ok(links)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAuth(req)

    const project = await prisma.project.findUnique({ where: { id: params.id } })
    if (!project) return apiError(`프로젝트를 찾을 수 없습니다: ${params.id}`, 404)

    const body = await req.json()
    const maxOrder = await prisma.projectLink.aggregate({
      where: { projectId: params.id },
      _max: { order: true },
    })

    const link = await prisma.projectLink.create({
      data: {
        projectId: params.id,
        type: body.type,
        label: body.label,
        url: body.url,
        order: body.order ?? (maxOrder._max.order ?? -1) + 1,
      },
    })

    return ok(link, 201)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
