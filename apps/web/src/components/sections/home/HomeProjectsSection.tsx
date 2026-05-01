'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { ProjectSummary } from '@portfolio/types'

// ── Phoenix Origin 경력 데이터 ──────────────────────────────
const PHOENIX = {
  company:  'Phoenix Origin',
  role:     'Frontend Developer',
  period:   '2024.03 ~ Present',
  logo:     '/phoenix-origin-logo.png',
  links: [
    { label: 'Website',   href: 'https://phoenixorigin.kr/' },
    { label: 'Instagram', href: 'https://www.instagram.com/phoenix.origin' },
    { label: 'Musinsa',   href: 'https://www.musinsa.com/brand/phoenix?gf=A' },
  ],
  intro: '브랜드 웹사이트의 구조 설계부터 UI/UX 구현, 배포 및 운영까지 전 과정을 담당했습니다.',
  bullets: [
    { label: '메인 페이지',       desc: '브랜드 아이덴티티를 전달하기 위한 랜딩 구조 및 인터랙션 구현' },
    { label: '상품 상세 페이지',  desc: '제품 정보를 효과적으로 전달하기 위한 콘텐츠 구조 설계 및 UI 구성' },
    { label: '리스트 페이지',     desc: '카테고리 기반 탐색 및 상품 목록 구조 구현' },
    { label: '컴포넌트 구조 설계',desc: '변경이 잦은 영역과 고정 영역을 분리하여 유지보수성과 확장성을 고려한 구조 설계' },
    { label: '반응형 UI',         desc: '다양한 디바이스 환경에서 일관된 사용자 경험 제공' },
  ],
  closing: '운영 과정에서는 실제 사용자 및 콘텐츠 변경 요구를 반영하며, 배포 이후에도 UI와 정보 구조를 지속적으로 개선했습니다.',
}

// ── 프로젝트 카드 컴포넌트 ──────────────────────────────────
interface Props {
  projects: ProjectSummary[]
}

