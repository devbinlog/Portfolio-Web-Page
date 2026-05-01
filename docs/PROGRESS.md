# My Portfolio World — 개발 진행 기록

> **이 파일을 읽으면 다음 대화에서 어디서부터 이어받아야 하는지 즉시 알 수 있습니다.**
> 마지막 업데이트: 2026-04-28

---

## 2026-04-17 세션 작업 기록 (첫 실행 성공)

### 환경 구성
- Docker Desktop 미설치 → Homebrew로 PostgreSQL 16 + Redis 설치
- `brew install postgresql@16 redis` → `brew services start ...`
- `portfolio_db` 데이터베이스 + `postgres` 유저 수동 생성

### 수정한 버그 7개

| # | 파일 | 문제 | 해결 |
|---|------|------|------|
| 1 | `apps/api/tsconfig.json` | `@portfolio/config` 패키지 경로를 ts-node가 못 찾음 | 상대경로(`../../packages/config/...`)로 변경 |
| 2 | `apps/api/tsconfig.json` | DTO 클래스 `strictPropertyInitialization` 오류 26개 | `"strictPropertyInitialization": false` 추가 |
| 3 | `apps/api/package.json` | `dev` 스크립트 없어 turbo가 실패 | `"dev": "nest start --watch"` 추가 |
| 4 | `apps/api/package.json` | `import type { Request } from 'express'` 오류 | `@types/express` devDependency 추가 |
| 5 | `apps/web/next.config.ts` | Next.js 14는 TypeScript config 미지원 | `next.config.mjs`로 변환 |
| 6 | `apps/web/tsconfig.json` | 동일한 `@portfolio/config` 경로 문제 | 상대경로로 변경 |
| 7 | `contacts.service.ts` | `TooManyRequestsException`이 NestJS 10에 없음 | `HttpException + HttpStatus.TOO_MANY_REQUESTS`로 교체 |
| 8 | `packages/types`, `packages/utils` | `main`이 TS 소스를 가리켜 NestJS 런타임 오류 | CJS 빌드 후 `main`을 `./dist/index.js`로 변경 |
| 9 | `apps/web` | `geist` 폰트 패키지 누락 | `pnpm --filter=web add geist` |

### 신규 생성 파일
- `apps/api/tsconfig.seed.json` — seed 전용 tsconfig (rootDir: `.`)
- `packages/types/tsconfig.json` — CJS 빌드용
- `packages/utils/tsconfig.json` — CJS 빌드용
- `apps/web/next.config.mjs` — (next.config.ts 대체)

### 실행 결과
- **API** `http://localhost:4000/api/v1/health` → `{"status":"ok","database":"ok","redis":"ok"}`
- **Web** `http://localhost:3000` → 200 OK, 프로젝트 데이터(BandStage/PageOfArtist/MUSE) 서버사이드 렌더링 확인
- **Prisma 마이그레이션** `20260417031040_init` 생성 완료
- **Seed** admin 계정 + 샘플 3개 프로젝트 삽입 완료

---

---

---

## 2026-04-28 세션 작업 기록 (UI/콘텐츠 전면 개편)

### 버그 수정

| 파일 | 문제 | 해결 |
|------|------|------|
| `apps/web/src/styles/globals.css` | `html { cursor: none }` + `* { cursor: none !important }` → 홈 제외 모든 페이지 마우스 포인터 안 보임 | 전역 규칙 제거 (홈 페이지 wrapper div에만 `cursor-none` 클래스 유지) |
| `apps/web/src/lib/api/projects.ts` | `next: { revalidate: 60 }` 캐시로 DB 변경사항이 즉시 반영 안 됨 | `cache: 'no-store'`로 변경 |

### 컴포넌트 변경

#### `IdentitySection.tsx` (About Me 페이지)
- 상단에 `About Me` 모노 라벨 추가 (다른 페이지와 동일 스타일)
- bio 렌더링: 단순 `<p>` → `\n\n` 기준 paragraph 분리 + `\n` → `<br />` 주입

