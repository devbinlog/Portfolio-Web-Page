# 05. 프론트엔드 설계

## App Router 구조

```
apps/web/app/
├── layout.tsx                      ← 루트 레이아웃 (HTML, 테마 설정)
├── page.tsx                        ← 랜딩 페이지 (3D 월드 히어로)
├── (public)/
│   ├── about/
│   │   └── page.tsx               ← About 페이지
│   ├── projects/
│   │   ├── page.tsx               ← 프로젝트 아카이브
│   │   └── [slug]/
│   │       └── page.tsx           ← 프로젝트 상세 페이지
│   └── contact/
│       └── page.tsx               ← 연락처 페이지
├── (admin)/
│   └── admin/
│       ├── layout.tsx             ← 어드민 레이아웃 (인증 보호)
│       ├── login/
│       │   └── page.tsx           ← 관리자 로그인
│       ├── page.tsx               ← 어드민 대시보드
│       ├── projects/
│       │   ├── page.tsx           ← 프로젝트 목록 관리
│       │   ├── new/
│       │   │   └── page.tsx       ← 새 프로젝트 생성
│       │   └── [id]/
│       │       └── page.tsx       ← 프로젝트 수정
│       └── contacts/
│           └── page.tsx           ← 연락 메시지 목록
├── api/                           ← Next.js Route Handlers
│   └── revalidate/
│       └── route.ts
└── sitemap.ts                     ← 동적 sitemap 생성
```

---

## 레이아웃 구조

### 루트 레이아웃 (app/layout.tsx)

서버 컴포넌트. HTML 기본 구조, 폰트, 테마 초기화, 전역 메타데이터 설정.

```tsx
// 서버 컴포넌트
export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>           // next-themes
          <QueryProvider>         // React Query
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 랜딩 페이지 레이아웃

3가지 레이어가 z-index로 겹쳐진다.

```
[최상위: UI Layer]     z-index: 50
  - 내비게이션 (이름, 링크, 테마 토글)
  - 히어로 텍스트 블록 (Taebin Kim, 역할, 철학)

[중간: Overlay Layer]  z-index: 40
  - ProjectOverlay 컴포넌트
  - 닫기 버튼, 상세 이동 링크

[하단: 3D Canvas]      z-index: 10
  - React Three Fiber Canvas
  - 씬 전체
```

---

## 페이지 구조

### 랜딩 페이지 (page.tsx)

서버 컴포넌트 (데이터 페칭) + 클라이언트 컴포넌트 조합.

데이터 페칭 (서버):
- getFeaturedProjects(): 대표 프로젝트 목록
- getProfile(): 프로필 정보

렌더링:
- HeroSection: 이름, 역할, 철학, 인터랙션 힌트
- WorldCanvas: 3D 씬 (dynamic import, Suspense)
- WorldFallback: 3D 비지원/모바일 시 대체 UI
- ProjectOverlay: 프로젝트 상세 overlay

### About 페이지

서버 컴포넌트 (SEO 메타데이터 포함).

섹션:
- IdentitySection: 이름, 역할, 소개
- BackgroundSection: 배경 요약
- StrengthsSection: 강점 목록
- WorkingMethodSection: 일하는 방식 (필수)
- SkillsSection: 기술 스택

### 프로젝트 아카이브 (projects/page.tsx)

서버 컴포넌트 (초기 데이터 포함).

기능:
- 전체 프로젝트 목록
- 카테고리 필터 (클라이언트 컴포넌트)
- 그리드 레이아웃

### 프로젝트 상세 페이지 (projects/[slug]/page.tsx)

서버 컴포넌트. SEO에 중요.

generateMetadata(): 프로젝트 제목, 설명 기반 메타데이터 생성
generateStaticParams(): 공개된 프로젝트 슬러그 사전 생성

섹션:
- ProjectHeader: 제목, 카테고리, 연도
- ProjectHeroImage: 히어로 이미지
- ProjectDescription: 상세 설명 (Markdown 렌더링)
- ProjectMedia: 갤러리, 영상 플레이스홀더
- ProjectDocuments: 문서 플레이스홀더
- ProjectTechStack: 기술 스택
- ProjectLinks: 링크 모음
- ProjectLearnings: 주요 학습 내용
- BackToWorld: 세계 복귀 버튼

---

## Overlay 구조

### ProjectOverlay 컴포넌트

클라이언트 컴포넌트. overlayStore를 구독한다.

```tsx
// overlayStore.isOpen이 true일 때 Framer Motion으로 등장
// 클릭한 프로젝트 데이터를 API에서 가져와 표시
// ESC 키, 배경 클릭, 닫기 버튼으로 닫힘
// 닫힐 때 worldStore.returnToWorld() 호출
```

overlay 내부 구성:
- OverlayHeader: 제목, 닫기 버튼
- OverlayContent: 스크롤 가능한 콘텐츠 영역
  - 요약, 설명 (단축), 카테고리, 연도
  - 기술 스택 태그
  - 미디어 썸네일 (이미지, 영상 플레이스홀더)
  - 문서 플레이스홀더
  - 링크 버튼 모음
- OverlayFooter: "자세히 보기" → /projects/[slug]

---

## 3D와 UI 연결 방식

### 연결 원칙

3D 씬 내부의 이벤트는 Zustand 스토어를 통해서만 HTML 레이어로 전달된다.
HTML 레이어는 스토어를 구독하고 상태 변화에 반응한다.

```
[3D 씬] ──호버 이벤트──→ worldStore.setHovered(projectId)
[3D 씬] ──클릭 이벤트──→ worldStore.setFocused(projectId)
                               ↓
                    overlayStore.open(projectId)
                               ↓
               [HTML Overlay] 구독 → 표시

