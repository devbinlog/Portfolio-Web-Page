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
  const tags = await Promise.all(
    tagDefs.map((t) =>
      prisma.tag.upsert({ where: { slug: t.slug }, update: {}, create: t })
    )
  );
  const tagMap = Object.fromEntries(tags.map((t) => [t.slug, t]));

  // ── 프로필 ────────────────────────────────────────────────────────────────
  await prisma.profile.upsert({
    where: { id: "default" },
    update: {
      name: "Taebin Kim",
      roleTitle: "AI / LLM Engineer & Frontend Developer",
      tagline: "Designing systems that transform unstructured input into structured user experiences.",
      bio: `AI를 단순히 개발을 대신하는 도구가 아니라, 함께 문제를 해결하는 파트너로 활용합니다.

작업을 하나의 흐름으로 처리하기보다 역할 단위로 나누고, 각 역할을 에이전트로 분리하여
구조적으로 설계한 뒤 작업을 진행합니다.

프로젝트마다 필요한 역할을 정의하고, 에이전트 단위로 세분화하여 각 영역을 독립적으로
구현하고 연결합니다.

이 방식은 개인이 수행할 수 있는 작업이라도 효율성과 시간, 비용을 줄이면서
동시에 결과의 완성도를 높이기 위해 사용하고 있습니다.

이 구조를 기반으로 다양한 시스템을 빠르게 설계하고 실제로 동작하는 결과까지 구현하는
개발 방식을 유지하고 있습니다.`,
      workingMethod: `문제를 기능 단위가 아닌 구조적으로 분해합니다.
구현 전에 문서와 아키텍처를 정의합니다.
데이터 구조와 사용자 경험을 함께 설계합니다.
배포, 유지보수, 운영을 처음부터 고려합니다.`,
      location: "Seoul, Korea",
    },
    create: {
      id: "default",
      name: "Taebin Kim",
      roleTitle: "AI / LLM Engineer & Frontend Developer",
      tagline: "Designing systems that transform unstructured input into structured user experiences.",
      bio: `AI를 단순히 개발을 대신하는 도구가 아니라, 함께 문제를 해결하는 파트너로 활용합니다.

작업을 하나의 흐름으로 처리하기보다 역할 단위로 나누고, 각 역할을 에이전트로 분리하여
구조적으로 설계한 뒤 작업을 진행합니다.

프로젝트마다 필요한 역할을 정의하고, 에이전트 단위로 세분화하여 각 영역을 독립적으로
구현하고 연결합니다.

이 방식은 개인이 수행할 수 있는 작업이라도 효율성과 시간, 비용을 줄이면서
동시에 결과의 완성도를 높이기 위해 사용하고 있습니다.

이 구조를 기반으로 다양한 시스템을 빠르게 설계하고 실제로 동작하는 결과까지 구현하는
개발 방식을 유지하고 있습니다.`,
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
      summary: `자연어로 입력한 음악 아이디어를 LLM으로 분석하고, 감정·장르·사운드·비주얼 방향을 구조화하는 음악 디렉션 엔진.
추상적인 음악 감각을 MusicProfile로 변환해 실제 제작 가능한 방향으로 연결합니다.`,
      description: `음악 아이디어는 대부분 "비 오는 밤에 혼자 듣는 감성적인 기타 음악"처럼 감정적이고 추상적인 언어로 시작됩니다.
하지만 작곡, 사운드 디자인, 앨범 커버, 공연 비주얼로 이어지기 위해서는 감정과 분위기를 장르, 템포, 악기, 사운드 톤, 시각 무드 같은 구체적인 요소로 변환해야 합니다.

기존 도구는 음악 추천이나 이미지 생성에 집중되어 있어, 사용자의 막연한 음악 아이디어를 제작 가능한 구조로 정리해주는 과정이 부족합니다.

---

일반적인 AI 도구는 사용자의 문장을 자연어로 답변하는 데 그치기 쉽습니다.
예를 들어 "몽환적이고 살짝 슬픈 우주 느낌의 음악"이라는 입력에 대해 단순 설명은 가능하지만, 이를 실제 제작에 필요한 데이터 구조로 변환하지는 못합니다.

또한 음악 방향, 사운드 구성, 비주얼 무드가 각각 분리되어 있어 하나의 아이디어가 앨범 커버, 공연 무드, 콘텐츠 기획까지 이어지기 어렵습니다.`,
      year: 2025,
      role: "AI 백엔드 개발, 풀스택",
      contribution: `LLM을 단순 텍스트 생성기가 아니라 음악 아이디어를 구조화하는 엔진으로 사용했습니다.
사용자의 추상적인 입력을 MusicProfile JSON으로 강제 변환하고, 이 구조를 기반으로 음악 방향, 사운드 구성, 비주얼 무드, 콘텐츠 활용 방향을 생성하도록 설계했습니다.

또한 API 키가 없는 환경에서도 서비스 흐름을 확인할 수 있도록 Mock Mode를 분리했습니다.
GitHub Pages에서는 정적 데모로 동작하고, 실제 LLM 실행은 Vercel API Route 또는 서버 환경에서 처리할 수 있도록 구조를 나누었습니다.`,
      keyLearnings: `MDE를 통해 사용자의 추상적인 음악 아이디어를 감정, 장르, 템포감, 악기 구성, 사운드 톤, 비주얼 무드로 분해하는 구조를 설계했습니다.

또한 MusicProfile이라는 중간 표현을 두면 음악 방향, 사운드 구성, 앨범 커버 목업, 콘텐츠 기획을 하나의 데이터 구조에서 확장할 수 있습니다.
이미지 생성은 핵심 기능이 아니라 visual_association을 기반으로 콘셉트를 빠르게 확인하기 위한 보조 목업 단계로 분리했습니다.`,
      workingApproach: `MDE는 사용자의 자연어 입력을 LLM으로 분석해 MusicProfile이라는 구조화된 JSON으로 변환합니다.
MusicProfile은 감정, 에너지, 템포감, 장르, 악기 구성, 사운드 방향, 분위기, 비주얼 연상, 청취 맥락, 콘텐츠 목표를 포함합니다.

이를 기반으로 사용자는 다음 결과를 얻을 수 있습니다.

음악 방향 설명
사운드 구성 제안
앨범 커버 또는 콘텐츠 비주얼 무드
실제 제작에 활용 가능한 구조화 데이터

---

User Input
 └── Text: "비 오는 밤에 혼자 듣는 감성적인 기타 음악 느낌"
          |
          v
 [LLM Structuring Layer]
 Input → MusicProfile (JSON)

 {
   emotion: ["melancholic", "lonely", "nostalgic"],
   energy: "low",
   tempo_feel: "slow",
   genre: ["indie rock", "ambient"],
   instrumentation: ["clean guitar", "reverb pad", "soft kick"],
   sound_direction: ["heavy reverb", "wide ambient texture"],
   atmosphere: ["rainy night", "empty street"],
   visual_association: ["blue neon", "wet road reflection"],
   listener_context: "alone at night",
   content_goal: "album cover direction"
 }
          |
          v
 [Direction Generator]
 ├── Music Direction
 ├── Sound Arrangement
 ├── Visual Mood
 └── Content Usage
          |
          v
 [Optional Visual Mockup]
 visual_association → album cover mood prompt
          |
          v
 Result UI`,
      techStack: ["Python", "FastAPI", "Next.js", "TypeScript", "SQLAlchemy", "Stable Diffusion", "ComfyUI", "PostgreSQL"],
      isFeatured: true,
      featuredOrder: 3,
      isPublished: true,
      categoryId: designCategory.id,
      secondaryCategoryId: aiCategory.id,
    },
    create: {
      title: "MDE",
      slug: "mde",
      summary: `자연어로 입력한 음악 아이디어를 LLM으로 분석하고, 감정·장르·사운드·비주얼 방향을 구조화하는 음악 디렉션 엔진.
추상적인 음악 감각을 MusicProfile로 변환해 실제 제작 가능한 방향으로 연결합니다.`,
      description: `음악 아이디어는 대부분 "비 오는 밤에 혼자 듣는 감성적인 기타 음악"처럼 감정적이고 추상적인 언어로 시작됩니다.
하지만 작곡, 사운드 디자인, 앨범 커버, 공연 비주얼로 이어지기 위해서는 감정과 분위기를 장르, 템포, 악기, 사운드 톤, 시각 무드 같은 구체적인 요소로 변환해야 합니다.

기존 도구는 음악 추천이나 이미지 생성에 집중되어 있어, 사용자의 막연한 음악 아이디어를 제작 가능한 구조로 정리해주는 과정이 부족합니다.

---

일반적인 AI 도구는 사용자의 문장을 자연어로 답변하는 데 그치기 쉽습니다.
예를 들어 "몽환적이고 살짝 슬픈 우주 느낌의 음악"이라는 입력에 대해 단순 설명은 가능하지만, 이를 실제 제작에 필요한 데이터 구조로 변환하지는 못합니다.

또한 음악 방향, 사운드 구성, 비주얼 무드가 각각 분리되어 있어 하나의 아이디어가 앨범 커버, 공연 무드, 콘텐츠 기획까지 이어지기 어렵습니다.`,
      year: 2025,
      role: "AI 백엔드 개발, 풀스택",
      contribution: `LLM을 단순 텍스트 생성기가 아니라 음악 아이디어를 구조화하는 엔진으로 사용했습니다.
사용자의 추상적인 입력을 MusicProfile JSON으로 강제 변환하고, 이 구조를 기반으로 음악 방향, 사운드 구성, 비주얼 무드, 콘텐츠 활용 방향을 생성하도록 설계했습니다.

또한 API 키가 없는 환경에서도 서비스 흐름을 확인할 수 있도록 Mock Mode를 분리했습니다.
GitHub Pages에서는 정적 데모로 동작하고, 실제 LLM 실행은 Vercel API Route 또는 서버 환경에서 처리할 수 있도록 구조를 나누었습니다.`,
      keyLearnings: `MDE를 통해 사용자의 추상적인 음악 아이디어를 감정, 장르, 템포감, 악기 구성, 사운드 톤, 비주얼 무드로 분해하는 구조를 설계했습니다.

또한 MusicProfile이라는 중간 표현을 두면 음악 방향, 사운드 구성, 앨범 커버 목업, 콘텐츠 기획을 하나의 데이터 구조에서 확장할 수 있습니다.
이미지 생성은 핵심 기능이 아니라 visual_association을 기반으로 콘셉트를 빠르게 확인하기 위한 보조 목업 단계로 분리했습니다.`,
      workingApproach: `MDE는 사용자의 자연어 입력을 LLM으로 분석해 MusicProfile이라는 구조화된 JSON으로 변환합니다.
MusicProfile은 감정, 에너지, 템포감, 장르, 악기 구성, 사운드 방향, 분위기, 비주얼 연상, 청취 맥락, 콘텐츠 목표를 포함합니다.

이를 기반으로 사용자는 다음 결과를 얻을 수 있습니다.

음악 방향 설명
사운드 구성 제안
앨범 커버 또는 콘텐츠 비주얼 무드
실제 제작에 활용 가능한 구조화 데이터

---

User Input
 └── Text: "비 오는 밤에 혼자 듣는 감성적인 기타 음악 느낌"
          |
          v
 [LLM Structuring Layer]
 Input → MusicProfile (JSON)

 {
   emotion: ["melancholic", "lonely", "nostalgic"],
   energy: "low",
   tempo_feel: "slow",
   genre: ["indie rock", "ambient"],
   instrumentation: ["clean guitar", "reverb pad", "soft kick"],
   sound_direction: ["heavy reverb", "wide ambient texture"],
   atmosphere: ["rainy night", "empty street"],
   visual_association: ["blue neon", "wet road reflection"],
   listener_context: "alone at night",
   content_goal: "album cover direction"
 }
          |
          v
 [Direction Generator]
 ├── Music Direction
 ├── Sound Arrangement
 ├── Visual Mood
 └── Content Usage
          |
          v
 [Optional Visual Mockup]
 visual_association → album cover mood prompt
          |
          v
 Result UI`,
      techStack: ["Python", "FastAPI", "Next.js", "TypeScript", "SQLAlchemy", "Stable Diffusion", "ComfyUI", "PostgreSQL"],
      isFeatured: true,
      featuredOrder: 3,
      isPublished: true,
      categoryId: designCategory.id,
      secondaryCategoryId: aiCategory.id,
    },
  });

  await prisma.projectLink.deleteMany({ where: { projectId: mde.id } });
  await prisma.projectLink.create({
    data: { projectId: mde.id, type: "GITHUB", label: "GitHub", url: "https://github.com/devbinlog/FMD", order: 1 },
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

  // ── 6. DesignFlow AI Builder ───────────────────────────────────────────────
  const designflow = await prisma.project.upsert({
    where: { slug: "designflow-ai-builder" },
    update: {
      title: "DesignFlow AI Builder",
      summary: `Figma 디자인 구조를 분석해 컴포넌트를 식별하고, React + Tailwind 코드로 자동 변환하는 AI 기반 코드 생성 시스템.
디자인 토큰 추출부터 LLM 기반 구조 해석, 코드 생성까지 하나의 파이프라인으로 연결했습니다.`,
      description: `Figma로 완성된 디자인을 코드로 옮기는 과정에서, 개발자는 어떤 요소가 컴포넌트인지를 직접 판단해야 합니다.

동일한 디자인이라도 개발자마다 컴포넌트 경계를 다르게 해석하고,
색상·폰트·간격 같은 디자인 토큰을 코드 변수로 변환하는 작업도 매번 수동으로 이루어집니다.

Figma는 CSS 수치를 제공하지만 실제 React 컴포넌트 구조는 제공하지 않아,
디자인-개발 사이의 간격을 메우는 과정에 반복적인 수작업이 발생합니다.

---

기존 디자인-to-코드 도구들은 마크업 수준의 CSS 변환에 그치며,
컴포넌트 단위의 구조나 재사용 가능한 설계를 자동으로 추론하지 못합니다.

또한 색상, 타이포그래피, 간격이 각각 분리된 형태로 존재해
하나의 디자인 시스템으로 통합하고 Tailwind 클래스로 매핑하는 과정이 체계화되어 있지 않습니다.

Figma 노드 트리 분석, 토큰 추출, 컴포넌트 식별, 코드 생성이 각각 분리되어 있어
이를 하나의 자동화된 흐름으로 연결하는 시스템이 부족합니다.`,
      year: 2026,
      role: "AI 백엔드 개발, 풀스택",
      contribution: `Figma 노드 트리를 재귀 순회해 레이아웃 의도와 반복 패턴을 추론하는 구조 분석 로직을 구현했습니다.

색상·타이포그래피·간격·반경 값을 사용 빈도 기준으로 정규화하고,
px 값을 Tailwind 유틸리티 클래스로 변환하는 토큰 매핑 로직을 외부 라이브러리 없이 직접 구현했습니다.

LLM을 3단계(구조 분석 → 컴포넌트 명명 → 코드 생성)로 분리해 호출하고,
각 단계는 전체 Figma JSON이 아닌 해당 단계에 필요한 데이터만 전달받도록 설계했습니다.

분석 실행을 백그라운드 태스크로 처리하고 클라이언트에서 폴링하는 구조를 적용해
응답 대기 중에도 UI가 블로킹되지 않도록 구성했습니다.`,
      keyLearnings: `Figma 노드 구조를 컴포넌트 단위로 해석하는 과정에서,
LLM을 단순 코드 생성기가 아니라 디자인 의도를 추론하는 해석 엔진으로 활용할 수 있음을 확인했습니다.

각 LLM 호출 단계에 전체 JSON이 아닌 필요한 데이터만 전달하는 방식이
응답 품질과 파싱 안정성을 함께 높이는 데 효과적이었습니다.

또한 Auto Layout, Component Sets, Variants 같은 고급 Figma 기능은
단순 노드 트리 분석으로 완전히 처리하기 어렵다는 한계를 확인했고,
이를 처리하기 위해서는 Figma 플러그인 API 수준의 접근이 필요하다는 점을 파악했습니다.`,
      workingApproach: `DesignFlow는 Figma JSON을 입력으로 받아 React + Tailwind 코드를 출력하는 과정을
파싱 → 정규화 → 토큰 추출 → AI 해석 → 코드 생성의 4단계 파이프라인으로 설계했습니다.

Figma 노드 트리를 재귀 순회해 레이아웃 의도와 반복 패턴을 추론하고,
색상·타이포그래피·간격·반경 값을 사용 빈도 기준으로 정규화해 Tailwind 유틸리티 클래스로 매핑했습니다.

LLM(Ollama 또는 Claude)을 3단계로 분리해 호출하도록 설계해,
각 단계에 필요한 최소한의 데이터만 전달함으로써 응답 품질과 처리 효율을 함께 확보했습니다.

---

Figma JSON Input
      |
      v
[figma_parser.py] → 노드 트리 파싱
      |
      v
[normalizer.py] → 노드 계층 정규화
      |
      v
[token_extractor.py] → 디자인 토큰 추출
 ├── colors     → Tailwind bg-[#hex]
 ├── typography → text-sm font-bold
 ├── spacing    → p-4 gap-6
 └── radius     → rounded-lg
      |
      v
[Claude / Ollama — 3단계 AI 파이프라인]
 ├── analyze_structure() → componentCandidates + layoutPattern
 ├── name_components()   → suggestedName + filePath
 └── generate_code()     → React + Tailwind TSX
      |
      v
Output Files
 ├── components/HeroSection.tsx
 ├── components/Header.tsx
 └── app/page.tsx`,
      techStack: ["Next.js 15", "TypeScript", "Tailwind CSS v4", "Python", "FastAPI", "Ollama", "Claude API", "PostgreSQL"],
      isFeatured: true,
      featuredOrder: 6,
      isPublished: true,
      categoryId: designCategory.id,
      secondaryCategoryId: aiCategory.id,
    },
    create: {
      title: "DesignFlow AI Builder",
      slug: "designflow-ai-builder",
      summary: `Figma 디자인 구조를 분석해 컴포넌트를 식별하고, React + Tailwind 코드로 자동 변환하는 AI 기반 코드 생성 시스템.
디자인 토큰 추출부터 LLM 기반 구조 해석, 코드 생성까지 하나의 파이프라인으로 연결했습니다.`,
      description: `Figma로 완성된 디자인을 코드로 옮기는 과정에서, 개발자는 어떤 요소가 컴포넌트인지를 직접 판단해야 합니다.

동일한 디자인이라도 개발자마다 컴포넌트 경계를 다르게 해석하고,
색상·폰트·간격 같은 디자인 토큰을 코드 변수로 변환하는 작업도 매번 수동으로 이루어집니다.

Figma는 CSS 수치를 제공하지만 실제 React 컴포넌트 구조는 제공하지 않아,
디자인-개발 사이의 간격을 메우는 과정에 반복적인 수작업이 발생합니다.

---

기존 디자인-to-코드 도구들은 마크업 수준의 CSS 변환에 그치며,
컴포넌트 단위의 구조나 재사용 가능한 설계를 자동으로 추론하지 못합니다.

또한 색상, 타이포그래피, 간격이 각각 분리된 형태로 존재해
하나의 디자인 시스템으로 통합하고 Tailwind 클래스로 매핑하는 과정이 체계화되어 있지 않습니다.

Figma 노드 트리 분석, 토큰 추출, 컴포넌트 식별, 코드 생성이 각각 분리되어 있어
이를 하나의 자동화된 흐름으로 연결하는 시스템이 부족합니다.`,
      year: 2026,
      role: "AI 백엔드 개발, 풀스택",
      contribution: `Figma 노드 트리를 재귀 순회해 레이아웃 의도와 반복 패턴을 추론하는 구조 분석 로직을 구현했습니다.

색상·타이포그래피·간격·반경 값을 사용 빈도 기준으로 정규화하고,
px 값을 Tailwind 유틸리티 클래스로 변환하는 토큰 매핑 로직을 외부 라이브러리 없이 직접 구현했습니다.

LLM을 3단계(구조 분석 → 컴포넌트 명명 → 코드 생성)로 분리해 호출하고,
각 단계는 전체 Figma JSON이 아닌 해당 단계에 필요한 데이터만 전달받도록 설계했습니다.

분석 실행을 백그라운드 태스크로 처리하고 클라이언트에서 폴링하는 구조를 적용해
응답 대기 중에도 UI가 블로킹되지 않도록 구성했습니다.`,
      keyLearnings: `Figma 노드 구조를 컴포넌트 단위로 해석하는 과정에서,
LLM을 단순 코드 생성기가 아니라 디자인 의도를 추론하는 해석 엔진으로 활용할 수 있음을 확인했습니다.

각 LLM 호출 단계에 전체 JSON이 아닌 필요한 데이터만 전달하는 방식이
응답 품질과 파싱 안정성을 함께 높이는 데 효과적이었습니다.

또한 Auto Layout, Component Sets, Variants 같은 고급 Figma 기능은
단순 노드 트리 분석으로 완전히 처리하기 어렵다는 한계를 확인했고,
이를 처리하기 위해서는 Figma 플러그인 API 수준의 접근이 필요하다는 점을 파악했습니다.`,
      workingApproach: `DesignFlow는 Figma JSON을 입력으로 받아 React + Tailwind 코드를 출력하는 과정을
파싱 → 정규화 → 토큰 추출 → AI 해석 → 코드 생성의 4단계 파이프라인으로 설계했습니다.

Figma 노드 트리를 재귀 순회해 레이아웃 의도와 반복 패턴을 추론하고,
색상·타이포그래피·간격·반경 값을 사용 빈도 기준으로 정규화해 Tailwind 유틸리티 클래스로 매핑했습니다.

LLM(Ollama 또는 Claude)을 3단계로 분리해 호출하도록 설계해,
각 단계에 필요한 최소한의 데이터만 전달함으로써 응답 품질과 처리 효율을 함께 확보했습니다.

---

Figma JSON Input
      |
      v
[figma_parser.py] → 노드 트리 파싱
      |
      v
[normalizer.py] → 노드 계층 정규화
      |
      v
[token_extractor.py] → 디자인 토큰 추출
 ├── colors     → Tailwind bg-[#hex]
 ├── typography → text-sm font-bold
 ├── spacing    → p-4 gap-6
 └── radius     → rounded-lg
      |
      v
[Claude / Ollama — 3단계 AI 파이프라인]
 ├── analyze_structure() → componentCandidates + layoutPattern
 ├── name_components()   → suggestedName + filePath
 └── generate_code()     → React + Tailwind TSX
      |
      v
Output Files
 ├── components/HeroSection.tsx
 ├── components/Header.tsx
 └── app/page.tsx`,
      techStack: ["Next.js 15", "TypeScript", "Tailwind CSS v4", "Python", "FastAPI", "Ollama", "Claude API", "PostgreSQL"],
      isFeatured: true,
      featuredOrder: 6,
      isPublished: true,
      categoryId: designCategory.id,
      secondaryCategoryId: aiCategory.id,
    },
  });

  await prisma.projectLink.deleteMany({ where: { projectId: designflow.id } });
  await prisma.projectLink.create({
    data: { projectId: designflow.id, type: "GITHUB", label: "GitHub", url: "https://github.com/devbinlog/DesignFlow_AI_Builder", order: 1 },
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