#### `about/page.tsx`
- 섹션 순서 변경: `IdentitySection → SkillsSection → WorkingMethodSection`
- `space-y-24` → `space-y-14` (GitHub 링크와 Tech Stack 간격 축소)

#### `SkillsSection.tsx`
- 제목: 한국어 → **"Tech Stack"**
- 카테고리 설명 전부 영문화
  - AI / Data: `LLM pipeline, search systems, multimodal processing`
  - Backend: `REST API, data modeling, server design`
  - Frontend: `Interactive UI, type-safe components`
  - 3D / Interactive: `Real-time 3D rendering, gesture interaction`
  - Infra: `Containers, CI/CD, monorepo`

#### `WorkingMethodSection.tsx`
- 제목: "제가 일하는 방식" → **"Working Style"**
- 4개 항목 실제 프로젝트 예시로 교체 (BandStage, FMD, MUSE, Page of Artist 기반)

#### `TechBadge.tsx`
- 모든 아이콘에 브랜드 컬러 적용 (`color` prop)
- wrapper `<span>`에서 `text-text-secondary` 제거 → `currentColor` 오버라이드 해제

#### `HomeAboutSection.tsx` (인트로 페이지 About Me 섹션)
- bio 렌더링: `whitespace-pre-line` → `\n\n` / `\n` 분리 방식으로 통일
- bio 최대 너비: `max-w-[540px]` → `max-w-[680px]`
- 우측 패딩: `pr-10` → `pr-16`
- 스킬 태그 크기 조정: `text-[11px] px-2.5 py-1` → `text-xs px-3 py-1.5`

#### `contact/page.tsx`
- 구조 변경: "Contact" h1 → 소형 모노 라벨 + **"Coffee Chat"** h1
- 설명 텍스트: 인트로 페이지와 동일 내용으로 통일

#### `ProjectArchive.tsx`
- summary `<p>`에 `whitespace-pre-line` 추가 → `\n` 기준 줄바꿈 렌더링

#### `ProjectsPageHeader.tsx` (신규 생성)
- 위치: `src/components/sections/projects/ProjectsPageHeader.tsx`
- **Portfolio** 모노 라벨 + "Projects" 제목
- 통계 카운터 (count-up 애니메이션, easeOutCubic): Projects / Technologies 28+ / Year 2026
- 기술 마퀴 스트립: 22개 기술명 무한 좌→우 스크롤 (CSS keyframe `marquee`, 30s)

#### `projects/page.tsx`
- 기존 `<header>` 블록 제거 → `<ProjectsPageHeader count={projects.length} />` 사용

### DB 변경사항 (portfolio_db)

#### profiles 테이블
- `location`: "Seoul, Korea" → `''` (비워둠)

#### projects 테이블 — summary 전면 교체

| slug | 새 summary |
|------|-----------|
| `bandstage` | 분산된 공연, 아티스트, 예매 정보를 하나의 흐름으로 통합한 라이브 음악 플랫폼. *(줄바꿈)* 데이터 구조와 사용자 탐색 경험을 함께 설계해 공연을 찾는 과정을 하나의 시스템으로 연결했습니다. |
| `page-of-artist` | 텍스트 중심 탐색의 한계를 해결하기 위해, 아티스트와 음악 데이터를 3D 인터페이스로 재구성한 뮤직 플랫폼. *(줄바꿈)* 데이터 구조와 인터랙션을 결합해 사용자가 콘텐츠를 탐색하는 과정을 하나의 경험 흐름으로 설계했습니다. |
| `fmd` | 자연어 입력을 LLM으로 구조화하고, 생성과 검색을 결합해 결과를 제공하는 디자인 탐색 시스템. *(줄바꿈)* 입력부터 결과까지 이어지는 구조를 설계해 추상적인 요구를 실제 결과로 연결합니다. |
| `emotion-aware-ai-voice-engine` | 음성 입력의 감정을 실시간으로 분석하고, 그에 맞는 응답을 생성하는 AI 음성 인터랙션 시스템. *(줄바꿈)* STT, 감정 분석, LLM, TTS를 하나의 파이프라인으로 구성해 입력부터 응답까지의 흐름을 통합했습니다. |
| `designflow-ai-builder` | 자연어와 디자인 입력을 기반으로 UI 구조를 생성하고 코드로 연결하는 AI 기반 UI 생성 시스템. *(줄바꿈)* 입력을 컴포넌트 트리로 구조화한 뒤 React와 Tailwind 코드로 변환하는 파이프라인을 설계했습니다. |
| `muse` | 손동작을 입력으로 받아 사운드를 제어하는 실시간 인터랙션 시스템. *(줄바꿈)* 입력, 인식, 매핑, 출력 구조를 설계해 사용자의 움직임을 음악으로 연결되는 흐름으로 구현했습니다. |

