import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MainNav } from '@/components/layout/MainNav'
import { ProjectDetailContent } from '@/components/project/ProjectDetailContent'
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/api/projects'
import { getProfile } from '@/lib/api/profile'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)
  if (!project) return {}

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} | binlog`,
      description: project.summary,
      images: project.heroImageUrl ? [project.heroImageUrl] : [],
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params }: PageProps) {
  const [project, profile] = await Promise.all([
    getProjectBySlug(params.slug),
    getProfile(),
  ])

  if (!project) notFound()

  return (
    <div className="min-h-dvh bg-surface-base">
      <MainNav profile={profile} />
      <div className="max-w-container-narrow mx-auto px-6 pt-32 pb-24">
        <ProjectDetailContent project={project} />
      </div>
    </div>
  )
}
