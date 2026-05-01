# 02. 시스템 아키텍처

## 전체 시스템 구조

```
[사용자 브라우저]
      |
[Next.js Web App] ─── [NestJS API Server]
      |                      |
[React Three Fiber]    [Prisma ORM]
      |                      |
[HTML Overlay Layer]   [PostgreSQL]
                             |
                        [Redis]
```

### 구성 요소

- Next.js Web App: 프론트엔드 애플리케이션 (SSR/SSG/CSR 혼합)
- NestJS API Server: REST API 백엔드 서버
- PostgreSQL: 주요 데이터 저장소
- Redis: rate limit, 캐시, 세션 보조
- React Three Fiber: 3D 씬 렌더링 (클라이언트 전용)
- HTML Overlay Layer: 프로젝트 상세 정보 표시 (클라이언트 전용)

---

## 프론트/백엔드/DB/Redis 관계

### 데이터 흐름

공개 프로젝트 조회:
사용자 → Next.js (Server Component) → NestJS API → PostgreSQL → Next.js → 사용자

관리자 프로젝트 생성:
관리자 → Next.js (Client Component) → NestJS API (JWT 인증) → PostgreSQL → 응답

연락 폼 제출:
사용자 → Next.js → NestJS API → Redis (rate limit 확인) → PostgreSQL (저장) → 응답

### 컴포넌트별 역할

Next.js 서버 컴포넌트
- 초기 데이터 페칭 (프로젝트 목록, 프로필 등)
- SEO 메타데이터 생성
- 레이아웃 렌더링

Next.js 클라이언트 컴포넌트
- 3D 씬 렌더링 (React Three Fiber)
- 상태 관리 (Zustand)
- 인터랙션 처리
- overlay 시스템

NestJS API
- 비즈니스 로직 처리
- 데이터 유효성 검증
- 인증/인가
- 파일 업로드 처리

---

## 3D 씬과 Overlay 관계

### 계층 구조

```
[Root Layout]
  ├── [HTML UI Layer]     ← z-index 최상위
  │     ├── 내비게이션
  │     ├── 테마 토글
  │     └── 바텀 가이던스
  ├── [Overlay Layer]     ← z-index 중간
  │     ├── ProjectOverlay
  │     └── ProjectDetailPage
  └── [3D Canvas Layer]   ← z-index 하단
        ├── Scene
        ├── Camera
        ├── Lighting
        └── Objects
```

### 상태 동기화

3D와 Overlay는 Zustand 스토어를 통해 단방향으로 상태를 공유한다.

3D → Store: 호버 상태, 포커스 상태, 카메라 위치
Store → Overlay: overlay 표시 여부, 선택된 프로젝트 ID
Overlay → Store: overlay 닫기, 세계 복귀 요청

3D 내부에서 직접 HTML DOM을 조작하지 않는다.
HTML에서 직접 Three.js 객체를 참조하지 않는다.

---

## 상태 관리 구조

### Zustand 스토어 구성

worldStore
- worldPhase: 'initial' | 'intro' | 'idle' | 'hover' | 'focus' | 'overlay' | 'detail'
- hoveredProjectId: string | null
- focusedProjectId: string | null
- returnToWorld: () => void

overlayStore
- isOpen: boolean
- projectId: string | null
- openOverlay: (projectId: string) => void
- closeOverlay: () => void

themeStore
- theme: 'dark' | 'light'
- setTheme: (theme: 'dark' | 'light') => void
- toggleTheme: () => void

cameraStore
- cameraState: CameraState
- targetPosition: Vector3
- setCameraState: (state: CameraState) => void

performanceStore
- isReducedMotion: boolean
- isPerformanceMode: boolean
- setPerformanceMode: (value: boolean) => void

---

## 카메라 시스템 구조

### 카메라 상태

```
CameraState:
  intro              → 인트로 영화적 공개
  hub_default        → 세계 기본 뷰
  hover_soft_follow  → hover 시 부드러운 미세 이동
  project_focus_move → 프로젝트 클릭 후 이동 중
  project_focus_hold → 프로젝트 포커스 완료
  detail_overlay_hold → overlay 열린 상태 유지
  reset_move         → 세계로 복귀 이동 중
```

### 전환 규칙

- 모든 전환은 부드럽게 보간된다
- hover는 최소한의 카메라 이동만 허용
- focus 이동은 사전 설정된 안전한 목표 위치를 사용
- 사용자 orbit 컨트롤은 제한되거나 비활성화
- 모션 감소 모드에서는 즉시 전환

---

## 테마 시스템 구조

### 토큰 계층

시맨틱 레이어 (의미 기반)
- --color-surface-base
- --color-surface-elevated
- --color-text-primary
- --color-text-secondary
- --color-border-default
- --color-accent-primary
- --color-overlay-background
- --color-focus-ring

원시 토큰 레이어 (색상값)
- 다크 테마: 검정/회색/흰색 기반
- 라이트 테마: 흰색/밝은 회색/검정 기반

### 3D 테마 적용

material 속성 (emissive, roughness, metalness)이 테마 상태를 구독한다.
조명 intensity와 color가 테마에 따라 조정된다.

---

## 배포 구조

### 환경 구분

개발 (local)
- docker compose up으로 전체 스택 실행
- hot reload 지원
- 로컬 PostgreSQL, Redis 사용

스테이징 (staging)
- CI/CD 자동 배포
- 프로덕션과 동일한 구성
- 테스트 데이터 사용

프로덕션 (production)
- 안정 버전만 배포
- 환경변수 분리
- 마이그레이션 수동 확인 후 적용

### Docker 구성

```
services:
  web:     Next.js 앱 (포트 3000)
  api:     NestJS 앱 (포트 4000)
  db:      PostgreSQL (포트 5432)
  redis:   Redis (포트 6379)
```

---

## 폴더 구조

```
My_Portfolio_World/
├── agents/              ← 에이전트 역할 정의
├── docs/                ← 프로젝트 문서
├── apps/
│   ├── web/             ← Next.js 프론트엔드
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx        ← 랜딩
│   │   │   │   ├── about/
│   │   │   │   ├── projects/
│   │   │   │   └── contact/
│   │   │   └── (admin)/
│   │   │       └── admin/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── sections/
│   │   │   ├── project/
│   │   │   ├── overlay/
│   │   │   └── three/
│   │   │       ├── scene/
│   │   │       ├── camera/
│   │   │       ├── lighting/
│   │   │       ├── objects/
│   │   │       ├── interactions/
│   │   │       └── effects/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── lib/
│   │   ├── types/
│   │   └── styles/
│   └── api/             ← NestJS 백엔드
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── admin/
│       │   │   ├── projects/
│       │   │   ├── media/
│       │   │   ├── documents/
│       │   │   ├── links/
│       │   │   ├── contacts/
│       │   │   ├── uploads/
│       │   │   ├── profile/
│       │   │   └── health/
│       │   ├── common/
│       │   │   ├── filters/
│       │   │   ├── interceptors/
│       │   │   ├── decorators/
│       │   │   └── guards/
│       │   └── config/
│       └── prisma/
│           ├── schema.prisma
│           └── migrations/
├── packages/
│   ├── ui/              ← 공유 UI 컴포넌트
│   ├── config/          ← 공유 설정 (Tailwind, ESLint 등)
│   ├── types/           ← 공유 TypeScript 타입
│   └── utils/           ← 공유 유틸리티 함수
├── prompts/             ← 프롬프트 템플릿
└── samples/             ← 샘플 데이터, 예시
```
