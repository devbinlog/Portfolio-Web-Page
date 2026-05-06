import type { Profile } from '@portfolio/types'
import { prisma } from '@/lib/server/prisma'

const fallback: Profile = {
  id: 'default',
  name: '김태빈',
  roleTitle: 'AI / LLM Engineer & Frontend Developer',
  tagline: 'Developing imagination.',
  bio: 'AI를 단순히 개발을 대신하는 도구가 아니라, 함께 문제를 해결하는 파트너로 활용합니다.\n\n작업을 하나의 흐름으로 처리하기보다 역할 단위로 나누고, 각 역할을 에이전트로 분리하여\n구조적으로 설계한 뒤 작업을 진행합니다.\n\n프로젝트마다 필요한 역할을 정의하고, 에이전트 단위로 세분화하여 각 영역을 독립적으로\n구현하고 연결합니다.\n\n이 방식은 개인이 수행할 수 있는 작업이라도 효율성과 시간, 비용을 줄이면서\n동시에 결과의 완성도를 높이기 위해 사용하고 있습니다.\n\n이 구조를 기반으로 다양한 시스템을 빠르게 설계하고 실제로 동작하는 결과까지 구현하는\n개발 방식을 유지하고 있습니다.',
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
