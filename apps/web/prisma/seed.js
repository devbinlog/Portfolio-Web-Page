"use strict";
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── 카테고리 ──────────────────────────────────────────────────────────────
  const musicCategory = await prisma.category.upsert({
    where: { slug: "music_projects" },
    update: {},
    create: { name: "Music Projects", slug: "music_projects", objectFamily: "signal_orb", order: 1 },
  });
  const aiCategory = await prisma.category.upsert({
    where: { slug: "ai_projects" },
    update: {},
    create: { name: "AI Projects", slug: "ai_projects", objectFamily: "data_crystal", order: 2 },
  });
  const designCategory = await prisma.category.upsert({
    where: { slug: "design_projects" },
    update: {},
    create: { name: "Design Projects", slug: "design_projects", objectFamily: "layered_device", order: 3 },
  });

  // ── 태그 ──────────────────────────────────────────────────────────────────
  const tagDefs = [
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextjs" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Python", slug: "python" },
    { name: "FastAPI", slug: "fastapi" },
    { name: "AI", slug: "ai" },
    { name: "Three.js", slug: "threejs" },
    { name: "Tauri", slug: "tauri" },
    { name: "MediaPipe", slug: "mediapipe" },
    { name: "Prisma", slug: "prisma" },
    { name: "Rust", slug: "rust" },
    { name: "WebSocket", slug: "websocket" },
    { name: "Supabase", slug: "supabase" },
    { name: "Tailwind CSS", slug: "tailwindcss" },
    { name: "Vite", slug: "vite" },
    { name: "LangGraph", slug: "langgraph" },
    { name: "Vercel AI SDK", slug: "vercel-ai-sdk" },
    { name: "PostgreSQL", slug: "postgresql" },
    { name: "Zustand", slug: "zustand" },
  ];
  const tags = [];
  for (const t of tagDefs) {
    const tag = await prisma.tag.upsert({ where: { slug: t.slug }, update: {}, create: t });
    tags.push(tag);
  }
  const tagMap = Object.fromEntries(tags.map((t) => [t.slug, t]));

  // ── 프로필 ────────────────────────────────────────────────────────────────
  await prisma.profile.upsert({
    where: { id: "default" },
    update: {
      name: "binlog",
      roleTitle: "AX Engineer & Frontend Developer",
      tagline: "Developing imagination.",
      bio: `AI를 단순히 기능으로 추가하는 것이 아니라, 사용자의 문제를 해결하고 서비스의 흐름을 개선하는 도구로 활용합니다.

서비스를 개별 기능의 집합이 아닌 하나의 경험으로 바라봅니다. 사용자의 입력부터 처리 과정, 결과와 피드백까지 자연스럽게 이어지는 흐름을 먼저 설계한 뒤 구현합니다.

프로젝트마다 해결해야 하는 문제를 분석하고, 필요한 데이터 구조와 시스템 흐름을 정의합니다. 프론트엔드와 AI, 백엔드가 하나의 서비스 안에서 유기적으로 연결될 수 있도록 설계합니다.

새로운 기술을 적용하는 것보다 실제 사용자에게 어떤 경험과 가치를 제공할 수 있는지를 우선으로 생각하며, 효율성과 완성도를 함께 고려한 개발 방식을 지향합니다.

이러한 접근을 바탕으로 AI 기술을 실제 서비스에 자연스럽게 녹여내고, 아이디어를 사용자가 직접 경험할 수 있도록 구현하는 것을 목표로 합니다.`,
      workingMethod: `문제를 기능 단위가 아닌 구조적으로 분해합니다.
구현 전에 문서와 아키텍처를 정의합니다.
데이터 구조와 사용자 경험을 함께 설계합니다.
배포, 유지보수, 운영을 처음부터 고려합니다.`,
      location: "Seoul, Korea",
    },
    create: {
      id: "default",
      name: "binlog",
      roleTitle: "AX Engineer & Frontend Developer",
      tagline: "Developing imagination.",
      bio: `AI를 단순히 기능으로 추가하는 것이 아니라, 사용자의 문제를 해결하고 서비스의 흐름을 개선하는 도구로 활용합니다.

서비스를 개별 기능의 집합이 아닌 하나의 경험으로 바라봅니다. 사용자의 입력부터 처리 과정, 결과와 피드백까지 자연스럽게 이어지는 흐름을 먼저 설계한 뒤 구현합니다.

프로젝트마다 해결해야 하는 문제를 분석하고, 필요한 데이터 구조와 시스템 흐름을 정의합니다. 프론트엔드와 AI, 백엔드가 하나의 서비스 안에서 유기적으로 연결될 수 있도록 설계합니다.

새로운 기술을 적용하는 것보다 실제 사용자에게 어떤 경험과 가치를 제공할 수 있는지를 우선으로 생각하며, 효율성과 완성도를 함께 고려한 개발 방식을 지향합니다.

이러한 접근을 바탕으로 AI 기술을 실제 서비스에 자연스럽게 녹여내고, 아이디어를 사용자가 직접 경험할 수 있도록 구현하는 것을 목표로 합니다.`,
      workingMethod: `문제를 기능 단위가 아닌 구조적으로 분해합니다.
구현 전에 문서와 아키텍처를 정의합니다.
데이터 구조와 사용자 경험을 함께 설계합니다.
배포, 유지보수, 운영을 처음부터 고려합니다.`,
      location: "Seoul, Korea",
      socialLinks: {
        create: [{ platform: "GitHub", url: "https://github.com/devbinlog", order: 1 }],
      },
    },
  });

  // ── 관리자 계정 ───────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("Rlaxoqls38@", 10);
  await prisma.adminUser.upsert({
    where: { email: "devbinlog8@gmail.com" },
    update: {},
    create: {
      email: "devbinlog8@gmail.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  // ── 1. BandStage ──────────────────────────────────────────────────────────
  const bandstage = await prisma.project.upsert({
    where: { slug: "bandstage" },
    update: {
      title: "BandStage",
      summary: `분산된 공연, 아티스트, 예매 정보를 구조화해 하나의 흐름으로 연결한 라이브 음악 플랫폼.
데이터 모델과 탐색 경험을 함께 설계해 공연을 찾는 과정을 시스템으로 정의했습니다.`,
      description: `공연 정보가 SNS, 포스터, 예매 플랫폼에 분산되어 있어 사용자가 원하는 공연을 한 번에 탐색할 수 없는 문제가 있습니다.
아티스트, 공연장, 팬이 각각 다른 채널에서 움직이며 공연 정보가 하나의 흐름으로 연결되지 않습니다.

---

기존 공연 정보는 SNS, 포스터, 예매 플랫폼에 분산되어 있으며, 데이터가 구조화되지 않아 검색, 필터링, 예매까지 하나의 흐름으로 연결되지 않습니다.

사용자는 원하는 공연을 탐색하기 위해 여러 채널을 반복적으로 확인해야 하고, 아티스트 역시 공연 등록과 관리, 홍보를 통합적으로 수행할 수 없는 구조입니다.`,
      year: 2025,
      role: "풀스택 개발",
      contribution: `서버 컴포넌트 우선 아키텍처로 클라이언트 번들을 최소화했습니다. 동적 라우팅(/events/[slug])에서 정적 생성과 ISR을 조합해 성능과 데이터 신선도를 동시에 확보했습니다. NextAuth.js v4로 FAN/ARTIST/VENUE_MANAGER/ADMIN 4역할 인증 시스템을 구현하고, 미들웨어 레벨에서 역할별 라우트를 보호했습니다. 실제 서울 공연장 25개 데이터를 구조화해 Supabase PostgreSQL에 시드했습니다.`,
      keyLearnings: `권한 검사를 UI가 아닌 서버와 데이터 레이어에서 처리하도록 설계하면서, 역할에 따른 접근 제어를 일관된 기준으로 통제할 수 있는 구조를 만들었습니다.

상태 머신 도입 이후 잘못된 상태 전환이 차단되었고, 데이터 흐름이 명확해지면서 예외 상황과 디버깅 포인트가 크게 줄어들었습니다.

데이터 구조를 먼저 정의하고 그 위에 기능을 쌓는 방식이, UI 설계와 사용자 탐색 흐름까지 자연스럽게 결정된다는 것을 확인했습니다.`,
      workingApproach: `분산된 공연 정보를 하나의 흐름으로 연결하기 위해, 공연 생태계를 "Region → Venue → Event → Reservation" 4계층 데이터 모델로 구조화했습니다.

사용자는 지역, 공연장, 공연 단위를 기준으로 탐색할 수 있고, 예매까지 하나의 흐름 안에서 이어지도록 설계했습니다.

또한 아티스트가 공연을 직접 등록하고 관리할 수 있도록 공연 등록 워크플로우를 구성하고, 이를 상태 머신(DRAFT → PENDING → APPROVED → PUBLISHED)으로 정의해 권한별 전환을 코드 레벨에서 통제했습니다.

사용자 역할(Fan, Artist, Venue Manager)에 따라 서로 다른 진입 경로를 가지지만, 탐색, 등록, 관리 기능이 모두 동일한 데이터 구조 위에서 동작하도록 설계해 시스템 전체 흐름을 일관되게 유지했습니다.

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
      techStack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS v4", "Prisma", "Supabase", "NextAuth.js", "Vercel"],
      codeSnippets: [
        {
          title: "createEvent — RBAC + Zod",
          language: "typescript",
          code: `export async function createEvent(input: EventInput) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "로그인이 필요합니다." }
  if (session.user.role !== "ARTIST" && session.user.role !== "ADMIN")
    return { success: false, error: "공연 등록 권한이 없습니다." }

  const parsed = eventSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const slug = await generateUniqueSlug(parsed.data.title, async (s) => {
    const exists = await db.event.findUnique({ where: { slug: s } })
    return !!exists
  })

  const event = await db.event.create({
    data: {
      ...parsed.data,
      slug,
      status: "PENDING",
      ownerId: session.user.id,
    },
    include: { ticketTypes: true },
  })

  revalidatePath("/events")
  return { success: true, slug: event.slug, eventId: event.id }
}`,
          explanation: "Next.js Server Action: Zod 검증과 역할 기반 접근 제어(ARTIST/ADMIN)를 서버 레이어에서 처리하고, 중복 없는 slug를 생성한 뒤 Prisma로 공연 데이터를 생성합니다.",
        },
        {
          title: "createReservation — DB Transaction",
          language: "typescript",
          code: `export async function createReservation(ticketTypeId: string, quantity: number) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "로그인이 필요합니다." }

  const ticketType = await db.ticketType.findUnique({
    where: { id: ticketTypeId },
    include: { event: { select: { id: true, slug: true, status: true } } },
  })

  if (ticketType?.event.status !== "PUBLISHED")
    return { success: false, error: "예매가 불가능한 공연입니다." }
  if (ticketType.remaining < quantity)
    return { success: false, error: "잔여 수량이 부족합니다." }

  const ticket = await db.$transaction(async (tx) => {
    const created = await tx.ticket.create({
      data: {
        ticketTypeId,
        eventId: ticketType.eventId,
        userId: session.user!.id,
        quantity,
        totalAmount: Number(ticketType.price) * quantity,
        status: "PENDING",
      },
    })
    await tx.ticketType.update({
      where: { id: ticketTypeId },
      data: { remaining: { decrement: quantity } },
    })
    return created
  })

  revalidatePath("/events/" + ticketType.event.slug)
  return { success: true, ticketId: ticket.id }
}`,
          explanation: "Prisma $transaction으로 티켓 생성과 잔여 수량 감소를 원자적으로 처리합니다. 상태 검증, 재고 확인, 사용자 구매 한도를 순서대로 통과해야 예매가 완료됩니다.",
        },
      ],
            thumbnailUrl: "/images/projects/bandstage-hero.png",
      heroImageUrl: "/images/projects/bandstage-hero.png",
      isFeatured: true,
      featuredOrder: 3,
      isPublished: true,
      categoryId: musicCategory.id,
    },
    create: {
      title: "BandStage",
      slug: "bandstage",
      summary: `분산된 공연, 아티스트, 예매 정보를 구조화해 하나의 흐름으로 연결한 라이브 음악 플랫폼.
데이터 모델과 탐색 경험을 함께 설계해 공연을 찾는 과정을 시스템으로 정의했습니다.`,
      description: `공연 정보가 SNS, 포스터, 예매 플랫폼에 분산되어 있어 사용자가 원하는 공연을 한 번에 탐색할 수 없는 문제가 있습니다.
아티스트, 공연장, 팬이 각각 다른 채널에서 움직이며 공연 정보가 하나의 흐름으로 연결되지 않습니다.

---

기존 공연 정보는 SNS, 포스터, 예매 플랫폼에 분산되어 있으며, 데이터가 구조화되지 않아 검색, 필터링, 예매까지 하나의 흐름으로 연결되지 않습니다.

사용자는 원하는 공연을 탐색하기 위해 여러 채널을 반복적으로 확인해야 하고, 아티스트 역시 공연 등록과 관리, 홍보를 통합적으로 수행할 수 없는 구조입니다.`,
      year: 2025,
      role: "풀스택 개발",
      contribution: `서버 컴포넌트 우선 아키텍처로 클라이언트 번들을 최소화했습니다. 동적 라우팅(/events/[slug])에서 정적 생성과 ISR을 조합해 성능과 데이터 신선도를 동시에 확보했습니다. NextAuth.js v4로 FAN/ARTIST/VENUE_MANAGER/ADMIN 4역할 인증 시스템을 구현하고, 미들웨어 레벨에서 역할별 라우트를 보호했습니다. 실제 서울 공연장 25개 데이터를 구조화해 Supabase PostgreSQL에 시드했습니다.`,
      keyLearnings: `권한 검사를 UI가 아닌 서버와 데이터 레이어에서 처리하도록 설계하면서, 역할에 따른 접근 제어를 일관된 기준으로 통제할 수 있는 구조를 만들었습니다.

상태 머신 도입 이후 잘못된 상태 전환이 차단되었고, 데이터 흐름이 명확해지면서 예외 상황과 디버깅 포인트가 크게 줄어들었습니다.

데이터 구조를 먼저 정의하고 그 위에 기능을 쌓는 방식이, UI 설계와 사용자 탐색 흐름까지 자연스럽게 결정된다는 것을 확인했습니다.`,
      workingApproach: `분산된 공연 정보를 하나의 흐름으로 연결하기 위해, 공연 생태계를 "Region → Venue → Event → Reservation" 4계층 데이터 모델로 구조화했습니다.

사용자는 지역, 공연장, 공연 단위를 기준으로 탐색할 수 있고, 예매까지 하나의 흐름 안에서 이어지도록 설계했습니다.

또한 아티스트가 공연을 직접 등록하고 관리할 수 있도록 공연 등록 워크플로우를 구성하고, 이를 상태 머신(DRAFT → PENDING → APPROVED → PUBLISHED)으로 정의해 권한별 전환을 코드 레벨에서 통제했습니다.

사용자 역할(Fan, Artist, Venue Manager)에 따라 서로 다른 진입 경로를 가지지만, 탐색, 등록, 관리 기능이 모두 동일한 데이터 구조 위에서 동작하도록 설계해 시스템 전체 흐름을 일관되게 유지했습니다.

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
      techStack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS v4", "Prisma", "Supabase", "NextAuth.js", "Vercel"],
      codeSnippets: [
        {
          title: "createEvent — RBAC + Zod",
          language: "typescript",
          code: `export async function createEvent(input: EventInput) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "로그인이 필요합니다." }
  if (session.user.role !== "ARTIST" && session.user.role !== "ADMIN")
    return { success: false, error: "공연 등록 권한이 없습니다." }

  const parsed = eventSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message }

  const slug = await generateUniqueSlug(parsed.data.title, async (s) => {
    const exists = await db.event.findUnique({ where: { slug: s } })
    return !!exists
  })

  const event = await db.event.create({
    data: {
      ...parsed.data,
      slug,
      status: "PENDING",
      ownerId: session.user.id,
    },
    include: { ticketTypes: true },
  })

  revalidatePath("/events")
  return { success: true, slug: event.slug, eventId: event.id }
}`,
          explanation: "Next.js Server Action: Zod 검증과 역할 기반 접근 제어(ARTIST/ADMIN)를 서버 레이어에서 처리하고, 중복 없는 slug를 생성한 뒤 Prisma로 공연 데이터를 생성합니다.",
        },
        {
          title: "createReservation — DB Transaction",
          language: "typescript",
          code: `export async function createReservation(ticketTypeId: string, quantity: number) {
  const session = await auth()
  if (!session?.user) return { success: false, error: "로그인이 필요합니다." }

  const ticketType = await db.ticketType.findUnique({
    where: { id: ticketTypeId },
    include: { event: { select: { id: true, slug: true, status: true } } },
  })

  if (ticketType?.event.status !== "PUBLISHED")
    return { success: false, error: "예매가 불가능한 공연입니다." }
  if (ticketType.remaining < quantity)
    return { success: false, error: "잔여 수량이 부족합니다." }

  const ticket = await db.$transaction(async (tx) => {
    const created = await tx.ticket.create({
      data: {
        ticketTypeId,
        eventId: ticketType.eventId,
        userId: session.user!.id,
        quantity,
        totalAmount: Number(ticketType.price) * quantity,
        status: "PENDING",
      },
    })
    await tx.ticketType.update({
      where: { id: ticketTypeId },
      data: { remaining: { decrement: quantity } },
    })
    return created
  })

  revalidatePath("/events/" + ticketType.event.slug)
  return { success: true, ticketId: ticket.id }
}`,
          explanation: "Prisma $transaction으로 티켓 생성과 잔여 수량 감소를 원자적으로 처리합니다. 상태 검증, 재고 확인, 사용자 구매 한도를 순서대로 통과해야 예매가 완료됩니다.",
        },
      ],
            thumbnailUrl: "/images/projects/bandstage-hero.png",
      heroImageUrl: "/images/projects/bandstage-hero.png",
      isFeatured: true,
      featuredOrder: 3,
      isPublished: true,
      categoryId: musicCategory.id,
    },
  });

  // 링크 upsert는 deleteMany + createMany 패턴 사용
  await prisma.projectLink.deleteMany({ where: { projectId: bandstage.id } });
  await prisma.projectLink.create({
    data: { projectId: bandstage.id, type: "GITHUB", label: "GitHub", url: "https://github.com/devbinlog/BandStage", order: 1 },
  });

  // ── 2. Page of Artist ─────────────────────────────────────────────────────
  const pageOfArtist = await prisma.project.upsert({
    where: { slug: "page-of-artist" },
    update: {
      title: "Page of Artist",
      summary: `텍스트 중심 탐색의 한계를 해결하기 위해, 아티스트와 음악 데이터를 3D 인터페이스로 재구성한 뮤직 플랫폼.
데이터 구조와 인터랙션을 결합해 사용자가 콘텐츠를 탐색하는 과정을 하나의 경험 흐름으로 설계했습니다.`,
      description: `캡스톤 프로젝트로 진행된 6인의 팀 프로젝트로, 기존 음악 플랫폼의 탐색 경험을 개선하기 위해 시작했습니다.

기존 음악 플랫폼의 아티스트 페이지는 앨범, 트랙, 프로필 정보를 2D 리스트 형태로 나열하는 구조가 대부분입니다.
이 방식은 정보를 빠르게 확인하기에는 적합하지만, 사용자가 아티스트의 음악 세계관이나 앨범 간 분위기 차이를 시각적으로 탐색하기에는 한계가 있었습니다.

특히 신인 아티스트나 개성 있는 음악 콘텐츠는 단순 목록 안에서 차별점이 드러나기 어렵고, 사용자는 콘텐츠를 "탐색"하기보다 이미 알고 있는 곡을 "재생"하는 흐름에 머물게 됩니다.

그래서 Page of Artist는 아티스트와 음악 데이터를 단순히 나열하는 것이 아니라, 사용자가 직접 움직이고 선택하며 탐색할 수 있는 3D 공간 기반 음악 경험으로 재구성하는 것을 목표로 했습니다.

---

기존 3D 웹 기반 음악 콘텐츠는 시각적으로는 인상적이지만, 실제 음악 데이터 구조와 연결되지 않는 경우가 많았습니다.
즉, 3D 오브젝트는 장식적인 요소에 머물고, 아티스트 정보나 앨범, 트랙 데이터와 유기적으로 연결되지 않아 서비스 구조로 확장하기 어려웠습니다.

또한 3D 인터페이스는 사용자가 조작할 때 어색한 움직임이 발생하기 쉽습니다.
단순 위치 이동이나 회전만 적용하면 카드가 기계적으로 움직이고, 사용자가 "탐색하고 있다"는 감각보다 "효과를 보고 있다"는 느낌에 가까워집니다.

모바일 환경과 성능도 중요한 한계였습니다.
React 상태 변화만으로 3D 카드의 위치, 회전, 포커싱을 처리하면 불필요한 리렌더링이 발생할 수 있고, 카드 개수가 늘어날수록 인터랙션이 끊기거나 프레임 저하가 생길 가능성이 있었습니다.`,
      year: 2025,
      role: "프론트엔드 개발, 3D 인터랙션",
      contribution: `카드 인터랙션은 마우스 위치 기반 3D 틸팅과 Spring 물리 연산을 결합해, 사용자의 입력에 따라 자연스럽게 반응하는 인터랙션 구조를 구현했습니다.

렌더링 사이클과 분리된 ref 기반 물리 계산을 적용해, React 리렌더 없이도 60fps 환경에서 안정적인 애니메이션을 유지했습니다.

외부 음악 데이터를 API 기반으로 연동하고, 응답 지연이나 실패 상황에서도 UI 흐름이 유지되도록 데이터 처리 구조를 설계했습니다.

Firebase Firestore 실시간 구독을 통해 아티스트 데이터 변경이 즉시 반영되도록 구성해, 데이터와 UI 상태가 실시간으로 동기화되는 구조를 구현했습니다.

장르 필터 선택 시 카드 재배치 애니메이션을 물리 기반으로 처리해, 데이터 변화가 자연스러운 시각적 흐름으로 이어지도록 설계했습니다.`,
      keyLearnings: `캡스톤 프로젝트를 통해 인터랙션 중심 UI 설계와 팀 기반 개발 경험을 쌓을 수 있었고, 최종 A+ 학점과 함께 "기획과 기술적 도전성이 뛰어나며 협업 기반 문제 해결 능력이 우수하다"는 평가를 받았습니다.

이후 리빌딩 과정에서 렌더링과 물리 연산을 분리한 구조를 적용해, 60fps 환경에서도 안정적인 인터랙션을 구현했습니다.

외부 API의 불안정성을 고려해 정적 데이터 폴백 구조를 적용함으로써, 서비스 환경에서도 사용자 경험이 끊기지 않도록 개선했습니다.

이 과정을 통해 인터랙션과 데이터 구조를 함께 설계하는 것이 사용자 경험의 완성도를 결정한다는 것을 확인했습니다.`,
      workingApproach: `Page of Artist는 아티스트와 음악 데이터를 3D 카드 인터페이스로 재구성하고, 사용자의 조작이 곧 탐색 흐름이 되도록 설계했습니다.
각 카드는 단순한 이미지 요소가 아니라 아티스트, 앨범, 트랙 정보를 담는 데이터 단위로 정의했습니다.

3D 구현에는 React Three Fiber를 사용했습니다.
React 기반 컴포넌트 구조 안에서 Three.js의 3D 객체를 다룰 수 있어, 카드 UI와 데이터 구조를 함께 관리하기에 적합했기 때문입니다.
이를 통해 아티스트 카드, 앨범 정보, 트랙 리스트를 각각 독립적인 컴포넌트로 분리하면서도 하나의 3D 탐색 흐름 안에 배치할 수 있었습니다.

카드의 이동과 포커싱은 단순 애니메이션이 아니라 Spring 기반 물리 연산으로 처리했습니다.
사용자가 드래그하거나 스크롤할 때 카드가 즉시 끊겨 움직이는 것이 아니라, 감쇠와 관성을 가진 움직임으로 반응하도록 설계해 자연스러운 조작감을 만들고자 했습니다.

또한 카드의 상태를 active, adjacent, background로 나누어 현재 선택된 카드와 주변 카드의 크기, 위치, 시각적 강조를 다르게 처리했습니다.
이를 통해 사용자가 어떤 콘텐츠에 집중하고 있는지 명확하게 인식할 수 있도록 했습니다.

성능 측면에서는 React의 일반적인 상태 업데이트에 모든 움직임을 맡기지 않고, useFrame과 ref 기반 계산을 활용해 렌더링 사이클과 물리 연산을 분리했습니다.
이 구조를 통해 카드의 위치, 회전, 스케일 변화가 반복적으로 발생해도 불필요한 리렌더링을 줄이고 안정적인 인터랙션을 유지하도록 설계했습니다.

---

User Input (Mouse / Keyboard / Touch / Gyroscope)
                      |
                      v
       DOM Event Handlers (CircularCarousel)
                      |
          springTarget ref <- drag / scroll
                      |
       useFrame Physics Loop (60fps, no re-render)
    force = dx x TENSION - vel x FRICTION
                      |
   Card Group Positions (imperative update)
                      |
          Three.js Renderer -> Canvas

  Spotify API -> Express Proxy (Token Cache)
                      |
          Artist Data + Track Info
                      |
  Firebase Firestore (realtime) -> Zustand Store
                      |
            Card Data -> 3D Scene`,
      techStack: ["React 18", "TypeScript", "Three.js", "React Three Fiber", "Zustand", "Firebase", "Spotify API", "Vite"],
      codeSnippets: [
        {
          title: "CircularCarousel — Spring Physics Loop",
          language: "typescript",
          code: `const SPRING_TENSION = 170
const SPRING_FRICTION = 26
const RADIUS = 3.8

const springPos = useRef(0)
const springVel = useRef(0)
const springTarget = useRef(0)

useFrame((_, dt) => {
  if (N === 0) return
  const safe = Math.min(dt, 0.033)

  // Damped spring: force = tension * displacement - friction * velocity
  const dx = springTarget.current - springPos.current
  const force = dx * SPRING_TENSION - springVel.current * SPRING_FRICTION
  springVel.current += force * safe
  springPos.current += springVel.current * safe

  // Imperatively update each card's 3D position (no React re-render)
  for (let i = 0; i < N; i++) {
    const group = cardGroupRefs.current[i]
    if (!group) continue
    const angle = i * angleStep + springPos.current
    group.position.set(RADIUS * Math.sin(angle), 0, RADIUS * Math.cos(angle))
    group.rotation.y = -angle
  }

  const computed = wrap(Math.round(-springPos.current / angleStep), N)
  if (computed !== activeIndex) setActiveIndex(computed)
})

const onPointerUp = () => {
  if (isDragging.current) {
    // Snap to nearest card after drag release
    const nearest = -Math.round(springPos.current / angleStep) * angleStep
    springTarget.current = nearest
  }
  isDragging.current = false
}`,
          explanation: "useFrame 안에서 감쇠 스프링(tension=170, friction=26)을 직접 계산하고, ref로 각 Three.js 카드 그룹을 명령형으로 업데이트합니다. React 리렌더 없이 60fps 인터랙션을 유지하는 핵심 구조입니다.",
        },
      ],
            thumbnailUrl: "/images/projects/page-of-artist-hero.png",
      heroImageUrl: "/images/projects/page-of-artist-hero.png",
      isFeatured: true,
      featuredOrder: 2,
      isPublished: true,
      categoryId: musicCategory.id,
    },
    create: {
      title: "Page of Artist",
      slug: "page-of-artist",
      summary: `텍스트 중심 탐색의 한계를 해결하기 위해, 아티스트와 음악 데이터를 3D 인터페이스로 재구성한 뮤직 플랫폼.
데이터 구조와 인터랙션을 결합해 사용자가 콘텐츠를 탐색하는 과정을 하나의 경험 흐름으로 설계했습니다.`,
      description: `캡스톤 프로젝트로 진행된 6인의 팀 프로젝트로, 기존 음악 플랫폼의 탐색 경험을 개선하기 위해 시작했습니다.

기존 음악 플랫폼의 아티스트 페이지는 앨범, 트랙, 프로필 정보를 2D 리스트 형태로 나열하는 구조가 대부분입니다.
이 방식은 정보를 빠르게 확인하기에는 적합하지만, 사용자가 아티스트의 음악 세계관이나 앨범 간 분위기 차이를 시각적으로 탐색하기에는 한계가 있었습니다.

특히 신인 아티스트나 개성 있는 음악 콘텐츠는 단순 목록 안에서 차별점이 드러나기 어렵고, 사용자는 콘텐츠를 "탐색"하기보다 이미 알고 있는 곡을 "재생"하는 흐름에 머물게 됩니다.

그래서 Page of Artist는 아티스트와 음악 데이터를 단순히 나열하는 것이 아니라, 사용자가 직접 움직이고 선택하며 탐색할 수 있는 3D 공간 기반 음악 경험으로 재구성하는 것을 목표로 했습니다.

---

기존 3D 웹 기반 음악 콘텐츠는 시각적으로는 인상적이지만, 실제 음악 데이터 구조와 연결되지 않는 경우가 많았습니다.
즉, 3D 오브젝트는 장식적인 요소에 머물고, 아티스트 정보나 앨범, 트랙 데이터와 유기적으로 연결되지 않아 서비스 구조로 확장하기 어려웠습니다.

또한 3D 인터페이스는 사용자가 조작할 때 어색한 움직임이 발생하기 쉽습니다.
단순 위치 이동이나 회전만 적용하면 카드가 기계적으로 움직이고, 사용자가 "탐색하고 있다"는 감각보다 "효과를 보고 있다"는 느낌에 가까워집니다.

모바일 환경과 성능도 중요한 한계였습니다.
React 상태 변화만으로 3D 카드의 위치, 회전, 포커싱을 처리하면 불필요한 리렌더링이 발생할 수 있고, 카드 개수가 늘어날수록 인터랙션이 끊기거나 프레임 저하가 생길 가능성이 있었습니다.`,
      year: 2025,
      role: "프론트엔드 개발, 3D 인터랙션",
      contribution: `카드 인터랙션은 마우스 위치 기반 3D 틸팅과 Spring 물리 연산을 결합해, 사용자의 입력에 따라 자연스럽게 반응하는 인터랙션 구조를 구현했습니다.

렌더링 사이클과 분리된 ref 기반 물리 계산을 적용해, React 리렌더 없이도 60fps 환경에서 안정적인 애니메이션을 유지했습니다.

외부 음악 데이터를 API 기반으로 연동하고, 응답 지연이나 실패 상황에서도 UI 흐름이 유지되도록 데이터 처리 구조를 설계했습니다.

Firebase Firestore 실시간 구독을 통해 아티스트 데이터 변경이 즉시 반영되도록 구성해, 데이터와 UI 상태가 실시간으로 동기화되는 구조를 구현했습니다.

장르 필터 선택 시 카드 재배치 애니메이션을 물리 기반으로 처리해, 데이터 변화가 자연스러운 시각적 흐름으로 이어지도록 설계했습니다.`,
      keyLearnings: `캡스톤 프로젝트를 통해 인터랙션 중심 UI 설계와 팀 기반 개발 경험을 쌓을 수 있었고, 최종 A+ 학점과 함께 "기획과 기술적 도전성이 뛰어나며 협업 기반 문제 해결 능력이 우수하다"는 평가를 받았습니다.

이후 리빌딩 과정에서 렌더링과 물리 연산을 분리한 구조를 적용해, 60fps 환경에서도 안정적인 인터랙션을 구현했습니다.

외부 API의 불안정성을 고려해 정적 데이터 폴백 구조를 적용함으로써, 서비스 환경에서도 사용자 경험이 끊기지 않도록 개선했습니다.

이 과정을 통해 인터랙션과 데이터 구조를 함께 설계하는 것이 사용자 경험의 완성도를 결정한다는 것을 확인했습니다.`,
      workingApproach: `Page of Artist는 아티스트와 음악 데이터를 3D 카드 인터페이스로 재구성하고, 사용자의 조작이 곧 탐색 흐름이 되도록 설계했습니다.
각 카드는 단순한 이미지 요소가 아니라 아티스트, 앨범, 트랙 정보를 담는 데이터 단위로 정의했습니다.

3D 구현에는 React Three Fiber를 사용했습니다.
React 기반 컴포넌트 구조 안에서 Three.js의 3D 객체를 다룰 수 있어, 카드 UI와 데이터 구조를 함께 관리하기에 적합했기 때문입니다.
이를 통해 아티스트 카드, 앨범 정보, 트랙 리스트를 각각 독립적인 컴포넌트로 분리하면서도 하나의 3D 탐색 흐름 안에 배치할 수 있었습니다.

카드의 이동과 포커싱은 단순 애니메이션이 아니라 Spring 기반 물리 연산으로 처리했습니다.
사용자가 드래그하거나 스크롤할 때 카드가 즉시 끊겨 움직이는 것이 아니라, 감쇠와 관성을 가진 움직임으로 반응하도록 설계해 자연스러운 조작감을 만들고자 했습니다.

또한 카드의 상태를 active, adjacent, background로 나누어 현재 선택된 카드와 주변 카드의 크기, 위치, 시각적 강조를 다르게 처리했습니다.
이를 통해 사용자가 어떤 콘텐츠에 집중하고 있는지 명확하게 인식할 수 있도록 했습니다.

성능 측면에서는 React의 일반적인 상태 업데이트에 모든 움직임을 맡기지 않고, useFrame과 ref 기반 계산을 활용해 렌더링 사이클과 물리 연산을 분리했습니다.
이 구조를 통해 카드의 위치, 회전, 스케일 변화가 반복적으로 발생해도 불필요한 리렌더링을 줄이고 안정적인 인터랙션을 유지하도록 설계했습니다.

---

User Input (Mouse / Keyboard / Touch / Gyroscope)
                      |
                      v
       DOM Event Handlers (CircularCarousel)
                      |
          springTarget ref <- drag / scroll
                      |
       useFrame Physics Loop (60fps, no re-render)
    force = dx x TENSION - vel x FRICTION
                      |
   Card Group Positions (imperative update)
                      |
          Three.js Renderer -> Canvas

  Spotify API -> Express Proxy (Token Cache)
                      |
          Artist Data + Track Info
                      |
  Firebase Firestore (realtime) -> Zustand Store
                      |
            Card Data -> 3D Scene`,
      techStack: ["React 18", "TypeScript", "Three.js", "React Three Fiber", "Zustand", "Firebase", "Spotify API", "Vite"],
      codeSnippets: [
        {
          title: "CircularCarousel — Spring Physics Loop",
          language: "typescript",
          code: `const SPRING_TENSION = 170
const SPRING_FRICTION = 26
const RADIUS = 3.8

const springPos = useRef(0)
const springVel = useRef(0)
const springTarget = useRef(0)

useFrame((_, dt) => {
  if (N === 0) return
  const safe = Math.min(dt, 0.033)

  // Damped spring: force = tension * displacement - friction * velocity
  const dx = springTarget.current - springPos.current
  const force = dx * SPRING_TENSION - springVel.current * SPRING_FRICTION
  springVel.current += force * safe
  springPos.current += springVel.current * safe

  // Imperatively update each card's 3D position (no React re-render)
  for (let i = 0; i < N; i++) {
    const group = cardGroupRefs.current[i]
    if (!group) continue
    const angle = i * angleStep + springPos.current
    group.position.set(RADIUS * Math.sin(angle), 0, RADIUS * Math.cos(angle))
    group.rotation.y = -angle
  }

  const computed = wrap(Math.round(-springPos.current / angleStep), N)
  if (computed !== activeIndex) setActiveIndex(computed)
})

const onPointerUp = () => {
  if (isDragging.current) {
    // Snap to nearest card after drag release
    const nearest = -Math.round(springPos.current / angleStep) * angleStep
    springTarget.current = nearest
  }
  isDragging.current = false
}`,
          explanation: "useFrame 안에서 감쇠 스프링(tension=170, friction=26)을 직접 계산하고, ref로 각 Three.js 카드 그룹을 명령형으로 업데이트합니다. React 리렌더 없이 60fps 인터랙션을 유지하는 핵심 구조입니다.",
        },
      ],
            thumbnailUrl: "/images/projects/page-of-artist-hero.png",
      heroImageUrl: "/images/projects/page-of-artist-hero.png",
      isFeatured: true,
      featuredOrder: 2,
      isPublished: true,
      categoryId: musicCategory.id,
    },
  });

  await prisma.projectLink.deleteMany({ where: { projectId: pageOfArtist.id } });
  await prisma.projectLink.create({
    data: { projectId: pageOfArtist.id, type: "GITHUB", label: "GitHub", url: "https://github.com/devbinlog/Page_of_Artist", order: 1 },
  });

  // ── 3. MDE ────────────────────────────────────────────────────────────────
  const mde = await prisma.project.upsert({
    where: { slug: "mde" },
    update: {
      title: "MDE",
      summary: `추상적인 음악적 상상을 LLM으로 분석해 10개 필드의 MusicProfile과 4방향 창작 가이드로 구조화하는 음악 디렉션 엔진.
음악 추천 생성이 아닌, 제작 전 단계의 방향성 데이터를 만들어냅니다.`,
      description: `음악 제작자는 "새벽에 혼자 운전하는 느낌"처럼 감정적 언어로 창작을 시작합니다.
그런데 이 언어는 제작 파라미터(BPM, 악기 편성, 믹싱 접근법)로 직접 연결되지 않습니다.

기존 레퍼런스 플레이리스트는 원하는 결과물을 보여줄 뿐 방향을 주지 않고, Suno나 Udio 같은 AI 음악 생성기는 완성 트랙을 만들 뿐 창작 방향을 구조화하지 않습니다. 음악 추천 시스템은 기존 음악을 제안할 뿐 새로운 제작 경로를 열어주지 못합니다.

MDE는 이 제작 전 단계의 공백을 채웁니다.

---

일반 AI 도구는 자연어로 답변하는 데 그칩니다.
"폭발적인 에너지로 우울을 극복하는 펑크 사운드"라는 입력에 설명은 가능하지만, 제작에 필요한 구조화된 데이터로 변환하지는 못합니다.

음악 방향, 사운드 구성, 비주얼 무드가 각각 분리되어 있어 하나의 아이디어가 앨범 커버, 공연 무드, 콘텐츠 기획까지 이어지기 어렵습니다.`,
      year: 2025,
      role: "AI 백엔드 개발, 풀스택",
      contribution: `LLM을 대화 인터페이스가 아닌 구조화 엔진으로 사용했습니다.
사용자의 감정 언어를 MusicProfile JSON 스키마로 강제 변환하고, 이를 기반으로 음악·사운드·비주얼·콘텐츠 방향을 생성하도록 두 단계 순차 파이프라인을 설계했습니다.

MusicProfile(10개 필드, temperature 0.3) → DirectionExplanation(4개 방향, temperature 0.7) 순서로 호출해 구조화 정밀도와 창의적 표현을 분리했습니다.

LLM 응답에서 JSON을 추출하는 3단계 폴백(직접 파싱 → 마크다운 제거 → 정규식 추출)을 구현해 추론 모델의 불규칙한 출력에 대응했습니다.

또한 Pollinations.ai Flux 모델로 visual_association 필드를 기반으로 앨범 커버 목업 이미지를 자동 생성하고, 세션 저장·공유 링크·데모 모드로 서비스 안정성을 확보했습니다.`,
      keyLearnings: `LLM에게 JSON 스키마를 시스템 프롬프트로 강제하면, 자연어 답변이 아닌 재사용 가능한 구조화 데이터를 얻을 수 있습니다. MDE를 통해 이 접근이 감정 언어를 제작 파라미터로 변환하는 데 실질적으로 유효함을 확인했습니다.

MusicProfile(구조화, 정밀도 우선)과 DirectionExplanation(서사, 창의성 우선)을 별도 LLM 호출로 분리하면 각 스키마의 복잡도를 낮추고 파싱 안정성을 높일 수 있습니다.

LLM 응답 파싱에서 3단계 폴백을 구현하면서, 추론 모델이 답변 전에 사고 과정을 출력하는 특성이 JSON 추출에 영향을 준다는 점을 경험했습니다.

MusicProfile의 visual_association 필드가 앨범 커버 프롬프트로 그대로 활용되는 설계에서, 데이터 구조 하나가 여러 다운스트림 도구에 연결되는 확장성을 확인했습니다.`,
      workingApproach: `MDE는 감정 언어로 입력한 음악 아이디어를 LLM으로 분석해 10개 필드의 MusicProfile JSON으로 변환하고, 이를 기반으로 4방향 창작 가이드(DirectionExplanation)를 생성합니다.

MusicProfile: emotion, energy, tempo_feel, genre, instrumentation, sound_direction, atmosphere, visual_association, listener_context, content_goal, summary

이를 기반으로 사용자는 다음 결과를 얻을 수 있습니다.

음악 방향 설명
사운드 엔지니어링 가이드
비주얼 / 앨범 아트 방향
콘텐츠 활용 전략

---

Natural Language Input: "새벽에 혼자 운전하는 느낌"
          |
          v
 [Stage 1] LLM (temperature 0.3)
 → MusicProfile JSON (10 fields)

 {
   emotion: ["melancholic", "lonely", "contemplative"],
   energy: "low",
   tempo_feel: "slow",
   genre: ["indie rock", "ambient"],
   instrumentation: ["clean guitar", "synth pad", "soft kick"],
   sound_direction: ["heavy reverb", "wide stereo pad"],
   atmosphere: ["rainy night", "empty street"],
   visual_association: ["blue neon", "wet road reflection"],
   listener_context: "새벽 드라이브",
   content_goal: "playlist_mood",
   summary: "고독한 새벽 드라이브의 몽환적 인디 사운드"
 }
          |
          v
 [Stage 2] LLM (temperature 0.7)
 → DirectionExplanation JSON (4 fields)
 ├── music_direction
 ├── sound_direction
 ├── visual_direction
 └── content_usage
          |
          v
 Result UI
 ├── JSON 시각화 (에너지 바, 템포 배지, 태그 카드)
 ├── 앨범 커버 목업 (Pollinations.ai Flux)
 └── 세션 저장 / 공유 링크`,
      techStack: ["Python", "FastAPI", "Next.js 15", "TypeScript", "Tailwind CSS v4", "OpenRouter", "Pollinations.ai", "SQLAlchemy", "PostgreSQL"],
      codeSnippets: [
        {
          title: "direction_service.py — 두 단계 LLM 파이프라인",
          language: "python",
          code: `async def generate_all_directions(
    input_text: str,
    options: dict | None = None,
) -> dict[str, Any]:
    """Generate MusicProfile and DirectionExplanation sequentially."""
    profile_msg = _build_profile_user_message(input_text, options)

    # Stage 1: MusicProfile 생성 (구조화 우선, temperature 0.3)
    profile_raw = await call_gemini(PROFILE_SYSTEM_PROMPT, profile_msg, temperature=0.3)
    music_profile = extract_json(profile_raw)

    # Stage 2: DirectionExplanation 생성 (창의성 우선, temperature 0.7)
    explanation_msg = json.dumps(music_profile, ensure_ascii=False, indent=2)
    try:
        expl_raw = await call_gemini(
            EXPLANATION_SYSTEM_PROMPT,
            explanation_msg,
            temperature=0.7,
            max_tokens=1024,
        )
        explanation = extract_json(expl_raw)
    except Exception as e:
        logger.warning("Explanation generation failed, using fallback: %s", e)
        explanation = _make_fallback_explanation(music_profile)

    return {"musicProfile": music_profile, "explanation": explanation}


def extract_json(text: str) -> dict:
    """3단계 폴백으로 LLM 응답에서 JSON을 추출합니다."""
    try:
        return json.loads(text)                          # 1. 직접 파싱
    except json.JSONDecodeError:
        pass
    clean = re.sub(r"\`\`\`(?:json)?\s*", "", text).strip().rstrip("\`").strip()
    try:
        return json.loads(clean)                         # 2. 마크다운 제거
    except json.JSONDecodeError:
        pass
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        return json.loads(match.group())                 # 3. 정규식 추출
    raise ValueError(f"Could not extract JSON: {text[:200]}")`,
          explanation: "두 단계 순차 LLM 파이프라인입니다. Stage 1은 temperature 0.3으로 10개 필드의 MusicProfile JSON을 정밀하게 구조화하고, Stage 2는 temperature 0.7로 그 결과를 받아 음악·사운드·비주얼·콘텐츠 4방향 창작 가이드를 생성합니다. extract_json은 추론 모델이 사고 과정을 앞에 출력하는 특성에 대응하는 3단계 폴백 파싱을 구현합니다.",
        },
      ],
            thumbnailUrl: "/images/projects/mde-hero.png",
      heroImageUrl: "/images/projects/mde-hero.png",
      isFeatured: true,
      featuredOrder: 1,
      isPublished: true,
      categoryId: designCategory.id,
      secondaryCategoryId: aiCategory.id,
    },
    create: {
      title: "MDE",
      slug: "mde",
      summary: `추상적인 음악적 상상을 LLM으로 분석해 10개 필드의 MusicProfile과 4방향 창작 가이드로 구조화하는 음악 디렉션 엔진.
음악 추천·생성이 아닌, 제작 전 단계의 방향성 데이터를 만들어냅니다.`,
      description: `음악 제작자는 "새벽에 혼자 운전하는 느낌"처럼 감정적 언어로 창작을 시작합니다.
그런데 이 언어는 제작 파라미터(BPM, 악기 편성, 믹싱 접근법)로 직접 연결되지 않습니다.

기존 레퍼런스 플레이리스트는 원하는 결과물을 보여줄 뿐 방향을 주지 않고, Suno나 Udio 같은 AI 음악 생성기는 완성 트랙을 만들 뿐 창작 방향을 구조화하지 않습니다. 음악 추천 시스템은 기존 음악을 제안할 뿐 새로운 제작 경로를 열어주지 못합니다.

MDE는 이 제작 전 단계의 공백을 채웁니다.

---

일반 AI 도구는 자연어로 답변하는 데 그칩니다.
"폭발적인 에너지로 우울을 극복하는 펑크 사운드"라는 입력에 설명은 가능하지만, 제작에 필요한 구조화된 데이터로 변환하지는 못합니다.

음악 방향, 사운드 구성, 비주얼 무드가 각각 분리되어 있어 하나의 아이디어가 앨범 커버, 공연 무드, 콘텐츠 기획까지 이어지기 어렵습니다.`,
      year: 2025,
      role: "AI 백엔드 개발, 풀스택",
      contribution: `LLM을 대화 인터페이스가 아닌 구조화 엔진으로 사용했습니다.
사용자의 감정 언어를 MusicProfile JSON 스키마로 강제 변환하고, 이를 기반으로 음악·사운드·비주얼·콘텐츠 방향을 생성하도록 두 단계 순차 파이프라인을 설계했습니다.

MusicProfile(10개 필드, temperature 0.3) → DirectionExplanation(4개 방향, temperature 0.7) 순서로 호출해 구조화 정밀도와 창의적 표현을 분리했습니다.

LLM 응답에서 JSON을 추출하는 3단계 폴백(직접 파싱 → 마크다운 제거 → 정규식 추출)을 구현해 추론 모델의 불규칙한 출력에 대응했습니다.

또한 Pollinations.ai Flux 모델로 visual_association 필드를 기반으로 앨범 커버 목업 이미지를 자동 생성하고, 세션 저장·공유 링크·데모 모드로 서비스 안정성을 확보했습니다.`,
      keyLearnings: `LLM에게 JSON 스키마를 시스템 프롬프트로 강제하면, 자연어 답변이 아닌 재사용 가능한 구조화 데이터를 얻을 수 있습니다. MDE를 통해 이 접근이 감정 언어를 제작 파라미터로 변환하는 데 실질적으로 유효함을 확인했습니다.

MusicProfile(구조화, 정밀도 우선)과 DirectionExplanation(서사, 창의성 우선)을 별도 LLM 호출로 분리하면 각 스키마의 복잡도를 낮추고 파싱 안정성을 높일 수 있습니다.

LLM 응답 파싱에서 3단계 폴백을 구현하면서, 추론 모델이 답변 전에 사고 과정을 출력하는 특성이 JSON 추출에 영향을 준다는 점을 경험했습니다.

MusicProfile의 visual_association 필드가 앨범 커버 프롬프트로 그대로 활용되는 설계에서, 데이터 구조 하나가 여러 다운스트림 도구에 연결되는 확장성을 확인했습니다.`,
      workingApproach: `MDE는 감정 언어로 입력한 음악 아이디어를 LLM으로 분석해 10개 필드의 MusicProfile JSON으로 변환하고, 이를 기반으로 4방향 창작 가이드(DirectionExplanation)를 생성합니다.

MusicProfile: emotion, energy, tempo_feel, genre, instrumentation, sound_direction, atmosphere, visual_association, listener_context, content_goal, summary

이를 기반으로 사용자는 다음 결과를 얻을 수 있습니다.

음악 방향 설명
사운드 엔지니어링 가이드
비주얼 / 앨범 아트 방향
콘텐츠 활용 전략

---

Natural Language Input: "새벽에 혼자 운전하는 느낌"
          |
          v
 [Stage 1] LLM (temperature 0.3)
 → MusicProfile JSON (10 fields)

 {
   emotion: ["melancholic", "lonely", "contemplative"],
   energy: "low",
   tempo_feel: "slow",
   genre: ["indie rock", "ambient"],
   instrumentation: ["clean guitar", "synth pad", "soft kick"],
   sound_direction: ["heavy reverb", "wide stereo pad"],
   atmosphere: ["rainy night", "empty street"],
   visual_association: ["blue neon", "wet road reflection"],
   listener_context: "새벽 드라이브",
   content_goal: "playlist_mood",
   summary: "고독한 새벽 드라이브의 몽환적 인디 사운드"
 }
          |
          v
 [Stage 2] LLM (temperature 0.7)
 → DirectionExplanation JSON (4 fields)
 ├── music_direction
 ├── sound_direction
 ├── visual_direction
 └── content_usage
          |
          v
 Result UI
 ├── JSON 시각화 (에너지 바, 템포 배지, 태그 카드)
 ├── 앨범 커버 목업 (Pollinations.ai Flux)
 └── 세션 저장 / 공유 링크`,
      techStack: ["Python", "FastAPI", "Next.js 15", "TypeScript", "Tailwind CSS v4", "OpenRouter", "Pollinations.ai", "SQLAlchemy", "PostgreSQL"],
      codeSnippets: [
        {
          title: "direction_service.py — 두 단계 LLM 파이프라인",
          language: "python",
          code: `async def generate_all_directions(
    input_text: str,
    options: dict | None = None,
) -> dict[str, Any]:
    """Generate MusicProfile and DirectionExplanation sequentially."""
    profile_msg = _build_profile_user_message(input_text, options)

    # Stage 1: MusicProfile 생성 (구조화 우선, temperature 0.3)
    profile_raw = await call_gemini(PROFILE_SYSTEM_PROMPT, profile_msg, temperature=0.3)
    music_profile = extract_json(profile_raw)

    # Stage 2: DirectionExplanation 생성 (창의성 우선, temperature 0.7)
    explanation_msg = json.dumps(music_profile, ensure_ascii=False, indent=2)
    try:
        expl_raw = await call_gemini(
            EXPLANATION_SYSTEM_PROMPT,
            explanation_msg,
            temperature=0.7,
            max_tokens=1024,
        )
        explanation = extract_json(expl_raw)
    except Exception as e:
        logger.warning("Explanation generation failed, using fallback: %s", e)
        explanation = _make_fallback_explanation(music_profile)

    return {"musicProfile": music_profile, "explanation": explanation}


def extract_json(text: str) -> dict:
    """3단계 폴백으로 LLM 응답에서 JSON을 추출합니다."""
    try:
        return json.loads(text)                          # 1. 직접 파싱
    except json.JSONDecodeError:
        pass
    clean = re.sub(r"\`\`\`(?:json)?\s*", "", text).strip().rstrip("\`").strip()
    try:
        return json.loads(clean)                         # 2. 마크다운 제거
    except json.JSONDecodeError:
        pass
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        return json.loads(match.group())                 # 3. 정규식 추출
    raise ValueError(f"Could not extract JSON: {text[:200]}")`,
          explanation: "두 단계 순차 LLM 파이프라인입니다. Stage 1은 temperature 0.3으로 10개 필드의 MusicProfile JSON을 정밀하게 구조화하고, Stage 2는 temperature 0.7로 그 결과를 받아 음악·사운드·비주얼·콘텐츠 4방향 창작 가이드를 생성합니다. extract_json은 추론 모델이 사고 과정을 앞에 출력하는 특성에 대응하는 3단계 폴백 파싱을 구현합니다.",
        },
      ],
      thumbnailUrl: "/images/projects/mde-hero.png",
      heroImageUrl: "/images/projects/mde-hero.png",
      isFeatured: true,
      featuredOrder: 1,
      isPublished: true,
      categoryId: designCategory.id,
      secondaryCategoryId: aiCategory.id,
    },
  });

  await prisma.projectLink.deleteMany({ where: { projectId: mde.id } });
  await prisma.projectLink.create({
    data: { projectId: mde.id, type: "GITHUB", label: "GitHub", url: "https://github.com/devbinlog/MDE", order: 1 },
  });

  // ── 5. MUSE ───────────────────────────────────────────────────────────────
  const muse = await prisma.project.upsert({
    where: { slug: "muse" },
    update: {
      title: "MUSE",
      summary: `손동작을 입력으로 받아 사운드를 제어하는 실시간 인터랙션 시스템.
입력, 인식, 매핑, 출력 구조를 설계해 사용자의 움직임을 음악으로 연결되는 흐름으로 구현했습니다.`,
      description: `기존 음악 생성 방식은 악기를 다루는 기술을 전제로 하거나,
터치 기반 인터페이스에 의존해 실제 연주 감각을 전달하기 어렵습니다.

특히 음악을 처음 접하는 사용자에게는 진입 장벽이 높고,
직관적인 입력만으로 음악을 만들 수 있는 방식이 부족한 문제가 있습니다.

MUSE는 별도의 장비 없이 웹캠만으로 사용자의 움직임을 음악으로 연결할 수 있는
직관적인 인터랙션 시스템을 만드는 것을 목표로 했습니다.

---

기존 제스처 기반 음악 시스템은 입력 인식과 오디오 출력이 분리되어 있어
지연(latency)이 발생하고, 실제 연주처럼 자연스럽게 연결되지 않는 문제가 있습니다.

또한 제스처 인식의 정확도가 낮아 입력 안정성이 떨어지고,
단순 트리거 기반 구조로 인해 음악 표현의 다양성이 제한되는 한계가 있습니다.

웹 환경에서는 특히 오디오 처리가 메인 스레드에 의존할 경우
입력 처리와 충돌하면서 지연이 증가하는 구조적 문제가 발생합니다.`,
      year: 2026,
      role: "풀스택 개발",
      contribution: `Tauri(Rust)로 웹 앱을 데스크탑 앱으로 패키징해 시스템 MIDI 접근을 가능하게 했습니다. AudioWorklet으로 드럼 합성과 루프스테이션 녹음을 메인 스레드 밖에서 처리합니다. 5손가락 0.8초 유지 제스처로 신시사이저/드럼/이펙터 패널을 전환하는 제스처 FSM을 구현했습니다. 외부 샘플 파일 없이 Web Audio API만으로 킥, 스네어, 하이햇 6종 드럼 합성을 구현했습니다.`,
      keyLearnings: `입력과 오디오 처리를 분리한 구조를 적용해,
30ms 이하의 레이턴시로 실시간 연주가 가능한 환경을 구현했습니다.

제스처 인식에서 발생하는 노이즈를 줄이기 위해
홀드 시간과 평균화 기반 필터를 적용해 입력 안정성을 개선했습니다.

이 과정을 통해 인터랙션 시스템에서는 단순한 인식 정확도보다
입력 안정성과 반응 일관성이 사용자 경험에 더 큰 영향을 준다는 것을 확인했습니다.

또한 하나의 입력을 여러 출력으로 매핑하는 구조를 통해
단순 제스처를 음악적 표현으로 확장할 수 있는 가능성을 확인했습니다.`,
      workingApproach: `MUSE는 사용자의 손동작을 입력으로 받아 사운드를 생성하는 구조를
입력 → 인식 → 매핑 → 출력 단계로 분리해 설계했습니다.

MediaPipe 기반 손 추적을 통해 손의 위치와 손가락 상태를 실시간으로 추출하고,
이를 제스처 데이터로 변환해 오디오 파라미터에 매핑했습니다.

화면을 상단(멜로디)과 하단(드럼) 영역으로 분리해,
하나의 입력 장치로도 서로 다른 음악 요소를 동시에 제어할 수 있도록 구성했습니다.

오디오 처리는 Web Audio API의 AudioWorklet을 사용해 메인 스레드와 분리함으로써,
입력 처리와 독립적으로 동작하는 저지연 사운드 시스템을 구현했습니다.

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
 Screen Split: Upper zone (35%) / Lower zone (65%)
 ├── Upper zone: Synthesizer (pentatonic scale)
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
      techStack: ["React 18", "TypeScript", "Tauri", "Rust", "MediaPipe", "Web Audio API", "Zustand", "Vite"],
      codeSnippets: [
        {
          title: "computeHandOpenness — Landmark Heuristic",
          language: "typescript",
          code: `private computeHandOpenness(hand: Hand | null): number {
  if (!hand || hand.landmarks.length < 21) return 0
  const wrist   = hand.landmarks[0]
  const fingers = [
    { tip: 8,  mcp: 5  },
    { tip: 12, mcp: 9  },
    { tip: 16, mcp: 13 },
    { tip: 20, mcp: 17 },
  ]
  let extended = 0

  for (const { tip, mcp } of fingers) {
    const distTip = Math.hypot(
      hand.landmarks[tip].x - wrist.x,
      hand.landmarks[tip].y - wrist.y
    )
    const distMcp = Math.hypot(
      hand.landmarks[mcp].x - wrist.x,
      hand.landmarks[mcp].y - wrist.y
    )
    if (distTip > distMcp * 1.1) extended++
  }

  // Thumb spread check via wrist-to-index MCP distance ratio
  const thumbSpread = Math.hypot(
    hand.landmarks[4].x - hand.landmarks[5].x,
    hand.landmarks[4].y - hand.landmarks[5].y
  )
  const handSize = Math.hypot(
    wrist.x - hand.landmarks[9].x,
    wrist.y - hand.landmarks[9].y
  )
  if (handSize > 0.01 && thumbSpread > handSize * 0.5) extended++

  // EMA smoothing applied by caller: 0.7 * prev + 0.3 * raw
  return extended / 5
}`,
          explanation: "MediaPipe 21개 랜드마크에서 손가락 4개의 tip-MCP 거리 비교로 신장 여부를 판단하고, 엄지 펼침을 별도 계산해 0~1 범위의 손 개방도를 반환합니다. 호출부에서 EMA(α=0.3)로 노이즈를 제거합니다.",
        },
        {
          title: "DrumEngine — Procedural Synthesis",
          language: "typescript",
          code: `hit(type: DrumType, velocity = 0.8): void {
  const t   = this.ctx!.currentTime
  const vel = Math.max(0.1, Math.min(1, velocity))
  switch (type) {
    case "kick":        this.playKick(t, vel);         break
    case "snare":       this.playSnare(t, vel);        break
    case "hihatClosed": this.playHihat(t, vel, false); break
    case "hihatOpen":   this.playHihat(t, vel, true);  break
    case "tom1":        this.playTom(t, vel, 210);     break
    case "tom2":        this.playTom(t, vel, 150);     break
  }
}

private playKick(t: number, vel: number): void {
  const osc  = this.ctx!.createOscillator()
  const gain = this.ctx!.createGain()
  // 160Hz → 30Hz pitch drop over 450ms (sine wave body)
  osc.frequency.setValueAtTime(160, t)
  osc.frequency.exponentialRampToValueAtTime(30, t + 0.45)
  gain.gain.setValueAtTime(vel * 1.2, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
  osc.connect(gain)
  gain.connect(this.masterGain!)
  osc.start(t); osc.stop(t + 0.5)
}

private playSnare(t: number, vel: number): void {
  // White noise through 2800Hz bandpass filter
  const noise  = this.ctx!.createBufferSource()
  noise.buffer = this.makeNoiseBuffer()
  const filter = this.ctx!.createBiquadFilter()
  filter.type  = "bandpass"
  filter.frequency.value = 2800
  const gain   = this.ctx!.createGain()
  gain.gain.setValueAtTime(vel * 0.8, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
  noise.connect(filter); filter.connect(gain); gain.connect(this.masterGain!)
  noise.start(t); noise.stop(t + 0.18)
}`,
          explanation: "외부 샘플 파일 없이 Web Audio API만으로 드럼 사운드를 합성합니다. 킥은 사인파 피치 드롭(160→30Hz), 스네어는 화이트 노이즈 + 밴드패스 필터로 구현하며 velocity가 gain과 decay를 제어합니다.",
        },
      ],
            thumbnailUrl: "/images/projects/muse-hero.png",
      heroImageUrl: "/images/projects/muse-hero.png",
      isFeatured: true,
      featuredOrder: 4,
      isPublished: true,
      categoryId: musicCategory.id,
    },
    create: {
      title: "MUSE",
      slug: "muse",
      summary: `손동작을 입력으로 받아 사운드를 제어하는 실시간 인터랙션 시스템.
입력, 인식, 매핑, 출력 구조를 설계해 사용자의 움직임을 음악으로 연결되는 흐름으로 구현했습니다.`,
      description: `기존 음악 생성 방식은 악기를 다루는 기술을 전제로 하거나,
터치 기반 인터페이스에 의존해 실제 연주 감각을 전달하기 어렵습니다.

특히 음악을 처음 접하는 사용자에게는 진입 장벽이 높고,
직관적인 입력만으로 음악을 만들 수 있는 방식이 부족한 문제가 있습니다.

MUSE는 별도의 장비 없이 웹캠만으로 사용자의 움직임을 음악으로 연결할 수 있는
직관적인 인터랙션 시스템을 만드는 것을 목표로 했습니다.

---

기존 제스처 기반 음악 시스템은 입력 인식과 오디오 출력이 분리되어 있어
지연(latency)이 발생하고, 실제 연주처럼 자연스럽게 연결되지 않는 문제가 있습니다.

또한 제스처 인식의 정확도가 낮아 입력 안정성이 떨어지고,
단순 트리거 기반 구조로 인해 음악 표현의 다양성이 제한되는 한계가 있습니다.

웹 환경에서는 특히 오디오 처리가 메인 스레드에 의존할 경우
입력 처리와 충돌하면서 지연이 증가하는 구조적 문제가 발생합니다.`,
      year: 2026,
      role: "풀스택 개발",
      contribution: `Tauri(Rust)로 웹 앱을 데스크탑 앱으로 패키징해 시스템 MIDI 접근을 가능하게 했습니다. AudioWorklet으로 드럼 합성과 루프스테이션 녹음을 메인 스레드 밖에서 처리합니다. 5손가락 0.8초 유지 제스처로 신시사이저/드럼/이펙터 패널을 전환하는 제스처 FSM을 구현했습니다. 외부 샘플 파일 없이 Web Audio API만으로 킥, 스네어, 하이햇 6종 드럼 합성을 구현했습니다.`,
      keyLearnings: `입력과 오디오 처리를 분리한 구조를 적용해,
30ms 이하의 레이턴시로 실시간 연주가 가능한 환경을 구현했습니다.

제스처 인식에서 발생하는 노이즈를 줄이기 위해
홀드 시간과 평균화 기반 필터를 적용해 입력 안정성을 개선했습니다.

이 과정을 통해 인터랙션 시스템에서는 단순한 인식 정확도보다
입력 안정성과 반응 일관성이 사용자 경험에 더 큰 영향을 준다는 것을 확인했습니다.

또한 하나의 입력을 여러 출력으로 매핑하는 구조를 통해
단순 제스처를 음악적 표현으로 확장할 수 있는 가능성을 확인했습니다.`,
      workingApproach: `MUSE는 사용자의 손동작을 입력으로 받아 사운드를 생성하는 구조를
입력 → 인식 → 매핑 → 출력 단계로 분리해 설계했습니다.

MediaPipe 기반 손 추적을 통해 손의 위치와 손가락 상태를 실시간으로 추출하고,
이를 제스처 데이터로 변환해 오디오 파라미터에 매핑했습니다.

화면을 상단(멜로디)과 하단(드럼) 영역으로 분리해,
하나의 입력 장치로도 서로 다른 음악 요소를 동시에 제어할 수 있도록 구성했습니다.

오디오 처리는 Web Audio API의 AudioWorklet을 사용해 메인 스레드와 분리함으로써,
입력 처리와 독립적으로 동작하는 저지연 사운드 시스템을 구현했습니다.

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
 Screen Split: Upper zone (35%) / Lower zone (65%)
 ├── Upper zone: Synthesizer (pentatonic scale)
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
      techStack: ["React 18", "TypeScript", "Tauri", "Rust", "MediaPipe", "Web Audio API", "Zustand", "Vite"],
      codeSnippets: [
        {
          title: "computeHandOpenness — Landmark Heuristic",
          language: "typescript",
          code: `private computeHandOpenness(hand: Hand | null): number {
  if (!hand || hand.landmarks.length < 21) return 0
  const wrist   = hand.landmarks[0]
  const fingers = [
    { tip: 8,  mcp: 5  },
    { tip: 12, mcp: 9  },
    { tip: 16, mcp: 13 },
    { tip: 20, mcp: 17 },
  ]
  let extended = 0

  for (const { tip, mcp } of fingers) {
    const distTip = Math.hypot(
      hand.landmarks[tip].x - wrist.x,
      hand.landmarks[tip].y - wrist.y
    )
    const distMcp = Math.hypot(
      hand.landmarks[mcp].x - wrist.x,
      hand.landmarks[mcp].y - wrist.y
    )
    if (distTip > distMcp * 1.1) extended++
  }

  // Thumb spread check via wrist-to-index MCP distance ratio
  const thumbSpread = Math.hypot(
    hand.landmarks[4].x - hand.landmarks[5].x,
    hand.landmarks[4].y - hand.landmarks[5].y
  )
  const handSize = Math.hypot(
    wrist.x - hand.landmarks[9].x,
    wrist.y - hand.landmarks[9].y
  )
  if (handSize > 0.01 && thumbSpread > handSize * 0.5) extended++

  // EMA smoothing applied by caller: 0.7 * prev + 0.3 * raw
  return extended / 5
}`,
          explanation: "MediaPipe 21개 랜드마크에서 손가락 4개의 tip-MCP 거리 비교로 신장 여부를 판단하고, 엄지 펼침을 별도 계산해 0~1 범위의 손 개방도를 반환합니다. 호출부에서 EMA(α=0.3)로 노이즈를 제거합니다.",
        },
        {
          title: "DrumEngine — Procedural Synthesis",
          language: "typescript",
          code: `hit(type: DrumType, velocity = 0.8): void {
  const t   = this.ctx!.currentTime
  const vel = Math.max(0.1, Math.min(1, velocity))
  switch (type) {
    case "kick":        this.playKick(t, vel);         break
    case "snare":       this.playSnare(t, vel);        break
    case "hihatClosed": this.playHihat(t, vel, false); break
    case "hihatOpen":   this.playHihat(t, vel, true);  break
    case "tom1":        this.playTom(t, vel, 210);     break
    case "tom2":        this.playTom(t, vel, 150);     break
  }
}

private playKick(t: number, vel: number): void {
  const osc  = this.ctx!.createOscillator()
  const gain = this.ctx!.createGain()
  // 160Hz → 30Hz pitch drop over 450ms (sine wave body)
  osc.frequency.setValueAtTime(160, t)
  osc.frequency.exponentialRampToValueAtTime(30, t + 0.45)
  gain.gain.setValueAtTime(vel * 1.2, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
  osc.connect(gain)
  gain.connect(this.masterGain!)
  osc.start(t); osc.stop(t + 0.5)
}

private playSnare(t: number, vel: number): void {
  // White noise through 2800Hz bandpass filter
  const noise  = this.ctx!.createBufferSource()
  noise.buffer = this.makeNoiseBuffer()
  const filter = this.ctx!.createBiquadFilter()
  filter.type  = "bandpass"
  filter.frequency.value = 2800
  const gain   = this.ctx!.createGain()
  gain.gain.setValueAtTime(vel * 0.8, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
  noise.connect(filter); filter.connect(gain); gain.connect(this.masterGain!)
  noise.start(t); noise.stop(t + 0.18)
}`,
          explanation: "외부 샘플 파일 없이 Web Audio API만으로 드럼 사운드를 합성합니다. 킥은 사인파 피치 드롭(160→30Hz), 스네어는 화이트 노이즈 + 밴드패스 필터로 구현하며 velocity가 gain과 decay를 제어합니다.",
        },
      ],
            thumbnailUrl: "/images/projects/muse-hero.png",
      heroImageUrl: "/images/projects/muse-hero.png",
      isFeatured: true,
      featuredOrder: 4,
      isPublished: true,
      categoryId: musicCategory.id,
    },
  });

  await prisma.projectLink.deleteMany({ where: { projectId: muse.id } });
  await prisma.projectLink.create({
    data: { projectId: muse.id, type: "GITHUB", label: "GitHub", url: "https://github.com/devbinlog/MUSE-Motion-based-User-Sound-Engine-", order: 1 },
  });


  // ── 6. Personalized AI Assistant ─────────────────────────────────────────
  const personalizedAI = await prisma.project.upsert({
    where: { slug: "personalized-ai-assistant" },
    update: {
      title: "Personalized AI Assistant",
      summary: `응답을 3개 생성하고, 선택하면, AI가 학습합니다.
선택 행동 자체가 개인화 데이터가 되어, 사용할수록 나를 닮아가는 AI 어시스턴트.`,
      description: `매번 "코드로 보여줘", "너무 길어", "단계별로 설명해줘"를 반복해야 했습니다. GPT-4를 반년 넘게 사용했지만, AI는 매번 처음 쓰는 것처럼 동일한 방식으로 응답했습니다. 개발 질문에는 코드 예제 중심, 기획 논의에는 간결한 요점 — 이 선호도를 AI는 학습하지 않았습니다.

기존 AI 어시스턴트와의 차이는 여기에 있습니다. 기존 시스템은 정보를 저장합니다("이 사람은 개발자야"). 이 시스템은 행동이 바뀝니다(코드 예제 중심으로 응답 전략 변경). 정보를 기억하는 것과 행동이 변하는 것은 다릅니다.

---

선호도를 직접 설정하는 방식은 초기 부담이 크고, 대화 맥락마다 미세하게 달라지는 선호도를 반영하기 어렵습니다.

Learning Mode의 API 3배 호출 비용, Vercel 서버리스 환경의 Python 미지원(LangGraph를 독립 서버로 분리해 해결), LLM 자기 참조 평가의 신뢰도 문제(18차원 → 9차원으로 축소) — 이 트레이드오프들이 설계 과정에서 가장 어려운 결정이었습니다.`,
      year: 2026,
      role: "풀스택 개발, AI 시스템 설계",
      contribution: `/api/chat 12단계 파이프라인 전체를 설계했습니다. Task Analyzer가 13가지 유형으로 입력을 분류하고, Candidate Generator가 5개 전략으로 Promise.all 병렬 생성합니다. 응답 스트리밍 완료 후 XAI 생성과 detectSuggestions()를 비동기 체인으로 분리해, 사이드이펙트가 사용자 체감 응답 속도에 영향을 주지 않도록 설계했습니다.

Preference Memory 합성을 LLM 기반으로 구현했습니다. 선호도 로그 5개 이상이 쌓이면 LLM이 전체 로그를 분석해 preferredTone, preferredLength, preferredStrategies, avoidedPatterns를 포함한 자연어 요약으로 합성합니다. 50개 로그를 그대로 프롬프트에 넣는 것보다 LLM이 합성한 요약 1개가 효과와 비용 모두에서 유리합니다.

Evaluation Engine을 18차원에서 9차원으로 줄이는 설계 결정을 내렸습니다. LLM에게 LLM 응답의 사실 정확성을 평가하게 하는 것은 자기 참조 편향이 발생합니다. 신뢰 있게 측정 가능한 9개 차원(structure, readability, specificity, completeness, professionalism, formatting, preferenceMatch, taskMatch, overall)만 남겨 평가 노이즈를 제거했습니다.

Execution Mode의 목표 격리 구조를 설계했습니다. Zustand 전역 상태로만 관리했을 때 A 채팅방 목표가 B 채팅방에도 주입되는 문제를 발견하고, conv_executionGoal_{conversationId} 키로 localStorage에 대화 단위 격리 저장하는 방식으로 해결했습니다.

resolveUserContext()로 인증 상태 전환을 처리했습니다. NextAuth 세션 → 쿠키 세션 ID → anonymous 폴백의 3단계로, 로그인 상태가 바뀌어도 동일한 사용자로 선호도 데이터가 유지됩니다.

Flow Designer로 도메인별 대화 플로우를 설계했습니다. 트리거 키워드를 정의하면 resolveFlow()가 사용자 메시지와 키워드를 매칭해 현재 단계를 결정하고, 해당 단계의 AI 지시사항이 buildSystemPrompt()의 [FLOW] 블록으로 주입됩니다. Persona System이 '어떤 어조로 말하는가'를 정의한다면, Flow Designer는 '어떤 상황에서 어떤 방식으로 접근하는가'를 정의합니다. 기술 지원 / 커리어 코칭 / 학습 멘토링 3가지 기본 플로우를 제공하고, 커스텀 플로우 생성과 실제 배포 전 시뮬레이션을 지원합니다.

축적된 사용자 데이터를 AI 파인튜닝용 데이터셋으로 내보내는 파이프라인을 구현했습니다. 선호도 로그는 DPO(Direct Preference Optimization) 형식의 chosen/rejected 응답 쌍으로, 평가 데이터는 9차원 루브릭 점수로, 대화 기록은 system/user/assistant 역할 레이블이 붙은 SFT 포맷으로 변환됩니다. JSON / JSONL / CSV 세 가지 형식으로 내보낼 수 있으며, 이 시스템은 AI를 사용하는 것에서 멈추지 않고 사용 데이터를 다시 AI 학습에 활용하는 데이터 루프를 갖추고 있습니다.

LangGraph Recommendation 노드를 실제 GPT-4o-mini에 연결했습니다. Python FastAPI + LangGraph 0.2 StateGraph로 구현하며, 첫 대화에서는 목표, 단계 컨텍스트 기반 현황 파악 질문을, 이후 대화에서는 직전 대화를 이어받아 다음 행동을 유도하는 질문을 생성합니다. /api/goals/{id}/recommend에서 FastAPI 백엔드를 우선 호출하고 실패 시 Next.js 서비스로 폴백하는 구조입니다.`,
      keyLearnings: `AX는 기능이 아니라 설계입니다. 스트리밍 속도, 후보 선택 인터페이스, XAI 투명성 모두가 사용자 경험의 일부입니다. AI 챗봇을 만드는 것과 AI 경험 시스템을 설계하는 것은 다릅니다.

개인화는 정보 저장이 아니라 행동 변화입니다. "나는 개발자야"를 기억하는 것과 코드 예제 중심으로 응답 전략이 바뀌는 것은 다릅니다. 전략이 바뀌어야 진짜 개인화입니다.

평가를 설계하는 것이 가장 어렵습니다. 18차원에서 9차원으로 줄이는 과정에서, 측정 가능한 기준과 측정 불가능한 기준을 구분하는 것 자체가 핵심 설계 결정이었습니다. 적은 차원, 더 정확한 평가가 더 많은 차원, 낮은 신뢰도보다 낫습니다.

비동기 사이드이펙트 설계가 UX를 결정합니다. 어떤 작업을 응답 경로에 넣고 어떤 작업을 비동기로 분리할지가 사용자 체감 응답 속도를 결정합니다. 스트리밍 완료 후 XAI 생성과 적응형 제안 탐지를 분리한 것이 이 판단에서 나왔습니다.

목표 기반 AI 설계는 단발성 QA 설계와 근본적으로 다릅니다. 대화와 대화를 이어주는 구조가 코칭과 QA의 차이입니다.

사용 데이터가 다시 학습 데이터가 됩니다. 선호도 로그 → DPO 데이터셋, 평가 결과 → 루브릭 학습 데이터로 내보내는 구조를 설계하면서, 사용자 경험이 끝나는 지점이 모델 개선의 시작점이 될 수 있다는 것을 배웠습니다.`,
      workingApproach: `사용자의 선택 행동 자체를 학습 신호로 변환합니다. 직접 묻지 않고, 인터페이스가 데이터 수집 채널이 됩니다.

Learning Mode: 동일한 입력에 3개 응답 후보를, 5가지 전략(STRUCTURED / CONCISE / PROFESSIONAL / ANALYTICAL / CONVERSATIONAL) 중 질문 유형과 사용자 선호도에 맞는 3가지를 선택해 Promise.all 병렬 생성합니다. 사용자 선택 → /api/preferences가 선호도 로그 저장 → 로그 5개 이상이면 LLM이 전체 로그를 분석해 사용자 프로파일 합성 → 다음 대화 시스템 프롬프트 [MEMORY] 블록에 자동 주입.

Normal Mode: 합성된 선호도 프로파일 기반으로 응답이 자동 개인화됩니다.
최종 점수 = 평가 점수(0~1) + 선호도 메모리 가중치(0~0.3)

Execution Mode: 목표 입력 → Journey Planner(LLM)가 4~8단계 여정 자동 설계 → 각 대화에서 Progress Engine이 현재 단계 컨텍스트를 [EXECUTION] 블록으로 주입 → AI가 여정 맥락을 유지하며 코칭. 목표는 conv_executionGoal_{conversationId} 키로 대화 단위 격리 저장. 대화 종료 후 LangGraph StateGraph에 연결된 GPT-4o-mini가 목표, 마일스톤, 현재 단계 컨텍스트를 읽고, 다음 행동을 유도하는 코칭 질문을 실시간 생성합니다.

---

/api/chat 12단계 파이프라인              buildSystemPrompt 8-layer 조립

resolveUserContext()                    [1] BASE      페르소나 지시사항
  → loadPreferenceMemory()             [2] MEMORY    학습된 선호도 요약
  → Task Analyzer (13가지 유형)        [3] TASK      태스크 유형 + 복잡도
  → Persona Selector (5가지)           [4] FLOW      활성 플로우 + 단계 지시
  → resolveFlow() — 활성 플로우 + 단계 매칭
  → Candidate Generator (×3, 병렬)    [5] EXECUTION 실행 목표 + 진행 단계
  → Evaluation Engine (9차원, 0~1)    [6] SEARCH    웹 검색 결과
  → Ranker                             [7] ONBOARDING 스타일 + 포맷 규칙
  → buildSystemPrompt() [8-layer]     [8] STRATEGY  응답 전략 힌트
  → streamText() → SSE 스트리밍
  → [비동기] XAI 생성 → DB
  → [비동기] detectSuggestions() → DB

규모: API Routes 38개 이상 / DB 테이블 24개 / 대화 플로우 템플릿 3가지 / 데이터 내보내기 형식 3가지(DPO / 평가 / 대화) / LangGraph 노드 12개 (Recommendation 노드 GPT-4o-mini 실제 연결) / 구현 Phase 14단계`,
      techStack: ["Next.js 15", "TypeScript", "Vercel AI SDK", "LangGraph", "FastAPI", "Python", "PostgreSQL", "Prisma", "Zustand", "Tailwind CSS"],
      codeSnippets: [
        {
          title: "preferences/route.ts — 선호도 로그 저장 & LLM 메모리 합성",
          language: "typescript",
          code: `// /api/preferences/route.ts
export async function POST(req: Request) {
  const { selectedIndex, candidates } = await req.json()
  const userCtx = await resolveUserContext(req)

  // 선호도 로그 저장 (선택된 전략 + 거부된 전략)
  await db.preferenceLog.create({
    data: {
      userId: userCtx.userId,
      selectedStrategy: candidates[selectedIndex].strategy,
      taskType: candidates[selectedIndex].taskType,
      rejectedStrategies: candidates
        .filter((_, i) => i !== selectedIndex)
        .map((c) => c.strategy),
    },
  })

  // 로그 임계치(5개) 이상이면 LLM 메모리 합성 트리거
  const logCount = await db.preferenceLog.count({
    where: { userId: userCtx.userId },
  })

  if (logCount >= SYNTHESIS_THRESHOLD) {
    const recentLogs = await db.preferenceLog.findMany({
      where: { userId: userCtx.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    // LLM이 전체 로그를 분석해 사용자 프로파일 합성
    // (로그 50개를 그대로 넣는 것보다 합성된 요약 1개가 효과·비용 모두 유리)
    const { object: profile } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        preferredTone: z.enum(['casual', 'professional', 'academic']),
        preferredLength: z.enum(['concise', 'moderate', 'detailed']),
        preferredStrategies: z.array(z.string()),
        avoidedPatterns: z.array(z.string()),
        rawSummary: z.string(),
      }),
      prompt: \`다음 선호도 로그를 분석해 사용자 응답 프로파일을 합성하세요:\\n\${JSON.stringify(recentLogs)}\`,
    })

    // 합성된 프로파일 → 다음 대화 buildSystemPrompt() [MEMORY] 블록에 주입
    await db.preferenceMemory.upsert({
      where: { userId: userCtx.userId },
      update: { ...profile, synthesizedAt: new Date() },
      create: { userId: userCtx.userId, ...profile },
    })
  }

  return Response.json({ ok: true })
}`,
          explanation: "사용자가 3개 후보 중 하나를 선택하면 선택된 전략과 거부된 전략이 로그로 저장됩니다. 로그 5개 이상이 쌓이면 LLM이 최근 50개 로그를 분석해 preferredTone, preferredLength, preferredStrategies, avoidedPatterns를 자연어 요약으로 합성합니다. 합성된 프로파일은 다음 대화의 buildSystemPrompt() [MEMORY] 블록에 주입되어, 사용자가 명시적으로 지시하지 않아도 AI가 이미 알고 있는 상태가 만들어집니다.",
        },
      ],
      thumbnailUrl: "/images/projects/personalized-ai-assistant-hero-v2.png",
      heroImageUrl: "/images/projects/personalized-ai-assistant-hero-v2.png",
      isFeatured: true,
      featuredOrder: 0,
      isPublished: true,
      categoryId: aiCategory.id,
    },
    create: {
      title: "Personalized AI Assistant",
      slug: "personalized-ai-assistant",
      summary: `응답을 3개 생성하고, 선택하면, AI가 학습합니다.
선택 행동 자체가 개인화 데이터가 되어, 사용할수록 나를 닮아가는 AI 어시스턴트.`,
      description: `매번 "코드로 보여줘", "너무 길어", "단계별로 설명해줘"를 반복해야 했습니다. GPT-4를 반년 넘게 사용했지만, AI는 매번 처음 쓰는 것처럼 동일한 방식으로 응답했습니다. 개발 질문에는 코드 예제 중심, 기획 논의에는 간결한 요점 — 이 선호도를 AI는 학습하지 않았습니다.

기존 AI 어시스턴트와의 차이는 여기에 있습니다. 기존 시스템은 정보를 저장합니다("이 사람은 개발자야"). 이 시스템은 행동이 바뀝니다(코드 예제 중심으로 응답 전략 변경). 정보를 기억하는 것과 행동이 변하는 것은 다릅니다.

---

선호도를 직접 설정하는 방식은 초기 부담이 크고, 대화 맥락마다 미세하게 달라지는 선호도를 반영하기 어렵습니다.

Learning Mode의 API 3배 호출 비용, Vercel 서버리스 환경의 Python 미지원(LangGraph를 독립 서버로 분리해 해결), LLM 자기 참조 평가의 신뢰도 문제(18차원 → 9차원으로 축소) — 이 트레이드오프들이 설계 과정에서 가장 어려운 결정이었습니다.`,
      year: 2026,
      role: "풀스택 개발, AI 시스템 설계",
      contribution: `/api/chat 12단계 파이프라인 전체를 설계했습니다. Task Analyzer가 13가지 유형으로 입력을 분류하고, Candidate Generator가 5개 전략으로 Promise.all 병렬 생성합니다. 응답 스트리밍 완료 후 XAI 생성과 detectSuggestions()를 비동기 체인으로 분리해, 사이드이펙트가 사용자 체감 응답 속도에 영향을 주지 않도록 설계했습니다.

Preference Memory 합성을 LLM 기반으로 구현했습니다. 선호도 로그 5개 이상이 쌓이면 LLM이 전체 로그를 분석해 preferredTone, preferredLength, preferredStrategies, avoidedPatterns를 포함한 자연어 요약으로 합성합니다. 50개 로그를 그대로 프롬프트에 넣는 것보다 LLM이 합성한 요약 1개가 효과와 비용 모두에서 유리합니다.

Evaluation Engine을 18차원에서 9차원으로 줄이는 설계 결정을 내렸습니다. LLM에게 LLM 응답의 사실 정확성을 평가하게 하는 것은 자기 참조 편향이 발생합니다. 신뢰 있게 측정 가능한 9개 차원(structure, readability, specificity, completeness, professionalism, formatting, preferenceMatch, taskMatch, overall)만 남겨 평가 노이즈를 제거했습니다.

Execution Mode의 목표 격리 구조를 설계했습니다. Zustand 전역 상태로만 관리했을 때 A 채팅방 목표가 B 채팅방에도 주입되는 문제를 발견하고, conv_executionGoal_{conversationId} 키로 localStorage에 대화 단위 격리 저장하는 방식으로 해결했습니다.

resolveUserContext()로 인증 상태 전환을 처리했습니다. NextAuth 세션 → 쿠키 세션 ID → anonymous 폴백의 3단계로, 로그인 상태가 바뀌어도 동일한 사용자로 선호도 데이터가 유지됩니다.

Flow Designer로 도메인별 대화 플로우를 설계했습니다. 트리거 키워드를 정의하면 resolveFlow()가 사용자 메시지와 키워드를 매칭해 현재 단계를 결정하고, 해당 단계의 AI 지시사항이 buildSystemPrompt()의 [FLOW] 블록으로 주입됩니다. Persona System이 '어떤 어조로 말하는가'를 정의한다면, Flow Designer는 '어떤 상황에서 어떤 방식으로 접근하는가'를 정의합니다. 기술 지원 / 커리어 코칭 / 학습 멘토링 3가지 기본 플로우를 제공하고, 커스텀 플로우 생성과 실제 배포 전 시뮬레이션을 지원합니다.

축적된 사용자 데이터를 AI 파인튜닝용 데이터셋으로 내보내는 파이프라인을 구현했습니다. 선호도 로그는 DPO(Direct Preference Optimization) 형식의 chosen/rejected 응답 쌍으로, 평가 데이터는 9차원 루브릭 점수로, 대화 기록은 system/user/assistant 역할 레이블이 붙은 SFT 포맷으로 변환됩니다. JSON / JSONL / CSV 세 가지 형식으로 내보낼 수 있으며, 이 시스템은 AI를 사용하는 것에서 멈추지 않고 사용 데이터를 다시 AI 학습에 활용하는 데이터 루프를 갖추고 있습니다.

LangGraph Recommendation 노드를 실제 GPT-4o-mini에 연결했습니다. Python FastAPI + LangGraph 0.2 StateGraph로 구현하며, 첫 대화에서는 목표, 단계 컨텍스트 기반 현황 파악 질문을, 이후 대화에서는 직전 대화를 이어받아 다음 행동을 유도하는 질문을 생성합니다. /api/goals/{id}/recommend에서 FastAPI 백엔드를 우선 호출하고 실패 시 Next.js 서비스로 폴백하는 구조입니다.`,
      keyLearnings: `AX는 기능이 아니라 설계입니다. 스트리밍 속도, 후보 선택 인터페이스, XAI 투명성 모두가 사용자 경험의 일부입니다. AI 챗봇을 만드는 것과 AI 경험 시스템을 설계하는 것은 다릅니다.

개인화는 정보 저장이 아니라 행동 변화입니다. "나는 개발자야"를 기억하는 것과 코드 예제 중심으로 응답 전략이 바뀌는 것은 다릅니다. 전략이 바뀌어야 진짜 개인화입니다.

평가를 설계하는 것이 가장 어렵습니다. 18차원에서 9차원으로 줄이는 과정에서, 측정 가능한 기준과 측정 불가능한 기준을 구분하는 것 자체가 핵심 설계 결정이었습니다. 적은 차원, 더 정확한 평가가 더 많은 차원, 낮은 신뢰도보다 낫습니다.

비동기 사이드이펙트 설계가 UX를 결정합니다. 어떤 작업을 응답 경로에 넣고 어떤 작업을 비동기로 분리할지가 사용자 체감 응답 속도를 결정합니다. 스트리밍 완료 후 XAI 생성과 적응형 제안 탐지를 분리한 것이 이 판단에서 나왔습니다.

목표 기반 AI 설계는 단발성 QA 설계와 근본적으로 다릅니다. 대화와 대화를 이어주는 구조가 코칭과 QA의 차이입니다.

사용 데이터가 다시 학습 데이터가 됩니다. 선호도 로그 → DPO 데이터셋, 평가 결과 → 루브릭 학습 데이터로 내보내는 구조를 설계하면서, 사용자 경험이 끝나는 지점이 모델 개선의 시작점이 될 수 있다는 것을 배웠습니다.`,
      workingApproach: `사용자의 선택 행동 자체를 학습 신호로 변환합니다. 직접 묻지 않고, 인터페이스가 데이터 수집 채널이 됩니다.

Learning Mode: 동일한 입력에 3개 응답 후보를, 5가지 전략(STRUCTURED / CONCISE / PROFESSIONAL / ANALYTICAL / CONVERSATIONAL) 중 질문 유형과 사용자 선호도에 맞는 3가지를 선택해 Promise.all 병렬 생성합니다. 사용자 선택 → /api/preferences가 선호도 로그 저장 → 로그 5개 이상이면 LLM이 전체 로그를 분석해 사용자 프로파일 합성 → 다음 대화 시스템 프롬프트 [MEMORY] 블록에 자동 주입.

Normal Mode: 합성된 선호도 프로파일 기반으로 응답이 자동 개인화됩니다.
최종 점수 = 평가 점수(0~1) + 선호도 메모리 가중치(0~0.3)

Execution Mode: 목표 입력 → Journey Planner(LLM)가 4~8단계 여정 자동 설계 → 각 대화에서 Progress Engine이 현재 단계 컨텍스트를 [EXECUTION] 블록으로 주입 → AI가 여정 맥락을 유지하며 코칭. 목표는 conv_executionGoal_{conversationId} 키로 대화 단위 격리 저장. 대화 종료 후 LangGraph StateGraph에 연결된 GPT-4o-mini가 목표, 마일스톤, 현재 단계 컨텍스트를 읽고, 다음 행동을 유도하는 코칭 질문을 실시간 생성합니다.

---

/api/chat 12단계 파이프라인              buildSystemPrompt 8-layer 조립

resolveUserContext()                    [1] BASE      페르소나 지시사항
  → loadPreferenceMemory()             [2] MEMORY    학습된 선호도 요약
  → Task Analyzer (13가지 유형)        [3] TASK      태스크 유형 + 복잡도
  → Persona Selector (5가지)           [4] FLOW      활성 플로우 + 단계 지시
  → resolveFlow() — 활성 플로우 + 단계 매칭
  → Candidate Generator (×3, 병렬)    [5] EXECUTION 실행 목표 + 진행 단계
  → Evaluation Engine (9차원, 0~1)    [6] SEARCH    웹 검색 결과
  → Ranker                             [7] ONBOARDING 스타일 + 포맷 규칙
  → buildSystemPrompt() [8-layer]     [8] STRATEGY  응답 전략 힌트
  → streamText() → SSE 스트리밍
  → [비동기] XAI 생성 → DB
  → [비동기] detectSuggestions() → DB

규모: API Routes 38개 이상 / DB 테이블 24개 / 대화 플로우 템플릿 3가지 / 데이터 내보내기 형식 3가지(DPO / 평가 / 대화) / LangGraph 노드 12개 (Recommendation 노드 GPT-4o-mini 실제 연결) / 구현 Phase 14단계`,
      techStack: ["Next.js 15", "TypeScript", "Vercel AI SDK", "LangGraph", "FastAPI", "Python", "PostgreSQL", "Prisma", "Zustand", "Tailwind CSS"],
      codeSnippets: [
        {
          title: "preferences/route.ts — 선호도 로그 저장 & LLM 메모리 합성",
          language: "typescript",
          code: `// /api/preferences/route.ts
export async function POST(req: Request) {
  const { selectedIndex, candidates } = await req.json()
  const userCtx = await resolveUserContext(req)

  // 선호도 로그 저장 (선택된 전략 + 거부된 전략)
  await db.preferenceLog.create({
    data: {
      userId: userCtx.userId,
      selectedStrategy: candidates[selectedIndex].strategy,
      taskType: candidates[selectedIndex].taskType,
      rejectedStrategies: candidates
        .filter((_, i) => i !== selectedIndex)
        .map((c) => c.strategy),
    },
  })

  // 로그 임계치(5개) 이상이면 LLM 메모리 합성 트리거
  const logCount = await db.preferenceLog.count({
    where: { userId: userCtx.userId },
  })

  if (logCount >= SYNTHESIS_THRESHOLD) {
    const recentLogs = await db.preferenceLog.findMany({
      where: { userId: userCtx.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    // LLM이 전체 로그를 분석해 사용자 프로파일 합성
    // (로그 50개를 그대로 넣는 것보다 합성된 요약 1개가 효과·비용 모두 유리)
    const { object: profile } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        preferredTone: z.enum(['casual', 'professional', 'academic']),
        preferredLength: z.enum(['concise', 'moderate', 'detailed']),
        preferredStrategies: z.array(z.string()),
        avoidedPatterns: z.array(z.string()),
        rawSummary: z.string(),
      }),
      prompt: \`다음 선호도 로그를 분석해 사용자 응답 프로파일을 합성하세요:\\n\${JSON.stringify(recentLogs)}\`,
    })

    // 합성된 프로파일 → 다음 대화 buildSystemPrompt() [MEMORY] 블록에 주입
    await db.preferenceMemory.upsert({
      where: { userId: userCtx.userId },
      update: { ...profile, synthesizedAt: new Date() },
      create: { userId: userCtx.userId, ...profile },
    })
  }

  return Response.json({ ok: true })
}`,
          explanation: "사용자가 3개 후보 중 하나를 선택하면 선택된 전략과 거부된 전략이 로그로 저장됩니다. 로그 5개 이상이 쌓이면 LLM이 최근 50개 로그를 분석해 preferredTone, preferredLength, preferredStrategies, avoidedPatterns를 자연어 요약으로 합성합니다. 합성된 프로파일은 다음 대화의 buildSystemPrompt() [MEMORY] 블록에 주입되어, 사용자가 명시적으로 지시하지 않아도 AI가 이미 알고 있는 상태가 만들어집니다.",
        },
      ],
      thumbnailUrl: "/images/projects/personalized-ai-assistant-hero-v2.png",
      heroImageUrl: "/images/projects/personalized-ai-assistant-hero-v2.png",
      isFeatured: true,
      featuredOrder: 0,
      isPublished: true,
      categoryId: aiCategory.id,
    },
  });

  await prisma.projectLink.deleteMany({ where: { projectId: personalizedAI.id } });
  await prisma.projectLink.createMany({
    data: [
      { projectId: personalizedAI.id, type: "GITHUB", label: "GitHub", url: "https://github.com/devbinlog/Personalized_AI_Assistant", order: 1 },
      { projectId: personalizedAI.id, type: "DEMO", label: "Live Demo", url: "https://frontend-mu-liard-59.vercel.app", order: 2 },
    ],
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
