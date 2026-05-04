import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { checkContactRateLimit } from '@/lib/server/rate-limit'
import { ok, apiError } from '@/lib/server/api-response'

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    await checkContactRateLimit(ip)

    const body = await req.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return apiError('name, email, message는 필수입니다.', 400)
    }

    await prisma.contactMessage.create({
      data: { name, email, message, ipAddress: ip },
    })

    return ok({ message: '메시지가 성공적으로 전송되었습니다.' }, 201)
  } catch (e) {
    if (e instanceof Error && e.message === 'RATE_LIMITED') {
      return apiError('요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.', 429)
    }
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
