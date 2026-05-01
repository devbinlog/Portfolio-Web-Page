'use client'

import type { Profile } from '@portfolio/types'

interface HeroSectionProps {
  profile: Profile
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section
      className="absolute top-0 left-0 z-40 flex flex-col justify-center h-full w-full pointer-events-none px-6 md:px-10 lg:px-16"
      aria-label="히어로 섹션"
    >
      <div className="max-w-xl space-y-3">
        {/* 실명 — 가장 두드러지는 요소 */}
        <h1 className="text-display-xl md:text-display-2xl font-extrabold text-text-primary leading-none tracking-tight">
          {profile.name}
        </h1>

        {/* 역할 라인 */}
        <p className="text-lg md:text-xl font-normal text-text-secondary">
          {profile.roleTitle}
        </p>

        {/* 핵심 문장 */}
        <p className="text-base md:text-lg font-semibold text-text-primary leading-snug pt-1">
          창의적인 아이디어를 구조적으로 구체화하고,
          <br />
          도전적인 접근으로 실제 동작하는 시스템으로 구현합니다.
        </p>
      </div>
    </section>
  )
}
