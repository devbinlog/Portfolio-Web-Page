# Portfolio — Taebin Kim

> AI / 풀스택 / 인터랙티브 포트폴리오 플랫폼

**Live →** https://binlog-devbinlog.vercel.app/ 

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
Frontend     Next.js 14 App Router / React Three Fiber / Zustand / Tailwind CSS / Framer Motion
Backend      NestJS / Prisma ORM / PostgreSQL 
Auth         JWT (어드민 전용)
Infra        Vercel (web) / Supabase (DB) 
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

## 문서

| 파일 | 내용 |
|------|------|
| [docs/00_project.md](docs/00_project.md) | 프로젝트 개요 |
| [docs/02_architecture.md](docs/02_architecture.md) | 시스템 아키텍처 |
| [docs/03_data.md](docs/03_data.md) | 데이터 모델 |
| [docs/04_api.md](docs/04_api.md) | API 엔드포인트 |

---

## 라이선스

MIT © 2025 Taebin Kim
