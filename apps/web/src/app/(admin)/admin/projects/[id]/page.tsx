'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { adminApi } from '@/lib/api/admin'
import type { ProjectDetail, ProjectMedia, ProjectDocument, ProjectLink } from '@portfolio/types'
import ProjectForm from '@/components/sections/admin/ProjectForm'
import MediaManager from '@/components/sections/admin/MediaManager'
import DocumentManager from '@/components/sections/admin/DocumentManager'
import LinkManager from '@/components/sections/admin/LinkManager'

type Tab = 'info' | 'media' | 'documents' | 'links'

export default function AdminProjectEditPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('info')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    adminApi.projects
      .get(params.id)
      .then(setProject)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [params.id])

  function handleInfoSuccess(updated: ProjectDetail) {
    setProject(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-surface-elevated rounded animate-pulse" />
        <div className="h-64 bg-surface-elevated rounded animate-pulse" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="text-center py-20">
        <p className="text-feedback-error text-sm">{error || '프로젝트를 찾을 수 없습니다.'}</p>
        <button
          onClick={() => router.push('/admin/projects')}
          className="mt-4 text-accent-default hover:underline text-sm"
        >
          목록으로
        </button>
      </div>
    )
  }

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'info', label: '기본 정보' },
    { id: 'media', label: '미디어', count: project.media.length },
    { id: 'documents', label: '문서', count: project.documents.length },
    { id: 'links', label: '링크', count: project.links.length },
  ]

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/projects')}
          className="text-xs text-text-secondary hover:text-text-primary mb-4 block"
        >
          ← 목록으로
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-text-primary">{project.title}</h1>
          {saved && (
            <span className="text-xs text-feedback-success">저장됨</span>
          )}
        </div>
        <p className="text-xs text-text-secondary mt-1 font-mono">/projects/{project.slug}</p>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 border-b border-border-default mb-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? 'border-accent-default text-text-primary font-medium'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="ml-1.5 text-xs text-text-disabled">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {tab === 'info' && (
        <ProjectForm initial={project} onSuccess={handleInfoSuccess} />
      )}

      {tab === 'media' && (
        <MediaManager
          projectId={project.id}
          items={project.media}
          onChange={(media) => setProject({ ...project, media: media as ProjectMedia[] })}
        />
      )}

      {tab === 'documents' && (
        <DocumentManager
          projectId={project.id}
          items={project.documents}
          onChange={(documents) =>
            setProject({ ...project, documents: documents as ProjectDocument[] })
          }
        />
      )}

      {tab === 'links' && (
        <LinkManager
          projectId={project.id}
          items={project.links}
          onChange={(links) => setProject({ ...project, links: links as ProjectLink[] })}
        />
      )}
    </div>
  )
}
