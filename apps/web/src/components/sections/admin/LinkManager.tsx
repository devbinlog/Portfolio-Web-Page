'use client'

import { useState } from 'react'
import { adminApi } from '@/lib/api/admin'
import type { ProjectLink, LinkType } from '@portfolio/types'

const LINK_TYPE_LABELS: Record<LinkType, string> = {
  GITHUB: 'GitHub',
  DEMO: '데모',
  DOCS: '문서',
  EXTERNAL: '외부 링크',
}

interface Props {
  projectId: string
  items: ProjectLink[]
  onChange: (items: ProjectLink[]) => void
}

export default function LinkManager({ projectId, items, onChange }: Props) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    type: 'GITHUB' as LinkType,
    label: '',
    url: '',
  })
  const [saving, setSaving] = useState(false)

  function resetForm() {
    setForm({ type: 'GITHUB', label: '', url: '' })
  }

  async function handleAdd() {
    if (!form.url.trim() || !form.label.trim()) return
    setSaving(true)
    try {
      const created = await adminApi.links.create(projectId, {
        type: form.type,
        label: form.label.trim(),
        url: form.url.trim(),
      })
      onChange([...items, created as ProjectLink])
      setAdding(false)
      resetForm()
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('링크를 삭제하시겠습니까?')) return
    try {
      await adminApi.links.delete(projectId, id)
      onChange(items.filter((l) => l.id !== id))
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono text-text-secondary uppercase tracking-wider">링크</h3>
        {!adding && (
          <button onClick={() => setAdding(true)} className="text-xs text-accent-default hover:underline">
            + 추가
          </button>
        )}
      </div>

      {items.map((link) => (
        <div
          key={link.id}
          className="flex items-center gap-3 p-3 bg-surface-elevated border border-border-default rounded text-sm"
        >
          <div className="flex-1 min-w-0">
            <span className="text-xs text-text-secondary">{LINK_TYPE_LABELS[link.type]}</span>
            <p className="text-text-primary mt-0.5">{link.label}</p>
            <p className="text-text-disabled text-xs truncate">{link.url}</p>
          </div>
          <button
            onClick={() => handleDelete(link.id)}
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
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as LinkType }))}
              className="input-base"
            >
              {(Object.keys(LINK_TYPE_LABELS) as LinkType[]).map((t) => (
                <option key={t} value={t}>{LINK_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary">레이블 *</label>
            <input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              className="input-base"
              placeholder="GitHub 저장소"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary">URL *</label>
            <input
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              className="input-base"
              placeholder="https://..."
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