#### projects 테이블 — 카드 순서 재편

| slug | 변경 전 | 변경 후 |
|------|---------|---------|
| `muse` | isFeatured=true, featuredOrder=3 | isFeatured=false, featuredOrder=NULL |
| `fmd` | isFeatured=false | isFeatured=true, featuredOrder=3 |
| `muse` / `designflow-ai-builder` | 비featured 내 순서 불명 | createdAt 교환으로 DesignFlow→Emotion→MUSE 순 |

**최종 카드 순서:**
- Row 1 (Featured): BandStage(1) → Page of Artist(2) → FMD(3)
- Row 2 (나머지): DesignFlow → Emotion-Aware → MUSE

---

## ▶ 다음 세션에서 할 일 (우선순위 순)

### 0순위 — 서버 재시작 방법
```bash
# 매 세션 시작 시: DB + Redis 기동 확인
brew services list | grep -E "postgresql|redis"
# 미실행이면:
brew services start postgresql@16
brew services start redis

# packages 빌드 필요 (소스 변경 시)
cd packages/types && npx tsc && cd ../utils && npx tsc && cd ../..

# 서버 실행
pnpm --filter=api dev &
pnpm --filter=web dev &
```

### 1순위 — 콘텐츠 보완
- [ ] 프로젝트 썸네일 이미지 추가 (현재 빈 회색 박스 상태)
- [ ] 각 프로젝트 상세 페이지(`/projects/[slug]`) 내용 확인 및 보완
- [ ] 홈 인트로 3D 월드에 FMD 오브젝트 추가 (`configs.ts` 수동 편집 필요)
  - 현재 `WORLD_OBJECT_CONFIGS`에 bandstage / pageofartist / muse만 있음
  - FMD가 featured 3번으로 승격됐으므로 3D 월드에도 추가 검토

### 2순위 — 타입 오류 수정
- `apps/web/src/app/(admin)/admin/projects/page.tsx:50` — `ProjectSummary`에 `isPublished` 없음
- `apps/web/src/__tests__/worldStore.test.ts` — `vi` import 순서 이슈

### 3순위 — 미구현 기능
- [ ] 이미지 업로드 — 현재 URL 직접 입력만 가능. Cloudinary 또는 S3 연동 고려
- [ ] OG 이미지 / SEO 메타데이터 각 페이지별 정비
- [ ] `projects.ts` `cache: 'no-store'` → 배포 시 `revalidate` 전략으로 교체 필요

### 4순위 — 배포
- Vercel (web) + Railway/Fly.io (api + db + redis) 조합 권장
- `apps/web/Dockerfile` (standalone) + `apps/api/Dockerfile` 이미 완성됨
- `docker-compose.prod.yml` 이미 완성됨
- 환경 변수 설정 후 `pnpm docker:prod`

---

## 전체 Phase 현황 (모두 완료)

