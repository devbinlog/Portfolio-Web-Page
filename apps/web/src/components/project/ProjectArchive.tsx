import Link from 'next/link'
import type { ProjectSummary } from '@portfolio/types'

interface ProjectArchiveProps {
  projects: ProjectSummary[]
}

export function ProjectArchive({ projects }: ProjectArchiveProps) {
  return (
    <div>
      {/* 프로젝트 그리드 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group block p-5 rounded-lg border border-border-default bg-surface-elevated hover:border-border-strong transition-colors"
          >
            {project.thumbnailUrl ? (
              <div className="aspect-video rounded bg-surface-input mb-4 overflow-hidden">
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video rounded bg-surface-input mb-4" />
            )}

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-text-disabled">{project.year}</span>
            </div>

            <h3 className="text-base font-semibold text-text-primary group-hover:text-text-link">
              {project.title}
            </h3>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed whitespace-pre-line">
              {project.summary}
            </p>

            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-1.5 py-0.5 text-xs font-mono text-text-secondary bg-accent-muted rounded"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-text-secondary text-sm">프로젝트가 없습니다.</p>
      )}
    </div>
  )
}
