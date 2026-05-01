# 07. 3D 시스템 설계

## 월드 레이아웃

### 공간 계층

```
Identity Core (중심)
  - 좌표: [0, 0, 0]
  - 세계의 중심, 개인 아이덴티티 표현

Featured Orbit (주요 궤도)
  - 반경: 6-8 units
  - 대표 프로젝트 3개 배치
  - BandStage: [-6, 0.5, -2]
  - PageOfArtist: [6, -0.5, -3]
  - MUSE: [0, 1, -8]

Secondary Orbit (보조 궤도)
  - 반경: 12-16 units
  - 향후 추가 프로젝트 배치 예정 영역

Ambient Objects (분위기 오브젝트)
  - 불규칙 배치, 배경 깊이감 표현
  - 작은 구체, 파티클, 기하 형태
  - 인터랙션 없음
```

### 카메라 기준 좌표

Hub Default 카메라:
- position: [0, 3, 14]
- lookAt: [0, 0, 0]
- fov: 60

---

## Identity Core

세계의 중심 오브젝트. Taebin Kim의 아이덴티티를 상징한다.

형태: 복합 구체 구조 (내부 구체 + 외부 링 2개)
크기: 반경 1.5 units

```
IdentityCore
  ├── CoreSphere (반경 1.0, 느린 자전)
  ├── OuterRing1 (반경 2.0, X축 기울임, 역방향 회전)
  └── OuterRing2 (반경 2.5, Z축 기울임, 동방향 회전)
```

다크 테마:
- CoreSphere: MeshStandardMaterial, color #1a1a1a, emissive #ffffff, emissiveIntensity 0.04
- Rings: MeshStandardMaterial, color #ffffff, emissiveIntensity 0.02

라이트 테마:
- CoreSphere: color #f0f0f0, emissive #000000, emissiveIntensity 0.02
- Rings: color #1a1a1a, emissiveIntensity 0.01

---

## 궤도 구조 (Orbit Structure)

Featured Orbit의 배치 원칙:
- 균등하지 않은 비정형 배치 (자연스러운 느낌)
- y축 offset으로 깊이감 추가
- z축 offset으로 원근감 추가
- 각 오브젝트 사이 충분한 시각적 공간 확보

오브젝트 배치:
```
BandStage:    position [-6,  0.5, -2]
PageOfArtist: position [ 6, -0.5, -3]
MUSE:         position [ 0,  1.0, -8]
```

---

## 프로젝트 오브젝트 계층 구조

```
ProjectObjectRoot
  ├── PlacementGroup      ← 세계 좌표 고정
  │     └── FloatGroup    ← 부유 애니메이션 적용
  │           └── TiltGroup  ← hover 시 미세 기울임
  │                 └── FocusGroup  ← focus 시 스케일
  │                       └── MeshGroup
  │                             ├── BaseForm         ← 카테고리 기본 형태
  │                             ├── AccentLayer      ← 카테고리 액센트 레이어
  │                             └── EmblemOrSymbol   ← 프로젝트 식별 심볼
  ├── MediaPreviewPlane   ← 선택적 미디어 프리뷰 평면
  ├── LabelGroup          ← 프로젝트 이름 레이블 (HTML 또는 drei/Text)
  └── HighlightGroup      ← hover 시 하이라이트 링/글로우
```

### PlacementGroup

세계 좌표 내 고정 위치. transform 없음.

### FloatGroup

부유 애니메이션 적용 그룹.
```
useFrame: position.y += Math.sin(elapsedTime * 0.5 + offset) * 0.05
모션 감소 모드: 애니메이션 비활성화
```

### TiltGroup

hover 시 미세한 X/Y 기울임.
```
target rotation: lerp to (0.1, 0.05, 0)
idle rotation: lerp to (0, 0, 0)
lerp speed: 0.05
```

### FocusGroup

focus 시 스케일 업.
```
target scale: lerp to (1.15, 1.15, 1.15)
idle scale: lerp to (1, 1, 1)
```

### HighlightGroup

hover 시 활성화. 오브젝트 주변 링 또는 outline.
카테고리 색상 또는 흰색.
emissiveIntensity 증가로 빛남 효과.

---

## Signal Orb (Music Projects)

```
BaseForm: SphereGeometry (반경 0.8, segments 32)
AccentLayer: TorusGeometry (반경 1.2, tube 0.02, 기울임 적용)
EmblemOrSymbol: 음파 형태의 선형 심볼 (plane + texture 또는 Tube)
```

BandStage 변형:
- Layered Device 세컨더리 액센트 추가
- 구체 외부에 얇은 패널 레이어

PageOfArtist 변형:
- BandStage와 동일한 구조
- 심볼 형태만 다름

---

## Data Crystal (AI Projects)

```
BaseForm: OctahedronGeometry (반경 0.9) 또는 IcosahedronGeometry
AccentLayer: 반투명 외부 정팔면체 (scale 1.15, wireframe 선택)
EmblemOrSymbol: 데이터 라인 텍스처 또는 점 패턴
```

MUSE 변형:
- Signal Orb 기반 + Data Crystal 세컨더리
- 구체 + 결정형 outer shell 조합

---

## Layered Device (Design Projects)

```
BaseForm: BoxGeometry 또는 ExtrudeGeometry 기반 패널
AccentLayer: 더 얇은 패널들이 offset 배치
EmblemOrSymbol: 격자 또는 모듈 패턴
```

---

## 카메라 상태 정의