| Phase | 내용 | 상태 |
|-------|------|------|
| 1 | 루트 구조, /agents 7개, /docs 12개 | ✅ |
| 2 | 모노레포 스캐폴드, shared packages, web/api 기반 | ✅ |
| 3-A | 백엔드 핵심 모듈 (media, documents, links, admin CRUD) | ✅ |
| 3-B | 어드민 대시보드 UI 전체 | ✅ |
| 3-C | Tailwind 토큰, 3D 오브젝트 패밀리 완성 | ✅ |
| 4 | 3D 월드 풀 시스템 (인트로, 파티클, 카메라 상태머신) | ✅ |
| 5 | Vitest 테스트, Playwright e2e, Dockerfile, README | ✅ |
| 버그수정 | Service 파일 3개, 어드민 프로필 페이지, 인프라 | ✅ |
| **실행테스트** | **첫 실행 성공, 타입오류 수정, DB seed 완료** | **✅ 2026-04-17** |

---

## 전체 파일 목록 (156개, node_modules 제외)

### 루트
```
.eslintrc.json
.gitignore
.prettierrc
package.json              ← scripts: dev, build, test, docker:dev, docker:prod, db:*
pnpm-workspace.yaml
turbo.json
docker-compose.yml        ← 개발용 (Dockerfile.dev 참조)
docker-compose.prod.yml   ← 프로덕션용
README.md
```

### /agents (7개, 한국어)
```
ai_agent.md, backend_agent.md, data_agent.md, design_agent.md
frontend_agent.md, infra_agent.md, product_agent.md
```

### /docs (13개, 한국어)
```
00_project.md ~ 11_design_playbook.md
PROGRESS.md               ← 이 파일 (진행 기록)
```

### /packages
```
packages/types/src/
  project.ts              ← ProjectSummary, ProjectDetail, Category, Tag, Media 등
  profile.ts              ← Profile, SocialLink
  api.ts                  ← PaginatedResponse
  world.ts                ← WorldPhase, CameraState, WorldObjectConfig
  index.ts

packages/config/
  tailwind/index.js       ← CSS var 기반 시맨틱 토큰 (accent-default/hover 포함)
  tsconfig/base.json, nextjs.json, nestjs.json

packages/utils/src/
  slug.ts                 ← generateSlug()
  format.ts

packages/ui/src/index.ts  ← 플레이스홀더 (미구현)
```

### /apps/api (NestJS)
```
.env                      ← 로컬 개발용 (gitignore, .env.example에서 복사됨)
.env.example
Dockerfile                ← 프로덕션 (multi-stage, prisma migrate deploy 포함)
Dockerfile.dev            ← 개발 (hot reload)
package.json
tsconfig.json
vitest.config.ts

prisma/
  schema.prisma           ← 13개 모델 (AdminUser, Profile, Project, ProjectMedia 등)
  seed.ts                 ← BandStage/PageOfArtist/MUSE + admin 계정 시드

src/main.ts               ← ValidationPipe, CORS, ExceptionFilter, LoggingInterceptor
src/app.module.ts         ← 모든 모듈 등록

src/common/
  filters/http-exception.filter.ts
  guards/jwt-auth.guard.ts
  interceptors/logging.interceptor.ts
  prisma/prisma.module.ts, prisma.service.ts
  redis/redis.module.ts, redis.service.ts

src/modules/
  auth/
    auth.controller.ts    ← POST /auth/login
    auth.service.ts       ← Redis 잠금 (5회 실패 → 15분)
    auth.module.ts
    dto/login.dto.ts
    strategies/jwt.strategy.ts

  projects/               ← 공개 API
    projects.controller.ts  ← GET /projects, GET /projects/:slug
    projects.service.ts     ← 페이지네이션, 필터, ISR 대응
    projects.module.ts
    dto/projects-query.dto.ts

  contacts/               ← 공개 API
    contacts.controller.ts  ← POST /contacts
    contacts.service.ts     ← Redis 속도 제한 (5회/시간)
    contacts.module.ts
    dto/create-contact.dto.ts

  profile/                ← 공개 API
    profile.controller.ts   ← GET /profile
    profile.service.ts      ← DB 없으면 기본값 반환
    profile.module.ts

  health/
    health.controller.ts    ← GET /health

  media/
    media.controller.ts     ← /admin/projects/:id/media CRUD + reorder
    media.service.ts
    media.module.ts
    dto/create-media.dto.ts, update-media.dto.ts

  documents/
    documents.controller.ts
    documents.service.ts
    documents.module.ts
    dto/create-document.dto.ts, update-document.dto.ts

  links/
    links.controller.ts
    links.service.ts
    links.module.ts
    dto/create-link.dto.ts, update-link.dto.ts

  admin/
    projects/
      admin-projects.controller.ts
      admin-projects.service.ts   ← stats, CRUD, togglePublish, reorder, soft delete
      admin-projects.module.ts
      dto/create-project.dto.ts, update-project.dto.ts

    contacts/
      admin-contacts.controller.ts
      admin-contacts.service.ts   ← findAll, markRead, remove
      admin-contacts.module.ts

    profile/
      admin-profile.controller.ts
      admin-profile.service.ts    ← upsert, addSocialLink, updateSocialLink, removeSocialLink
      admin-profile.module.ts
      dto/update-profile.dto.ts

    categories/
      categories.controller.ts    ← 공개 GET /categories
      categories.service.ts
      categories.module.ts

src/__tests__/
  auth.service.test.ts
  slug.test.ts
```

