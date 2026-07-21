import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { ok, apiError } from '@/lib/server/api-response'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug: params.slug, isPublished: true },
    })

    if (!post) return apiError('포스트를 찾을 수 없습니다.', 404)

    return ok(post)
  } catch (e) {
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
