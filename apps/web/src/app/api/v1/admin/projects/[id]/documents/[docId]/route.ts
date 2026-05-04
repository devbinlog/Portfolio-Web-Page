import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; docId: string } },
) {
  try {
    await verifyAuth(req)

    const doc = await prisma.projectDocument.findFirst({
      where: { id: params.docId, projectId: params.id },
    })
    if (!doc) return apiError(`문서를 찾을 수 없습니다: ${params.docId}`, 404)

    const body = await req.json()
    const updated = await prisma.projectDocument.update({
      where: { id: params.docId },
      data: {
        ...body,
        isPlaceholder: body.url ? false : body.isPlaceholder,
      },
    })

    return ok(updated)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; docId: string } },
) {
  try {
    await verifyAuth(req)

    const doc = await prisma.projectDocument.findFirst({
      where: { id: params.docId, projectId: params.id },
    })
    if (!doc) return apiError(`문서를 찾을 수 없습니다: ${params.docId}`, 404)

    await prisma.projectDocument.delete({ where: { id: params.docId } })
    return ok({ message: '문서가 삭제되었습니다.' })
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
