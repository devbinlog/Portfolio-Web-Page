import type { ReactNode } from 'react'
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiPython,
  SiFastapi,
  SiNodedotjs,
  SiNestjs,
  SiPostgresql,
  SiPrisma,
  SiRedis,
  SiTailwindcss,
  SiThreedotjs,
  SiDocker,
  SiGithubactions,
  SiTurborepo,
  SiFramer,
  SiWebgl,
  SiOpenai,
  SiVite,
  SiSqlite,
  SiSupabase,
  SiVercel,
  SiFirebase,
  SiRust,
  SiMediapipe,
} from 'react-icons/si'
import { TbBrain, TbMicrophone2, TbVector } from 'react-icons/tb'
import { MdApi } from 'react-icons/md'

// Fallback: 2-char abbreviation square
function IconFallback({ name }: { name: string }) {
  const abbr = (name ?? '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || '?'
  return (
    <span
      className="inline-flex items-center justify-center w-4 h-4 rounded-sm text-[9px] font-bold leading-none bg-accent-primary text-surface-base select-none"
      aria-hidden
    >
      {abbr}
    </span>
  )
}

// ── Icon registry ──────────────────────────────────────────────────────────
const ICON_MAP: Record<string, ReactNode> = {
  // AI / Data
  'LLM':               <TbBrain size={16} aria-hidden color="#A855F7" />,
  'Embedding':         <TbVector size={16} aria-hidden color="#6366F1" />,
  'Whisper':           <TbMicrophone2 size={16} aria-hidden color="#F59E0B" />,
  'Stable Diffusion':  <IconFallback name="SD" />,
  'OpenAI API':        <SiOpenai size={16} aria-hidden color="#10A37F" />,
  'MediaPipe':         <SiMediapipe size={16} aria-hidden color="#0097A7" />,

  // Backend
  'FastAPI':           <SiFastapi size={16} aria-hidden color="#009688" />,
  'Node.js / NestJS':  <SiNodedotjs size={16} aria-hidden color="#339933" />,
  'Node.js':           <SiNodedotjs size={16} aria-hidden color="#339933" />,
  'NestJS':            <SiNestjs size={16} aria-hidden color="#E0234E" />,
  'REST API':          <MdApi size={16} aria-hidden color="#6366F1" />,
  'PostgreSQL':        <SiPostgresql size={16} aria-hidden color="#336791" />,
  'Prisma':            <SiPrisma size={16} aria-hidden color="#5A67D8" />,
  'Redis':             <SiRedis size={16} aria-hidden color="#DC382D" />,
  'SQLAlchemy':        <SiPython size={16} aria-hidden color="#3776AB" />,
  'SQLite':            <SiSqlite size={16} aria-hidden color="#003B57" />,
  'Supabase':          <SiSupabase size={16} aria-hidden color="#3ECF8E" />,

  // Frontend
  'Next.js':           <SiNextdotjs size={16} aria-hidden />,
  'Next.js 14':        <SiNextdotjs size={16} aria-hidden />,
  'Next.js 14+':       <SiNextdotjs size={16} aria-hidden />,
  'Next.js 15':        <SiNextdotjs size={16} aria-hidden />,
  'React':             <SiReact size={16} aria-hidden color="#61DAFB" />,
  'React 18':          <SiReact size={16} aria-hidden color="#61DAFB" />,
  'React 19':          <SiReact size={16} aria-hidden color="#61DAFB" />,
  'TypeScript':        <SiTypescript size={16} aria-hidden color="#3178C6" />,
  'TypeScript 5':      <SiTypescript size={16} aria-hidden color="#3178C6" />,
  'Tailwind CSS':      <SiTailwindcss size={16} aria-hidden color="#06B6D4" />,
  'Tailwind CSS v4':   <SiTailwindcss size={16} aria-hidden color="#06B6D4" />,
  'Framer Motion':     <SiFramer size={16} aria-hidden color="#0055FF" />,
  'Zustand':           <IconFallback name="ZU" />,
  'Vite':              <SiVite size={16} aria-hidden color="#646CFF" />,
  'Vercel':            <SiVercel size={16} aria-hidden />,

  // 3D / Interactive
  'Three.js':          <SiThreedotjs size={16} aria-hidden />,
  'React Three Fiber': <SiReact size={16} aria-hidden color="#61DAFB" />,
  'WebGL':             <SiWebgl size={16} aria-hidden color="#990000" />,

  // Infra
  'Docker':            <SiDocker size={16} aria-hidden color="#2496ED" />,
  'GitHub Actions':    <SiGithubactions size={16} aria-hidden color="#2088FF" />,
  'Turborepo':         <SiTurborepo size={16} aria-hidden color="#EF4444" />,

  // Languages & Runtimes
  'Python':            <SiPython size={16} aria-hidden color="#3776AB" />,
  'Rust':              <SiRust size={16} aria-hidden color="#CE422B" />,

  // Services
  'Firebase':          <SiFirebase size={16} aria-hidden color="#FFCA28" />,
  'Tauri':             <SiRust size={16} aria-hidden color="#CE422B" />,
}

// ── TechBadge ──────────────────────────────────────────────────────────────
interface TechBadgeProps {
  name: string
  icon?: ReactNode
}

export function TechBadge({ name, icon }: TechBadgeProps) {
  const resolvedIcon = icon ?? ICON_MAP[name] ?? <IconFallback name={name} />

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-default bg-surface-input text-sm font-medium text-text-primary select-none">
      <span className="flex-shrink-0">{resolvedIcon}</span>
      <span>{name}</span>
    </span>
  )
}

// ── TechBadgeList ──────────────────────────────────────────────────────────
interface TechBadgeListProps {
  techs: string[]
}

export function TechBadgeList({ techs }: TechBadgeListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {techs.map((tech) => (
        <TechBadge key={tech} name={tech} />
      ))}
    </div>
  )
}
