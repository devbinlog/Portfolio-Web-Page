import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'

export async function PATCH(req: NextRequest) {
  try {
    await verifyAuth(req)

    const body = await req.json()
    const { orderedIds } = body as { orderedIds: string[] }

    if (!Array.isArray(orderedIds)) {
      return apiError('orderedIds는 배열이어야 합니다.', 400)
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.project.update({
          where: { id },
          data: { featuredOrder: index, isFeatured: true },
        }),
      ),
    )

    return ok({ message: 'Featured 순서가 변경되었습니다.' })
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
