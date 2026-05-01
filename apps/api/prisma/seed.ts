import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// description 필드 구조:  "Problem\n\n---\n\nLimitation"
// workingApproach 필드 구조: "Solution\n\n---\n\nArchitecture diagram"

async function main() {
  console.log('Seeding database...')

  // 카테고리
  const musicCategory = await prisma.category.upsert({
    where: { slug: 'music_projects' },
    update: {},
    create: { name: 'Music Projects', slug: 'music_projects', objectFamily: 'signal_orb', order: 1 },
  })
  const aiCategory = await prisma.category.upsert({
    where: { slug: 'ai_projects' },
    update: {},
    create: { name: 'AI Projects', slug: 'ai_projects', objectFamily: 'data_crystal', order: 2 },
  })
  const designCategory = await prisma.category.upsert({
    where: { slug: 'design_projects' },
    update: {},
    create: { name: 'Design Projects', slug: 'design_projects', objectFamily: 'layered_device', order: 3 },
  })

  // 태그
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: 'react' }, update: {}, create: { name: 'React', slug: 'react' } }),
    prisma.tag.upsert({ where: { slug: 'nextjs' }, update: {}, create: { name: 'Next.js', slug: 'nextjs' } }),
    prisma.tag.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript', slug: 'typescript' } }),
    prisma.tag.upsert({ where: { slug: 'python' }, update: {}, create: { name: 'Python', slug: 'python' } }),
    prisma.tag.upsert({ where: { slug: 'fastapi' }, update: {}, create: { name: 'FastAPI', slug: 'fastapi' } }),
    prisma.tag.upsert({ where: { slug: 'ai' }, update: {}, create: { name: 'AI', slug: 'ai' } }),
    prisma.tag.upsert({ where: { slug: 'threejs' }, update: {}, create: { name: 'Three.js', slug: 'threejs' } }),
    prisma.tag.upsert({ where: { slug: 'tauri' }, update: {}, create: { name: 'Tauri', slug: 'tauri' } }),
    prisma.tag.upsert({ where: { slug: 'mediapipe' }, update: {}, create: { name: 'MediaPipe', slug: 'mediapipe' } }),
    prisma.tag.upsert({ where: { slug: 'prisma' }, update: {}, create: { name: 'Prisma', slug: 'prisma' } }),
  ])
  const [reactTag, nextjsTag, typescriptTag, pythonTag, fastapiTag, aiTag, threejsTag, tauriTag, mediapipeTag, prismaTag] = tags

  // 프로필
  await prisma.profile.upsert({
    where: { id: 'default' },
    update: {
      name: 'Taebin Kim',
      roleTitle: 'AI / LLM Engineer & Frontend Developer',
      tagline: 'Designing systems that transform unstructured input into structured user experiences.',
      bio: 'LLM 파이프라인과 검색 시스템 설계부터 3D 인터랙션까지, 비정형 입력을 구조화된 사용자 경험으로 변환하는 End-to-End 시스템을 만듭니다. 구현보다 설계를 먼저, 기능보다 구조를 먼저 생각합니다.',
      location: 'Seoul, Korea',
    },
    create: {
      id: 'default',
      name: 'Taebin Kim',
      roleTitle: 'AI / LLM Engineer & Frontend Developer',
      tagline: 'Designing systems that transform unstructured input into structured user experiences.',
      bio: 'LLM 파이프라인과 검색 시스템 설계부터 3D 인터랙션까지, 비정형 입력을 구조화된 사용자 경험으로 변환하는 End-to-End 시스템을 만듭니다. 구현보다 설계를 먼저, 기능보다 구조를 먼저 생각합니다.',
      workingMethod: '',
      location: 'Seoul, Korea',
      socialLinks: {
        create: [
          { platform: 'GitHub', url: 'https://github.com/devbinlog', order: 1 },
        ],
      },
    },
  })

  // ── 1. BandStage ──────────────────────────────────────────────────────────
  const bandstage = await prisma.project.upsert({
    where: { slug: 'bandstage' },
    update: {
      title: 'BandStage',
      summary: '지역 기반 라이브 음악 플랫폼 — 밴드, 공연장, 공연, 예매를 하나로 연결합니다.',
      description: `국내 공연 생태계는 정보가 분산되어 있습니다. 아티스트는 공연을 홍보할 통합 채널이 없고, 팬은 "서울 홍대 인근 인디 밴드 공연"을 한 번에 탐색할 방법이 없습니다. 공연장 관리자, 아티스트, 팬 세 주체가 각자의 채널에서 따로 움직이며 공연 정보의 단절이 발생합니다.

---

기존 SNS(Instagram, X)는 공연 정보를 구조화해서 저장하지 않습니다. 검색이 불가능하고, 지역·장르 필터가 없으며, 예매 흐름이 분리되어 있습니다. 티켓 플랫폼은 중소 공연에 부적합한 수수료 구조를 가집니다. 아티스트 직접 홍보 도구도 없습니다.`,
      workingApproach: `공연 생태계를 "Region → Venue → Event → Reservation" 4계층 데이터 모델로 정의했습니다. 각 계층이 명확한 소유권과 상태를 가지며, 위에서 아래로만 의존합니다. 공연 등록 워크플로우(DRAFT → PENDING → APPROVED → PUBLISHED)를 상태 머신으로 설계해 권한별 전환 규칙을 코드로 명시했습니다.

---

User (Fan)          User (Artist)        User (Venue Manager)
    |                     |                        |
    v                     v                        v
[Region Filter]    [Event Registration]     [Venue Management]
    |               DRAFT → PENDING               |
    v               APPROVED → PUBLISHED          |
[Venue List]              |                       |
    |                     v                       |
    v              [Event Detail Page]            |
[Event Browse] ←────────────────────────── [Venue Profile]
    |
    v
[Reservation Flow]
 ├── Ticket Type Selection
 ├── Quantity Management
 └── Booking Confirmation`,
      contribution: `서버 컴포넌트 우선 아키텍처로 클라이언트 번들을 최소화했습니다. 동적 라우팅(/events/[slug])에서 정적 생성과 ISR을 조합해 성능과 데이터 신선도를 동시에 확보했습니다. NextAuth.js v4로 FAN/ARTIST/VENUE_MANAGER/ADMIN 4역할 인증 시스템을 구현하고, 미들웨어 레벨에서 역할별 라우트를 보호했습니다. 실제 서울 공연장 25개 데이터를 구조화해 Supabase PostgreSQL에 시드했습니다.`,
      keyLearnings: `복잡한 다중 역할 시스템에서 권한 검사를 UI 레이어가 아닌 서버/DB 레이어에서 처리해야 보안이 유지된다는 것을 직접 경험했습니다. 공연 상태 머신을 도입한 후 "잘못된 상태의 데이터"가 사라졌고, 디버깅 시간이 크게 줄었습니다. 데이터 모델이 확실할수록 UI 설계가 자연스럽게 따라온다는 것을 확인했습니다.`,
      techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Prisma', 'Supabase', 'NextAuth.js', 'Vercel'],
      codeSnippets: [
        {
          title: 'Event Status State Machine',
          language: 'typescript',
          code: `// Event lifecycle: DRAFT → PENDING → APPROVED → PUBLISHED
// Each transition is guarded by role + current state.

type EventStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'PUBLISHED' | 'CANCELLED'
type UserRole = 'ARTIST' | 'VENUE_MANAGER' | 'ADMIN'

interface Transition {
  from: EventStatus
  to: EventStatus
  allowedRoles: UserRole[]
}

const TRANSITIONS: Transition[] = [
  { from: 'DRAFT',    to: 'PENDING',   allowedRoles: ['ARTIST'] },
  { from: 'PENDING',  to: 'APPROVED',  allowedRoles: ['ADMIN', 'VENUE_MANAGER'] },
  { from: 'PENDING',  to: 'DRAFT',     allowedRoles: ['ADMIN'] },
  { from: 'APPROVED', to: 'PUBLISHED', allowedRoles: ['ADMIN', 'VENUE_MANAGER'] },
  { from: 'APPROVED', to: 'DRAFT',     allowedRoles: ['ADMIN'] },
  { from: 'PUBLISHED',to: 'CANCELLED', allowedRoles: ['ADMIN', 'VENUE_MANAGER', 'ARTIST'] },
]

export function canTransition(
  current: EventStatus,
  next: EventStatus,
  role: UserRole,
): boolean {
  return TRANSITIONS.some(
    (t) => t.from === current && t.to === next && t.allowedRoles.includes(role),
  )
}

// Usage in service layer:
export async function updateEventStatus(
  eventId: string,
  nextStatus: EventStatus,
  actorRole: UserRole,
) {
  const event = await prisma.event.findUniqueOrThrow({ where: { id: eventId } })

  if (!canTransition(event.status, nextStatus, actorRole)) {
    throw new ForbiddenException(
      \`\${actorRole} cannot transition event from \${event.status} to \${nextStatus}\`,
    )
  }

  return prisma.event.update({
    where: { id: eventId },
    data: { status: nextStatus },
  })
}`,
          explanation: '상태 전환 규칙을 TRANSITIONS 배열에 선언적으로 정의합니다. canTransition() 함수 하나로 모든 서비스 레이어에서 권한 검사를 재사용합니다. 규칙을 코드에 명시하면 새 역할 추가 시 배열에만 항목을 추가하면 됩니다.',
        },
        {
          title: 'Role-Based Route Guard (Next.js Middleware)',
          language: 'typescript',
          code: `// middleware.ts — runs on every request before rendering
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Route → required roles map
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin':          ['ADMIN'],
  '/venue/manage':   ['VENUE_MANAGER', 'ADMIN'],
  '/event/register': ['ARTIST', 'ADMIN'],
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const path = req.nextUrl.pathname

  for (const [prefix, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (!path.startsWith(prefix)) continue

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const userRole = token.role as string
    if (!roles.includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/venue/:path*', '/event/:path*'],
}`,
          explanation: '권한 검사를 UI 컴포넌트가 아닌 미들웨어 레이어에서 처리합니다. 페이지가 렌더링되기 전 서버에서 역할을 검증하므로 클라이언트 코드에 권한 로직이 노출되지 않습니다.',
        },
        {
          title: 'Prisma Event Query — Region + Genre Filter',
          language: 'typescript',
          code: `// app/events/page.tsx (Server Component)
interface EventsPageProps {
  searchParams: {
    region?: string
    genre?: string
    dateFrom?: string
    dateTo?: string
    page?: string
  }
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const page = Number(searchParams.page ?? 1)
  const pageSize = 12

  const where: Prisma.EventWhereInput = {
    status: 'PUBLISHED',
    // Region filter: venue.regionId matches
    ...(searchParams.region && {
      venue: { region: { slug: searchParams.region } },
    }),
    // Genre filter: artist tag matches
    ...(searchParams.genre && {
      artist: { tags: { some: { slug: searchParams.genre } } },
    }),
    // Date range filter
    ...(searchParams.dateFrom && {
      startAt: { gte: new Date(searchParams.dateFrom) },
    }),
    ...(searchParams.dateTo && {
      endAt: { lte: new Date(searchParams.dateTo) },
    }),
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: { venue: true, artist: true, ticketTypes: true },
      orderBy: { startAt: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.event.count({ where }),
  ])

  return <EventGrid events={events} total={total} page={page} />
}`,
          explanation: 'Prisma의 중첩 where 조건으로 venue.region, artist.tags, 날짜 범위를 단일 쿼리로 필터링합니다. Server Component에서 직접 DB 쿼리를 실행해 클라이언트 번들에 쿼리 로직이 포함되지 않습니다.',
        },
      ],
    },
    create: {
      title: 'BandStage',
      slug: 'bandstage',
      summary: '지역 기반 라이브 음악 플랫폼 — 밴드, 공연장, 공연, 예매를 하나로 연결합니다.',
      description: `국내 공연 생태계는 정보가 분산되어 있습니다. 아티스트는 공연을 홍보할 통합 채널이 없고, 팬은 "서울 홍대 인근 인디 밴드 공연"을 한 번에 탐색할 방법이 없습니다. 공연장 관리자, 아티스트, 팬 세 주체가 각자의 채널에서 따로 움직이며 공연 정보의 단절이 발생합니다.

---

기존 SNS(Instagram, X)는 공연 정보를 구조화해서 저장하지 않습니다. 검색이 불가능하고, 지역·장르 필터가 없으며, 예매 흐름이 분리되어 있습니다. 티켓 플랫폼은 중소 공연에 부적합한 수수료 구조를 가집니다. 아티스트 직접 홍보 도구도 없습니다.`,
      workingApproach: `공연 생태계를 "Region → Venue → Event → Reservation" 4계층 데이터 모델로 정의했습니다. 각 계층이 명확한 소유권과 상태를 가지며, 위에서 아래로만 의존합니다. 공연 등록 워크플로우(DRAFT → PENDING → APPROVED → PUBLISHED)를 상태 머신으로 설계해 권한별 전환 규칙을 코드로 명시했습니다.

---

User (Fan)          User (Artist)        User (Venue Manager)
    |                     |                        |
    v                     v                        v
[Region Filter]    [Event Registration]     [Venue Management]
    |               DRAFT → PENDING               |
    v               APPROVED → PUBLISHED          |
[Venue List]              |                       |
    |                     v                       |
    v              [Event Detail Page]            |
[Event Browse] ←────────────────────────── [Venue Profile]
    |
    v
[Reservation Flow]
 ├── Ticket Type Selection
 ├── Quantity Management
 └── Booking Confirmation`,
      contribution: `서버 컴포넌트 우선 아키텍처로 클라이언트 번들을 최소화했습니다. 동적 라우팅(/events/[slug])에서 정적 생성과 ISR을 조합해 성능과 데이터 신선도를 동시에 확보했습니다. NextAuth.js v4로 FAN/ARTIST/VENUE_MANAGER/ADMIN 4역할 인증 시스템을 구현하고, 미들웨어 레벨에서 역할별 라우트를 보호했습니다. 실제 서울 공연장 25개 데이터를 구조화해 Supabase PostgreSQL에 시드했습니다.`,
      keyLearnings: `복잡한 다중 역할 시스템에서 권한 검사를 UI 레이어가 아닌 서버/DB 레이어에서 처리해야 보안이 유지된다는 것을 직접 경험했습니다. 공연 상태 머신을 도입한 후 "잘못된 상태의 데이터"가 사라졌고, 디버깅 시간이 크게 줄었습니다. 데이터 모델이 확실할수록 UI 설계가 자연스럽게 따라온다는 것을 확인했습니다.`,
      techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Prisma', 'Supabase', 'NextAuth.js', 'Vercel'],
      codeSnippets: [
        {
          title: 'Event Status State Machine',
          language: 'typescript',
          code: `type EventStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'PUBLISHED' | 'CANCELLED'
type UserRole = 'ARTIST' | 'VENUE_MANAGER' | 'ADMIN'

const TRANSITIONS = [
  { from: 'DRAFT',    to: 'PENDING',   allowedRoles: ['ARTIST'] },
  { from: 'PENDING',  to: 'APPROVED',  allowedRoles: ['ADMIN', 'VENUE_MANAGER'] },
  { from: 'APPROVED', to: 'PUBLISHED', allowedRoles: ['ADMIN', 'VENUE_MANAGER'] },
  { from: 'PUBLISHED',to: 'CANCELLED', allowedRoles: ['ADMIN', 'VENUE_MANAGER', 'ARTIST'] },
] as const

export function canTransition(
  current: EventStatus, next: EventStatus, role: UserRole,
): boolean {
  return TRANSITIONS.some(
    (t) => t.from === current && t.to === next && t.allowedRoles.includes(role),
  )
}

export async function updateEventStatus(
  eventId: string, nextStatus: EventStatus, actorRole: UserRole,
) {
  const event = await prisma.event.findUniqueOrThrow({ where: { id: eventId } })
  if (!canTransition(event.status, nextStatus, actorRole)) {
    throw new ForbiddenException(
      \`\${actorRole} cannot transition from \${event.status} to \${nextStatus}\`,
    )
  }
  return prisma.event.update({ where: { id: eventId }, data: { status: nextStatus } })
}`,
          explanation: '상태 전환 규칙을 TRANSITIONS 배열에 선언적으로 정의합니다. canTransition() 함수 하나로 모든 서비스 레이어에서 권한 검사를 재사용합니다.',
        },
        {
          title: 'Role-Based Route Guard (Next.js Middleware)',
          language: 'typescript',
          code: `import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin':          ['ADMIN'],
  '/venue/manage':   ['VENUE_MANAGER', 'ADMIN'],
  '/event/register': ['ARTIST', 'ADMIN'],
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const path = req.nextUrl.pathname

  for (const [prefix, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (!path.startsWith(prefix)) continue
    if (!token) return NextResponse.redirect(new URL('/login', req.url))
    const userRole = token.role as string
    if (!roles.includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/venue/:path*', '/event/:path*'],
}`,
          explanation: '권한 검사를 UI 컴포넌트가 아닌 미들웨어 레이어에서 처리합니다. 페이지가 렌더링되기 전 서버에서 역할을 검증하므로 클라이언트 코드에 권한 로직이 노출되지 않습니다.',
        },
        {
          title: 'Prisma Event Query — Region + Genre Filter',
          language: 'typescript',
          code: `const where: Prisma.EventWhereInput = {
  status: 'PUBLISHED',
  ...(searchParams.region && {
    venue: { region: { slug: searchParams.region } },
  }),
  ...(searchParams.genre && {
    artist: { tags: { some: { slug: searchParams.genre } } },
  }),
  ...(searchParams.dateFrom && {
    startAt: { gte: new Date(searchParams.dateFrom) },
  }),
  ...(searchParams.dateTo && {
    endAt: { lte: new Date(searchParams.dateTo) },
  }),
}

const [events, total] = await Promise.all([
  prisma.event.findMany({
    where,
    include: { venue: true, artist: true, ticketTypes: true },
    orderBy: { startAt: 'asc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  }),
  prisma.event.count({ where }),
])`,
          explanation: 'Prisma의 중첩 where 조건으로 venue.region, artist.tags, 날짜 범위를 단일 쿼리로 필터링합니다. Server Component에서 직접 DB 쿼리를 실행해 클라이언트 번들에 쿼리 로직이 포함되지 않습니다.',
        },
      ],
      categoryId: musicCategory.id,
      year: 2026,
      role: '풀스택 개발',
      isFeatured: true,
      featuredOrder: 1,
      isPublished: true,
      media: { create: [{ type: 'VIDEO_PLACEHOLDER', placeholderLabel: '데모 영상 준비 중입니다', order: 1, isPlaceholder: true }] },
      links: { create: [{ type: 'GITHUB', label: 'GitHub', url: 'https://github.com/devbinlog/BandStage', order: 1 }] },
    },
  })
  await prisma.projectTag.createMany({
    data: [
      { projectId: bandstage.id, tagId: nextjsTag.id },
      { projectId: bandstage.id, tagId: typescriptTag.id },
      { projectId: bandstage.id, tagId: prismaTag.id },
    ],
    skipDuplicates: true,
  })

  // ── 2. Page of Artist ─────────────────────────────────────────────────────
  const pageofartist = await prisma.project.upsert({
    where: { slug: 'page-of-artist' },
    update: {
      title: 'Page of Artist',
      summary: '아티스트의 음악 세계를 3D 공간에서 탐험하는 인터랙티브 뮤직 갤러리.',
      description: `음악 스트리밍 앱의 아티스트 페이지는 2D 리스트로 음악을 나열합니다. 아티스트의 세계관, 앨범 간 연결, 분위기를 시각적으로 느낄 수 있는 공간이 없습니다. Spotify, Apple Music 모두 "재생 버튼이 있는 목록" 수준에 머뭅니다.

---

3D 웹 기반 음악 경험은 대부분 실험적 작품 수준에 그칩니다. 실제 음악 데이터(트랙, 앨범)와 연동되지 않고, 모바일에서 동작하지 않으며, 물리 기반 인터랙션이 없어 조작감이 어색합니다.`,
      workingApproach: `React Three Fiber 위에 Spring 물리 엔진을 직접 구현했습니다. 12장 카드의 원형 배치(반지름 3.8)에서 각 카드의 위치, 회전, 스케일을 Spring 감쇠 함수로 계산합니다. React의 리렌더링 사이클 밖에서 물리 연산을 처리하기 위해 useFrame 루프 내 ref 기반 계산을 사용했습니다.

---

User Input (drag / scroll / keyboard)
          |
          v
    [Spring Physics Engine]
    useFrame loop, ref-based (no re-render)
    ├── position: lerp to target
    ├── velocity: spring damping
    └── rotation: inertia decay
          |
          v
    [Card State Machine]
    active (1.0x) / adjacent (0.82x) / background (0.65x)
          |
    ┌─────┴──────┐
    v            v
[Front Face]  [Flip → Back Face]
 Artist Card   Album Tracklist
 + Glow FX     + Spotify API Data
          |
          v
    [Spotify Web API]
    Client Credentials Token (10min cache)
    └── Static fallback on API failure`,
      contribution: `Spotify Web API를 Express 프록시 서버로 연동해 Client Credentials 토큰을 자동 갱신했습니다. 카드 호버 시 마우스 위치 기반 3D 틸팅(±6° CardParallax)을 구현했습니다. Firebase Firestore 실시간 구독으로 아티스트 등록 즉시 갤러리에 반영됩니다. 장르 필터 7개(Pop, Hip-Hop, Rock, R&B, Indie, Electronic, Latin) 선택 시 카드 재배치 애니메이션이 Spring 물리로 처리됩니다.`,
      keyLearnings: `React 렌더링 사이클을 우회한 ref 기반 물리 루프 패턴을 확립했습니다. 이 패턴 덕분에 60fps 물리 연산 중 단 한 번의 리렌더도 발생하지 않습니다. 외부 API(Spotify)의 불안정성을 정적 데이터 폴백으로 처리해, API 장애가 사용자 경험을 깨지 않도록 했습니다.`,
    },
    create: {
      title: 'Page of Artist',
      slug: 'page-of-artist',
      summary: '아티스트의 음악 세계를 3D 공간에서 탐험하는 인터랙티브 뮤직 갤러리.',
      description: `음악 스트리밍 앱의 아티스트 페이지는 2D 리스트로 음악을 나열합니다. 아티스트의 세계관, 앨범 간 연결, 분위기를 시각적으로 느낄 수 있는 공간이 없습니다. Spotify, Apple Music 모두 "재생 버튼이 있는 목록" 수준에 머뭅니다.

---

3D 웹 기반 음악 경험은 대부분 실험적 작품 수준에 그칩니다. 실제 음악 데이터(트랙, 앨범)와 연동되지 않고, 모바일에서 동작하지 않으며, 물리 기반 인터랙션이 없어 조작감이 어색합니다.`,
      workingApproach: `React Three Fiber 위에 Spring 물리 엔진을 직접 구현했습니다. 12장 카드의 원형 배치(반지름 3.8)에서 각 카드의 위치, 회전, 스케일을 Spring 감쇠 함수로 계산합니다. React의 리렌더링 사이클 밖에서 물리 연산을 처리하기 위해 useFrame 루프 내 ref 기반 계산을 사용했습니다.

---

User Input (drag / scroll / keyboard)
          |
          v
    [Spring Physics Engine]
    useFrame loop, ref-based (no re-render)
    ├── position: lerp to target
    ├── velocity: spring damping
    └── rotation: inertia decay
          |
          v
    [Card State Machine]
    active (1.0x) / adjacent (0.82x) / background (0.65x)
          |
    ┌─────┴──────┐
    v            v
[Front Face]  [Flip → Back Face]
 Artist Card   Album Tracklist
 + Glow FX     + Spotify API Data
          |
          v
    [Spotify Web API]
    Client Credentials Token (10min cache)
    └── Static fallback on API failure`,
      contribution: `Spotify Web API를 Express 프록시 서버로 연동해 Client Credentials 토큰을 자동 갱신했습니다. 카드 호버 시 마우스 위치 기반 3D 틸팅(±6° CardParallax)을 구현했습니다. Firebase Firestore 실시간 구독으로 아티스트 등록 즉시 갤러리에 반영됩니다. 장르 필터 7개(Pop, Hip-Hop, Rock, R&B, Indie, Electronic, Latin) 선택 시 카드 재배치 애니메이션이 Spring 물리로 처리됩니다.`,
      keyLearnings: `React 렌더링 사이클을 우회한 ref 기반 물리 루프 패턴을 확립했습니다. 이 패턴 덕분에 60fps 물리 연산 중 단 한 번의 리렌더도 발생하지 않습니다. 외부 API(Spotify)의 불안정성을 정적 데이터 폴백으로 처리해, API 장애가 사용자 경험을 깨지 않도록 했습니다.`,
      techStack: ['React 18', 'TypeScript', 'Three.js', 'React Three Fiber', 'Zustand', 'Firebase', 'Spotify API', 'Vite'],
      categoryId: musicCategory.id,
      year: 2026,
      role: '프론트엔드 개발, 3D 인터랙션',
      isFeatured: true,
      featuredOrder: 2,
      isPublished: true,
      media: { create: [{ type: 'VIDEO_PLACEHOLDER', placeholderLabel: '데모 영상 준비 중입니다', order: 1, isPlaceholder: true }] },
      links: { create: [{ type: 'GITHUB', label: 'GitHub', url: 'https://github.com/devbinlog/Page_of_Artist', order: 1 }] },
    },
  })
  await prisma.projectTag.createMany({
    data: [
      { projectId: pageofartist.id, tagId: reactTag.id },
      { projectId: pageofartist.id, tagId: typescriptTag.id },
      { projectId: pageofartist.id, tagId: threejsTag.id },
    ],
    skipDuplicates: true,
  })

  // ── 3. MUSE ───────────────────────────────────────────────────────────────
  const muse = await prisma.project.upsert({
    where: { slug: 'muse' },
    update: {
      title: 'MUSE',
      summary: '웹캠 하나로 손동작을 음악으로 변환하는 실시간 제스처 사운드 엔진.',
      description: `악기를 배우지 않고 음악을 만드는 자연스러운 방법이 없습니다. 터치스크린 앱들은 버튼을 탭하는 수준에 그치며, 실제 연주 감각을 주지 못합니다. 웹캠만 있으면 아무 도구 없이 연주할 수 있는 시스템이 필요합니다.

---

기존 제스처 기반 음악 도구들은 레이턴시가 높고(100ms+), 제스처 인식 정확도가 낮으며, 악기 다양성이 없습니다. 웹 기반은 특히 오디오 처리 레이턴시 문제가 심각합니다. 또한 실제 연주처럼 루프 녹음 및 반복 재생 기능이 없어 음악적 완결성이 부족합니다.`,
      workingApproach: `MediaPipe Tasks Vision으로 손가락 21개 키포인트를 30FPS 실시간 추적하고, 좌표를 오디오 파라미터로 매핑하는 규칙 기반 시스템을 설계했습니다. Web Audio API의 AudioWorklet으로 메인 스레드 블로킹 없이 오디오를 처리해 레이턴시를 30ms 이하로 달성했습니다.

---

WebCam Feed (30fps)
    |
    v
[MediaPipe Hand Tracking]
 21 landmarks per hand
    |
    v
[Gesture Classifier]
 ├── Finger count (0–5)
 ├── Hand position (x, y zone)
 └── Hold duration (0.8s threshold)
    |
    v
[Sound Zone Mapper]
 Screen Split: Upper / Lower half
 ├── Upper: Synthesizer (pentatonic scale)
 │    └── finger_count → note pitch
 └── Lower: Drum Kit (6 pads)
      └── zone_position → pad trigger
    |
    v
[Web Audio Engine]
 AudioWorklet (off main thread)
 ├── Oscillator + ADSR envelope
 ├── Drum synthesis (no samples)
 └── Loop Station (record/playback)
    |
    v
[MIDI/OSC Output] → External DAW`,
      contribution: `Tauri(Rust)로 웹 앱을 데스크탑 앱으로 패키징해 시스템 MIDI 접근을 가능하게 했습니다. AudioWorklet으로 드럼 합성과 루프스테이션 녹음을 메인 스레드 밖에서 처리합니다. 5손가락 0.8초 유지 제스처로 신시사이저/드럼/이펙터 패널을 전환하는 제스처 FSM을 구현했습니다. 외부 샘플 파일 없이 Web Audio API만으로 킥, 스네어, 하이햇 6종 드럼 합성을 구현했습니다.`,
      keyLearnings: `Web Audio API의 레이턴시 병목은 메인 스레드 점유에서 옵니다. AudioWorklet 분리로 30ms 이하 레이턴시를 달성했습니다. 30FPS 제스처 인식에서 손 떨림 필터링이 없으면 오탐이 폭증합니다. 0.8초 홀드 임계값과 평균화 필터를 통해 실제 연주 가능한 정확도를 확보했습니다.`,
      codeSnippets: [
        {
          title: 'Gesture Classifier — Finger Count + Zone Detection',
          language: 'typescript',
          code: `// Converts 21 MediaPipe hand landmarks into a GestureEvent
// Landmark indices: 0=wrist, 4=thumb tip, 8=index tip, ...

interface Landmark { x: number; y: number; z: number }
interface GestureEvent {
  fingerCount: number
  zone: 'upper' | 'lower'
  handX: number   // 0.0 (left) to 1.0 (right)
  handY: number   // 0.0 (top) to 1.0 (bottom)
  holdDuration: number  // seconds
}

const FINGER_TIPS = [4, 8, 12, 16, 20]   // thumb, index, middle, ring, pinky
const FINGER_PIPS = [3, 6, 10, 14, 18]   // second knuckle (PIP joint)

function classifyGesture(
  landmarks: Landmark[],
  prevGesture: GestureEvent | null,
  deltaTime: number,
): GestureEvent {
  // Count extended fingers: tip.y < pip.y means finger is up
  const fingerCount = FINGER_TIPS.reduce((count, tip, i) => {
    const pip = FINGER_PIPS[i]
    // Thumb uses x-axis instead of y-axis
    const isExtended = i === 0
      ? Math.abs(landmarks[tip].x - landmarks[pip].x) > 0.04
      : landmarks[tip].y < landmarks[pip].y - 0.02
    return count + (isExtended ? 1 : 0)
  }, 0)

  const wrist = landmarks[0]
  const zone: 'upper' | 'lower' = wrist.y < 0.5 ? 'upper' : 'lower'

  // Accumulate hold duration if gesture is stable
  const isStable = prevGesture?.fingerCount === fingerCount && prevGesture.zone === zone
  const holdDuration = isStable ? (prevGesture?.holdDuration ?? 0) + deltaTime : 0

  return { fingerCount, zone, handX: wrist.x, handY: wrist.y, holdDuration }
}`,
          explanation: 'FINGER_TIPS[i].y < FINGER_PIPS[i].y 조건으로 손가락 펴짐을 판정합니다. 엄지는 y축이 아닌 x축 거리를 사용합니다. holdDuration을 누적해 0.8초 이상 유지 시 패널 전환 FSM을 트리거합니다.',
        },
        {
          title: 'Sound Zone Mapper — Finger Count to MIDI Note',
          language: 'typescript',
          code: `// Maps gesture params to audio synthesis parameters
// Upper half = synthesizer (pentatonic scale)
// Lower half = drum kit (6 zone pads)

const PENTATONIC_C4 = [60, 62, 64, 67, 69, 72]  // C D E G A C (MIDI)

interface AudioParams {
  type: 'synth' | 'drum'
  frequency?: number    // Hz — for synth
  drumPad?: number      // 0–5 — for drum
  velocity: number      // 0.0–1.0
}

export function mapGestureToAudio(gesture: GestureEvent): AudioParams | null {
  if (gesture.fingerCount === 0) return null  // fist = silence

  if (gesture.zone === 'upper') {
    // Finger count 1–5 → pentatonic note index
    const noteIndex = Math.min(gesture.fingerCount - 1, PENTATONIC_C4.length - 1)
    const midiNote = PENTATONIC_C4[noteIndex]
    const frequency = 440 * Math.pow(2, (midiNote - 69) / 12)

    // Hand X position → velocity (left=soft, right=loud)
    const velocity = 0.3 + gesture.handX * 0.7

    return { type: 'synth', frequency, velocity }
  } else {
    // Lower zone: split into 3×2 grid → 6 drum pads
    const col = Math.floor(gesture.handX * 3)   // 0, 1, 2
    const row = gesture.handY > 0.75 ? 1 : 0    // top/bottom row
    const drumPad = row * 3 + col               // 0–5

    return { type: 'drum', drumPad, velocity: 0.8 }
  }
}`,
          explanation: '손 위치(zone)와 손가락 수(fingerCount)를 오디오 파라미터로 변환합니다. 상단 영역은 pentatonic scale MIDI 노트로, 하단 영역은 3×2 그리드 드럼 패드로 매핑합니다. MIDI 노트 → 주파수 변환은 표준 공식 440 × 2^((note-69)/12)를 사용합니다.',
        },
        {
          title: 'AudioWorklet — Off-Thread Drum Synthesis',
          language: 'javascript',
          code: `// drum-processor.js  (runs in AudioWorkletGlobalScope)
// No DOM access, no main thread blocking.

class DrumProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'trigger', defaultValue: 0, automationRate: 'k-rate' }]
  }

  constructor() {
    super()
    this.phase = 0
    this.envelope = 0
    this.drumType = 0   // 0=kick, 1=snare, 2=hihat, ...
    this.port.onmessage = (e) => {
      if (e.data.type === 'trigger') {
        this.envelope = 1.0       // reset envelope on trigger
        this.phase = 0
        this.drumType = e.data.pad
      }
    }
  }

  process(inputs, outputs) {
    const output = outputs[0][0]
    const sampleRate = globalThis.sampleRate

    for (let i = 0; i < output.length; i++) {
      let sample = 0

      if (this.drumType === 0) {
        // Kick: sine with exponential pitch drop
        const freq = 80 * Math.exp(-this.phase * 15)
        sample = Math.sin(2 * Math.PI * freq * this.phase / sampleRate)
      } else if (this.drumType === 1) {
        // Snare: noise burst + tone
        sample = (Math.random() * 2 - 1) * 0.5
          + Math.sin(2 * Math.PI * 200 * this.phase / sampleRate) * 0.5
      } else {
        // Hi-hat: bandpassed noise
        sample = (Math.random() * 2 - 1)
      }

      output[i] = sample * this.envelope
      this.envelope *= 0.9994          // exponential decay
      this.phase++
    }
    return true   // keep processor alive
  }
}

registerProcessor('drum-processor', DrumProcessor)`,
          explanation: 'AudioWorkletProcessor는 메인 스레드와 분리된 오디오 스레드에서 실행됩니다. port.onmessage로 트리거 이벤트를 받고, process() 루프에서 샘플을 합성합니다. 외부 샘플 파일 없이 수식으로 킥(사인+피치 감쇠), 스네어(노이즈+톤), 하이햇(노이즈)을 합성합니다.',
        },
      ],
    },
    create: {
      title: 'MUSE',
      slug: 'muse',
      summary: '웹캠 하나로 손동작을 음악으로 변환하는 실시간 제스처 사운드 엔진.',
      description: `악기를 배우지 않고 음악을 만드는 자연스러운 방법이 없습니다. 터치스크린 앱들은 버튼을 탭하는 수준에 그치며, 실제 연주 감각을 주지 못합니다. 웹캠만 있으면 아무 도구 없이 연주할 수 있는 시스템이 필요합니다.

---

기존 제스처 기반 음악 도구들은 레이턴시가 높고(100ms+), 제스처 인식 정확도가 낮으며, 악기 다양성이 없습니다. 웹 기반은 특히 오디오 처리 레이턴시 문제가 심각합니다. 또한 실제 연주처럼 루프 녹음 및 반복 재생 기능이 없어 음악적 완결성이 부족합니다.`,
      workingApproach: `MediaPipe Tasks Vision으로 손가락 21개 키포인트를 30FPS 실시간 추적하고, 좌표를 오디오 파라미터로 매핑하는 규칙 기반 시스템을 설계했습니다. Web Audio API의 AudioWorklet으로 메인 스레드 블로킹 없이 오디오를 처리해 레이턴시를 30ms 이하로 달성했습니다.

---

WebCam Feed (30fps)
    |
    v
[MediaPipe Hand Tracking]
 21 landmarks per hand
    |
    v
[Gesture Classifier]
 ├── Finger count (0–5)
 ├── Hand position (x, y zone)
 └── Hold duration (0.8s threshold)
    |
    v
[Sound Zone Mapper]
 Screen Split: Upper / Lower half
 ├── Upper: Synthesizer (pentatonic scale)
 │    └── finger_count → note pitch
 └── Lower: Drum Kit (6 pads)
      └── zone_position → pad trigger
    |
    v
[Web Audio Engine]
 AudioWorklet (off main thread)
 ├── Oscillator + ADSR envelope
 ├── Drum synthesis (no samples)
 └── Loop Station (record/playback)
    |
    v
[MIDI/OSC Output] → External DAW`,
      contribution: `Tauri(Rust)로 웹 앱을 데스크탑 앱으로 패키징해 시스템 MIDI 접근을 가능하게 했습니다. AudioWorklet으로 드럼 합성과 루프스테이션 녹음을 메인 스레드 밖에서 처리합니다. 5손가락 0.8초 유지 제스처로 신시사이저/드럼/이펙터 패널을 전환하는 제스처 FSM을 구현했습니다. 외부 샘플 파일 없이 Web Audio API만으로 킥, 스네어, 하이햇 6종 드럼 합성을 구현했습니다.`,
      keyLearnings: `Web Audio API의 레이턴시 병목은 메인 스레드 점유에서 옵니다. AudioWorklet 분리로 30ms 이하 레이턴시를 달성했습니다. 30FPS 제스처 인식에서 손 떨림 필터링이 없으면 오탐이 폭증합니다. 0.8초 홀드 임계값과 평균화 필터를 통해 실제 연주 가능한 정확도를 확보했습니다.`,
      techStack: ['React 18', 'TypeScript', 'Tauri', 'Rust', 'MediaPipe', 'Web Audio API', 'Zustand', 'Vite'],
      codeSnippets: [
        {
          title: 'Gesture Classifier — Finger Count + Zone Detection',
          language: 'typescript',
          code: `interface Landmark { x: number; y: number; z: number }
interface GestureEvent {
  fingerCount: number
  zone: 'upper' | 'lower'
  handX: number
  handY: number
  holdDuration: number
}

const FINGER_TIPS = [4, 8, 12, 16, 20]
const FINGER_PIPS = [3, 6, 10, 14, 18]

function classifyGesture(
  landmarks: Landmark[],
  prevGesture: GestureEvent | null,
  deltaTime: number,
): GestureEvent {
  const fingerCount = FINGER_TIPS.reduce((count, tip, i) => {
    const pip = FINGER_PIPS[i]
    const isExtended = i === 0
      ? Math.abs(landmarks[tip].x - landmarks[pip].x) > 0.04
      : landmarks[tip].y < landmarks[pip].y - 0.02
    return count + (isExtended ? 1 : 0)
  }, 0)

  const wrist = landmarks[0]
  const zone: 'upper' | 'lower' = wrist.y < 0.5 ? 'upper' : 'lower'
  const isStable = prevGesture?.fingerCount === fingerCount && prevGesture.zone === zone
  const holdDuration = isStable ? (prevGesture?.holdDuration ?? 0) + deltaTime : 0

  return { fingerCount, zone, handX: wrist.x, handY: wrist.y, holdDuration }
}`,
          explanation: 'FINGER_TIPS[i].y < FINGER_PIPS[i].y 조건으로 손가락 펴짐을 판정합니다. 엄지는 y축이 아닌 x축 거리를 사용합니다. holdDuration을 누적해 0.8초 이상 유지 시 패널 전환 FSM을 트리거합니다.',
        },
        {
          title: 'Sound Zone Mapper — Finger Count to MIDI Note',
          language: 'typescript',
          code: `const PENTATONIC_C4 = [60, 62, 64, 67, 69, 72]

interface AudioParams {
  type: 'synth' | 'drum'
  frequency?: number
  drumPad?: number
  velocity: number
}

export function mapGestureToAudio(gesture: GestureEvent): AudioParams | null {
  if (gesture.fingerCount === 0) return null

  if (gesture.zone === 'upper') {
    const noteIndex = Math.min(gesture.fingerCount - 1, PENTATONIC_C4.length - 1)
    const midiNote = PENTATONIC_C4[noteIndex]
    const frequency = 440 * Math.pow(2, (midiNote - 69) / 12)
    const velocity = 0.3 + gesture.handX * 0.7
    return { type: 'synth', frequency, velocity }
  } else {
    const col = Math.floor(gesture.handX * 3)
    const row = gesture.handY > 0.75 ? 1 : 0
    const drumPad = row * 3 + col
    return { type: 'drum', drumPad, velocity: 0.8 }
  }
}`,
          explanation: '손 위치(zone)와 손가락 수를 오디오 파라미터로 변환합니다. 상단은 pentatonic scale MIDI 노트로, 하단은 3×2 그리드 드럼 패드로 매핑합니다.',
        },
        {
          title: 'AudioWorklet — Off-Thread Drum Synthesis',
          language: 'javascript',
          code: `class DrumProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.phase = 0
    this.envelope = 0
    this.drumType = 0
    this.port.onmessage = (e) => {
      if (e.data.type === 'trigger') {
        this.envelope = 1.0
        this.phase = 0
        this.drumType = e.data.pad
      }
    }
  }

  process(inputs, outputs) {
    const output = outputs[0][0]
    for (let i = 0; i < output.length; i++) {
      let sample = 0
      if (this.drumType === 0) {
        const freq = 80 * Math.exp(-this.phase * 15)
        sample = Math.sin(2 * Math.PI * freq * this.phase / sampleRate)
      } else if (this.drumType === 1) {
        sample = (Math.random() * 2 - 1) * 0.5
          + Math.sin(2 * Math.PI * 200 * this.phase / sampleRate) * 0.5
      } else {
        sample = (Math.random() * 2 - 1)
      }
      output[i] = sample * this.envelope
      this.envelope *= 0.9994
      this.phase++
    }
    return true
  }
}

registerProcessor('drum-processor', DrumProcessor)`,
          explanation: 'AudioWorkletProcessor는 메인 스레드와 분리된 오디오 스레드에서 실행됩니다. 외부 샘플 파일 없이 수식으로 킥(사인+피치 감쇠), 스네어(노이즈+톤), 하이햇(노이즈)을 합성합니다.',
        },
      ],
      categoryId: musicCategory.id,
      year: 2026,
      role: '풀스택 개발',
      isFeatured: true,
      featuredOrder: 3,
      isPublished: true,
      media: { create: [{ type: 'VIDEO_PLACEHOLDER', placeholderLabel: '데모 영상 준비 중입니다', order: 1, isPlaceholder: true }] },
      links: { create: [{ type: 'GITHUB', label: 'GitHub', url: 'https://github.com/devbinlog/MUSE-Motion-based-User-Sound-Engine-', order: 1 }] },
    },
  })
  await prisma.projectTag.createMany({
    data: [
      { projectId: muse.id, tagId: reactTag.id },
      { projectId: muse.id, tagId: typescriptTag.id },
      { projectId: muse.id, tagId: mediapipeTag.id },
      { projectId: muse.id, tagId: tauriTag.id },
    ],
    skipDuplicates: true,
  })

  // ── 4. Emotion-Aware AI Voice Engine ──────────────────────────────────────
  const emotionVoice = await prisma.project.upsert({
    where: { slug: 'emotion-aware-ai-voice-engine' },
    update: {
      description: `AI 음성 대화 시스템들은 감정을 무시합니다. 사용자가 화가 나거나 슬픈 상태일 때도 AI는 동일한 중립 톤으로 응답합니다. 이 단절이 음성 AI를 차갑고 기계적으로 느끼게 만들며, 지속 사용을 어렵게 합니다.

---

기존 TTS 시스템은 텍스트만 처리하고 음성 신호의 감정 피처(피치, 속도, 에너지)를 분석하지 않습니다. 실시간 처리를 위해서는 STT, 감정 분석, LLM, TTS가 모두 저레이턴시 파이프라인으로 연결되어야 하지만, 각 컴포넌트를 독립적으로 연결하면 7-12초 응답 시간이 발생합니다.`,
      workingApproach: `음성 신호에서 피치(librosa), 에너지(RMS), 속도(speech rate)를 추출해 6가지 감정 벡터로 매핑했습니다. 텍스트 감정 분석(키워드 기반)과 오디오 감정 분석을 가중 합산해 최종 감정을 결정합니다.

---

Microphone Input
    |
    v
[faster-whisper STT]
 ├── Korean / English auto-detect
 └── Streaming transcription
    |
    v
[Emotion Fusion Engine]
 ├── Audio Features: pitch, energy, speed
 ├── Text Features: keyword sentiment
 └── Weighted merge: audio(60%) + text(40%)
    |
    v
[Emotion → Response Mapping]
 neutral / happy / sad / angry / excited / calm
    |
    v
[Ollama LLM / Claude API fallback]
 System prompt: "Respond with {emotion} tone"
    |
    v
[TTS with Emotion Params]
 ├── pitch_shift: emotion.pitch_factor
 ├── speed: emotion.speed_factor
 └── Character routing: 유나(KO) / 사만다(EN)`,
    },
    create: {
      title: 'Emotion-Aware AI Voice Engine',
      slug: 'emotion-aware-ai-voice-engine',
      summary: '목소리의 감정을 실시간으로 인식하고, 감정에 맞는 톤으로 응답하는 AI 음성 대화 엔진.',
      description: `AI 음성 대화 시스템들은 감정을 무시합니다. 사용자가 화가 나거나 슬픈 상태일 때도 AI는 동일한 중립 톤으로 응답합니다. 이 단절이 음성 AI를 차갑고 기계적으로 느끼게 만들며, 지속 사용을 어렵게 합니다.

---

기존 TTS 시스템은 텍스트만 처리하고 음성 신호의 감정 피처(피치, 속도, 에너지)를 분석하지 않습니다. 실시간 처리를 위해서는 STT, 감정 분석, LLM, TTS가 모두 저레이턴시 파이프라인으로 연결되어야 하지만, 각 컴포넌트를 독립적으로 연결하면 7-12초 응답 시간이 발생합니다.`,
      workingApproach: `음성 신호에서 피치(librosa), 에너지(RMS), 속도(speech rate)를 추출해 6가지 감정 벡터로 매핑했습니다. 텍스트 감정 분석(키워드 기반)과 오디오 감정 분석을 가중 합산해 최종 감정을 결정합니다.

---

Microphone Input
    |
    v
[faster-whisper STT]
 ├── Korean / English auto-detect
 └── Streaming transcription
    |
    v
[Emotion Fusion Engine]
 ├── Audio Features: pitch, energy, speed
 ├── Text Features: keyword sentiment
 └── Weighted merge: audio(60%) + text(40%)
    |
    v
[Emotion → Response Mapping]
 neutral / happy / sad / angry / excited / calm
    |
    v
[Ollama LLM / Claude API fallback]
 System prompt: "Respond with {emotion} tone"
    |
    v
[TTS with Emotion Params]
 ├── pitch_shift: emotion.pitch_factor
 ├── speed: emotion.speed_factor
 └── Character routing: 유나(KO) / 사만다(EN)`,
      contribution: `faster-whisper로 한국어/영어 자동 감지 STT를 구현했습니다. numpy/scipy로 외부 ML 라이브러리 없이 오디오 감정 피처를 추출했습니다. FastAPI WebSocket으로 실시간 양방향 스트리밍을 구축했습니다. 로컬 Ollama와 Claude API를 폴백 체인으로 구성해 비용과 응답 속도를 균형 있게 관리했습니다.`,
      keyLearnings: `오디오 + 텍스트 감정 신호를 단순 평균이 아닌 가중 합산으로 처리하면 정확도가 유의미하게 향상됩니다. 로컬 LLM(Ollama)은 응답 속도가 느리지만 API 비용이 없어 개발 단계에서 적합합니다. WebSocket 파이프라인에서 각 단계를 비동기로 분리하면 전체 레이턴시를 절반 이하로 줄일 수 있습니다.`,
      techStack: ['Python', 'FastAPI', 'WebSocket', 'faster-whisper', 'Ollama', 'Claude API', 'Next.js 14', 'Tailwind CSS'],
      categoryId: aiCategory.id,
      year: 2026,
      role: 'AI 백엔드 개발',
      isFeatured: false,
      isPublished: true,
      media: { create: [{ type: 'VIDEO_PLACEHOLDER', placeholderLabel: '데모 영상 준비 중입니다', order: 1, isPlaceholder: true }] },
      links: { create: [{ type: 'GITHUB', label: 'GitHub', url: 'https://github.com/devbinlog/Emotion-Aware-AI-Voice-Engine', order: 1 }] },
    },
  })
  await prisma.projectTag.createMany({
    data: [
      { projectId: emotionVoice.id, tagId: pythonTag.id },
      { projectId: emotionVoice.id, tagId: fastapiTag.id },
      { projectId: emotionVoice.id, tagId: aiTag.id },
    ],
    skipDuplicates: true,
  })

  // ── 5. FMD ────────────────────────────────────────────────────────────────
  const fmd = await prisma.project.upsert({
    where: { slug: 'fmd' },
    update: {
      title: 'FMD',
      summary: '자연어 텍스트 또는 손스케치로 원하는 디자인 에셋을 찾아주는 AI 검색 엔진.',
      description: `디자이너가 레퍼런스를 찾을 때 "미니멀한 타이포 포스터 느낌"처럼 자연어로 원하는 것을 표현하지만, 기존 검색 도구(Pinterest, Behance)는 이 언어를 이해하지 못합니다. 키워드 매칭 기반 검색은 의미를 이해하지 못하고 인기도 순 정렬에 의존합니다.

---

멀티모달 입력(텍스트 + 스케치)을 동시에 처리하는 검색 시스템이 없고, 단일 플랫폼에 종속된 기존 도구는 다양한 스타일의 레퍼런스를 커버하지 못합니다. TF-IDF 단독 검색은 의미 유사도를 측정하지 못하고, 임베딩 단독 검색은 색상/레이아웃 같은 시각 특성을 놓칩니다.`,
      workingApproach: `사용자 입력을 LLM으로 DesignProfile(구조화된 JSON)로 변환하고, 이를 검색과 생성의 공통 인터페이스로 활용합니다. 단일 소스 의존을 피하기 위해 3개 검색 소스를 병렬 조회하고, 5가지 신호를 가중 합산해 최종 랭킹을 생성합니다.

---

User Input
 ├── Text: "minimal typo poster warm tone"
 └── Sketch: HTML5 Canvas (base64 PNG)
          |
          v
    [LLM Structuring Layer]
    Input → DesignProfile (JSON)
    {
      style: "minimal",
      color: "warm monochrome",
      layout: "centered typography",
      tone: "editorial",
      type: "poster"
    }
          |
     ┌────┴────┐
     v         v
[Search]   [Generation]
 ├── Naver    ├── ComfyUI
 ├── Google   ├── Stable Diffusion
 └── Openverse└── HuggingFace (fallback)
 style_variants: minimal / modern / vintage / bold
          |
          v
    [Multi-Signal Ranker]
    score = (
      embedding_sim  × 0.55 +
      color_profile  × 0.20 +
      keyword_match  × 0.20 +
      metadata_score × 0.05
    )
          |
          v
    Ranked Results → Frontend`,
      contribution: `LLM을 텍스트 생성기가 아닌 구조화 엔진으로 사용한 DesignProfile 추상화 레이어를 설계했습니다. TF-IDF 임베딩을 외부 ML 라이브러리 없이 Python stdlib만으로 구현해 배포 의존성을 최소화했습니다. ComfyUI → Stable Diffusion → HuggingFace → Pollinations 7단계 폴백 체인으로 이미지 생성 가용성을 확보했습니다. 한국어 100개 이상의 번역 맵을 내장해 한글 입력을 영어 디자인 용어로 정규화합니다.`,
      keyLearnings: `LLM 출력을 JSON 스키마로 강제 파싱하면 다운스트림 검색/생성 파이프라인의 입력이 일관되어 전체 시스템의 신뢰성이 높아집니다. 멀티 소스 검색 + 폴백 체인 패턴은 단일 API 장애가 사용자 경험을 깨지 않도록 보호합니다. 검색과 생성을 DesignProfile이라는 중간 표현으로 분리하면 두 파이프라인을 독립적으로 발전시킬 수 있습니다.`,
      codeSnippets: [
        {
          title: 'LLM-based DesignProfile Generation',
          language: 'python',
          code: `async def generate_design_profile(user_input: str) -> DesignProfile:
    """
    Converts freeform user text into a structured DesignProfile JSON.
    The LLM acts as a structuring engine, not a text generator.
    """
    prompt = f"""
You are a design analysis assistant.
Extract structured design attributes from the user's description.
Return ONLY valid JSON. No explanation.

User input: "{user_input}"

Required fields:
- style: one of [minimal, bold, editorial, playful, corporate]
- color: color palette description (e.g. "warm monochrome", "neon on dark")
- layout: layout pattern (e.g. "centered typography", "grid", "asymmetric")
- tone: emotional tone (e.g. "clean", "energetic", "serious")
- type: asset type (e.g. "poster", "logo", "web", "illustration")
- keywords: list of 3-5 English search keywords
"""
    response = await claude_client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.content[0].text.strip()
    # Strip markdown code fences if present
    if raw.startswith("\`\`\`"):
        raw = raw.split("\`\`\`")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    data = json.loads(raw)
    return DesignProfile(**data)`,
          explanation: 'LLM에게 텍스트 생성이 아닌 JSON 스키마 채우기를 요청합니다. 출력을 json.loads()로 강제 파싱해 다운스트림 파이프라인의 입력 타입을 보장합니다. claude-3-haiku를 선택한 이유는 구조화 태스크에서 속도 대비 정확도가 가장 높기 때문입니다.',
        },
        {
          title: 'Multi-Signal Ranker — Weighted Scoring',
          language: 'python',
          code: `class MultiSignalRanker:
    """
    Ranks search results using a weighted combination of 4 signals.
    Each signal targets a different dimension of design relevance.
    """
    WEIGHTS = {
        "embedding_sim": 0.55,   # semantic similarity (most important)
        "color_profile": 0.20,   # visual color match
        "keyword_match": 0.20,   # TF-IDF keyword overlap
        "metadata_score": 0.05,  # recency + source quality
    }

    def rank(
        self,
        results: list[SearchResult],
        profile: DesignProfile,
        query_embedding: np.ndarray,
    ) -> list[RankedResult]:
        scored = []
        for result in results:
            emb_score = cosine_similarity(
                query_embedding, result.embedding
            )
            color_score = self._color_distance(
                profile.color, result.dominant_colors
            )
            kw_score = self._tfidf_overlap(
                profile.keywords, result.tags
            )
            meta_score = self._metadata_score(result)

            final = sum(
                score * self.WEIGHTS[key]
                for key, score in {
                    "embedding_sim": emb_score,
                    "color_profile": color_score,
                    "keyword_match": kw_score,
                    "metadata_score": meta_score,
                }.items()
            )
            scored.append(RankedResult(result=result, score=final))

        return sorted(scored, key=lambda x: x.score, reverse=True)

    def _tfidf_overlap(
        self, query_terms: list[str], doc_terms: list[str]
    ) -> float:
        query_set = set(t.lower() for t in query_terms)
        doc_set = set(t.lower() for t in doc_terms)
        if not query_set or not doc_set:
            return 0.0
        intersection = query_set & doc_set
        # TF-IDF weight: terms shared / geometric mean of term counts
        return len(intersection) / (
            len(query_set) ** 0.5 * len(doc_set) ** 0.5
        )`,
          explanation: '4가지 신호(임베딩 유사도, 색상 프로파일, TF-IDF 키워드, 메타데이터)를 가중 합산합니다. embedding_sim(0.55)이 가장 큰 비중을 차지하는 이유는 의미 유사도가 검색 품질을 가장 잘 설명하기 때문입니다. TF-IDF를 외부 라이브러리 없이 구현해 scikit-learn 의존성을 제거했습니다.',
        },
        {
          title: 'FastAPI Search Endpoint',
          language: 'python',
          code: `@router.post("/search", response_model=SearchResponse)
async def search_designs(
    request: SearchRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> SearchResponse:
    """
    Multimodal design search: accepts text and/or sketch (base64 PNG).
    Parallel search across 3 sources, ranked by MultiSignalRanker.
    """
    # 1. Translate Korean input to English design terms
    normalized_query = translate_design_terms(request.query)

    # 2. LLM structuring: freeform text → DesignProfile JSON
    profile = await generate_design_profile(normalized_query)

    # 3. Embed the query once, reuse across all sources
    query_embedding = embedder.encode(
        " ".join(profile.keywords + [profile.style, profile.tone])
    )

    # 4. Fan out to 3 search sources in parallel
    naver_results, google_results, openverse_results = await asyncio.gather(
        search_naver(profile),
        search_google(profile),
        search_openverse(profile),
        return_exceptions=True,
    )

    # 5. Flatten, deduplicate, rank
    all_results = [
        r for batch in [naver_results, google_results, openverse_results]
        if isinstance(batch, list)
        for r in batch
    ]
    ranked = ranker.rank(all_results, profile, query_embedding)

    # 6. Log search for analytics (non-blocking)
    background_tasks.add_task(log_search, request.query, profile, len(ranked))

    return SearchResponse(
        profile=profile,
        results=ranked[:request.limit],
        total=len(ranked),
    )`,
          explanation: 'asyncio.gather()로 3개 소스를 병렬 요청해 순차 조회 대비 응답 시간을 60% 단축했습니다. return_exceptions=True로 일부 소스 장애 시에도 나머지 결과를 반환합니다. background_tasks로 로깅을 메인 응답 경로에서 분리해 레이턴시에 영향을 주지 않습니다.',
        },
      ],
    },
    create: {
      title: 'FMD',
      slug: 'fmd',
      summary: '자연어 텍스트 또는 손스케치로 원하는 디자인 에셋을 찾아주는 AI 검색 엔진.',
      description: `디자이너가 레퍼런스를 찾을 때 "미니멀한 타이포 포스터 느낌"처럼 자연어로 원하는 것을 표현하지만, 기존 검색 도구(Pinterest, Behance)는 이 언어를 이해하지 못합니다. 키워드 매칭 기반 검색은 의미를 이해하지 못하고 인기도 순 정렬에 의존합니다.

---

멀티모달 입력(텍스트 + 스케치)을 동시에 처리하는 검색 시스템이 없고, 단일 플랫폼에 종속된 기존 도구는 다양한 스타일의 레퍼런스를 커버하지 못합니다. TF-IDF 단독 검색은 의미 유사도를 측정하지 못하고, 임베딩 단독 검색은 색상/레이아웃 같은 시각 특성을 놓칩니다.`,
      workingApproach: `사용자 입력을 LLM으로 DesignProfile(구조화된 JSON)로 변환하고, 이를 검색과 생성의 공통 인터페이스로 활용합니다. 단일 소스 의존을 피하기 위해 3개 검색 소스를 병렬 조회하고, 5가지 신호를 가중 합산해 최종 랭킹을 생성합니다.

---

User Input
 ├── Text: "minimal typo poster warm tone"
 └── Sketch: HTML5 Canvas (base64 PNG)
          |
          v
    [LLM Structuring Layer]
    Input → DesignProfile (JSON)
    {
      style: "minimal",
      color: "warm monochrome",
      layout: "centered typography",
      tone: "editorial",
      type: "poster"
    }
          |
     ┌────┴────┐
     v         v
[Search]   [Generation]
 ├── Naver    ├── ComfyUI
 ├── Google   ├── Stable Diffusion
 └── Openverse└── HuggingFace (fallback)
 style_variants: minimal / modern / vintage / bold
          |
          v
    [Multi-Signal Ranker]
    score = (
      embedding_sim  × 0.55 +
      color_profile  × 0.20 +
      keyword_match  × 0.20 +
      metadata_score × 0.05
    )
          |
          v
    Ranked Results → Frontend`,
      contribution: `LLM을 텍스트 생성기가 아닌 구조화 엔진으로 사용한 DesignProfile 추상화 레이어를 설계했습니다. TF-IDF 임베딩을 외부 ML 라이브러리 없이 Python stdlib만으로 구현해 배포 의존성을 최소화했습니다. ComfyUI → Stable Diffusion → HuggingFace → Pollinations 7단계 폴백 체인으로 이미지 생성 가용성을 확보했습니다. 한국어 100개 이상의 번역 맵을 내장해 한글 입력을 영어 디자인 용어로 정규화합니다.`,
      keyLearnings: `LLM 출력을 JSON 스키마로 강제 파싱하면 다운스트림 검색/생성 파이프라인의 입력이 일관되어 전체 시스템의 신뢰성이 높아집니다. 멀티 소스 검색 + 폴백 체인 패턴은 단일 API 장애가 사용자 경험을 깨지 않도록 보호합니다. 검색과 생성을 DesignProfile이라는 중간 표현으로 분리하면 두 파이프라인을 독립적으로 발전시킬 수 있습니다.`,
      techStack: ['Python', 'FastAPI', 'Next.js', 'TypeScript', 'SQLAlchemy', 'Stable Diffusion', 'ComfyUI', 'PostgreSQL'],
      codeSnippets: [
        {
          title: 'LLM-based DesignProfile Generation',
          language: 'python',
          code: `async def generate_design_profile(user_input: str) -> DesignProfile:
    prompt = f"""
You are a design analysis assistant.
Extract structured design attributes from the user description.
Return ONLY valid JSON. No explanation.

User input: "{user_input}"

Required fields:
- style: one of [minimal, bold, editorial, playful, corporate]
- color: color palette description
- layout: layout pattern
- tone: emotional tone
- type: asset type
- keywords: list of 3-5 English search keywords
"""
    response = await claude_client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}],
    )
    raw = response.content[0].text.strip()
    if raw.startswith("\`\`\`"):
        raw = raw.split("\`\`\`")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    data = json.loads(raw)
    return DesignProfile(**data)`,
          explanation: 'LLM에게 JSON 스키마 채우기를 요청합니다. json.loads()로 출력을 강제 파싱해 다운스트림 파이프라인의 입력 타입을 보장합니다.',
        },
        {
          title: 'Multi-Signal Ranker — Weighted Scoring',
          language: 'python',
          code: `class MultiSignalRanker:
    WEIGHTS = {
        "embedding_sim": 0.55,
        "color_profile": 0.20,
        "keyword_match": 0.20,
        "metadata_score": 0.05,
    }

    def rank(
        self,
        results: list[SearchResult],
        profile: DesignProfile,
        query_embedding: np.ndarray,
    ) -> list[RankedResult]:
        scored = []
        for result in results:
            final = sum(
                score * self.WEIGHTS[key]
                for key, score in {
                    "embedding_sim": cosine_similarity(query_embedding, result.embedding),
                    "color_profile": self._color_distance(profile.color, result.dominant_colors),
                    "keyword_match": self._tfidf_overlap(profile.keywords, result.tags),
                    "metadata_score": self._metadata_score(result),
                }.items()
            )
            scored.append(RankedResult(result=result, score=final))
        return sorted(scored, key=lambda x: x.score, reverse=True)

    def _tfidf_overlap(self, query_terms: list[str], doc_terms: list[str]) -> float:
        q, d = set(t.lower() for t in query_terms), set(t.lower() for t in doc_terms)
        if not q or not d: return 0.0
        return len(q & d) / (len(q) ** 0.5 * len(d) ** 0.5)`,
          explanation: '4가지 신호를 가중 합산합니다. embedding_sim(0.55)이 가장 큰 비중을 차지합니다. TF-IDF를 외부 라이브러리 없이 구현해 scikit-learn 의존성을 제거했습니다.',
        },
        {
          title: 'FastAPI Parallel Search Endpoint',
          language: 'python',
          code: `@router.post("/search", response_model=SearchResponse)
async def search_designs(
    request: SearchRequest,
    background_tasks: BackgroundTasks,
) -> SearchResponse:
    normalized = translate_design_terms(request.query)
    profile = await generate_design_profile(normalized)
    query_embedding = embedder.encode(
        " ".join(profile.keywords + [profile.style, profile.tone])
    )

    # Fan out to 3 sources in parallel
    naver_r, google_r, openverse_r = await asyncio.gather(
        search_naver(profile),
        search_google(profile),
        search_openverse(profile),
        return_exceptions=True,
    )

    all_results = [
        r for batch in [naver_r, google_r, openverse_r]
        if isinstance(batch, list)
        for r in batch
    ]
    ranked = ranker.rank(all_results, profile, query_embedding)
    background_tasks.add_task(log_search, request.query, profile, len(ranked))
    return SearchResponse(profile=profile, results=ranked[:request.limit])`,
          explanation: 'asyncio.gather()로 3개 소스를 병렬 요청합니다. return_exceptions=True로 일부 소스 장애 시에도 나머지 결과를 반환합니다.',
        },
      ],
      categoryId: designCategory.id,
      secondaryCategoryId: aiCategory.id,
      year: 2026,
      role: 'AI 백엔드 개발, 풀스택',
      isFeatured: false,
      isPublished: true,
      media: { create: [{ type: 'VIDEO_PLACEHOLDER', placeholderLabel: '데모 영상 준비 중입니다', order: 1, isPlaceholder: true }] },
      links: { create: [{ type: 'GITHUB', label: 'GitHub', url: 'https://github.com/devbinlog/FMD', order: 1 }] },
    },
  })
  await prisma.projectTag.createMany({
    data: [
      { projectId: fmd.id, tagId: pythonTag.id },
      { projectId: fmd.id, tagId: fastapiTag.id },
      { projectId: fmd.id, tagId: aiTag.id },
      { projectId: fmd.id, tagId: nextjsTag.id },
    ],
    skipDuplicates: true,
  })

  // ── 6. DesignFlow AI Builder ──────────────────────────────────────────────
  const designflow = await prisma.project.upsert({
    where: { slug: 'designflow-ai-builder' },
    update: {
      description: `Figma 디자인을 코드로 변환하는 과정에서 개발자는 수작업으로 색상, 간격, 폰트를 일일이 입력합니다. 디자이너의 의도(컴포넌트 구조, 시각 계층)가 코드로 전달되는 과정에서 많은 정보가 손실됩니다.

---

기존 Figma-to-code 도구들은 픽셀 단위 CSS를 생성하고 컴포넌트 의미를 이해하지 못합니다. 색상 토큰 추출, Tailwind 클래스 매핑, 컴포넌트 경계 판정 세 가지 문제를 동시에 해결하는 도구가 없습니다.`,
    },
    create: {
      title: 'DesignFlow AI Builder',
      slug: 'designflow-ai-builder',
      summary: 'Figma 디자인을 분석해 React + Tailwind CSS 코드 초안을 자동 생성하는 AI 협업 도구.',
      description: `Figma 디자인을 코드로 변환하는 과정에서 개발자는 수작업으로 색상, 간격, 폰트를 일일이 입력합니다. 디자이너의 의도(컴포넌트 구조, 시각 계층)가 코드로 전달되는 과정에서 많은 정보가 손실됩니다.

---

기존 Figma-to-code 도구들은 픽셀 단위 CSS를 생성하고 컴포넌트 의미를 이해하지 못합니다. 색상 토큰 추출, Tailwind 클래스 매핑, 컴포넌트 경계 판정 세 가지 문제를 동시에 해결하는 도구가 없습니다.`,
      workingApproach: `Figma JSON 노드 트리를 재귀적으로 순회해 디자인 토큰(색상, 타이포그래피, 간격)을 추출하고 Tailwind 클래스로 매핑합니다. LLM으로 노드 군집을 의미 있는 컴포넌트 단위로 판정합니다.

---

Figma JSON Input
    |
    v
[Node Tree Parser]
 Recursive traversal
 ├── Color extraction → Tailwind mapping
 ├── Typography → font-size, font-weight
 └── Spacing → gap, padding, margin
    |
    v
[AI Component Classifier]
 Ollama (local) / Claude API (fallback)
 Input: node subgraph
 Output: component_type, component_name
    |
    v
[Code Generator]
 React functional component
 Tailwind utility classes
    |
    v
[Result Viewer]
 ├── Token Gallery
 ├── Component Tree
 └── Code Preview`,
      contribution: `Ollama(로컬 LLM)와 Claude API를 폴백 체인으로 구성해 비용 없이 개발하고 품질을 보장했습니다. 사용자 수정 사항을 DB에 저장해 모델 개선 데이터로 활용하는 피드백 루프를 구현했습니다. 설정 객체 기반 UI로 코드 변경 없이 필터/카테고리를 추가할 수 있는 구조를 설계했습니다.`,
      keyLearnings: `Figma 노드를 컴포넌트 경계로 분할하는 규칙을 LLM에 위임하면 사람이 정의한 휴리스틱보다 더 유연하게 작동합니다. 로컬 LLM은 응답이 느리지만 API 비용 없이 무제한 실험이 가능해 초기 개발에 적합합니다.`,
      techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS v4', 'Python', 'FastAPI', 'Ollama', 'Claude API', 'PostgreSQL'],
      categoryId: designCategory.id,
      secondaryCategoryId: aiCategory.id,
      year: 2026,
      role: 'AI 백엔드 개발, 풀스택',
      isFeatured: false,
      isPublished: true,
      media: { create: [{ type: 'VIDEO_PLACEHOLDER', placeholderLabel: '데모 영상 준비 중입니다', order: 1, isPlaceholder: true }] },
      links: { create: [{ type: 'GITHUB', label: 'GitHub', url: 'https://github.com/devbinlog/DesignFlow_AI_Builder', order: 1 }] },
    },
  })
  await prisma.projectTag.createMany({
    data: [
      { projectId: designflow.id, tagId: pythonTag.id },
      { projectId: designflow.id, tagId: fastapiTag.id },
      { projectId: designflow.id, tagId: nextjsTag.id },
      { projectId: designflow.id, tagId: aiTag.id },
    ],
    skipDuplicates: true,
  })

  // 관리자 계정
  const adminPasswordHash = await bcrypt.hash('admin1234!', 12)
  await prisma.adminUser.upsert({
    where: { email: 'admin@taebinkim.com' },
    update: {},
    create: {
      email: 'admin@taebinkim.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('Seed complete.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
