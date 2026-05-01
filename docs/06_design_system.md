# 06. 디자인 시스템

## 시각 언어 개요

이 포트폴리오의 시각 언어는 단 하나의 원칙에서 출발한다.

정제된 명료함: 꾸밈이 아닌 구조를 통해 인상을 만든다.

모든 시각적 결정은 다음 질문을 통과해야 한다.
"이것이 정보 계층을 강화하는가, 아니면 흐리는가?"

---

## 다크/라이트 토큰 시스템

### 시맨틱 토큰 정의

시맨틱 토큰은 색상값이 아닌 목적으로 이름을 가진다.
HTML/CSS에서는 이 토큰만을 사용한다.

```
surface
  surface-base       ← 기본 배경
  surface-elevated   ← 카드, 패널 배경
  surface-overlay    ← overlay 배경
  surface-input      ← 입력 필드 배경

text
  text-primary       ← 주요 본문 텍스트
  text-secondary     ← 보조 텍스트
  text-disabled      ← 비활성 텍스트
  text-inverse       ← 반전 텍스트 (버튼 내부 등)
  text-link          ← 링크 텍스트

border
  border-default     ← 기본 경계선
  border-strong      ← 강조 경계선
  border-focus       ← 포커스 링 색상

accent
  accent-primary     ← 주요 액센트 (CTA, 선택 상태)
  accent-secondary   ← 보조 액센트
  accent-muted       ← 흐린 액센트 (배지, 태그 배경)

feedback
  feedback-success
  feedback-warning
  feedback-error
  feedback-info
```

### 다크 테마 원시값

```css
.dark {
  --surface-base: #0a0a0a;
  --surface-elevated: #141414;
  --surface-overlay: rgba(10, 10, 10, 0.92);
  --surface-input: #1a1a1a;

  --text-primary: #f0f0f0;
  --text-secondary: #8a8a8a;
  --text-disabled: #444444;
  --text-inverse: #0a0a0a;
  --text-link: #e0e0e0;

  --border-default: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.16);
  --border-focus: rgba(255, 255, 255, 0.5);

  --accent-primary: #ffffff;
  --accent-secondary: #c0c0c0;
  --accent-muted: rgba(255, 255, 255, 0.08);

  --feedback-success: #4ade80;
  --feedback-warning: #facc15;
  --feedback-error: #f87171;
  --feedback-info: #60a5fa;
}
```

### 라이트 테마 원시값

```css
:root {
  --surface-base: #fafafa;
  --surface-elevated: #ffffff;
  --surface-overlay: rgba(250, 250, 250, 0.94);
  --surface-input: #f4f4f4;

  --text-primary: #0a0a0a;
  --text-secondary: #6b6b6b;
  --text-disabled: #b0b0b0;
  --text-inverse: #ffffff;
  --text-link: #1a1a1a;

  --border-default: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.16);
  --border-focus: rgba(0, 0, 0, 0.5);

  --accent-primary: #0a0a0a;
  --accent-secondary: #3a3a3a;
  --accent-muted: rgba(0, 0, 0, 0.06);

  --feedback-success: #16a34a;
  --feedback-warning: #d97706;
  --feedback-error: #dc2626;
  --feedback-info: #2563eb;
}
```

---

## 타이포그래피 시스템

### 폰트 패밀리

영문 Display/Heading: Geist (또는 Inter)
영문 Body/UI: Geist (또는 Inter)
한국어: Noto Sans KR (필요 시)
Monospace: Geist Mono (코드 블록, 기술 태그)

### 타입 스케일

```
display-2xl: 4.5rem  / 72px  — 히어로 이름 (Taebin Kim)
display-xl:  3.75rem / 60px  — 주요 섹션 제목
display-lg:  3rem    / 48px  — 페이지 제목
display-md:  2.25rem / 36px  — 서브 제목
display-sm:  1.875rem / 30px — 소 제목

text-xl:     1.25rem / 20px  — 부제목, 프로젝트 제목
text-lg:     1.125rem / 18px — 본문 강조
text-md:     1rem    / 16px  — 기본 본문
text-sm:     0.875rem / 14px — 보조 텍스트
text-xs:     0.75rem / 12px  — 태그, 레이블, 캡션
```

### 행간 (Line Height)

display: 1.1 (타이트)
heading: 1.2
body: 1.6 (여유)
ui: 1.4