[닫기 버튼] → overlayStore.close()
                    ↓
         worldStore.returnToWorld()
                    ↓
         [3D 씬] 카메라 복귀
```

### WorldCanvas 컴포넌트

dynamic import로 로딩:
```tsx
const WorldCanvas = dynamic(
  () => import('@/components/three/scene/WorldCanvas'),
  {
    ssr: false,
    loading: () => <WorldLoadingFallback />,
  }
)
```

WebGL 미지원 감지 → WorldFallback 자동 표시.

---

## 상태 관리 전략

### 스토어 파일 구조

```
stores/
├── worldStore.ts      ← 3D 월드 상태
├── overlayStore.ts    ← overlay 상태
├── themeStore.ts      ← 테마 상태
├── cameraStore.ts     ← 카메라 상태
└── performanceStore.ts ← 성능/모션 상태
```

### 규칙

- 서버 컴포넌트는 스토어를 사용하지 않는다
- 스토어 초기화는 클라이언트 컴포넌트에서만 수행
- 3D 씬은 스토어를 읽고 쓴다
- HTML 컴포넌트는 스토어를 읽고, 사용자 액션 시 쓴다
- 스토어 간의 의존성은 단방향을 유지한다

---

## 테마 전환 전략

### 구현 방식

next-themes 라이브러리 사용.
Tailwind CSS dark: 변형 또는 CSS 변수 기반 토큰 시스템.

```tsx
// app/layout.tsx
<ThemeProvider
  attribute="class"        // html 요소에 class="dark" 적용
  defaultTheme="dark"
  enableSystem={true}      // 시스템 설정 감지
  disableTransitionOnChange // theme 변경 시 flash 방지
>
```

### CSS 변수 토큰

```css
:root {
  --color-surface-base: #ffffff;
  --color-text-primary: #0a0a0a;
  /* ... */
}

.dark {
  --color-surface-base: #0a0a0a;
  --color-text-primary: #f5f5f5;
  /* ... */
}
```

### 3D 씬 테마 적용

```tsx
// themeStore를 구독하여 material 속성 변경
const theme = useThemeStore(state => state.theme)

useEffect(() => {
  if (theme === 'dark') {
    material.color.set('#ffffff')
    pointLight.intensity = 1.5
  } else {
    material.color.set('#1a1a1a')
    pointLight.intensity = 2.0
  }
}, [theme])
```

---

## 컴포넌트 분류 기준

서버 컴포넌트로 만들 것:
- 레이아웃 파일
- 정적 섹션 (데이터 페칭 필요하지 않은)
- 페이지 파일 (초기 데이터 포함)

클라이언트 컴포넌트로 만들 것:
- 3D 씬 모든 컴포넌트
- overlay 컴포넌트
- 인터랙티브 필터, 토글, 폼
- 스토어를 사용하는 모든 컴포넌트

경계 패턴:
- 서버 컴포넌트가 데이터를 페칭한 후 클라이언트 컴포넌트에 props로 전달
- 클라이언트 컴포넌트는 필요시 추가 데이터를 API에서 직접 페칭

---

## SEO 전략

### 메타데이터

```tsx
// app/layout.tsx - 기본 메타데이터
export const metadata = {
  title: {
    template: '%s | Taebin Kim',
    default: 'Taebin Kim - Frontend Developer',
  },
  description: 'Building imagination through structure and interaction.',
  openGraph: { ... },
  twitter: { ... },
}

// 각 페이지에서 generateMetadata() 함수로 동적 생성
```

### sitemap.ts

공개된 모든 프로젝트 슬러그를 포함한 동적 sitemap 생성.
