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
  title: 'Taebin Kim — AI / LLM Engineer & Frontend Developer',
  description:
    'LLM / Search Systems / Interactive Web / 3D Experience. Designing systems that transform unstructured input into structured user experiences.',
}

export default async function HomePage() {
  const [featuredProjects, profile] = await Promise.all([
    getFeaturedProjects(),
    getProfile(),
  ])

  return (
    <div className="bg-surface-base cursor-none">
      <MainNav profile={profile} />
      <ProjectOverlay />

      <GuitarPickCursor />

      {/* ── 히어로 섹션 (3D 월드 + 마우스 트래킹) ── */}
      <div className="relative w-full h-dvh overflow-hidden">
        <HeroSection profile={profile} />
        <WorldCanvas projects={featuredProjects} />
        <MouseAudioVisualizer />
        <WorldFallback projects={featuredProjects} />
      </div>

      {/* ── 스크롤 섹션들 ── */}
      <HomeAboutSection profile={profile} />
      <HomeProjectsSection projects={featuredProjects} />
      <HomeContactSection />
    </div>
  )
}
