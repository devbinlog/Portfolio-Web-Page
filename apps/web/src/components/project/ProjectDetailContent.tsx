import Link from 'next/link'
import type { ProjectDetail, CodeSnippet } from '@portfolio/types'
import { TechBadge } from '@/components/ui/TechBadge'
import { PlaceholderSlot } from './PlaceholderSlot'
import { KeyCodeSection } from './CodeBlock'

interface ProjectDetailContentProps {
  project: ProjectDetail
}

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-mono text-text-disabled">{num}</span>
      <span className="text-sm font-mono text-text-secondary">—</span>
      <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">{title}</h2>
    </div>
  )
}

function splitBySeparator(text: string): [string, string | null] {
  const parts = text.split(/\n\n---\n\n/)
  return [parts[0].trim(), parts[1]?.trim() ?? null]
}

export function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  const [problemText, limitationText] = splitBySeparator(project.description)
  const [solutionText, architectureText] = project.workingApproach
    ? splitBySeparator(project.workingApproach)
    : ['', null]

  const codeSnippets = project.codeSnippets as CodeSnippet[] | null

  // 섹션 번호는 내용이 있는 섹션만 순서대로 부여
  let sectionNum = 0
  const nextNum = () => String(++sectionNum).padStart(2, '0')

  return (
    <article>
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 mb-8 text-xs font-mono text-text-secondary">
        <Link href="/projects" className="hover:text-text-primary transition-colors">
          Projects
        </Link>
        <span>/</span>
        <span className="text-text-disabled">{project.title}</span>
      </div>

      {/* 타이틀 헤더 */}
      <header className="mb-12">
        <h1 className="text-display-md font-bold text-text-primary mb-3 leading-tight">
          {project.title}
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed max-w-2xl whitespace-pre-line">
          {project.summary}
        </p>

        {/* 메타 인라인 */}
        <div className="flex flex-wrap gap-6 mt-6 text-xs font-mono text-text-secondary">
          {project.role && (
            <span>
              <span className="text-text-disabled uppercase tracking-wider">Role</span>
              <span className="ml-2 text-text-primary">{project.role}</span>
            </span>
          )}
          <span>
            <span className="text-text-disabled uppercase tracking-wider">Year</span>
            <span className="ml-2 text-text-primary">{project.year}</span>
          </span>
        </div>

        {/* Tech Stack 뱃지 */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {project.techStack.map((tech) => (
              <TechBadge key={tech} name={tech} />
            ))}
          </div>
        )}
      </header>

      {/* 히어로 이미지 */}
      {project.heroImageUrl && (
        <div className="aspect-video rounded-lg bg-surface-input overflow-hidden mb-16">
          <img
            src={project.heroImageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* ── 01 문제 정의 ──────────────────────────────── */}
      {problemText && (
        <section className="mb-14 pb-14 border-b border-border-default">
          <SectionLabel num={nextNum()} title="Problem" />
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line max-w-2xl">
            {problemText}
          </p>
        </section>
      )}

      {/* ── 02 기술적 제약 ────────────────────────────── */}
      {limitationText && (
        <section className="mb-14 pb-14 border-b border-border-default">
          <SectionLabel num={nextNum()} title="Limitation" />
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line max-w-2xl">
            {limitationText}
          </p>
        </section>
      )}

      {/* ── 03 해결 접근 ──────────────────────────────── */}
      {solutionText && (
        <section className="mb-14 pb-14 border-b border-border-default">
          <SectionLabel num={nextNum()} title="Solution" />
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line max-w-2xl">
            {solutionText}
          </p>
        </section>
      )}

      {/* ── 04 시스템 아키텍처 ────────────────────────── */}
      {architectureText && (
        <section className="mb-14 pb-14 border-b border-border-default">
          <SectionLabel num={nextNum()} title="System Architecture" />
          <pre className="text-xs font-mono text-text-secondary leading-relaxed bg-surface-input rounded-lg p-5 overflow-x-auto whitespace-pre">
            {architectureText}
          </pre>
        </section>
      )}

      {/* ── 05 핵심 구현 ──────────────────────────────── */}
      {project.contribution && (
        <section className="mb-14 pb-14 border-b border-border-default">
          <SectionLabel num={nextNum()} title="Key Implementation" />
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line max-w-2xl">
            {project.contribution}
          </p>
        </section>
      )}

      {/* ── Key Code ──────────────────────────────────── */}
      {codeSnippets && codeSnippets.length > 0 && (
        <KeyCodeSection snippets={codeSnippets} sectionNum={nextNum()} />
      )}

      {/* ── Result & Learnings ────────────────────────── */}
      {project.keyLearnings && (
        <section className="mb-14 pb-14 border-b border-border-default">
          <SectionLabel num={nextNum()} title="Result & Learnings" />
          <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line max-w-2xl">
            {project.keyLearnings}
          </div>
        </section>
      )}

      {/* 미디어 갤러리 */}
      {project.media.length > 0 && (
        <section className="mb-14">
          <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mb-4">Media</p>
          <div className="space-y-4">
            {project.media.map((media) =>
              media.isPlaceholder ? (
                <PlaceholderSlot
                  key={media.id}
                  type={media.type === 'VIDEO_PLACEHOLDER' ? 'video' : 'image'}
                  label={media.placeholderLabel}
                />
              ) : media.type === 'IMAGE' && media.url ? (
                <div key={media.id} className="rounded-lg overflow-hidden bg-surface-input">
                  <img src={media.url} alt={media.altText || ''} className="w-full" />
                  {media.caption && (
                    <p className="px-3 py-2 text-xs text-text-secondary">{media.caption}</p>
                  )}
                </div>
              ) : null,
            )}
          </div>
        </section>
      )}

      {/* 문서 */}
      {project.documents.length > 0 && (
        <section className="mb-14">
          <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mb-4">Documents</p>
          <div className="space-y-3">
            {project.documents.map((doc) =>
              doc.isPlaceholder ? (
                <PlaceholderSlot
                  key={doc.id}
                  type="document"
                  label={doc.placeholderLabel}
                  title={doc.title}
                />
              ) : (
                <a
                  key={doc.id}
                  href={doc.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded border border-border-default bg-surface-elevated hover:border-border-strong transition-colors"
                >
                  <span className="text-sm text-text-primary">{doc.title}</span>
                  <span className="text-xs text-text-secondary ml-auto">{doc.type}</span>
                </a>
              ),
            )}
          </div>
        </section>
      )}

      {/* 링크 */}
      {project.links.length > 0 && (
        <section className="mb-12">
          <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mb-4">Links</p>
          <div className="flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded border border-border-default text-sm text-text-primary hover:border-border-strong hover:bg-surface-elevated transition-colors"
              >
                {link.type === 'GITHUB' && (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                )}
                {link.label}
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
