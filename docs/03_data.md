# 03. 데이터 설계

## ERD 개요

```
AdminUser
  └─── AuditLog

Profile
  └─── SocialLink

Category
  └─── Project (1:N)

Project
  ├─── ProjectMedia (1:N)
  ├─── ProjectDocument (1:N)
  ├─── ProjectLink (1:N)
  └─── ProjectTag (M:N via ProjectTag)

Tag
  └─── ProjectTag (M:N via ProjectTag)

ContactMessage

Asset
```

---

## 데이터 모델 정의

### AdminUser

관리자 계정 정보를 저장한다.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (UUID) | 기본키 |
| email | String | 이메일, unique |
| passwordHash | String | bcrypt 해시 |
| role | Enum | ADMIN |
| isActive | Boolean | 활성 상태 |
| lastLoginAt | DateTime? | 마지막 로그인 시각 |
| createdAt | DateTime | 생성 시각 |
| updatedAt | DateTime | 수정 시각 |

### Profile

Taebin Kim의 개인 프로필 정보를 저장한다. 단일 레코드.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (UUID) | 기본키 |
| name | String | 실명 (Taebin Kim) |
| roleTitle | String | 역할 (Frontend Developer) |
| tagline | String | 철학 라인 |
| bio | String | 소개 텍스트 |
| workingMethod | String | 일하는 방식 설명 (Markdown) |
| avatarUrl | String? | 프로필 이미지 URL |
| resumeUrl | String? | 이력서 URL |
| location | String? | 위치 |
| createdAt | DateTime | 생성 시각 |
| updatedAt | DateTime | 수정 시각 |

### SocialLink

프로필의 소셜/외부 링크 목록.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (UUID) | 기본키 |
| profileId | String | Profile 외래키 |
| platform | String | 플랫폼 이름 (GitHub, LinkedIn 등) |
| url | String | 링크 URL |
| order | Int | 표시 순서 |
| createdAt | DateTime | 생성 시각 |

### Category

프로젝트 카테고리.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (UUID) | 기본키 |
| name | String | 카테고리 이름 |
| slug | String | URL 슬러그, unique |
| objectFamily | String | 3D 오브젝트 패밀리 (signal_orb, data_crystal, layered_device 등) |
| order | Int | 표시 순서 |
| createdAt | DateTime | 생성 시각 |

초기 데이터:
- music_projects: Signal Orb
- ai_projects: Data Crystal
- design_projects: Layered Device

### Project

포트폴리오 프로젝트 정보의 핵심 모델.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (UUID) | 기본키 |
| title | String | 프로젝트 이름 |
| slug | String | URL 슬러그, unique |
| summary | String | 한 줄 요약 |
| description | String | 상세 설명 (Markdown) |
| categoryId | String | 주 카테고리 외래키 |
| secondaryCategoryId | String? | 부 카테고리 외래키 |
| year | Int | 프로젝트 연도 |
| role | String | 담당 역할 |
| contribution | String | 기여 내역 설명 |
| techStack | String[] | 기술 스택 목록 |
| keyLearnings | String | 주요 학습 내용 (Markdown) |
| workingApproach | String? | 구현 접근 방식 설명 |
| thumbnailUrl | String? | 썸네일 이미지 URL |
| heroImageUrl | String? | 히어로 이미지 URL |
| isFeatured | Boolean | 대표 프로젝트 여부 |
| featuredOrder | Int? | 대표 프로젝트 내 순서 |
| isPublished | Boolean | 공개 여부 |
| deletedAt | DateTime? | 소프트 삭제 시각 |
| createdAt | DateTime | 생성 시각 |
| updatedAt | DateTime | 수정 시각 |

### ProjectMedia

프로젝트에 속하는 이미지/미디어 목록.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (UUID) | 기본키 |
| projectId | String | Project 외래키 |
| type | Enum | IMAGE, VIDEO_PLACEHOLDER, VIDEO_EMBED |
| url | String? | 실제 파일 URL (없으면 null) |
| placeholderLabel | String? | 플레이스홀더 레이블 (예: "데모 영상 준비 중") |
| embedId | String? | YouTube/Vimeo embed ID |
| altText | String? | 이미지 alt 텍스트 |
| caption | String? | 캡션 |
| order | Int | 표시 순서 |
| isPlaceholder | Boolean | 플레이스홀더 여부 |
| createdAt | DateTime | 생성 시각 |

