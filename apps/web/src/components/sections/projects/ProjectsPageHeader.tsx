'use client'

import { useEffect, useState } from 'react'

const TECH_STRIP = [
  'Next.js', 'TypeScript', 'React', 'Python', 'FastAPI', 'Three.js',
  'React Three Fiber', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Rust',
  'MediaPipe', 'Zustand', 'Vite', 'Firebase', 'Supabase', 'Vercel',
  'Ollama', 'Claude API', 'Stable Diffusion', 'Tauri', 'WebSocket',
  'SQLAlchemy', 'NextAuth.js', 'React Three Fiber', 'Web Audio API',
]

function useCountUp(target: number, duration = 1000, delay = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => {
      let frame = 0
      const totalFrames = Math.round(duration / 16)
      const timer = setInterval(() => {
        frame++
        const progress = frame / totalFrames
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(eased * target))
        if (frame >= totalFrames) {
          setCount(target)
          clearInterval(timer)
        }
      }, 16)
      return () => clearInterval(timer)
    }, delay)
    return () => clearTimeout(timeout)
  }, [target, duration, delay])
  return count
}

interface ProjectsPageHeaderProps {
  count: number
}

export function ProjectsPageHeader({ count }: ProjectsPageHeaderProps) {
  const projectCount = useCountUp(count, 900, 100)
  const techCount = useCountUp(28, 1100, 200)

  return (
    <header className="mb-16">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <p className="text-xs font-mono text-text-disabled uppercase tracking-[0.2em] mb-4">
        Portfolio
      </p>
      <h1 className="text-display-md font-bold text-text-primary mb-12">Projects</h1>

      {/* 통계 카운터 */}
      <div className="flex items-center gap-6 md:gap-10 mb-10 pb-10 border-b border-border-default">
        <div>
          <p className="text-4xl md:text-5xl font-bold tabular-nums tracking-tight text-text-primary leading-none">
            {projectCount}
          </p>
          <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mt-2">
            Projects
          </p>
        </div>

        <div className="w-px h-10 bg-border-default" />

        <div>
          <p className="text-4xl md:text-5xl font-bold tabular-nums tracking-tight text-text-primary leading-none">
            {techCount}+
          </p>
          <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mt-2">
            Technologies
          </p>
        </div>

        <div className="w-px h-10 bg-border-default" />

        <div>
          <p className="text-4xl md:text-5xl font-bold tabular-nums tracking-tight text-text-primary leading-none">
            2026
          </p>
          <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mt-2">
            Year
          </p>
        </div>
      </div>

      {/* 기술 스크롤 스트립 */}
      <div className="overflow-hidden -mx-6">
        <div
          style={{
            display: 'flex',
            width: 'max-content',
            animation: 'marquee 30s linear infinite',
          }}
        >
          {[...TECH_STRIP, ...TECH_STRIP].map((tech, i) => (
            <span
              key={i}
              className="text-xs font-mono text-text-disabled whitespace-nowrap px-4"
            >
              {tech}
              <span className="ml-4 text-border-strong">·</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}
