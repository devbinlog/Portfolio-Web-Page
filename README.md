# Portfolio — Taebin Kim

> AI · 풀스택 · 인터랙티브 포트폴리오 플랫폼

**Live →** [taebinkim.vercel.app](https://taebinkim.vercel.app) _(배포 후 업데이트)_

---

## 프로젝트 소개

6개 프로젝트의 문제 정의, 기술 설계, 핵심 코드를 담은 개발자 포트폴리오입니다.
NestJS API + Next.js 14 App Router 풀스택 모노레포로 구성되어 있으며,
어드민 대시보드를 통해 프로젝트 콘텐츠를 직접 관리합니다.

### 수록 프로젝트

| # | 프로젝트 | 분야 | 스택 |
|---|---------|------|------|
| 1 | **BandStage** | 공연 플랫폼 | Next.js 15, Prisma, Supabase |
| 2 | **Page of Artist** | 3D 뮤직 갤러리 | React, Three.js, Firebase |
| 3 | **MDE** | AI 음악 디렉션 엔진 | Python, FastAPI, Claude API |
| 4 | **Emotion-Aware AI Voice Engine** | AI 음성 인터랙션 | FastAPI, faster-whisper, Ollama |
| 5 | **MUSE** | 제스처 사운드 시스템 | React, MediaPipe, Tauri |
| 6 | **DesignFlow AI Builder** | Figma → 코드 자동화 | FastAPI, Claude API, Next.js |

---

## 기술 스택

```
Monorepo     pnpm + Turborepo
Frontend     Next.js 14 App Router · React Three Fiber · Zustand · Tailwind CSS · Framer Motion
Backend      NestJS · Prisma ORM · PostgreSQL · Redis
Auth         JWT (어드민 전용)
Infra        Vercel (web) · Railway (api) · Supabase (DB) · Upstash (Redis)
```

---

## 로컬 개발 환경 설정

### 사전 요구사항

- Node.js 20+
- pnpm 8+
- PostgreSQL 14+
- Redis 7+

```bash
# pnpm 설치 (없는 경우)
npm install -g pnpm
```

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/devbinlog/Portfolio-Web-Page.git
cd Portfolio-Web-Page

# 2. 의존성 설치
pnpm install

# 3. 환경 변수 설정
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# .env 파일을 열어 값 입력 (아래 환경 변수 섹션 참고)

# 4. 공유 패키지 빌드
cd packages/types && npx tsc && cd -
cd packages/utils && npx tsc && cd -

# 5. DB 마이그레이션 & 시드
cd apps/api
npx prisma migrate deploy
npx ts-node prisma/seed.ts
cd -

# 6. 개발 서버 실행
# 터미널 1
cd apps/api && npm run dev

# 터미널 2
cd apps/web && npx next dev -p 3000
```

**접속 주소**
- 포트폴리오: http://localhost:3000
- API: http://localhost:4001/api/v1
- 어드민: http://localhost:3000/admin (admin@taebinkim.com / admin1234!)

---

## 환경 변수

### apps/api/.env

```env
NODE_ENV=development
PORT=4001

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_db

REDIS_URL=redis://localhost:6379

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=3600

CORS_ORIGIN=http://localhost:3000

LOG_LEVEL=debug
```

### apps/web/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:4001/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_3D=true
```

---

## 프로젝트 구조

```
Portfolio-Web-Page/
├── apps/
│   ├── api/                    # NestJS 백엔드
│   │   ├── src/
│   │   │   ├── modules/        # 도메인별 모듈 (projects, admin, profile, contacts)
│   │   │   └── common/         # 공통 필터·인터셉터·가드
│   │   └── prisma/             # 스키마 & 마이그레이션
│   └── web/                    # Next.js 14 프론트엔드
│       └── src/
│           ├── app/            # App Router (public / admin)
│           ├── components/     # UI 컴포넌트
│           └── lib/            # API 클라이언트 · 훅 · 유틸
├── packages/
│   ├── types/                  # 공유 타입 (@portfolio/types)
│   ├── utils/                  # 공유 유틸 (@portfolio/utils)
│   └── config/                 # Tailwind · ESLint 설정
└── docs/                       # 설계 문서
```

---

## 배포 구조

```
GitHub Push
    │
    ├──▶ Vercel (web)     apps/web  ──▶ taebinkim.vercel.app
    └──▶ Railway (api)    apps/api  ──▶ api.railway.app
                                         │
                                    Supabase (PostgreSQL)
                                    Upstash  (Redis)
```

> 상세 배포 가이드: [docs/08_deployment.md](docs/08_deployment.md)

---

## 어드민 대시보드

- 경로: `/admin`
- 기능: 프로젝트 CRUD · 미디어 관리 · 링크 관리 · 연락 메시지 확인
- 인증: JWT (HttpOnly Cookie)

---

## 문서

| 파일 | 내용 |
|------|------|
| [docs/00_project.md](docs/00_project.md) | 프로젝트 개요 |
| [docs/02_architecture.md](docs/02_architecture.md) | 시스템 아키텍처 |
| [docs/03_data.md](docs/03_data.md) | 데이터 모델 |
| [docs/04_api.md](docs/04_api.md) | API 엔드포인트 |
| [docs/08_deployment.md](docs/08_deployment.md) | 배포 가이드 |

---

## 라이선스

MIT © 2025 Taebin Kim
