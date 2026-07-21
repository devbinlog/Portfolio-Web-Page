import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { ok, apiError } from '@/lib/server/api-response'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { page } = body

    if (!page || typeof page !== 'string') return apiError('page가 필요합니다.', 400)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.pageView.upsert({
      where: { page_date: { page, date: today } },
      update: { count: { increment: 1 } },
      create: { page, date: today, count: 1 },
    })

    return ok({ ok: true })
  } catch (e) {
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
