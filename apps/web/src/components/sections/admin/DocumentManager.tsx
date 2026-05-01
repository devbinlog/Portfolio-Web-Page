'use client'

import { useState } from 'react'
import { adminApi } from '@/lib/api/admin'
import type { ProjectDocument, DocumentType } from '@portfolio/types'

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  REPORT: '보고서',
  PRESENTATION: '발표자료',
  MARKDOWN: '마크다운',
  OTHER: '기타',
}

interface Props {
  projectId: string
  items: ProjectDocument[]
  onChange: (items: ProjectDocument[]) => void
}

export default function DocumentManager({ projectId, items, onChange }: Props) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    type: 'REPORT' as DocumentType,
    title: '',
    url: '',
    placeholderLabel: '',
    isPlaceholder: false,
  })
  const [saving, setSaving] = useState(false)

  function resetForm() {
    setForm({ type: 'REPORT', title: '', url: '', placeholderLabel: '', isPlaceholder: false })
  }

  async function handleAdd() {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const created = await adminApi.documents.create(projectId, {
        type: form.type,
        title: form.title.trim(),
        url: form.url.trim() || null,
        placeholderLabel: form.placeholderLabel.trim() || null,
        isPlaceholder: form.isPlaceholder,
      })
      onChange([...items, created as ProjectDocument])
      setAdding(false)
      resetForm()
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('문서를 삭제하시겠습니까?')) return
    try {
      await adminApi.documents.delete(projectId, id)
      onChange(items.filter((d) => d.id !== id))
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono text-text-secondary uppercase tracking-wider">문서</h3>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-accent-default hover:underline">
            + 추가
          </button>
        )}
      </div>

      {items.map((doc) => (
        <div
          key={doc.id}
          className="flex items-start gap-3 p-3 bg-surface-elevated border border-border-default rounded text-sm"
        >
          <div className="flex-1 min-w-0">
            <span className="text-xs text-text-secondary">{DOC_TYPE_LABELS[doc.type]}</span>
            <p className="text-text-primary truncate mt-0.5">{doc.title}</p>
            {doc.isPlaceholder ? (
              <p className="text-text-secondary text-xs mt-0.5">플레이스홀더: {doc.placeholderLabel}</p>
            ) : (
              <p className="text-text-disabled text-xs truncate mt-0.5">{doc.url}</p>
            )}
          </div>
          <button
            onClick={() => handleDelete(doc.id)}
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
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as DocumentType }))}
              className="input-base"
            >
              {(Object.keys(DOC_TYPE_LABELS) as DocumentType[]).map((t) => (
                <option key={t} value={t}>{DOC_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary">제목 *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="input-base"
              placeholder="문서 제목"
            />
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

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="px-3 py-1.5 bg-accent-default text-surface-base text-xs rounded hover:bg-accent-hover disabled:opacity-50 transition-colors"
            >
              {saving ? '저장 중...' : '추가'}
            </button>
            <button
              onClick={() => { setAdding(false); resetForm() }}
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
