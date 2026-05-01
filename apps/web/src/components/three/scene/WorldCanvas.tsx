'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { ProjectSummary } from '@portfolio/types'

const WorldScene = dynamic(() => import('./WorldScene').then((m) => m.WorldScene), {
  ssr: false,
})

interface WorldCanvasProps {
  projects: ProjectSummary[]
}

function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

export function WorldCanvas({ projects }: WorldCanvasProps) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    setSupported(!mobile && isWebGLSupported())
  }, [])

  // 판정 전 — 아무것도 렌더링하지 않음
  if (supported === null) return null

  // 미지원 or 모바일 — fallback이 처리
  if (!supported) return null

  return (
    <div className="world-canvas" aria-hidden="true">
      <WorldScene projects={projects} />
    </div>
  )
}
