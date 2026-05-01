import type { Profile } from '@portfolio/types'
import { apiFetch } from './client'

export async function getProfile(): Promise<Profile> {
  try {
    return await apiFetch<Profile>('/profile', { cache: 'no-store' })
  } catch {
    // API 미연결 시 기본값 반환 (개발 환경용)
    return {
      id: 'default',
      name: 'Taebin Kim',
      roleTitle: 'Frontend Developer',
      tagline: 'Building imagination through structure and interaction.',
      bio: '구조와 인터랙션으로 상상을 현실로 만드는 프론트엔드 개발자입니다.',
      workingMethod:
        '문제를 기능 단위가 아닌 구조적으로 분해합니다.\n구현 전에 문서와 아키텍처를 정의합니다.\n데이터 구조와 사용자 경험을 함께 설계합니다.\n배포, 유지보수, 운영을 처음부터 고려합니다.',
      avatarUrl: null,
      resumeUrl: null,
      location: 'Seoul, Korea',
      socialLinks: [
        { id: '1', platform: 'GitHub', url: 'https://github.com/taebinkim', order: 1 },
      ],
    }
  }
}