export function HomeProjectsSection({ projects }: Props) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((i) => (i - 1 + projects.length) % projects.length)
  const next = () => setCurrent((i) => (i + 1) % projects.length)

  const getCardStyle = (idx: number) => {
    const diff = idx - current
    const len  = projects.length
    let d = diff
    if (d > len / 2) d -= len
    if (d < -len / 2) d += len

    if (d === 0) return { transform: 'translateX(0) scale(1)',               opacity: 1,    zIndex: 10, pointerEvents: 'auto'  as const }
    if (d === 1 || d === -1) {
      const dir = d > 0 ? 1 : -1
      return { transform: `translateX(${dir * 72}%) scale(0.82)`, opacity: 0.38, zIndex: 5,  pointerEvents: 'none'  as const }
    }
    return { transform: `translateX(${d > 0 ? 120 : -120}%) scale(0.65)`, opacity: 0, zIndex: 0, pointerEvents: 'none' as const }
  }

  const GRADIENT_COLORS = [
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
  ]

  return (
    <section
      id="projects"
      className="bg-surface-elevated py-28 px-6 md:px-10 lg:px-16 border-t border-border-default"
      aria-labelledby="exp-projects-heading"
    >
      <div className="max-w-5xl mx-auto w-full">

        {/* ══════════════════════════════════════════
            EXPERIENCE
        ══════════════════════════════════════════ */}
        <p className="text-xs font-mono text-text-disabled uppercase tracking-[0.2em] mb-10">
          Experience
        </p>

        {/* 헤더: 로고 + 기본 정보 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-10 pb-10 border-b border-border-default">

          {/* 원형 로고 */}
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOENIX.logo}
              alt={PHOENIX.company}
              className="w-36 h-36 md:w-44 md:h-44 rounded-full object-contain border border-border-default bg-[#fffef7] p-4 select-none"
            />
          </div>

          {/* 회사 정보 */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mb-2">
              Company
            </p>
            <h2
              id="exp-projects-heading"
              className="text-display-lg md:text-display-xl font-extrabold text-text-primary leading-none tracking-tight mb-2"
            >
              {PHOENIX.company}
            </h2>
            <p className="text-base md:text-lg text-text-secondary mb-1">
              {PHOENIX.role}
            </p>
            <p className="text-sm font-mono text-text-disabled mb-5">
              {PHOENIX.period}
            </p>

            {/* 링크 버튼 */}
            <div className="flex flex-wrap gap-2">
              {PHOENIX.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border-default text-xs font-mono text-text-secondary hover:border-border-strong hover:text-text-primary hover:bg-surface-elevated transition-colors"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="11" height="11">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 3h3v3m0-3L7 9M4 4H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1" />
                  </svg>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 업무 설명 */}
        <div className="mb-6">
          <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mb-5">
            What I did
          </p>
          <div>
            {/* 인트로 */}
            <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-5">
              {PHOENIX.intro}
            </p>

            {/* 담당 업무 목록 + 클로징 (이어지는 흐름) */}
            <ul className="space-y-2.5">
              {PHOENIX.bullets.map((item) => (
                <li key={item.label} className="flex gap-3 text-sm md:text-base text-text-secondary leading-relaxed">
                  <span className="flex-shrink-0 font-medium text-text-primary">{item.label}</span>
                  <span className="text-text-disabled">—</span>
                  <span>{item.desc}</span>
                </li>
              ))}
              {/* 클로징: 목록 마지막 항목과 이어지게 */}
              <li className="text-sm md:text-base text-text-secondary leading-relaxed pt-1">
                {PHOENIX.closing}
              </li>
            </ul>
          </div>
        </div>

        {/* 스크린샷 영역 — 추후 추가 예정 */}
        {/* SCREENSHOTS_PLACEHOLDER */}

        {/* ══════════════════════════════════════════
            PROJECTS
        ══════════════════════════════════════════ */}
        <div className="mt-20 pt-20 border-t border-border-default">
          <p className="text-xs font-mono text-text-disabled uppercase tracking-[0.2em] mb-10">
            Projects
          </p>

          {/* 제목 + 트랙 넘버 */}
          <div className="mb-12">
            <h3 className="text-display-lg md:text-display-xl font-extrabold text-text-primary leading-none tracking-tight">
              Building Systems
            </h3>
            {projects.length > 0 && (
              <p className="text-sm text-text-secondary font-mono mt-2">
                {String(current + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </p>
            )}
          </div>

          {/* 캐러셀 트랙 */}
          {projects.length > 0 ? (
            <>
              <div className="relative flex items-center justify-center" style={{ height: 420 }}>
                {projects.map((project, idx) => {
                  const style = getCardStyle(idx)
                  return (
                    <div
                      key={project.id}
                      className="absolute w-full max-w-sm md:max-w-md"
                      style={{
                        transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease',
                        ...style,
                      }}
                    >
                      <AlbumCard
                        project={project}
                        gradient={GRADIENT_COLORS[idx % GRADIENT_COLORS.length]}
                        isActive={idx === current}
                      />
                    </div>
                  )
                })}

                {/* 좌우 화살표 */}
                <button
                  onClick={prev}
                  className="absolute left-0 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-border-default bg-surface-base/80 backdrop-blur text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
                  aria-label="이전 프로젝트"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 12L6 8l4-4" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-0 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-border-default bg-surface-base/80 backdrop-blur text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
                  aria-label="다음 프로젝트"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
                  </svg>
                </button>
              </div>

              {/* 닷 인디케이터 */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {projects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className="transition-all duration-300"
                    aria-label={`프로젝트 ${idx + 1}`}
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        idx === current
                          ? 'w-5 h-1.5 bg-text-primary'
                          : 'w-1.5 h-1.5 bg-border-default hover:bg-border-strong'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {/* 전체 보기 */}
          <div className="flex justify-center mt-10">
            <Link
              href="/projects"
              className="text-sm font-mono text-text-disabled hover:text-text-secondary transition-colors"
            >
              View all projects →
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}

// ── AlbumCard ────────────────────────────────────────────────
function AlbumCard({
  project,
  gradient,
  isActive,
}: {
  project: ProjectSummary
  gradient: string
  isActive: boolean
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border transition-colors ${
        isActive ? 'border-border-strong' : 'border-border-default'
      } bg-surface-elevated`}
    >
      {/* 커버 */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {project.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: gradient }}
          >
            <span className="text-4xl font-black text-white/30 tracking-tighter select-none">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <span className="absolute top-3 right-3 text-xs font-mono bg-black/40 text-white/80 px-2 py-0.5 rounded backdrop-blur-sm">
          {project.year}
        </span>
      </div>

      {/* 트랙 정보 */}
      <div className="p-5">
        <p className="text-[10px] font-mono text-text-disabled uppercase tracking-widest mb-1">
          {project.category.name}
        </p>
        <h4 className="text-lg font-bold text-text-primary leading-tight mb-2 truncate">
          {project.title}
        </h4>
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">
          {project.summary}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-input text-text-disabled border border-border-default"
              >
                {tag.name}
              </span>
            ))}
          </div>
          {isActive && (
            <Link
              href={`/projects/${project.slug}`}
              className="flex-shrink-0 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
            >
              View →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
