'use client'

import { useEffect, useState } from 'react'
import type { ProjectSummary } from '@portfolio/types'
import { useOverlayStore } from '@/stores/overlayStore'

interface WorldFallbackProps {
  projects: ProjectSummary[]
}

function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

export function WorldFallback({ projects }: WorldFallbackProps) {
  const [showFallback, setShowFallback] = useState(false)
  const openOverlay = useOverlayStore((s) => s.openOverlay)

  useEffect(() => {
    const mobile = window.innerWidth < 768
    const noWebGL = !isWebGLSupported()
    setShowFallback(mobile || noWebGL)
  }, [])

  if (!showFallback) return null

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pt-24 pb-10 overflow-y-auto"
      aria-label="프로젝트 목록"
    >
      <div className="w-full max-w-md space-y-3 mt-auto">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => openOverlay(project.slug)}
            className="w-full text-left p-4 rounded-lg border border-border-default bg-surface-elevated hover:border-border-strong transition-colors"
          >
            <p className="text-xs text-text-secondary font-mono mb-1">
              {project.category.name}
            </p>
            <p className="text-sm font-semibold text-text-primary">{project.title}</p>
            <p className="text-xs text-text-secondary mt-0.5">{project.summary}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
