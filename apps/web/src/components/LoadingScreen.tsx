'use client'

import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [textVisible, setTextVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    // 200ms: 텍스트 페이드 인
    const t1 = setTimeout(() => setTextVisible(true), 200)
    // 1400ms: 전체 화면 페이드 아웃 시작
    const t2 = setTimeout(() => setExiting(true), 1400)
    // 2200ms: DOM 제거
    const t3 = setTimeout(() => setGone(true), 2200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  if (gone) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        backgroundColor: 'var(--surface-base)',
        opacity: exiting ? 0 : 1,
        transition: exiting ? 'opacity 0.8s ease' : 'none',
        pointerEvents: exiting ? 'none' : 'auto',
      }}
    >
      <span
        className="text-2xl font-mono font-semibold tracking-tight text-text-primary select-none"
        style={{
          opacity: textVisible ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        binlog
      </span>
    </div>
  )
}
