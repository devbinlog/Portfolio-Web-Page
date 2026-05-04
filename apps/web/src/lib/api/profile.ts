import type { Profile } from '@portfolio/types'
import { prisma } from '@/lib/server/prisma'

const fallback: Profile = {
  id: 'default',
  name: 'binlog',
  roleTitle: 'AI / LLM Engineer & Frontend Developer',
  tagline: 'Designing systems that transform unstructured input into structured user experiences.',
  bio: '',
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
