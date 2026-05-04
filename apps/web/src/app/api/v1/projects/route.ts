import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { ok, apiError } from '@/lib/server/api-response'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const category = searchParams.get('category') ?? undefined
    const featured = searchParams.get('featured') === 'true' ? true : undefined
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
    const skip = (page - 1) * limit

    const where = {
      isPublished: true,
      deletedAt: null,
      ...(category ? { category: { slug: category } } : {}),
      ...(featured ? { isFeatured: true } : {}),
    }

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { featuredOrder: 'asc' }, { year: 'desc' }],
        include: {
          category: true,
          secondaryCategory: true,
          tags: { include: { tag: true } },
        },
      }),
      prisma.project.count({ where }),
    ])

    return ok({
      data: data.map((p) => ({ ...p, tags: p.tags.map((pt) => pt.tag) })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (e) {
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
