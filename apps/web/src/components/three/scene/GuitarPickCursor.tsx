'use client'

import { useEffect, useRef } from 'react'

/**
 * 기타 피크 커서 — 히어로 섹션에서만 표시.
 * 피크 뾰족한 팁이 7시 방향(30° 시계방향 회전).
 *
 * 팁 좌표 계산:
 *   원래 팁: SVG (10, 25), SVG 중심: (10, 13)
 *   중심 대비 오프셋: (0, 12)
 *   30° 회전 후: (12·sin30°, 12·cos30°) = (6, 10.4)
 *   회전된 팁 SVG 좌표: (16, 23.4)
 *   → div offset: translate(clientX - 16, clientY - 23)
 */
export function GuitarPickCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 23}px)`
      el.style.opacity   = '1'
    }

    const onLeave = () => { el.style.opacity = '0' }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 z-[200] pointer-events-none opacity-0 will-change-transform"
      aria-hidden="true"
    >
      {/* 30° 시계방향 회전 → 팁이 7시 방향 */}
      <svg
        width="20"
        height="26"
        viewBox="0 0 20 26"
        fill="none"
        style={{ transform: 'rotate(30deg)', transformOrigin: '10px 13px' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 25C6.5 19.5 1 15 1 9.5C1 4.8 5.1 1 10 1C14.9 1 19 4.8 19 9.5C19 15 13.5 19.5 10 25Z"
          fill="black"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  )
}
