import type { Metadata } from 'next'
import { MainNav } from '@/components/layout/MainNav'
import { ProjectArchive } from '@/components/project/ProjectArchive'
import { ProjectsPageHeader } from '@/components/sections/projects/ProjectsPageHeader'
import { getAllProjects } from '@/lib/api/projects'
import { getProfile } from '@/lib/api/profile'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Taebin Kim의 프로젝트 아카이브. BandStage, PageOfArtist, MUSE 외 다수.',
}

export default async function ProjectsPage() {
  const [projects, profile] = await Promise.all([getAllProjects(), getProfile()])

  return (
    <div className="min-h-dvh bg-surface-base">
      <MainNav profile={profile} />
      <div className="max-w-container-wide mx-auto px-6 pt-32 pb-24">
        <ProjectsPageHeader count={projects.length} />
        <ProjectArchive projects={projects} />
      </div>
    </div>
  )
}