### /apps/web (Next.js)
```
.env.local                ← 로컬 개발용 (gitignore)
.env.example
Dockerfile                ← 프로덕션 (standalone output)
Dockerfile.dev
package.json
next.config.ts            ← output:'standalone', transpilePackages
tailwind.config.ts
postcss.config.js
tsconfig.json
vitest.config.ts
playwright.config.ts

public/
  fonts/GeistMono-Regular.woff   ← Three.js Text 컴포넌트용 폰트 (295KB)
  images/                        ← 이미지 디렉토리 (비어있음)

e2e/
  public.spec.ts          ← 공개 페이지 e2e
  admin.spec.ts           ← 어드민 인증 e2e

src/__tests__/
  adminApi.test.ts
  worldStore.test.ts

src/styles/globals.css    ← CSS 변수 토큰 (라이트/다크), .input-base 유틸리티

src/app/
  layout.tsx              ← ThemeProvider, GeistSans/Mono 폰트
  page.tsx                ← 랜딩: WorldCanvas + ProjectOverlay + HeroSection
  sitemap.ts

  (public)/
    about/page.tsx        ← IdentitySection + WorkingMethodSection + SkillsSection
    projects/page.tsx     ← ProjectArchive 목록
    projects/[slug]/page.tsx  ← 프로젝트 상세
    contact/page.tsx      ← ContactForm

  (admin)/admin/
    layout.tsx            ← JWT 인증 가드, 사이드바(현재경로 하이라이트, 로그아웃)
    page.tsx              ← 대시보드 (stats 카드 4개)
    login/page.tsx        ← AdminLoginForm
    projects/page.tsx     ← 프로젝트 목록 테이블
    projects/new/page.tsx ← 프로젝트 생성
    projects/[id]/page.tsx ← 프로젝트 편집 (기본정보/미디어/문서/링크 탭)
    contacts/page.tsx     ← 연락 메시지 (펼치기, 읽음 표시, 삭제)
    profile/page.tsx      ← 프로필 편집 + 소셜 링크 CRUD

src/stores/
  worldStore.ts           ← WorldPhase 상태머신 (hover 시 overlay/focus 중 무시)
  overlayStore.ts         ← 오버레이 열기/닫기
  cameraStore.ts          ← CameraState 관리
  performanceStore.ts     ← isReducedMotion
  adminAuthStore.ts       ← JWT persist (localStorage)

src/lib/
  api/
    client.ts             ← apiFetch (Bearer Token, ISR 지원)
    projects.ts           ← getFeaturedProjects, getAllProjects, getProjectBySlug
    profile.ts            ← getProfile (fallback 기본값)
    admin.ts              ← adminApi (stats, projects, media, documents, links, contacts, profile)

  world/
    configs.ts            ← WORLD_OBJECT_CONFIGS (bandstage, pageofartist, muse 위치/카메라)
    theme3d.ts            ← THEME_3D_CONFIG (dark/light, orb/crystal/device/core/label)

src/components/
  layout/
    MainNav.tsx
    BottomGuidance.tsx

  sections/
    HeroSection.tsx       ← fixed, pointer-events-none, profile.name/roleTitle/tagline
    ContactForm.tsx       ← useState 폼, fetch POST /contacts, rate limit 응답 처리
    about/
      IdentitySection.tsx
      WorkingMethodSection.tsx
      SkillsSection.tsx
    admin/
      AdminLoginForm.tsx
      ProjectForm.tsx     ← 공용 생성/편집 폼
      MediaManager.tsx
      DocumentManager.tsx
      LinkManager.tsx

  overlay/
    ProjectOverlay.tsx    ← 고정 우측 패널, ESC 닫기, focus trap, PlaceholderSlot

  project/
    ProjectArchive.tsx
    ProjectDetailContent.tsx
    PlaceholderSlot.tsx   ← isPlaceholder=true 항목 표시 (IMAGE/VIDEO/DOC 유형)

  three/
    scene/
      WorldCanvas.tsx     ← WebGL 감지, 모바일 < 768px 폴백
      WorldScene.tsx      ← Canvas, IntroTrigger, AmbientParticles, IdentityCore, ProjectObject
      WorldFallback.tsx

    camera/
      SceneCamera.tsx     ← 전체 WorldPhase 상태머신 (initial→intro easeInOut→idle→hover→focus→overlay)

    lighting/
      WorldLighting.tsx

    objects/
      IdentityCore.tsx    ← CoreSphere + 2 TorusGeometry rings
      ProjectObject.tsx   ← category.objectFamily 기반 패밀리 분기
      AmbientParticles.tsx ← 구형 분포 80개 파티클, 느린 자전
      families/
        SignalOrb.tsx     ← Music 카테고리 (구체 + 회전 링)
        DataCrystal.tsx   ← AI 카테고리 (icosahedron + octahedron 코어 + 에너지 링)
        LayeredDevice.tsx ← Design 카테고리 (3단 박스 레이어, hover 시 벌어짐)
```

