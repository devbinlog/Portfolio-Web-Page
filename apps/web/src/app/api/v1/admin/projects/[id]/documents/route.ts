import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAuth(req)

    const project = await prisma.project.findUnique({ where: { id: params.id } })
    if (!project) return apiError(`프로젝트를 찾을 수 없습니다: ${params.id}`, 404)

    const docs = await prisma.projectDocument.findMany({
      where: { projectId: params.id },
      orderBy: { order: 'asc' },
    })

    return ok(docs)
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
    const maxOrder = await prisma.projectDocument.aggregate({
      where: { projectId: params.id },
      _max: { order: true },
    })

    const doc = await prisma.projectDocument.create({
      data: {
        projectId: params.id,
        type: body.type,
        title: body.title,
        url: body.url ?? null,
        placeholderLabel: body.placeholderLabel ?? null,
        order: body.order ?? (maxOrder._max.order ?? -1) + 1,
        isPlaceholder: body.isPlaceholder ?? !body.url,
      },
    })

    return ok(doc, 201)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
