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
      featuredOrder: 1,
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
      featuredOrder: 1,
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
      featuredOrder: 3,
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
      featuredOrder: 3,
      isPublished: true,
      categoryId: designCategory.id,
      secondaryCategoryId: aiCategory.id,
    },
  });

  await prisma.projectLink.deleteMany({ where: { projectId: mde.id } });
  await prisma.projectLink.create({
    data: { projectId: mde.id, type: "GITHUB", label: "GitHub", url: "https://github.com/devbinlog/MDE", order: 1 },
  });

  // ── 4. Emotion-Aware AI Voice Engine ──────────────────────────────────────
  const emotionAI = await prisma.project.upsert({
    where: { slug: "emotion-aware-ai-voice-engine" },
    update: {
      title: "Emotion-Aware AI Voice Engine",
      summary: "STT, 감정 분석, LLM, TTS를 하나의 저지연 파이프라인으로 연결해 사용자의 감정 상태에 맞는 톤으로 응답하는 AI 음성 인터랙션 시스템.",
      description: `기존 음성 AI 시스템은 사용자의 감정 상태를 고려하지 않고, 항상 동일한 톤으로 응답합니다.

사용자가 화가 나거나 슬픈 상황에서도 AI는 중립적인 응답을 유지하며,
이로 인해 대화 경험이 단절되고 AI가 기계적으로 느껴지는 문제가 발생합니다.

특히 음성 기반 인터페이스에서는 감정이 중요한 요소임에도 불구하고,
대부분의 시스템이 텍스트 기반 처리에만 집중하고 있다는 한계를 가지고 있습니다.

---

기존 TTS 시스템은 텍스트만을 기반으로 동작하며,
음성 신호에서 감정을 추출하거나 반영하는 구조를 가지고 있지 않습니다.

또한 STT, 감정 분석, LLM, TTS를 개별적으로 연결할 경우
각 단계의 처리 지연이 누적되어 전체 응답 시간이 7~12초까지 증가하는 문제가 발생합니다.

이로 인해 실시간 대화 경험을 제공하기 어려운 구조적 한계를 가지고 있습니다.`,
      year: 2026,
      role: "AI 백엔드 개발",
      contribution: `오디오 신호와 텍스트를 결합한 감정 분석 모듈을 구현해,
멀티모달 기반으로 감정을 추출할 수 있도록 구성했습니다.

FastAPI WebSocket 서버를 사용해 음성 입력과 응답을 실시간으로 처리하고,
STT부터 TTS까지 이어지는 흐름을 하나의 연결된 세션으로 관리했습니다.

faster-whisper 기반 STT를 적용해 실시간 음성 인식을 처리하고,
감정 분석 결과를 LLM과 TTS에 전달해 응답 내용과 음성 톤을 함께 제어했습니다.`,
      keyLearnings: `감정 정보를 파이프라인 전반에 전달하는 구조를 설계하면서,
단순 텍스트 기반 응답보다 훨씬 자연스러운 음성 대화 경험을 구현할 수 있었습니다.

멀티모달 감정 분석을 통해 동일한 입력이라도 상황에 따라 다른 응답을 생성할 수 있게 되었고,
사용자와의 상호작용 품질을 개선할 수 있었습니다.

또한 STT, 감정 분석, LLM, TTS를 하나의 흐름으로 통합하면서
실시간 처리에서 지연을 줄이기 위한 파이프라인 설계의 중요성을 경험했습니다.`,
      workingApproach: `음성과 텍스트를 동시에 활용해 감정을 추출하고, 이를 응답 생성까지 연결하는 파이프라인을 설계했습니다.

오디오 신호에서는 피치, 에너지, 속도와 같은 특징을 추출해 감정 상태를 추정하고,
텍스트에서는 키워드 기반 감정 분석을 통해 보조 정보를 생성했습니다.

두 결과를 가중치 기반으로 통합해 최종 감정을 결정하고,
이를 LLM과 TTS에 전달해 응답의 내용과 음성 톤이 일관되도록 구성했습니다.

또한 전체 파이프라인을 하나의 흐름으로 연결해,
각 단계의 처리 지연이 누적되지 않도록 구조를 설계했습니다.

---

음성 입력 → STT → 감정 분석(오디오+텍스트 멀티모달) → 감정 통합
                                                         ↓
                              TTS(감정 톤 제어) ← LLM(감정 컨텍스트 반영)`,
      techStack: ["Python", "FastAPI", "WebSocket", "faster-whisper", "Ollama", "Claude API", "Next.js 14", "Tailwind CSS"],
      codeSnippets: [
        {
          title: "voice_ws — Real-time Pipeline",
          language: "python",
          code: `@ws_router.websocket("/ws/voice")
async def voice_ws(ws: WebSocket):
    await ws.accept()
    vad, stt, emotion, tts = _services()
    audio_buffer: List[np.ndarray] = []
    conversation_history: List[dict] = []

    async for raw in ws.iter_text():
        msg = json.loads(raw)
        t = msg.get("type")

        if t == "audio_chunk":
            chunk = np.frombuffer(
                base64.b64decode(msg["data"]), dtype=np.int16
            ).astype(np.float32) / 32768.0
            audio_buffer.append(chunk)
            await ws.send_json({"type": "vad_result", "is_speech": vad.is_speech(chunk)})

        elif t == "end_stream":
            full = np.concatenate(audio_buffer)

            # Stage 1: STT — transcribe with faster-whisper
            stt_result = await asyncio.to_thread(stt.transcribe, full, "ko", 16000)

            # Stage 2: Emotion — audio + text multimodal fusion
            emo = emotion.analyze(full, sr=16000, transcript=stt_result["transcript"])

            # Stage 3: LLM — emotion-conditioned response generation
            ai_text = await get_llm_response(stt_result["transcript"], emo, conversation_history)

            # Stage 4: TTS — prosody-adjusted synthesis
            out = tts.synthesize(text=ai_text, emotion_label=emo["emotion_label"])

            await ws.send_json({
                "type": "response",
                "transcript": stt_result["transcript"],
                "emotion": emo,
                "text": ai_text,
                "audio": out,
            })
            audio_buffer.clear()`,
          explanation: "WebSocket 한 세션에서 STT → 감정 분석 → LLM → TTS 파이프라인을 순차 실행합니다. 오디오 청크를 실시간으로 버퍼링하다가 end_stream 신호에 전체 파이프라인을 실행하고 응답을 반환합니다.",
        },
        {
          title: "EmotionService — MFCC + Text Fusion",
          language: "python",
          code: `class EmotionService:
    def __init__(self):
        self.classifier = EmotionClassifier()
        self._audio_w = settings.EMOTION_AUDIO_WEIGHT  # 0.6
        self._text_w  = settings.EMOTION_TEXT_WEIGHT   # 0.4

    def extract_audio_features(self, audio: np.ndarray, sr: int = 16000) -> dict:
        frames    = _frames(audio)
        f0        = _f0_autocorr(audio, sr)      # 피치: 자기상관 기반
        rms       = _rms(frames).mean()
        zcr       = _zcr(frames).mean()
        mfccs     = _mfcc(audio, sr, n_mfcc=13)  # mel-filterbank + DCT
        spk_rate  = _speaking_rate(audio, sr)
        return {
            "f0_mean": f0, "rms": rms, "zcr": zcr,
            "mfcc_mean": mfccs.mean(axis=1).tolist(),
            "speaking_rate": spk_rate,
        }

    def fuse(self, audio_result: dict, text_result: dict | None = None) -> dict:
        p_audio = np.array(audio_result["probabilities"])
        if text_result:
            p_text = np.array(text_result["probabilities"])
            fused  = self._audio_w * p_audio + self._text_w * p_text
        else:
            fused = p_audio
        fused /= fused.sum()
        label = EMOTION_LABELS[fused.argmax()]
        return {"emotion_label": label, "probabilities": fused.tolist()}

    def analyze(self, audio: np.ndarray, sr: int = 16000, transcript: str | None = None) -> dict:
        features     = self.extract_audio_features(audio, sr)
        audio_result = self.classifier.predict_from_features(features)
        text_result  = self.classifier.predict_from_text(transcript) if transcript else None
        return self.fuse(audio_result, text_result)`,
          explanation: "오디오에서 MFCC·피치·RMS·ZCR를 추출하고, 텍스트 키워드 감정 분석 결과와 가중치 기반(오디오 0.6 / 텍스트 0.4)으로 융합해 최종 감정 레이블을 결정합니다.",
        },
      ],
            thumbnailUrl: "/images/projects/emotion-hero.png",
      heroImageUrl: "/images/projects/emotion-hero.png",
      isFeatured: true,
      featuredOrder: 4,
      isPublished: true,
      categoryId: aiCategory.id,
    },
    create: {
      title: "Emotion-Aware AI Voice Engine",
      slug: "emotion-aware-ai-voice-engine",
      summary: "STT, 감정 분석, LLM, TTS를 하나의 저지연 파이프라인으로 연결해 사용자의 감정 상태에 맞는 톤으로 응답하는 AI 음성 인터랙션 시스템.",
      description: `기존 음성 AI 시스템은 사용자의 감정 상태를 고려하지 않고, 항상 동일한 톤으로 응답합니다.

사용자가 화가 나거나 슬픈 상황에서도 AI는 중립적인 응답을 유지하며,
이로 인해 대화 경험이 단절되고 AI가 기계적으로 느껴지는 문제가 발생합니다.

특히 음성 기반 인터페이스에서는 감정이 중요한 요소임에도 불구하고,
대부분의 시스템이 텍스트 기반 처리에만 집중하고 있다는 한계를 가지고 있습니다.

---

기존 TTS 시스템은 텍스트만을 기반으로 동작하며,
음성 신호에서 감정을 추출하거나 반영하는 구조를 가지고 있지 않습니다.

또한 STT, 감정 분석, LLM, TTS를 개별적으로 연결할 경우
각 단계의 처리 지연이 누적되어 전체 응답 시간이 7~12초까지 증가하는 문제가 발생합니다.

이로 인해 실시간 대화 경험을 제공하기 어려운 구조적 한계를 가지고 있습니다.`,
      year: 2026,
      role: "AI 백엔드 개발",
      contribution: `오디오 신호와 텍스트를 결합한 감정 분석 모듈을 구현해,
멀티모달 기반으로 감정을 추출할 수 있도록 구성했습니다.

FastAPI WebSocket 서버를 사용해 음성 입력과 응답을 실시간으로 처리하고,
STT부터 TTS까지 이어지는 흐름을 하나의 연결된 세션으로 관리했습니다.

faster-whisper 기반 STT를 적용해 실시간 음성 인식을 처리하고,
감정 분석 결과를 LLM과 TTS에 전달해 응답 내용과 음성 톤을 함께 제어했습니다.`,
      keyLearnings: `감정 정보를 파이프라인 전반에 전달하는 구조를 설계하면서,
단순 텍스트 기반 응답보다 훨씬 자연스러운 음성 대화 경험을 구현할 수 있었습니다.

멀티모달 감정 분석을 통해 동일한 입력이라도 상황에 따라 다른 응답을 생성할 수 있게 되었고,
사용자와의 상호작용 품질을 개선할 수 있었습니다.

또한 STT, 감정 분석, LLM, TTS를 하나의 흐름으로 통합하면서
실시간 처리에서 지연을 줄이기 위한 파이프라인 설계의 중요성을 경험했습니다.`,
      workingApproach: `음성과 텍스트를 동시에 활용해 감정을 추출하고, 이를 응답 생성까지 연결하는 파이프라인을 설계했습니다.

오디오 신호에서는 피치, 에너지, 속도와 같은 특징을 추출해 감정 상태를 추정하고,
텍스트에서는 키워드 기반 감정 분석을 통해 보조 정보를 생성했습니다.

두 결과를 가중치 기반으로 통합해 최종 감정을 결정하고,
이를 LLM과 TTS에 전달해 응답의 내용과 음성 톤이 일관되도록 구성했습니다.

또한 전체 파이프라인을 하나의 흐름으로 연결해,
각 단계의 처리 지연이 누적되지 않도록 구조를 설계했습니다.

---

음성 입력 → STT → 감정 분석(오디오+텍스트 멀티모달) → 감정 통합
                                                         ↓
                              TTS(감정 톤 제어) ← LLM(감정 컨텍스트 반영)`,
      techStack: ["Python", "FastAPI", "WebSocket", "faster-whisper", "Ollama", "Claude API", "Next.js 14", "Tailwind CSS"],
      codeSnippets: [
        {
          title: "voice_ws — Real-time Pipeline",
          language: "python",
          code: `@ws_router.websocket("/ws/voice")
async def voice_ws(ws: WebSocket):
    await ws.accept()
    vad, stt, emotion, tts = _services()
    audio_buffer: List[np.ndarray] = []
    conversation_history: List[dict] = []

    async for raw in ws.iter_text():
        msg = json.loads(raw)
        t = msg.get("type")

        if t == "audio_chunk":
            chunk = np.frombuffer(
                base64.b64decode(msg["data"]), dtype=np.int16
            ).astype(np.float32) / 32768.0
            audio_buffer.append(chunk)
            await ws.send_json({"type": "vad_result", "is_speech": vad.is_speech(chunk)})

        elif t == "end_stream":
            full = np.concatenate(audio_buffer)

            # Stage 1: STT — transcribe with faster-whisper
            stt_result = await asyncio.to_thread(stt.transcribe, full, "ko", 16000)

            # Stage 2: Emotion — audio + text multimodal fusion
            emo = emotion.analyze(full, sr=16000, transcript=stt_result["transcript"])

            # Stage 3: LLM — emotion-conditioned response generation
            ai_text = await get_llm_response(stt_result["transcript"], emo, conversation_history)

            # Stage 4: TTS — prosody-adjusted synthesis
            out = tts.synthesize(text=ai_text, emotion_label=emo["emotion_label"])

            await ws.send_json({
                "type": "response",
                "transcript": stt_result["transcript"],
                "emotion": emo,
                "text": ai_text,
                "audio": out,
            })
            audio_buffer.clear()`,
          explanation: "WebSocket 한 세션에서 STT → 감정 분석 → LLM → TTS 파이프라인을 순차 실행합니다. 오디오 청크를 실시간으로 버퍼링하다가 end_stream 신호에 전체 파이프라인을 실행하고 응답을 반환합니다.",
        },
        {
          title: "EmotionService — MFCC + Text Fusion",
          language: "python",
          code: `class EmotionService:
    def __init__(self):
        self.classifier = EmotionClassifier()
        self._audio_w = settings.EMOTION_AUDIO_WEIGHT  # 0.6
        self._text_w  = settings.EMOTION_TEXT_WEIGHT   # 0.4

    def extract_audio_features(self, audio: np.ndarray, sr: int = 16000) -> dict:
        frames    = _frames(audio)
        f0        = _f0_autocorr(audio, sr)      # 피치: 자기상관 기반
        rms       = _rms(frames).mean()
        zcr       = _zcr(frames).mean()
        mfccs     = _mfcc(audio, sr, n_mfcc=13)  # mel-filterbank + DCT
        spk_rate  = _speaking_rate(audio, sr)
        return {
            "f0_mean": f0, "rms": rms, "zcr": zcr,
            "mfcc_mean": mfccs.mean(axis=1).tolist(),
            "speaking_rate": spk_rate,
        }

    def fuse(self, audio_result: dict, text_result: dict | None = None) -> dict:
        p_audio = np.array(audio_result["probabilities"])
        if text_result:
            p_text = np.array(text_result["probabilities"])
            fused  = self._audio_w * p_audio + self._text_w * p_text
        else:
            fused = p_audio
        fused /= fused.sum()
        label = EMOTION_LABELS[fused.argmax()]
        return {"emotion_label": label, "probabilities": fused.tolist()}

    def analyze(self, audio: np.ndarray, sr: int = 16000, transcript: str | None = None) -> dict:
        features     = self.extract_audio_features(audio, sr)
        audio_result = self.classifier.predict_from_features(features)
        text_result  = self.classifier.predict_from_text(transcript) if transcript else None
        return self.fuse(audio_result, text_result)`,
          explanation: "오디오에서 MFCC·피치·RMS·ZCR를 추출하고, 텍스트 키워드 감정 분석 결과와 가중치 기반(오디오 0.6 / 텍스트 0.4)으로 융합해 최종 감정 레이블을 결정합니다.",
        },
      ],
            thumbnailUrl: "/images/projects/emotion-hero.png",
      heroImageUrl: "/images/projects/emotion-hero.png",
      isFeatured: true,
      featuredOrder: 4,
      isPublished: true,
      categoryId: aiCategory.id,
    },
  });

  await prisma.projectLink.deleteMany({ where: { projectId: emotionAI.id } });
  await prisma.projectLink.create({
    data: { projectId: emotionAI.id, type: "GITHUB", label: "GitHub", url: "https://github.com/devbinlog/Emotion-Aware-AI-Voice-Engine", order: 1 },
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
      featuredOrder: 5,
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
      featuredOrder: 5,
      isPublished: true,
      categoryId: musicCategory.id,
    },
  });

  await prisma.projectLink.deleteMany({ where: { projectId: muse.id } });
  await prisma.projectLink.create({
    data: { projectId: muse.id, type: "GITHUB", label: "GitHub", url: "https://github.com/devbinlog/MUSE-Motion-based-User-Sound-Engine-", order: 1 },
  });

  // ── 6. TrackHub ──────────────────────────────────────────────────────────────
  const trackhub = await prisma.project.upsert({
    where: { slug: "trackhub" },
    update: {
      title: "TrackHub",
      summary: `음악 프로덕션 협업을 위한 오디오 버전 관리 플랫폼. Git의 이머터블 버전 관리 개념을 오디오 파일에 적용해
작곡가, 프로듀서, 엔지니어가 하나의 워크스페이스에서 안전하게 협업할 수 있습니다.`,
      description: `음악 프로덕션 팀은 KakaoTalk, 이메일, Discord에 파일이 흩어져 있어 어떤 WAV가 최신본인지 파악하기 어렵고,
대용량 파일 전송과 버전 충돌로 협업 과정이 비효율적입니다.

저작권 보호와 보안 취약점, 피드백 이력 관리 부재, 작업 과정 추적 불가 등의 문제가
실제 음악 작업 현장에서 반복적으로 발생하고 있습니다.

---

TrackHub은 이러한 문제를 해결하기 위해 설계된 음악 프로덕션 전용 버전 관리 및 협업 플랫폼입니다.

Workspace → Project → Track → Version의 계층 구조로 작업물을 체계적으로 관리하며,
한 번 업로드된 파일은 덮어쓰이지 않고 새로운 버전으로 불변 저장됩니다.

브라우저 내 스트리밍 재생과 파형 시각화로 다운로드 없이 오디오를 미리 들을 수 있고,
타임스탬프 기반 피드백으로 특정 구간에 정확하게 코멘트를 남길 수 있습니다.

Owner, Admin, Editor, Viewer의 4단계 역할 기반 접근 제어(RBAC)와
Supabase RLS(Row-Level Security)를 통해 데이터베이스 레벨에서 권한을 보장합니다.`,
      year: 2025,
      role: "풀스택 개발",
      contribution: `Workspace → Project → Track → Version의 4단계 계층 구조를 설계하고,
Supabase PostgreSQL과 RLS 기반의 역할 권한 모델(Owner / Admin / Editor / Viewer)을 구현했습니다.

Supabase Storage의 비공개 버킷과 Signed URL을 활용해 보안 파일 저장 구조를 설계하고,
스토리지 경로를 /workspaces/{id}/projects/{id}/tracks/{id}/versions/{id}/{fileName} 형태로 정규화했습니다.

wavesurfer.js를 활용한 브라우저 내 오디오 스트리밍 재생과 파형 시각화를 구현하고,
타임스탬프 기반 피드백 시스템으로 특정 구간에 코멘트를 남길 수 있도록 설계했습니다.

Supabase Realtime을 통한 실시간 구독과 전체 활동 감사 로그
(업로드, 다운로드, 초대, 버전 생성, 코멘트, 권한 변경)를 구현해 작업 이력을 완전하게 추적했습니다.`,
      keyLearnings: `Git의 이머터블 버전 관리 개념을 오디오 파일에 적용하면서,
음악 협업에 특화된 UX가 단순한 파일 공유 도구와 어떻게 다른지 명확하게 이해할 수 있었습니다.

Supabase Storage와 RLS를 결합해 역할 기반 접근 제어를 구현하는 과정에서,
데이터베이스 수준의 보안 정책이 애플리케이션 로직보다 더 신뢰할 수 있는 보안 레이어임을 확인했습니다.

wavesurfer.js로 브라우저 내 오디오 재생을 구현하면서,
대용량 오디오 파일을 스트리밍 방식으로 처리하는 것이 전통적인 다운로드 방식보다
협업 환경에서 훨씬 효율적임을 직접 경험했습니다.`,
      workingApproach: `TrackHub은 음악 협업 과정의 고통 지점(버전 혼란, 보안 취약, 피드백 부재)을
구조적으로 해결하는 방식으로 설계했습니다.

데이터 모델을 먼저 정의하고 계층 구조를 확정한 뒤 구현에 진입했으며,
RLS 정책은 애플리케이션 코드와 별개로 데이터베이스 레벨에서 동작하도록 설계해
보안을 코드 바깥에서 보장했습니다.

---

[인증] Supabase Auth → JWT 기반 세션 관리
         |
         v
[워크스페이스 계층]
  Workspace → Project → Track → Version
         |
         v
[스토리지 & 보안]
  Supabase Storage (비공개 버킷) + Signed URL
  RLS 권한 정책 (Owner / Admin / Editor / Viewer)
  경로: /workspaces/{id}/projects/{id}/tracks/{id}/versions/{id}/{file}
         |
         v
[오디오 재생]
  wavesurfer.js → 브라우저 내 스트리밍 + 파형 시각화
  타임스탬프 피드백 → 특정 구간 코멘트
         |
         v
[실시간 & 감사]
  Supabase Realtime → 실시간 구독
  Activity Logs → 업로드·다운로드·초대·버전 생성·코멘트·권한 변경 이력 추적`,
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Zustand", "TanStack Query", "wavesurfer.js", "Supabase"],
      codeSnippets: [
        {
          title: "RLS Policy — Track Access Control",
          language: "sql",
          code: `-- 트랙 조회: 워크스페이스 멤버만 접근 가능
CREATE POLICY "track_select_policy" ON tracks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      WHERE p.id = tracks.project_id
        AND wm.user_id = auth.uid()
    )
  );

-- 트랙 생성: Editor 이상 권한만 허용
CREATE POLICY "track_insert_policy" ON tracks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      WHERE p.id = tracks.project_id
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'admin', 'editor')
    )
  );

-- 버전 삭제: Owner / Admin만 허용
CREATE POLICY "version_delete_policy" ON track_versions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      JOIN tracks t ON t.project_id = p.id
      WHERE t.id = track_versions.track_id
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'admin')
    )
  );`,
          explanation: "RLS 정책을 데이터베이스 레벨에서 정의해 애플리케이션 코드와 독립적으로 보안을 보장합니다. 워크스페이스 멤버십과 역할(Owner/Admin/Editor/Viewer)을 기반으로 트랙 조회·생성·삭제 권한을 제어합니다.",
        },
        {
          title: "getSignedAudioUrl — Secure Streaming",
          language: "typescript",
          code: `export async function getSignedAudioUrl(
  storagePath: string,
  expiresIn = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from('audio-files')
    .createSignedUrl(storagePath, expiresIn);

  if (error) throw new Error(\`Signed URL 생성 실패: \${error.message}\`);
  return data.signedUrl;
}

// wavesurfer.js 파형 시각화 + 스트리밍 재생 훅
export function useAudioPlayer(storagePath: string) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    getSignedAudioUrl(storagePath).then((signedUrl) => {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current!,
        waveColor: '#6366f1',
        progressColor: '#4f46e5',
        url: signedUrl,
      });
      wavesurferRef.current.on('ready', () => setIsReady(true));
    });

    return () => wavesurferRef.current?.destroy();
  }, [storagePath]);

  return { waveformRef, wavesurfer: wavesurferRef.current, isReady };
}`,
          explanation: "비공개 버킷의 오디오 파일을 Signed URL(1시간 만료)로 안전하게 스트리밍합니다. wavesurfer.js가 해당 URL로 직접 파형 시각화와 스트리밍 재생을 처리해 파일 다운로드 없이 브라우저에서 오디오를 미리 들을 수 있습니다.",
        },
      ],
      thumbnailUrl: "/images/projects/trackhub-hero.png",
      heroImageUrl: "/images/projects/trackhub-hero.png",
      isFeatured: true,
      featuredOrder: 6,
      isPublished: true,
      categoryId: musicCategory.id,
      secondaryCategoryId: null,
    },
    create: {
      title: "TrackHub",
      slug: "trackhub",
      summary: `음악 프로덕션 협업을 위한 오디오 버전 관리 플랫폼. Git의 이머터블 버전 관리 개념을 오디오 파일에 적용해
작곡가, 프로듀서, 엔지니어가 하나의 워크스페이스에서 안전하게 협업할 수 있습니다.`,
      description: `음악 프로덕션 팀은 KakaoTalk, 이메일, Discord에 파일이 흩어져 있어 어떤 WAV가 최신본인지 파악하기 어렵고,
대용량 파일 전송과 버전 충돌로 협업 과정이 비효율적입니다.

저작권 보호와 보안 취약점, 피드백 이력 관리 부재, 작업 과정 추적 불가 등의 문제가
실제 음악 작업 현장에서 반복적으로 발생하고 있습니다.

---

TrackHub은 이러한 문제를 해결하기 위해 설계된 음악 프로덕션 전용 버전 관리 및 협업 플랫폼입니다.

Workspace → Project → Track → Version의 계층 구조로 작업물을 체계적으로 관리하며,
한 번 업로드된 파일은 덮어쓰이지 않고 새로운 버전으로 불변 저장됩니다.

브라우저 내 스트리밍 재생과 파형 시각화로 다운로드 없이 오디오를 미리 들을 수 있고,
타임스탬프 기반 피드백으로 특정 구간에 정확하게 코멘트를 남길 수 있습니다.

Owner, Admin, Editor, Viewer의 4단계 역할 기반 접근 제어(RBAC)와
Supabase RLS(Row-Level Security)를 통해 데이터베이스 레벨에서 권한을 보장합니다.`,
      year: 2025,
      role: "풀스택 개발",
      contribution: `Workspace → Project → Track → Version의 4단계 계층 구조를 설계하고,
Supabase PostgreSQL과 RLS 기반의 역할 권한 모델(Owner / Admin / Editor / Viewer)을 구현했습니다.

Supabase Storage의 비공개 버킷과 Signed URL을 활용해 보안 파일 저장 구조를 설계하고,
스토리지 경로를 /workspaces/{id}/projects/{id}/tracks/{id}/versions/{id}/{fileName} 형태로 정규화했습니다.

wavesurfer.js를 활용한 브라우저 내 오디오 스트리밍 재생과 파형 시각화를 구현하고,
타임스탬프 기반 피드백 시스템으로 특정 구간에 코멘트를 남길 수 있도록 설계했습니다.

Supabase Realtime을 통한 실시간 구독과 전체 활동 감사 로그
(업로드, 다운로드, 초대, 버전 생성, 코멘트, 권한 변경)를 구현해 작업 이력을 완전하게 추적했습니다.`,
      keyLearnings: `Git의 이머터블 버전 관리 개념을 오디오 파일에 적용하면서,
음악 협업에 특화된 UX가 단순한 파일 공유 도구와 어떻게 다른지 명확하게 이해할 수 있었습니다.

Supabase Storage와 RLS를 결합해 역할 기반 접근 제어를 구현하는 과정에서,
데이터베이스 수준의 보안 정책이 애플리케이션 로직보다 더 신뢰할 수 있는 보안 레이어임을 확인했습니다.

wavesurfer.js로 브라우저 내 오디오 재생을 구현하면서,
대용량 오디오 파일을 스트리밍 방식으로 처리하는 것이 전통적인 다운로드 방식보다
협업 환경에서 훨씬 효율적임을 직접 경험했습니다.`,
      workingApproach: `TrackHub은 음악 협업 과정의 고통 지점(버전 혼란, 보안 취약, 피드백 부재)을
구조적으로 해결하는 방식으로 설계했습니다.

데이터 모델을 먼저 정의하고 계층 구조를 확정한 뒤 구현에 진입했으며,
RLS 정책은 애플리케이션 코드와 별개로 데이터베이스 레벨에서 동작하도록 설계해
보안을 코드 바깥에서 보장했습니다.

---

[인증] Supabase Auth → JWT 기반 세션 관리
         |
         v
[워크스페이스 계층]
  Workspace → Project → Track → Version
         |
         v
[스토리지 & 보안]
  Supabase Storage (비공개 버킷) + Signed URL
  RLS 권한 정책 (Owner / Admin / Editor / Viewer)
  경로: /workspaces/{id}/projects/{id}/tracks/{id}/versions/{id}/{file}
         |
         v
[오디오 재생]
  wavesurfer.js → 브라우저 내 스트리밍 + 파형 시각화
  타임스탬프 피드백 → 특정 구간 코멘트
         |
         v
[실시간 & 감사]
  Supabase Realtime → 실시간 구독
  Activity Logs → 업로드·다운로드·초대·버전 생성·코멘트·권한 변경 이력 추적`,
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Zustand", "TanStack Query", "wavesurfer.js", "Supabase"],
      codeSnippets: [
        {
          title: "RLS Policy — Track Access Control",
          language: "sql",
          code: `-- 트랙 조회: 워크스페이스 멤버만 접근 가능
CREATE POLICY "track_select_policy" ON tracks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      WHERE p.id = tracks.project_id
        AND wm.user_id = auth.uid()
    )
  );

-- 트랙 생성: Editor 이상 권한만 허용
CREATE POLICY "track_insert_policy" ON tracks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      WHERE p.id = tracks.project_id
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'admin', 'editor')
    )
  );

-- 버전 삭제: Owner / Admin만 허용
CREATE POLICY "version_delete_policy" ON track_versions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      JOIN projects p ON p.workspace_id = wm.workspace_id
      JOIN tracks t ON t.project_id = p.id
      WHERE t.id = track_versions.track_id
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'admin')
    )
  );`,
          explanation: "RLS 정책을 데이터베이스 레벨에서 정의해 애플리케이션 코드와 독립적으로 보안을 보장합니다. 워크스페이스 멤버십과 역할(Owner/Admin/Editor/Viewer)을 기반으로 트랙 조회·생성·삭제 권한을 제어합니다.",
        },
        {
          title: "getSignedAudioUrl — Secure Streaming",
          language: "typescript",
          code: `export async function getSignedAudioUrl(
  storagePath: string,
  expiresIn = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from('audio-files')
    .createSignedUrl(storagePath, expiresIn);

  if (error) throw new Error(\`Signed URL 생성 실패: \${error.message}\`);
  return data.signedUrl;
}

// wavesurfer.js 파형 시각화 + 스트리밍 재생 훅
export function useAudioPlayer(storagePath: string) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    getSignedAudioUrl(storagePath).then((signedUrl) => {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current!,
        waveColor: '#6366f1',
        progressColor: '#4f46e5',
        url: signedUrl,
      });
      wavesurferRef.current.on('ready', () => setIsReady(true));
    });

    return () => wavesurferRef.current?.destroy();
  }, [storagePath]);

  return { waveformRef, wavesurfer: wavesurferRef.current, isReady };
}`,
          explanation: "비공개 버킷의 오디오 파일을 Signed URL(1시간 만료)로 안전하게 스트리밍합니다. wavesurfer.js가 해당 URL로 직접 파형 시각화와 스트리밍 재생을 처리해 파일 다운로드 없이 브라우저에서 오디오를 미리 들을 수 있습니다.",
        },
      ],
      thumbnailUrl: "/images/projects/trackhub-hero.png",
      heroImageUrl: "/images/projects/trackhub-hero.png",
      isFeatured: true,
      featuredOrder: 6,
      isPublished: true,
      categoryId: musicCategory.id,
    },
  });

  await prisma.projectLink.deleteMany({ where: { projectId: trackhub.id } });
  await prisma.projectLink.create({
    data: { projectId: trackhub.id, type: "GITHUB", label: "GitHub", url: "https://github.com/devbinlog/TrackHub", order: 1 },
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