---

## 핵심 설계 결정 (변경 시 주의)

### 인증
- JWT Bearer + Redis 잠금 (5회 실패 → 15분 차단)
- `adminAuthStore` — Zustand persist (localStorage, 키: `admin-auth`)
- 토큰 만료: `JWT_EXPIRES_IN=3600` (1시간)

### 3D 아키텍처
- WorldPhase: `initial → intro → idle → hover → focus → overlay`
- CSS var 접근 불가 → `THEME_3D_CONFIG` 상수로 색상 관리
- 인트로: 카메라 하늘(0, 18, 22) → 허브(0, 3, 14), `easeInOutCubic`, 완료 시 `idle`
- 새 Featured 프로젝트 추가 시 `configs.ts` 수동 편집 필요

### PlaceholderSlot
- `isPlaceholder: true` + `url: null` + `placeholderLabel: string`
- 어드민에서 URL 추가 시 `isPlaceholder: false`로 자동 전환 (media.service.ts)

### Tailwind 토큰
- 시맨틱 CSS 변수: `globals.css` `:root`(라이트) + `.dark`(다크)
- Tailwind는 `var(--token)` 참조
- 어드민에서 사용하는 `accent-default`, `accent-hover` 별도 추가됨

### Soft Delete
- `Project.deletedAt: DateTime?` — null이면 활성, 값이 있으면 삭제됨
- admin-projects.service.ts `remove()` 메서드가 처리

---

## 어드민 계정 (seed 후)
- URL: http://localhost:3000/admin/login
- 이메일: `admin@taebinkim.com`
- 비밀번호: `admin1234!`

## 주요 포트
- Web: http://localhost:3000
- API: http://localhost:4000/api/v1
- DB: localhost:5432 (postgres / postgres / portfolio_db)
- Redis: localhost:6379

## 빠른 시작 명령
```bash
pnpm install
docker compose up -d db redis
pnpm db:generate && pnpm db:migrate && pnpm db:seed
pnpm dev
```
