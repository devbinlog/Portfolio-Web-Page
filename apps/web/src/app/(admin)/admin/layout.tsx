'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminAuthStore } from '@/stores/adminAuthStore'

const NAV_ITEMS = [
  { href: '/admin', label: '대시보드' },
  { href: '/admin/projects', label: '프로젝트' },
  { href: '/admin/contacts', label: '연락 메시지' },
  { href: '/admin/profile', label: '프로필' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdminAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/admin/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  function handleLogout() {
    logout()
    router.replace('/admin/login')
  }

  return (
    <div className="min-h-dvh bg-surface-base">
      <div className="flex">
        <aside className="w-56 min-h-dvh border-r border-border-default bg-surface-elevated flex flex-col p-6">
          <nav className="space-y-1 flex-1">
            <p className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-4">
              Admin
            </p>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded text-sm transition-colors ${
                    isActive
                      ? 'bg-accent-default text-surface-base font-medium'
                      : 'text-text-primary hover:bg-accent-muted'
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          {/* 하단 로그아웃 */}
          <div className="border-t border-border-default pt-4 mt-4">
            <a
              href="/"
              className="block px-3 py-2 rounded text-xs text-text-secondary hover:text-text-primary hover:bg-accent-muted mb-1"
            >
              ← 포트폴리오 보기
            </a>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded text-xs text-feedback-error hover:bg-feedback-error/10 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
