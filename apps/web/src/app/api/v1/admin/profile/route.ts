import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { verifyAuth } from '@/lib/server/auth'
import { ok, apiError } from '@/lib/server/api-response'

export async function GET(req: NextRequest) {
  try {
    await verifyAuth(req)

    const profile = await prisma.profile.findFirst({
      include: { socialLinks: { orderBy: { order: 'asc' } } },
    })

    return ok(profile)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}

export async function PUT(req: NextRequest) {
  try {
    await verifyAuth(req)

    const body = await req.json()
    const existing = await prisma.profile.findFirst()

    if (existing) {
      const updated = await prisma.profile.update({
        where: { id: existing.id },
        data: body,
        include: { socialLinks: { orderBy: { order: 'asc' } } },
      })
      return ok(updated)
    }

    const created = await prisma.profile.create({
      data: {
        name: body.name ?? 'binlog',
        roleTitle: body.roleTitle ?? 'Frontend Developer',
        tagline: body.tagline ?? '',
        bio: body.bio ?? '',
        workingMethod: body.workingMethod ?? '',
        avatarUrl: body.avatarUrl,
        resumeUrl: body.resumeUrl,
        location: body.location,
      },
      include: { socialLinks: { orderBy: { order: 'asc' } } },
    })
    return ok(created, 201)
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return apiError('인증이 필요합니다.', 401)
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
