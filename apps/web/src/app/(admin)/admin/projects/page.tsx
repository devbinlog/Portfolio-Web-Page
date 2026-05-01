'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { adminApi } from '@/lib/api/admin'
import type { ProjectSummary } from '@portfolio/types'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    adminApi.projects
      .list()
      .then(setProjects)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleTogglePublish(id: string) {
    setTogglingId(id)
    try {
      const updated = await adminApi.projects.togglePublish(id)
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)))
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}"를 삭제하시겠습니까?`)) return
    setDeletingId(id)
    try {
      await adminApi.projects.delete(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-text-primary">프로젝트 관리</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-accent-default text-surface-base text-sm font-medium rounded hover:bg-accent-hover transition-colors"
        >
          + 새 프로젝트
        </Link>
      </div>

      {error && <p className="text-feedback-error text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-elevated rounded-lg animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-text-secondary text-sm">
          <p>프로젝트가 없습니다.</p>
          <Link
            href="/admin/projects/new"
            className="mt-4 inline-block text-accent-default hover:underline"
          >
            첫 프로젝트 만들기
          </Link>
        </div>
      ) : (
        <div className="border border-border-default rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-elevated border-b border-border-default">
              <tr>
                <th className="text-left px-4 py-3 text-text-secondary font-normal">제목</th>
                <th className="text-left px-4 py-3 text-text-secondary font-normal">카테고리</th>
                <th className="text-left px-4 py-3 text-text-secondary font-normal">연도</th>
                <th className="text-left px-4 py-3 text-text-secondary font-normal">상태</th>
                <th className="text-left px-4 py-3 text-text-secondary font-normal">피처드</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="px-4 py-3 text-text-primary font-medium">{project.title}</td>
                  <td className="px-4 py-3 text-text-secondary">{project.category.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{project.year}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublish(project.id)}
                      disabled={togglingId === project.id}
                      className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                        (project as ProjectSummary & { isPublished?: boolean }).isPublished
                          ? 'bg-feedback-success/20 text-feedback-success hover:bg-feedback-success/30'
                          : 'bg-surface-elevated text-text-secondary hover:bg-border-default'
                      }`}
                    >
                      {togglingId === project.id
                        ? '...'
                        : (project as ProjectSummary & { isPublished?: boolean }).isPublished
                        ? '게시됨'
                        : '비공개'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-xs">
                    {project.isFeatured ? `★ ${project.featuredOrder ?? ''}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-xs text-accent-default hover:underline"
                      >
                        편집
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        disabled={deletingId === project.id}
                        className="text-xs text-feedback-error hover:underline disabled:opacity-50"
                      >
                        {deletingId === project.id ? '...' : '삭제'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