### ProjectDocument

프로젝트 관련 문서/보고서 목록.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (UUID) | 기본키 |
| projectId | String | Project 외래키 |
| type | Enum | REPORT, PRESENTATION, MARKDOWN, OTHER |
| title | String | 문서 제목 |
| url | String? | 실제 파일 URL (없으면 null) |
| placeholderLabel | String? | 플레이스홀더 레이블 (예: "최종 보고서 업로드 예정") |
| isPlaceholder | Boolean | 플레이스홀더 여부 |
| order | Int | 표시 순서 |
| createdAt | DateTime | 생성 시각 |

### ProjectLink

프로젝트 외부 링크 목록.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (UUID) | 기본키 |
| projectId | String | Project 외래키 |
| type | Enum | GITHUB, DEMO, DOCS, EXTERNAL |
| label | String | 링크 레이블 |
| url | String | 링크 URL |
| order | Int | 표시 순서 |
| createdAt | DateTime | 생성 시각 |

### Tag

프로젝트 태그.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (UUID) | 기본키 |
| name | String | 태그 이름 |
| slug | String | URL 슬러그, unique |
| createdAt | DateTime | 생성 시각 |

### ProjectTag

Project와 Tag의 M:N 관계 테이블.

| 필드 | 타입 | 설명 |
|------|------|------|
| projectId | String | Project 외래키 |
| tagId | String | Tag 외래키 |
| (복합 기본키: projectId + tagId) | | |

### ContactMessage

방문자 연락 폼으로 수신된 메시지.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (UUID) | 기본키 |
| name | String | 발신자 이름 |
| email | String | 발신자 이메일 |
| message | String | 메시지 내용 |
| isRead | Boolean | 읽음 여부 |
| ipAddress | String? | 발신자 IP (rate limit 참조용) |
| createdAt | DateTime | 생성 시각 |

### Asset

업로드된 파일 자산을 추적하는 범용 모델.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (UUID) | 기본키 |
| filename | String | 파일 이름 |
| originalName | String | 원본 파일 이름 |
| mimeType | String | MIME 타입 |
| size | Int | 파일 크기 (bytes) |
| url | String | 저장 URL |
| createdAt | DateTime | 생성 시각 |

### AuditLog

관리자 주요 작업 로그.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (UUID) | 기본키 |
| adminId | String | AdminUser 외래키 |
| action | String | 수행 작업 (예: PROJECT_CREATE) |
| entityType | String | 대상 엔티티 타입 |
| entityId | String? | 대상 엔티티 ID |
| metadata | Json? | 추가 컨텍스트 |
| createdAt | DateTime | 생성 시각 |

---

## 플레이스홀더 자산 구조

미디어/문서/영상이 아직 준비되지 않은 경우:

1. isPlaceholder = true 로 설정
2. url = null
3. placeholderLabel에 표시할 메시지 입력 (예: "데모 영상 준비 중입니다")
4. UI는 isPlaceholder 여부를 확인하여 준비 중 상태 표시
5. 나중에 실제 파일이 준비되면 url을 업데이트하고 isPlaceholder = false 로 변경

이 구조를 통해 플레이스홀더 → 실제 파일로의 전환이 최소한의 변경으로 가능하다.

---

## Redis 활용 전략

### 현재 계획

연락 폼 rate limit
- 키: contact_rate_limit:{ip}
- 값: 제출 횟수
- TTL: 1시간
- 제한: 시간당 5회

관리자 로그인 시도 제한
- 키: admin_login_fail:{email}
- 값: 실패 횟수
- TTL: 15분
- 제한: 5회 실패 후 15분 잠금

### 미래 확장 계획

- 공개 API 응답 캐시 (프로젝트 목록)
- 세션 스토어 (필요 시)
- 실시간 기능 기반 (필요 시)

### Redis 키 네이밍 규칙

형식: {namespace}:{entity_type}:{identifier}
예시:
- rate_limit:contact:{ip}
- rate_limit:login:{email}
- cache:projects:featured
- cache:project:{slug}
