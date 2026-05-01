'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api/admin'

interface SocialLink {
  id: string
  platform: string
  url: string
  order: number
}

interface ProfileData {
  id: string
  name: string
  roleTitle: string
  tagline: string
  bio: string
  workingMethod: string
  avatarUrl: string | null
  resumeUrl: string | null
  location: string | null
  socialLinks: SocialLink[]
}

type FormState = Omit<ProfileData, 'id' | 'socialLinks'>

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [form, setForm] = useState<FormState>({
    name: '',
    roleTitle: '',
    tagline: '',
    bio: '',
    workingMethod: '',
    avatarUrl: '',
    resumeUrl: '',
    location: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 소셜 링크 폼
  const [newLink, setNewLink] = useState({ platform: '', url: '' })
  const [addingLink, setAddingLink] = useState(false)

  useEffect(() => {
    adminApi.profile.get().then((data) => {
      const p = data as ProfileData
      setProfile(p)
      if (p) {
        setForm({
          name: p.name ?? '',
          roleTitle: p.roleTitle ?? '',
          tagline: p.tagline ?? '',
          bio: p.bio ?? '',
          workingMethod: p.workingMethod ?? '',
          avatarUrl: p.avatarUrl ?? '',
          resumeUrl: p.resumeUrl ?? '',
          location: p.location ?? '',
        })
      }
    }).catch((e: Error) => setError(e.message))
  }, [])

  function setField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const updated = await adminApi.profile.update({
        ...form,
        avatarUrl: form.avatarUrl || null,
        resumeUrl: form.resumeUrl || null,
        location: form.location || null,
      })
      setProfile(updated as ProfileData)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleAddLink() {
    if (!newLink.platform.trim() || !newLink.url.trim()) return
    setAddingLink(true)
    try {
      const created = await adminApi.profile.addSocialLink(newLink)
      setProfile((prev) =>
        prev ? { ...prev, socialLinks: [...prev.socialLinks, created as SocialLink] } : prev,
      )
      setNewLink({ platform: '', url: '' })
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setAddingLink(false)
    }
  }

  async function handleRemoveLink(id: string) {
    if (!confirm('소셜 링크를 삭제하시겠습니까?')) return
    try {
      await adminApi.profile.removeSocialLink(id)
      setProfile((prev) =>
        prev ? { ...prev, socialLinks: prev.socialLinks.filter((l) => l.id !== id) } : prev,
      )
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-xl font-semibold text-text-primary">프로필 관리</h1>
        {saved && <span className="text-xs text-feedback-success">저장됨</span>}
      </div>

      {error && (
        <p className="text-feedback-error text-sm bg-feedback-error/10 px-4 py-3 rounded mb-6">
          {error}
        </p>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {/* 기본 정보 */}
        <section className="space-y-4">
          <h2 className="text-sm font-mono text-text-secondary uppercase tracking-wider">기본 정보</h2>

          {[
            { label: '이름 *', key: 'name' as const, required: true },
            { label: '역할 *', key: 'roleTitle' as const, required: true },
            { label: '태그라인 *', key: 'tagline' as const, required: true },
            { label: '위치', key: 'location' as const },
            { label: '아바타 URL', key: 'avatarUrl' as const },
            { label: '이력서 URL', key: 'resumeUrl' as const },
          ].map(({ label, key, required }) => (
            <div key={key} className="space-y-1.5">
              <label className="block text-xs text-text-secondary">{label}</label>
              <input
                required={required}
                value={form[key] ?? ''}
                onChange={(e) => setField(key, e.target.value)}
                className="input-base"
                placeholder={label}
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="block text-xs text-text-secondary">소개글</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setField('bio', e.target.value)}
              className="input-base resize-y"
              placeholder="자기소개"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs text-text-secondary">업무 방식</label>
            <textarea
              rows={3}
              value={form.workingMethod}
              onChange={(e) => setField('workingMethod', e.target.value)}
              className="input-base resize-y"
              placeholder="어떻게 일하는지"
            />
          </div>
        </section>

        <div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-accent-default text-surface-base text-sm font-medium rounded hover:bg-accent-hover disabled:opacity-50 transition-colors"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>

      {/* 소셜 링크 */}
      <div className="mt-12 max-w-2xl">
        <h2 className="text-sm font-mono text-text-secondary uppercase tracking-wider mb-4">소셜 링크</h2>

        <div className="space-y-2">
          {profile?.socialLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-3 p-3 bg-surface-elevated border border-border-default rounded"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{link.platform}</p>
                <p className="text-xs text-text-secondary truncate">{link.url}</p>
              </div>
              <button
                onClick={() => handleRemoveLink(link.id)}
                className="text-xs text-feedback-error hover:underline shrink-0"
              >
                삭제
              </button>
            </div>
          ))}
        </div>

        {/* 소셜 링크 추가 */}
        <div className="mt-4 p-4 border border-border-default rounded space-y-3 bg-surface-elevated">
          <h3 className="text-xs text-text-secondary">링크 추가</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary">플랫폼</label>
              <input
                value={newLink.platform}
                onChange={(e) => setNewLink((p) => ({ ...p, platform: e.target.value }))}
                className="input-base"
                placeholder="GitHub, LinkedIn..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary">URL</label>
              <input
                value={newLink.url}
                onChange={(e) => setNewLink((p) => ({ ...p, url: e.target.value }))}
                className="input-base"
                placeholder="https://..."
              />
            </div>
          </div>
          <button
            onClick={handleAddLink}
            disabled={addingLink || !newLink.platform || !newLink.url}
            className="px-3 py-1.5 bg-accent-default text-surface-base text-xs rounded hover:bg-accent-hover disabled:opacity-50 transition-colors"
          >
            {addingLink ? '추가 중...' : '+ 추가'}
          </button>
        </div>
      </div>
    </div>
  )
}
