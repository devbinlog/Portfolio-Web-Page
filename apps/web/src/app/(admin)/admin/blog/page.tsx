'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useAdminAuthStore } from '@/stores/adminAuthStore'

interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt: string | null
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminBlogPage() {
  const { accessToken: token } = useAdminAuthStore()
  const [posts, setPosts] = useState<BlogPostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/admin/blog', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      setPosts(json.data ?? [])
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load() }, [load])

  async function handleTogglePublish(id: string) {
    setTogglingId(id)
    try {
      const res = await fetch(`/api/v1/admin/blog/${id}/publish`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...json.data } : p)))
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
      await fetch(`/api/v1/admin/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-text-primary">DevLog 관리</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-accent-default text-surface-base text-sm font-medium rounded hover:bg-accent-hover transition-colors"
        >
          + 새 포스트
        </Link>
      </div>

      {error && <p className="text-feedback-error text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-elevated rounded-lg animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-text-secondary text-sm">
          <p>작성된 포스트가 없습니다.</p>
          <Link
            href="/admin/blog/new"
            className="mt-4 inline-block text-accent-default hover:underline"
          >
            첫 포스트 작성하기
          </Link>
        </div>
      ) : (
        <div className="border border-border-default rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-elevated border-b border-border-default">
              <tr>
                <th className="text-left px-4 py-3 text-text-secondary font-normal">제목</th>
                <th className="text-left px-4 py-3 text-text-secondary font-normal">슬러그</th>
                <th className="text-left px-4 py-3 text-text-secondary font-normal">상태</th>
                <th className="text-left px-4 py-3 text-text-secondary font-normal">작성일</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="px-4 py-3 text-text-primary font-medium">{post.title}</td>
                  <td className="px-4 py-3 text-text-secondary font-mono text-xs">{post.slug}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublish(post.id)}
                      disabled={togglingId === post.id}
                      className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                        post.isPublished
                          ? 'bg-feedback-success/20 text-feedback-success hover:bg-feedback-success/30'
                          : 'bg-surface-elevated text-text-secondary hover:bg-border-default'
                      }`}
                    >
                      {togglingId === post.id ? '...' : post.isPublished ? '게시됨' : '비공개'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-xs">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="text-xs text-accent-default hover:underline"
                      >
                        편집
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletingId === post.id}
                        className="text-xs text-feedback-error hover:underline disabled:opacity-50"
                      >
                        {deletingId === post.id ? '...' : '삭제'}
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
