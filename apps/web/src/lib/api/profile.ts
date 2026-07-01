import type { Profile } from '@portfolio/types'
import { prisma } from '@/lib/server/prisma'

const fallback: Profile = {
  id: 'default',
  name: 'binlog',
  roleTitle: 'AX Engineer & Frontend Developer',
  tagline: 'Developing imagination.',
  bio: 'AI를 단순히 기능으로 추가하는 것이 아니라, 사용자의 문제를 해결하고 서비스의 흐름을 개선하는 도구로 활용합니다.\n\n서비스를 개별 기능의 집합이 아닌 하나의 경험으로 바라봅니다. 사용자의 입력부터 처리 과정, 결과와 피드백까지 자연스럽게 이어지는 흐름을 먼저 설계한 뒤 구현합니다.\n\n프로젝트마다 해결해야 하는 문제를 분석하고, 필요한 데이터 구조와 시스템 흐름을 정의합니다. 프론트엔드와 AI, 백엔드가 하나의 서비스 안에서 유기적으로 연결될 수 있도록 설계합니다.\n\n새로운 기술을 적용하는 것보다 실제 사용자에게 어떤 경험과 가치를 제공할 수 있는지를 우선으로 생각하며, 효율성과 완성도를 함께 고려한 개발 방식을 지향합니다.\n\n이러한 접근을 바탕으로 AI 기술을 실제 서비스에 자연스럽게 녹여내고, 아이디어를 사용자가 직접 경험할 수 있도록 구현하는 것을 목표로 합니다.',
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
