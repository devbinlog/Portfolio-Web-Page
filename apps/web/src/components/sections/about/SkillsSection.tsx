import { TechBadge } from '@/components/ui/TechBadge'

const SKILL_GROUPS = [
  {
    label: 'AI / Data',
    description: 'LLM pipeline, search systems, multimodal processing',
    skills: ['LLM', 'Embedding', 'Whisper', 'Stable Diffusion'],
  },
  {
    label: 'Backend',
    description: 'REST API, data modeling, server design',
    skills: ['FastAPI', 'Node.js / NestJS', 'REST API', 'PostgreSQL', 'Prisma', 'Redis'],
  },
  {
    label: 'Frontend',
    description: 'Interactive UI, type-safe components',
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    label: '3D / Interactive',
    description: 'Real-time 3D rendering, gesture interaction',
    skills: ['Three.js', 'React Three Fiber', 'WebGL'],
  },
  {
    label: 'Infra',
    description: 'Containers, CI/CD, monorepo',
    skills: ['Docker', 'GitHub Actions', 'Turborepo'],
  },
]

export function SkillsSection() {
  return (
    <section aria-labelledby="skills-heading">
      <h2 id="skills-heading" className="text-2xl font-bold text-text-primary mb-2">
        Tech Stack
      </h2>
      <p className="text-sm text-text-secondary mb-10">
        입력부터 결과까지 이어지는 AI 파이프라인을 설계하고, 이를 인터랙티브한 사용자 경험으로 연결합니다.
      </p>

      <div className="space-y-10">
        {SKILL_GROUPS.map((group) => (
          <div key={group.label}>
            {/* 카테고리 헤더 */}
            <div className="flex items-baseline gap-3 mb-4">
              <p className="text-xs font-mono text-text-primary uppercase tracking-widest">
                {group.label}
              </p>
              <p className="text-xs text-text-disabled">{group.description}</p>
            </div>

            {/* 뱃지 그리드 */}
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <TechBadge key={skill} name={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
