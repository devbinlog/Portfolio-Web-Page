'use client'

import { useState } from 'react'
import { adminApi } from '@/lib/api/admin'
import type { ProjectMedia, MediaType } from '@portfolio/types'

const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  IMAGE: '이미지',
  VIDEO_PLACEHOLDER: '비디오 플레이스홀더',
  VIDEO_EMBED: '비디오 임베드',
}

interface Props {
  projectId: string
  items: ProjectMedia[]
  onChange: (items: ProjectMedia[]) => void
}

export default function MediaManager({ projectId, items, onChange }: Props) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    type: 'IMAGE' as MediaType,
    url: '',
    placeholderLabel: '',
    embedId: '',
    altText: '',
    caption: '',
    isPlaceholder: false,
  })
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  function resetForm() {
    setForm({
      type: 'IMAGE',
      url: '',
      placeholderLabel: '',
      embedId: '',
      altText: '',
      caption: '',
      isPlaceholder: false,
    })
  }

  async function handleAdd() {
    setSaving(true)
    try {
      const created = await adminApi.media.create(projectId, {
        type: form.type,
        url: form.url.trim() || null,
        placeholderLabel: form.placeholderLabel.trim() || null,
        embedId: form.embedId.trim() || null,
        altText: form.altText.trim() || null,
        caption: form.caption.trim() || null,
        isPlaceholder: form.isPlaceholder,
      })
      onChange([...items, created as ProjectMedia])
      setAdding(false)
      resetForm()
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('미디어를 삭제하시겠습니까?')) return
    try {
      await adminApi.media.delete(projectId, id)
      onChange(items.filter((m) => m.id !== id))
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono text-text-secondary uppercase tracking-wider">미디어</h3>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-xs text-accent-default hover:underline"
          >
            + 추가
          </button>
        )}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 p-3 bg-surface-elevated border border-border-default rounded text-sm"
        >
          <div className="flex-1 min-w-0">
            <span className="text-xs text-text-secondary">{MEDIA_TYPE_LABELS[item.type]}</span>
            {item.isPlaceholder ? (
              <p className="text-text-secondary text-xs mt-0.5">
                플레이스홀더: {item.placeholderLabel}
              </p>
            ) : (
              <p className="text-text-primary truncate mt-0.5">{item.url}</p>
            )}
            {item.caption && (
              <p className="text-text-disabled text-xs mt-0.5">{item.caption}</p>
            )}
          </div>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-xs text-feedback-error hover:underline shrink-0"
          >
            삭제
          </button>
        </div>
      ))}

      {adding && (
        <div className="p-4 border border-border-default rounded space-y-3 bg-surface-elevated">
          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary">유형</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as MediaType }))}
              className="input-base"
            >
              {(Object.keys(MEDIA_TYPE_LABELS) as MediaType[]).map((t) => (
                <option key={t} value={t}>
                  {MEDIA_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPlaceholder}
              onChange={(e) => setForm((f) => ({ ...f, isPlaceholder: e.target.checked }))}
            />
            플레이스홀더
          </label>

          {form.isPlaceholder ? (
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary">플레이스홀더 레이블</label>
              <input
                value={form.placeholderLabel}
                onChange={(e) => setForm((f) => ({ ...f, placeholderLabel: e.target.value }))}
                className="input-base"
                placeholder="준비 중"
              />
            </div>
          ) : (
            <>
              {form.type === 'VIDEO_EMBED' ? (
                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary">임베드 ID</label>
                  <input
                    value={form.embedId}
                    onChange={(e) => setForm((f) => ({ ...f, embedId: e.target.value }))}
                    className="input-base"
                    placeholder="YouTube Video ID"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary">URL</label>
                  <input
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                    className="input-base"
                    placeholder="https://..."
                  />
                </div>
              )}
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary">대체 텍스트</label>
            <input
              value={form.altText}
              onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))}
              className="input-base"
              placeholder="이미지 설명"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary">캡션</label>
            <input
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              className="input-base"
              placeholder="선택사항"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="px-3 py-1.5 bg-accent-default text-surface-base text-xs rounded hover:bg-accent-hover disabled:opacity-50 transition-colors"
            >
              {saving ? '저장 중...' : '추가'}
            </button>
            <button
              onClick={() => {
                setAdding(false)
                resetForm()
              }}
              className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