### 웨이트 (Font Weight)

400: 기본 본문
500: 강조 본문, UI 레이블
600: 소 제목
700: 주요 제목
800: 히어로 이름, 대형 디스플레이

---

## 컴포넌트 기준

### 버튼

Primary: accent-primary 배경, text-inverse 텍스트
Secondary: 투명 배경, border-strong, text-primary
Ghost: 테두리 없음, hover 시 surface-elevated 배경
Link: 밑줄 없음, hover 시 밑줄 표시

크기:
- sm: h-8, px-3, text-sm
- md: h-10, px-4, text-md (기본)
- lg: h-12, px-6, text-lg

### 태그 / 배지

기술 스택 태그: surface-input 배경, border-default, text-secondary, text-xs, Monospace 폰트
카테고리 배지: accent-muted 배경, text-secondary, text-xs
상태 배지: 각 feedback 색상

### 카드

배경: surface-elevated
테두리: border-default
border-radius: 8px (중소)
hover 시: border-strong, 미세한 위로 이동 (모션 감소 모드 제외)
내부 패딩: 24px (기본)

### 패널 / overlay

배경: surface-overlay + backdrop-blur
테두리: border-default
border-radius: 12px
그림자: 다크에서는 없음, 라이트에서는 subtile shadow
최대 너비: 720px (overlay 기준)

### 입력 필드

배경: surface-input
테두리: border-default
포커스: border-focus
error: feedback-error 테두리
border-radius: 6px
높이: 40px (기본)

---

## Overlay 규칙

overlay는 3D 씬 위에서 열리며, 씬은 배경으로 유지된다.

레이아웃:
- 화면 오른쪽 40% 또는 중앙 전체 (프로젝트에 따라)
- 최대 너비 640px (좁은 overlay)
- 배경 blur 처리된 오버레이 배경

내부 구성 순서:
1. 프로젝트 제목 + 닫기 버튼
2. 카테고리, 연도, 역할 레이블
3. 요약 (1-2문장)
4. 미디어 갤러리 (썸네일, 플레이스홀더 명확히 표시)
5. 기술 스택 태그
6. 문서/보고서 (플레이스홀더 명확히 표시)
7. 링크 버튼 모음
8. "자세히 보기" 상세 페이지 링크

플레이스홀더 상태 표시:
- 영상 플레이스홀더: 대기 중 아이콘 + placeholderLabel 텍스트
- 문서 플레이스홀더: 파일 아이콘 + placeholderLabel 텍스트
- 명확하게 "준비 중" 또는 "업로드 예정" 표시, 절대 빈 공간으로 두지 않음

---

## 3D Visual Direction

3D 씬의 시각 방향은 HTML UI와 같은 토큰 언어를 공유하되, Three.js material 속성으로 표현된다.

### Signal Orb (Music Projects)

형태: 구체 중심 + 링 구조 + 미세한 파동
material: MeshStandardMaterial, metalness 0.3, roughness 0.4
다크: emissive #ffffff, emissiveIntensity 0.05
라이트: emissive #000000, emissiveIntensity 0.03
모션: 느린 자전, 링의 미세한 진동

### Data Crystal (AI Projects)

형태: 다층 결정 구조, 각진 면
material: MeshPhysicalMaterial, transmission 0.2, roughness 0.1
다크: 반투명, subtle line accent
라이트: 더 불투명하게
모션: 느린 회전, 면 분리 없이 미세 pulse

### Layered Device (Design Projects)

형태: 구조화된 표면, 레이어드 패널, 모듈형 구성
material: MeshStandardMaterial, metalness 0.6, roughness 0.2
다크: 차가운 금속
라이트: 밝은 알루미늄 느낌
모션: 패널 간 미세한 분리/합체

---

## 브랜딩 표현 방식

히어로 섹션에서:
- "Taebin Kim"은 가장 크게, display-2xl, weight-800
- "Frontend Developer"는 text-xl, weight-400, text-secondary
- 철학 라인은 text-md, weight-400, text-secondary, 이탤릭 선택적
- 키워드 라인은 text-sm, weight-500, letter-spacing 넓게

전체적으로:
- 실명이 항상 가장 두드러진다
- 꾸밈 요소(아이콘, 이모지, 배지 등)를 이름 옆에 배치하지 않는다
- 이름의 타이포그래피 자체가 브랜딩이다
