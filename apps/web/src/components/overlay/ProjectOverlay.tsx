'use client'

import { useEffect, useRef } from 'react'
import { useOverlayStore } from '@/stores/overlayStore'
import { PlaceholderSlot } from '@/components/project/PlaceholderSlot'
import Link from 'next/link'
import type { ProjectDetail } from '@portfolio/types'
import { useState } from 'react'

export function ProjectOverlay() {
  const { isOpen, projectId, closeOverlay } = useOverlayStore()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!projectId) {
      setProject(null)
      return
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    fetch(`${apiUrl}/projects/${projectId}`)
      .then((r) => r.json())
      .then(setProject)
      .catch(() => setProject(null))
  }, [projectId])

  // ESC 키로 닫기
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeOverlay()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, closeOverlay])

  // 포커스 트랩
  useEffect(() => {
    if (isOpen && overlayRef.current) {
      overlayRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 z-40 bg-surface-overlay backdrop-blur-sm"
        onClick={closeOverlay}
        aria-hidden="true"
      />

      {/* 패널 */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label={project ? `${project.title} 상세 정보` : '프로젝트 상세 정보'}
        tabIndex={-1}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-surface-base border-l border-border-default overflow-y-auto focus:outline-none"
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-surface-base border-b border-border-default px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary truncate">
            {project?.title || '로딩 중...'}
          </h2>
          <button
            onClick={closeOverlay}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-accent-muted text-text-secondary hover:text-text-primary transition-colors shrink-0"
            aria-label="닫기"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 콘텐츠 */}
        {!project ? (
          <div className="px-6 py-8 text-sm text-text-secondary">불러오는 중...</div>
        ) : (
          <div className="px-6 py-6 space-y-8">
            {/* 메타 */}
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span>{project.year}</span>
              <span className="text-text-disabled">/</span>
              <span>{project.role}</span>
            </div>

            {/* 요약 */}
            <p className="text-sm text-text-secondary leading-relaxed">{project.summary}</p>

            {/* 기술 스택 */}
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-xs font-mono text-text-secondary bg-surface-input border border-border-default rounded"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* 미디어 플레이스홀더 */}
            {project.media.some((m) => m.isPlaceholder) && (
              <div className="space-y-2">
                {project.media
                  .filter((m) => m.isPlaceholder)
                  .map((m) => (
                    <PlaceholderSlot
                      key={m.id}
                      type={m.type === 'VIDEO_PLACEHOLDER' ? 'video' : 'image'}
                      label={m.placeholderLabel}
                    />
                  ))}
              </div>
            )}

            {/* 문서 플레이스홀더 */}
            {project.documents.some((d) => d.isPlaceholder) && (
              <div className="space-y-2">
                {project.documents
                  .filter((d) => d.isPlaceholder)
                  .map((d) => (
                    <PlaceholderSlot
                      key={d.id}
                      type="document"
                      label={d.placeholderLabel}
                      title={d.title}
                    />
                  ))}
              </div>
            )}

            {/* 링크 */}
            {project.links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded border border-border-default text-xs text-text-primary hover:border-border-strong hover:bg-surface-elevated transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {/* 상세 페이지 링크 */}
            <div className="pt-2 border-t border-border-default">
              <Link
                href={`/projects/${project.slug}`}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors underline underline-offset-4"
                onClick={closeOverlay}
              >
                전체 내용 보기 →
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
