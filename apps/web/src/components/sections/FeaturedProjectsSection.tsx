import Link from 'next/link'
import type { ProjectSummary } from '@portfolio/types'
import { TechBadge } from '@/components/ui/TechBadge'

interface FeaturedProjectsSectionProps {
  projects: ProjectSummary[]
}

const PROJECT_INDEX = ['01', '02', '03', '04', '05', '06']

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  if (projects.length === 0) return null

  return (
    <section
      className="bg-surface-base border-t border-border-default"
      aria-labelledby="featured-heading"
    >
      <div className="max-w-container-wide mx-auto px-6 py-24 md:py-32">
        {/* 섹션 헤더 */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mb-3">
              Featured Projects
            </p>
            <h2
              id="featured-heading"
              className="text-display-sm font-bold text-text-primary leading-tight"
            >
              Systems I&apos;ve built
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden md:inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors group"
          >
            View all projects
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="group-hover:translate-x-0.5 transition-transform"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>

        {/* 프로젝트 카드 그리드 */}
        <div className="grid gap-px bg-border-default border border-border-default rounded-lg overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* 모바일 All Projects 링크 */}
        <div className="mt-8 md:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            View all projects
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
}: {
  project: ProjectSummary
  index: number
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col bg-surface-base hover:bg-surface-elevated transition-colors p-6 md:p-8"
    >
      {/* 인덱스 + 썸네일 */}
      <div className="mb-6">
        {project.thumbnailUrl ? (
          <div className="aspect-video rounded-md overflow-hidden bg-surface-input mb-4">
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="aspect-video rounded-md bg-surface-input mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-text-disabled select-none">
              {PROJECT_INDEX[index] ?? '0' + (index + 1)}
            </span>
          </div>
        )}
        <span className="text-xs font-mono text-text-disabled">{PROJECT_INDEX[index]}</span>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-text-link transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
          {project.summary}
        </p>

        {/* 기술 스택 뱃지 (최대 3개) */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <TechBadge key={tag.id} name={tag.name} />
            ))}
            {project.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 text-xs text-text-disabled">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* View link */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-text-disabled group-hover:text-text-secondary transition-colors mt-auto">
          <span>View case study</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="group-hover:translate-x-0.5 transition-transform"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
