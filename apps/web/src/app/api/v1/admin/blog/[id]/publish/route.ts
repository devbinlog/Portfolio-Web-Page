import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await verifyAuth(req)

    const post = await prisma.blogPost.findUnique({ where: { id: params.id } })
    if (!post) return apiError('포스트를 찾을 수 없습니다.', 404)

    const isPublished = !post.isPublished
    const updated = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        isPublished,
        publishedAt: isPublished && !post.publishedAt ? new Date() : post.publishedAt,
      },
    })

    return ok(updated)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
