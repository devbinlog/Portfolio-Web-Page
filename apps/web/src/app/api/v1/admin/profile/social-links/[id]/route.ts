import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAuth(req)

    const link = await prisma.socialLink.findUnique({ where: { id: params.id } })
    if (!link) return apiError('소셜 링크를 찾을 수 없습니다.', 404)

    const body = await req.json()
    const updated = await prisma.socialLink.update({
      where: { id: params.id },
      data: body,
    })

    return ok(updated)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAuth(req)

    const link = await prisma.socialLink.findUnique({ where: { id: params.id } })
    if (!link) return apiError('소셜 링크를 찾을 수 없습니다.', 404)

    await prisma.socialLink.delete({ where: { id: params.id } })
    return ok({ message: '소셜 링크가 삭제되었습니다.' })
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
