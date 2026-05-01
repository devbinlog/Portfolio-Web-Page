'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminApi, type DashboardStats } from '@/lib/api/admin'

function StatCard({
  label,
  value,
  href,
}: {
  label: string
  value: number | undefined
  href?: string
}) {
  const inner = (
    <div className="bg-surface-elevated border border-border-default rounded-lg p-6 hover:border-accent-default transition-colors">
      <p className="text-xs font-mono text-text-secondary uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-semibold text-text-primary">
        {value === undefined ? '—' : value}
      </p>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    )
  }

  return inner
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <div>
      <h1 className="text-xl font-semibold text-text-primary mb-8">대시보드</h1>

      {error && (
        <p className="text-feedback-error text-sm mb-6">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="전체 프로젝트" value={stats?.total} href="/admin/projects" />
        <StatCard label="게시된 프로젝트" value={stats?.published} />
        <StatCard label="피처드 프로젝트" value={stats?.featured} />
        <StatCard label="읽지 않은 메시지" value={stats?.unreadMessages} href="/admin/contacts" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-3 bg-surface-elevated border border-border-default rounded-lg p-5 hover:border-accent-default transition-colors"
        >
          <span className="text-accent-default text-xl">+</span>
          <div>
            <p className="text-sm font-medium text-text-primary">새 프로젝트 추가</p>
            <p className="text-xs text-text-secondary mt-0.5">프로젝트를 생성하고 미디어를 추가합니다</p>
          </div>
        </Link>

        <Link
          href="/admin/contacts"
          className="flex items-center gap-3 bg-surface-elevated border border-border-default rounded-lg p-5 hover:border-accent-default transition-colors"
        >
          <span className="text-accent-default text-xl">✉</span>
          <div>
            <p className="text-sm font-medium text-text-primary">연락 메시지 확인</p>
            <p className="text-xs text-text-secondary mt-0.5">
              {stats?.unreadMessages ? `${stats.unreadMessages}개 읽지 않음` : '메시지를 확인합니다'}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
