'use client'

import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [opacity, setOpacity] = useState(0)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    // 50ms: 페이드 인 시작
    const t1 = setTimeout(() => setOpacity(1), 50)
    // 1100ms: 페이드 아웃 시작
    const t2 = setTimeout(() => setOpacity(0), 1100)
    // 1800ms: DOM에서 제거
    const t3 = setTimeout(() => setMounted(false), 1800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
      style={{
        opacity,
        transition: 'opacity 0.65s ease',
        backgroundColor: 'var(--surface-base)',
      }}
    >
      <span className="text-2xl font-mono font-semibold tracking-tight text-text-primary select-none">
        binlog
      </span>
    </div>
  )
}
