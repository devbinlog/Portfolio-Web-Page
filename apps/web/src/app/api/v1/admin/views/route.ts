import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'

export async function GET(req: NextRequest) {
  try {
    await verifyAuth(req)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [allViews, todayViews] = await Promise.all([
      prisma.pageView.aggregate({ _sum: { count: true } }),
      prisma.pageView.aggregate({
        where: { date: today },
        _sum: { count: true },
      }),
    ])

    return ok({
      totalAllTime: allViews._sum.count ?? 0,
      todayTotal: todayViews._sum.count ?? 0,
    })
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
