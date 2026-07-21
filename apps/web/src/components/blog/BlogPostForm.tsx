'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const TipTapEditor = dynamic(() => import('./TipTapEditor'), { ssr: false })

export interface BlogPostFormData {
  title: string
  slug: string
  excerpt: string
  coverImageUrl: string
  content: object | null
}

interface BlogPostFormProps {
  initialData?: BlogPostFormData
  onSubmit: (data: BlogPostFormData) => Promise<void>
  submitLabel: string
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function BlogPostForm({ initialData, onSubmit, submitLabel }: BlogPostFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl ?? '')
  const [content, setContent] = useState<object | null>(initialData?.content ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!initialData?.slug) setSlug(toSlug(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return setError('제목을 입력하세요.')
    if (!content) return setError('내용을 입력하세요.')

    setSaving(true)
    setError(null)
    try {
      await onSubmit({ title, slug, excerpt, coverImageUrl, content })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full px-3 py-2 bg-surface-input border border-border-default rounded text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-border-focus'
  const labelCls = 'block text-xs text-text-secondary mb-1 font-medium'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="px-4 py-3 bg-feedback-error/10 border border-feedback-error/30 rounded text-feedback-error text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelCls}>제목 *</label>
          <input
            className={inputCls}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="포스트 제목"
            required
          />
        </div>

        <div>
          <label className={labelCls}>슬러그 (URL)</label>
          <input
            className={`${inputCls} font-mono`}
            value={slug}
            onChange={(e) => setSlug(toSlug(e.target.value))}
            placeholder="post-url-slug"
          />
        </div>

        <div>
          <label className={labelCls}>커버 이미지 URL</label>
          <input
            className={inputCls}
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://..."
            type="url"
          />
        </div>

        <div className="col-span-2">
          <label className={labelCls}>요약 (선택)</label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="목록에 표시될 짧은 요약"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>내용 *</label>
        <TipTapEditor content={content} onChange={setContent} />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-accent-default text-surface-base text-sm font-medium rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {saving ? '저장 중...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
