import type { Profile } from '@portfolio/types'
import { SiGithub } from 'react-icons/si'

interface Props {
  profile: Profile
}

const SKILL_GENRES = [
  { label: 'AI / LLM', color: '#6366f1' },
  { label: 'Search Systems', color: '#8b5cf6' },
  { label: 'FastAPI', color: '#009688' },
  { label: 'Next.js', color: '#000000' },
  { label: 'React', color: '#61dafb' },
  { label: 'TypeScript', color: '#3178c6' },
  { label: 'Three.js', color: '#049ef4' },
  { label: 'Python', color: '#3776ab' },
  { label: 'PostgreSQL', color: '#336791' },
  { label: 'Docker', color: '#2496ed' },
]

export function HomeAboutSection({ profile }: Props) {
  const githubLink = profile.socialLinks.find((l) => l.platform === 'GitHub')

  return (
    <section
      id="about"
      className="min-h-screen bg-surface-base flex flex-col justify-center px-6 md:px-10 lg:px-16 py-24 border-t border-border-default"
      aria-labelledby="home-about-heading"
    >
      <div className="max-w-5xl mx-auto w-full">

        {/* ── 섹션 라벨 ─────────────────────────────── */}
        <p className="text-xs font-mono text-text-disabled uppercase tracking-[0.2em] mb-12">
          About Me
        </p>

        {/* ── 아티스트 헤더 ──────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-8 md:gap-12 mb-14 pb-14 border-b border-border-default">

          {/* 아바타 */}
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile-photo.jpeg"
              alt="binlog"
              className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover select-none border border-border-default" style={{ objectPosition: 'center 3%' }}
            />
          </div>

          {/* 이름 + 정보 */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mb-2">
              Developer
            </p>
            <h2
              id="home-about-heading"
              className="text-display-lg md:text-display-xl font-extrabold text-text-primary leading-none tracking-tight mb-3"
            >
              김태빈
            </h2>
            <p className="text-base md:text-lg text-text-secondary mb-4">
              {profile.roleTitle}
            </p>
            {profile.location && (
              <p className="text-sm text-text-disabled font-mono">{profile.location}</p>
            )}
          </div>
        </div>

        {/* ── 바디 (2컬럼: 바이오 + 스킬) ─────────────── */}
        <div className="grid md:grid-cols-[1fr_300px] gap-0 md:gap-0 items-start">

          {/* 바이오 */}
          <div className="pr-16">
            <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mb-5">
              Bio
            </p>
            <div className="text-base text-text-secondary leading-relaxed space-y-4 max-w-[680px]">
              {profile.bio.split('\n\n').map((paragraph, i) => (
                <p key={i}>
                  {paragraph.split('\n').map((line, j, arr) => (
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3 mt-8">
              {githubLink && (
                <a
                  href={githubLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-default text-sm text-text-primary hover:border-border-strong hover:bg-surface-elevated transition-colors"
                >
                  <SiGithub size={15} />
                  GitHub
                </a>
              )}
              <a
                href="mailto:devbinlog8@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-default text-sm text-text-primary hover:border-border-strong hover:bg-surface-elevated transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                Email
              </a>
            </div>
          </div>

          {/* 스킬 — 장르 태그 */}
          <div className="border-l border-border-default pl-10">
            <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mb-4">
              Specialties
            </p>
            <div className="flex flex-wrap gap-2">
              {SKILL_GENRES.map((skill) => (
                <span
                  key={skill.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border-default bg-surface-input text-text-secondary hover:border-border-strong transition-colors cursor-default"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: skill.color }}
                  />
                  {skill.label}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
