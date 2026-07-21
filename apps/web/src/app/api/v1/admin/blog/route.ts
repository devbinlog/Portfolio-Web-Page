import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'
import { generateSlug } from '@portfolio/utils'

export async function GET(req: NextRequest) {
  try {
    await verifyAuth(req)

    const posts = await prisma.blogPost.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return ok(posts)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}

export async function POST(req: NextRequest) {
  try {
    await verifyAuth(req)

    const body = await req.json()
    const { title, slug: rawSlug, excerpt, content, coverImageUrl } = body

    if (!title || !content) return apiError('제목과 내용은 필수입니다.', 400)

    const slug = rawSlug || generateSlug(title)
    const existing = await prisma.blogPost.findFirst({ where: { slug } })
    if (existing) return apiError(`슬러그가 이미 사용 중입니다: ${slug}`, 409)

    const post = await prisma.blogPost.create({
      data: { title, slug, excerpt, content, coverImageUrl },
    })

    return ok(post, 201)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
