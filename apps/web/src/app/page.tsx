import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { WorldCanvas } from '@/components/three/scene/WorldCanvas'
import { WorldFallback } from '@/components/three/scene/WorldFallback'
import { MouseAudioVisualizer } from '@/components/three/scene/MouseAudioVisualizer'
import { GuitarPickCursor } from '@/components/three/scene/GuitarPickCursor'
import { ProjectOverlay } from '@/components/overlay/ProjectOverlay'
import { MainNav } from '@/components/layout/MainNav'
import { HomeAboutSection } from '@/components/sections/home/HomeAboutSection'
import { HomeProjectsSection } from '@/components/sections/home/HomeProjectsSection'
import { HomeContactSection } from '@/components/sections/home/HomeContactSection'
import { getFeaturedProjects } from '@/lib/api/projects'
import { getProfile } from '@/lib/api/profile'

export const metadata: Metadata = {
  title: 'binlog — AI / LLM Engineer & Frontend Developer',
  description:
    'LLM / Search Systems / Interactive Web / 3D Experience. Designing systems that transform unstructured input into structured user experiences.',
}

export default async function HomePage() {
  const [featuredProjects, profile] = await Promise.all([
    getFeaturedProjects(),
    getProfile(),
  ])

  return (
    <div className="bg-surface-base md:cursor-none">
      <MainNav profile={profile} />
      <ProjectOverlay />

      <GuitarPickCursor />

      {/* ── 히어로 섹션 (데스크탑: 3D 월드) ── */}
      <div className="hidden md:block relative w-full h-dvh overflow-hidden">
        <HeroSection profile={profile} />
        <WorldCanvas projects={featuredProjects} />
        <MouseAudioVisualizer />
        <WorldFallback projects={featuredProjects} />
      </div>

      {/* ── 히어로 섹션 (모바일) ── */}
      <section
        className="md:hidden pt-20 pb-10 px-6 min-h-[55dvh] flex flex-col justify-center border-b border-border-default"
        aria-label="히어로 섹션"
      >
        <div className="max-w-xl space-y-3">
          <h1 className="text-[2.75rem] font-extrabold text-text-primary leading-none tracking-tight">
            Taebin Kim
          </h1>
          <p className="text-lg font-normal text-text-secondary">{profile.roleTitle}</p>
          <p className="text-base font-semibold text-text-primary leading-snug pt-1">
            {profile.tagline}
          </p>
        </div>
      </section>

      {/* ── 스크롤 섹션들 ── */}
      <HomeAboutSection profile={profile} />
      <HomeProjectsSection projects={featuredProjects} />
      <HomeContactSection />
    </div>
  )
}
