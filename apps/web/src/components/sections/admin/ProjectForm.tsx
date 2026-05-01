'use client'

import { useState, useEffect } from 'react'
import type { ProjectDetail, Category } from '@portfolio/types'
import { adminApi } from '@/lib/api/admin'

interface ProjectFormData {
  title: string
  summary: string
  description: string
  role: string
  contribution: string
  techStack: string
  keyLearnings: string
  workingApproach: string
  year: number
  categoryId: string
  secondaryCategoryId: string
  heroImageUrl: string
  thumbnailUrl: string
  isFeatured: boolean
  featuredOrder: string
  isPublished: boolean
  tags: string
}

interface Props {
  initial?: ProjectDetail
  onSuccess: (project: ProjectDetail) => void
}

const EMPTY: ProjectFormData = {
  title: '',
  summary: '',
  description: '',
  role: '',
  contribution: '',
  techStack: '',
  keyLearnings: '',
  workingApproach: '',
  year: new Date().getFullYear(),
  categoryId: '',
  secondaryCategoryId: '',
  heroImageUrl: '',
  thumbnailUrl: '',
  isFeatured: false,
  featuredOrder: '',
  isPublished: false,
  tags: '',
}

function toFormData(p: ProjectDetail): ProjectFormData {
  return {
    title: p.title,
    summary: p.summary,
    description: p.description,
    role: p.role,
    contribution: p.contribution,
    techStack: p.techStack.join(', '),
    keyLearnings: p.keyLearnings,
    workingApproach: p.workingApproach ?? '',
    year: p.year,
    categoryId: p.category.id,
    secondaryCategoryId: p.secondaryCategory?.id ?? '',
    heroImageUrl: p.heroImageUrl ?? '',
    thumbnailUrl: p.thumbnailUrl ?? '',
    isFeatured: p.isFeatured,
    featuredOrder: p.featuredOrder?.toString() ?? '',
    isPublished: p.isPublished,
    tags: p.tags.map((t) => t.name).join(', '),
  }
}

export default function ProjectForm({ initial, onSuccess }: Props) {
  const [form, setForm] = useState<ProjectFormData>(initial ? toFormData(initial) : EMPTY)
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1') + '/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  function set<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      description: form.description.trim(),
      role: form.role.trim(),
      contribution: form.contribution.trim(),
      techStack: form.techStack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      keyLearnings: form.keyLearnings.trim(),
      workingApproach: form.workingApproach.trim() || null,
      year: form.year,
      categoryId: form.categoryId,
      secondaryCategoryId: form.secondaryCategoryId || null,
      heroImageUrl: form.heroImageUrl.trim() || null,
      thumbnailUrl: form.thumbnailUrl.trim() || null,
      isFeatured: form.isFeatured,
      featuredOrder: form.featuredOrder ? parseInt(form.featuredOrder, 10) : null,
      isPublished: form.isPublished,
      tags: form.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }

    try {
      const result = initial
        ? await adminApi.projects.update(initial.id, payload)
        : await adminApi.projects.create(payload)
      onSuccess(result)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <p className="text-feedback-error text-sm bg-feedback-error/10 px-4 py-3 rounded">
          {error}
        </p>
      )}

      {/* 기본 정보 */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono text-text-secondary uppercase tracking-wider">기본 정보</h2>

        <Field label="제목 *">
          <input
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="input-base"
            placeholder="프로젝트 제목"
          />
        </Field>

        <Field label="요약 *">
          <input
            required
            value={form.summary}
            onChange={(e) => set('summary', e.target.value)}
            className="input-base"
            placeholder="한 줄 요약"
          />
        </Field>

        <Field label="연도 *">
          <input
            required
            type="number"
            value={form.year}
            onChange={(e) => set('year', parseInt(e.target.value, 10))}
            className="input-base w-32"
            min={2000}
            max={2100}
          />
        </Field>

        <Field label="카테고리 *">
          <select
            required
            value={form.categoryId}
            onChange={(e) => set('categoryId', e.target.value)}
            className="input-base"
          >
            <option value="">카테고리 선택</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="보조 카테고리">
          <select
            value={form.secondaryCategoryId}
            onChange={(e) => set('secondaryCategoryId', e.target.value)}
            className="input-base"
          >
            <option value="">없음</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="태그 (쉼표 구분)">
          <input
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            className="input-base"
            placeholder="React, TypeScript, Three.js"
          />
        </Field>
      </section>

      {/* 상세 내용 */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono text-text-secondary uppercase tracking-wider">상세 내용</h2>

        <Field label="설명 *">
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className="input-base resize-y"
            placeholder="프로젝트 상세 설명"
          />
        </Field>

        <Field label="역할 *">
          <input
            required
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            className="input-base"
            placeholder="Frontend Developer"
          />
        </Field>

        <Field label="기여도 *">
          <input
            required
            value={form.contribution}
            onChange={(e) => set('contribution', e.target.value)}
            className="input-base"
            placeholder="UI 설계 및 개발 100%"
          />
        </Field>

        <Field label="기술 스택 (쉼표 구분) *">
          <input
            required
            value={form.techStack}
            onChange={(e) => set('techStack', e.target.value)}
            className="input-base"
            placeholder="React, TypeScript, Tailwind CSS"
          />
        </Field>

        <Field label="핵심 학습 *">
          <textarea
            required
            rows={3}
            value={form.keyLearnings}
            onChange={(e) => set('keyLearnings', e.target.value)}
            className="input-base resize-y"
            placeholder="이 프로젝트에서 배운 것들"
          />
        </Field>

        <Field label="작업 방식">
          <textarea
            rows={3}
            value={form.workingApproach}
            onChange={(e) => set('workingApproach', e.target.value)}
            className="input-base resize-y"
            placeholder="어떻게 접근했는지"
          />
        </Field>
      </section>

      {/* 이미지 */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono text-text-secondary uppercase tracking-wider">이미지</h2>

        <Field label="히어로 이미지 URL">
          <input
            value={form.heroImageUrl}
            onChange={(e) => set('heroImageUrl', e.target.value)}
            className="input-base"
            placeholder="https://..."
          />
        </Field>

        <Field label="썸네일 URL">
          <input
            value={form.thumbnailUrl}
            onChange={(e) => set('thumbnailUrl', e.target.value)}
            className="input-base"
            placeholder="https://..."
          />
        </Field>
      </section>

      {/* 게시 설정 */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono text-text-secondary uppercase tracking-wider">게시 설정</h2>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => set('isPublished', e.target.checked)}
              className="w-4 h-4"
            />
            게시됨
          </label>

          <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => set('isFeatured', e.target.checked)}
              className="w-4 h-4"
            />
            피처드 (3D 월드 노출)
          </label>
        </div>

        {form.isFeatured && (
          <Field label="피처드 순서">
            <input
              type="number"
              value={form.featuredOrder}
              onChange={(e) => set('featuredOrder', e.target.value)}
              className="input-base w-24"
              min={1}
              max={10}
            />
          </Field>
        )}
      </section>

      <div className="pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-accent-default text-surface-base text-sm font-medium rounded hover:bg-accent-hover disabled:opacity-50 transition-colors"
        >
          {saving ? '저장 중...' : initial ? '수정 저장' : '프로젝트 생성'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-text-secondary">{label}</label>
      {children}
    </div>
  )
}
