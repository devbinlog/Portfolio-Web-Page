import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'

export async function POST(req: NextRequest) {
  try {
    await verifyAuth(req)

    const profile = await prisma.profile.findFirst()
    if (!profile) return apiError('프로필이 없습니다.', 404)

    const body = await req.json()
    const maxOrder = await prisma.socialLink.aggregate({
      where: { profileId: profile.id },
      _max: { order: true },
    })

    const link = await prisma.socialLink.create({
      data: {
        profileId: profile.id,
        platform: body.platform,
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
