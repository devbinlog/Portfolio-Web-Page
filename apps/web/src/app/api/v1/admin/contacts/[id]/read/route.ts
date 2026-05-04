import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await verifyAuth(req)

    const msg = await prisma.contactMessage.findUnique({ where: { id: params.id } })
    if (!msg) return apiError('메시지를 찾을 수 없습니다.', 404)

    const updated = await prisma.contactMessage.update({
      where: { id: params.id },
      data: { isRead: true },
    })

    return ok(updated)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
