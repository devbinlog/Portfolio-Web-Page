import { prisma } from '@/lib/server/prisma'
import { ok, apiError } from '@/lib/server/api-response'

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      include: { socialLinks: { orderBy: { order: 'asc' } } },
    })

    if (!profile) {
      return ok({
        name: 'binlog',
        roleTitle: 'Frontend Developer',
        tagline: 'Building imagination through structure and interaction.',
        bio: '',
        workingMethod: '',
        avatarUrl: null,
        resumeUrl: null,
        location: null,
        socialLinks: [],
      })
    }

    return ok(profile)
  } catch (e) {
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
