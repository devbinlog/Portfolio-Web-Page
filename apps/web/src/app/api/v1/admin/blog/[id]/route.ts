import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'
import { generateSlug } from '@portfolio/utils'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await verifyAuth(req)

    const post = await prisma.blogPost.findUnique({ where: { id: params.id } })
    if (!post) return apiError('포스트를 찾을 수 없습니다.', 404)

    return ok(post)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await verifyAuth(req)

    const body = await req.json()
    const { title, slug: rawSlug, excerpt, content, coverImageUrl } = body

    const post = await prisma.blogPost.findUnique({ where: { id: params.id } })
    if (!post) return apiError('포스트를 찾을 수 없습니다.', 404)

    const slug = rawSlug || generateSlug(title ?? post.title)

    if (slug !== post.slug) {
      const conflict = await prisma.blogPost.findFirst({ where: { slug, NOT: { id: params.id } } })
      if (conflict) return apiError(`슬러그가 이미 사용 중입니다: ${slug}`, 409)
    }

    const updated = await prisma.blogPost.update({
      where: { id: params.id },
      data: { title, slug, excerpt, content, coverImageUrl },
    })

    return ok(updated)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await verifyAuth(req)

    const post = await prisma.blogPost.findUnique({ where: { id: params.id } })
    if (!post) return apiError('포스트를 찾을 수 없습니다.', 404)

    await prisma.blogPost.delete({ where: { id: params.id } })

    return ok({ message: '삭제되었습니다.' })
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