```typescript
type CameraState =
  | 'intro'               // 인트로 영화적 공개
  | 'hub_default'         // 세계 기본 뷰
  | 'hover_soft_follow'   // hover 미세 이동
  | 'project_focus_move'  // 프로젝트로 이동 중
  | 'project_focus_hold'  // 프로젝트 포커스 완료
  | 'detail_overlay_hold' // overlay 열린 상태 유지
  | 'reset_move'          // 세계로 복귀 이동 중
```

### 상태별 카메라 동작

intro:
- 시작: position [0, 8, 20], lookAt [0, 0, 0]
- 끝: hub_default 위치로 이동
- 지속 시간: 2-3초, easing: easeOutCubic

hub_default:
- position: [0, 3, 14], lookAt: [0, 0, 0]
- 부드러운 미세 흔들림 없음 (고요)

hover_soft_follow:
- hub_default에서 ±0.3 units 이내의 미세 이동
- 과도한 이동 금지

project_focus_move:
- 각 프로젝트별 사전 설정된 안전 카메라 위치로 이동
- lerp speed: 0.03-0.05
- 이동 완료 시 project_focus_hold로 전환

project_focus_hold:
- 프로젝트 앞, 약간 offset된 위치에서 고정
- 미세 흔들림 없음

detail_overlay_hold:
- project_focus_hold와 동일 또는 약간 뒤로 후퇴
- overlay가 화면을 차지하므로 씬은 배경으로만

reset_move:
- hub_default로 복귀
- lerp speed: 0.04

### 프로젝트별 카메라 목표

```
BandStage focus:
  position: [-5, 1, 4]
  lookAt: [-6, 0.5, -2]

PageOfArtist focus:
  position: [5, 0, 4]
  lookAt: [6, -0.5, -3]

MUSE focus:
  position: [1, 2, -2]
  lookAt: [0, 1, -8]
```

---

## 조명 시스템

```
AmbientLight
  - 다크: intensity 0.3, color #ffffff
  - 라이트: intensity 0.5, color #ffffff

DirectionalLight (주 조명)
  - position: [8, 12, 8]
  - 다크: intensity 1.2, color #ffffff
  - 라이트: intensity 1.8, color #fff8f0

PointLight (Identity Core 보조)
  - position: [0, 2, 2]
  - 다크: intensity 0.8, color #c0c0ff
  - 라이트: intensity 0.4, color #4040ff
  - distance: 12, decay: 2

HemisphereLight (환경광)
  - 다크: skyColor #111133, groundColor #000000, intensity 0.4
  - 라이트: skyColor #e0e8ff, groundColor #a0a060, intensity 0.3
```

---

## 인터랙션 규칙

hover:
- onPointerEnter → hovered 상태 활성화
- cursor 변경: grab 또는 pointer
- HighlightGroup 활성화
- LabelGroup 표시 강화
- 카메라 미세 이동

click:
- onClick → focused 상태 활성화
- 카메라 해당 프로젝트로 이동
- overlay 열기 (worldStore를 통해)

focus 해제:
- overlay 닫기 → returnToWorld()
- 카메라 hub_default로 복귀
- focused 상태 해제

이중 클릭:
- 이미 focused 상태의 오브젝트를 다시 클릭하면 overlay 다시 열기

---

## 성능 전략

기하학적 복잡도:
- 기본 형태: segments 16-32 (세부 오브젝트)
- 파티클: 최대 200개
- Ambient Objects: 최대 20개, segments 8

텍스처:
- 텍스처 없이 material만으로 표현 (초기)
- 필요 시 512x512 이하 텍스처 사용

인스턴싱:
- Ambient Objects: InstancedMesh 사용

렌더링:
- antialias: true (데스크톱), false (모바일)
- pixelRatio: min(devicePixelRatio, 2)
- shadowMap: 비활성화 (성능)
- tone mapping: ACESFilmicToneMapping

모바일:
- 씬 전체 비로딩
- 2D fallback 자동 활성화
- useWebGLRenderer 훅으로 WebGL 지원 여부 감지

---

## Fallback 전략

WebGL 미지원 감지:
```typescript
const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    )
  } catch (e) {
    return false
  }
}
```

Fallback UI:
- 동일한 프로젝트 목록을 카드 그리드로 표시
- 동일한 overlay 시스템 사용
- 동일한 콘텐츠 접근성 보장

---

## 다크/라이트 테마 3D 동작

테마 변경 이벤트:
1. themeStore에서 테마 변경 이벤트 발생
2. WorldScene이 테마 상태를 구독
3. 모든 material의 color, emissive 값을 새 테마값으로 전환
4. 조명 intensity와 color 조정
5. 전환은 즉시 (flash 없이) 또는 짧은 lerp (0.1-0.2초)로 처리

3D 씬은 CSS 변수를 직접 읽지 않는다.
테마별 Three.js 색상값은 코드에 정의된 상수로 관리한다.

```typescript
export const THEME_3D_CONFIG = {
  dark: {
    ambient: { intensity: 0.3, color: '#ffffff' },
    directional: { intensity: 1.2, color: '#ffffff' },
    core: { color: '#1a1a1a', emissive: '#ffffff', emissiveIntensity: 0.04 },
  },
  light: {
    ambient: { intensity: 0.5, color: '#ffffff' },
    directional: { intensity: 1.8, color: '#fff8f0' },
    core: { color: '#f0f0f0', emissive: '#000000', emissiveIntensity: 0.02 },
  },
}
```
