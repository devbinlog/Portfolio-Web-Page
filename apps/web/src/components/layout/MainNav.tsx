'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import type { Profile } from '@portfolio/types'

interface MainNavProps {
  profile: Profile
}

export function MainNav({ profile }: MainNavProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5"
      role="banner"
    >
      {/* 로고 / 실명 */}
      <Link
        href="/"
        className="text-sm font-semibold tracking-tight text-text-primary hover:text-text-secondary transition-colors"
      >
        {profile.name}
      </Link>

      {/* 내비게이션 링크 */}
      <nav aria-label="주요 내비게이션">
        <ul className="flex items-center gap-6">
          <li>
            <Link
              href="/about"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              About Me
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      {/* 테마 토글 */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 flex items-center justify-center rounded text-text-secondary hover:text-text-primary hover:bg-accent-muted transition-colors"
          aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12.5A5.5 5.5 0 1 1 8 2.5a5.5 5.5 0 0 1 0 11z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
            </svg>
          )}
        </button>
      )}
    </header>
  )
}
