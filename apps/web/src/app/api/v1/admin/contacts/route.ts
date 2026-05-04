import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'

export async function GET(req: NextRequest) {
  try {
    await verifyAuth(req)

    const { searchParams } = req.nextUrl
    const unread = searchParams.get('unread') === 'true' ? true : undefined

    const messages = await prisma.contactMessage.findMany({
      where: unread ? { isRead: false } : {},
      orderBy: { createdAt: 'desc' },
    })

    return ok(messages)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
