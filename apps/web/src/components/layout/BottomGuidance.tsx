'use client'

import { useWorldStore } from '@/stores/worldStore'

export function BottomGuidance() {
  const phase = useWorldStore((s) => s.phase)

  if (phase === 'overlay' || phase === 'detail') return null

  return (
    <div
      className="absolute bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
      aria-hidden="true"
    >
      <p className="text-xs text-text-secondary tracking-wide select-none">
        Select a project object to explore its story, visuals, documents, and implementation.
      </p>
    </div>
  )
}
