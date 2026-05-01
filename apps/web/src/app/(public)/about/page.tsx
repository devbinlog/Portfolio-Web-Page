import type { Metadata } from 'next'
import { MainNav } from '@/components/layout/MainNav'
import { IdentitySection } from '@/components/sections/about/IdentitySection'
import { WorkingMethodSection } from '@/components/sections/about/WorkingMethodSection'
import { SkillsSection } from '@/components/sections/about/SkillsSection'
import { getProfile } from '@/lib/api/profile'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Taebin Kim에 대해. 문제를 구조적으로 분해하고, 설계 후 구현하며, 배포와 유지보수를 처음부터 고려하는 개발자.',
}

export default async function AboutPage() {
  const profile = await getProfile()

  return (
    <div className="min-h-dvh bg-surface-base">
      <MainNav profile={profile} />
      <div className="max-w-container-narrow mx-auto px-6 pt-32 pb-24 space-y-14">
        <IdentitySection profile={profile} />
        <SkillsSection />
        <WorkingMethodSection workingMethod={profile.workingMethod} />
      </div>
    </div>
  )
}
