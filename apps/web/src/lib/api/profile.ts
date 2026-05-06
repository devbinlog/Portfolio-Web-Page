import type { Profile } from '@portfolio/types'
import { prisma } from '@/lib/server/prisma'

const fallback: Profile = {
  id: 'default',
  name: 'binlog',
  roleTitle: 'AI / LLM Engineer & Frontend Developer',
  tagline: 'Developing imagination.',
  bio: '창의적인 아이디어를 구조화하고,\nAI와 인터랙션을 기반으로 실제 동작하는 시스템과 사용자 경험을 구현합니다.',
  workingMethod: '',
  avatarUrl: null,
  resumeUrl: null,
  location: 'Seoul, Korea',
  socialLinks: [],
}

export async function getProfile(): Promise<Profile> {
  try {
    const profile = await prisma.profile.findFirst({
      include: { socialLinks: { orderBy: { order: 'asc' } } },
    })
    return (profile ?? fallback) as unknown as Profile
  } catch {
    return fallback
  }
}
