# 04. API 설계

## API 기본 규칙

- 기본 URL: /api/v1
- 인증 방식: JWT Bearer Token
- 콘텐츠 타입: application/json
- 공개 엔드포인트: 인증 불필요
- 관리자 엔드포인트: Authorization: Bearer {token} 필수

---

## 에러 응답 구조

모든 에러 응답은 아래 형식을 따른다.

```json
{
  "statusCode": 400,
  "error": "BAD_REQUEST",
  "message": "요청 데이터가 올바르지 않습니다.",
  "details": [
    {
      "field": "email",
      "message": "올바른 이메일 형식이 아닙니다."
    }
  ],
  "timestamp": "2025-01-01T00:00:00.000Z",
  "path": "/api/v1/contacts"
}
```

에러 코드 목록:
- 400 BAD_REQUEST: 요청 데이터 유효성 오류
- 401 UNAUTHORIZED: 인증 토큰 없음 또는 만료
- 403 FORBIDDEN: 권한 없음
- 404 NOT_FOUND: 리소스 없음
- 409 CONFLICT: 중복 데이터 (슬러그 등)
- 429 TOO_MANY_REQUESTS: rate limit 초과
- 500 INTERNAL_SERVER_ERROR: 서버 내부 오류

---

## 공개 API

### 프로젝트 조회

```
GET /api/v1/projects
```
공개된 전체 프로젝트 목록 반환.

쿼리 파라미터:
- category: 카테고리 슬러그 필터
- featured: true이면 대표 프로젝트만 반환
- page: 페이지 번호 (기본 1)
- limit: 페이지당 항목 수 (기본 20, 최대 50)

응답:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "BandStage",
      "slug": "bandstage",
      "summary": "음악 공연 플랫폼",
      "category": { "id": "uuid", "name": "Music Projects", "slug": "music_projects" },
      "year": 2024,
      "thumbnailUrl": "https://...",
      "isFeatured": true,
      "featuredOrder": 1,
      "tags": [{ "name": "React", "slug": "react" }]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

```
GET /api/v1/projects/:slug
```
슬러그 기준 단일 프로젝트 상세 반환.

응답: 전체 프로젝트 데이터 (media, documents, links, tags 포함)

```json
{
  "id": "uuid",
  "title": "BandStage",
  "slug": "bandstage",
  "summary": "음악 공연 플랫폼",
  "description": "마크다운 형식의 상세 설명",
  "category": { ... },
  "secondaryCategory": { ... },
  "year": 2024,
  "role": "프론트엔드 개발",
  "contribution": "전체 프론트엔드 설계 및 구현",
  "techStack": ["React", "Next.js", "TypeScript"],
  "keyLearnings": "마크다운 형식의 학습 내용",
  "workingApproach": "접근 방식 설명",
  "thumbnailUrl": "https://...",
  "heroImageUrl": "https://...",
  "media": [
    {
      "id": "uuid",
      "type": "IMAGE",
      "url": "https://...",
      "altText": "스크린샷",
      "order": 1,
      "isPlaceholder": false
    },
    {
      "id": "uuid",
      "type": "VIDEO_PLACEHOLDER",
      "url": null,
      "placeholderLabel": "데모 영상 준비 중입니다",
      "order": 2,
      "isPlaceholder": true
    }
  ],
  "documents": [
    {
      "id": "uuid",
      "type": "REPORT",
      "title": "최종 보고서",
      "url": null,
      "placeholderLabel": "보고서 업로드 예정",
      "isPlaceholder": true,
      "order": 1
    }
  ],
  "links": [
    { "type": "GITHUB", "label": "GitHub", "url": "https://github.com/..." },
    { "type": "DEMO", "label": "Live Demo", "url": "https://..." }
  ],
  "tags": [...]
}
```

### 카테고리 조회

```
GET /api/v1/categories
```
카테고리 목록 반환.

### 프로필 조회

```
GET /api/v1/profile
```
공개 프로필 정보 반환.

```json
{
  "name": "Taebin Kim",
  "roleTitle": "Frontend Developer",
  "tagline": "Building imagination through structure and interaction.",
  "bio": "소개 텍스트",
  "workingMethod": "마크다운 형식의 일하는 방식",
  "avatarUrl": "https://...",
  "resumeUrl": "https://...",
  "socialLinks": [
    { "platform": "GitHub", "url": "https://github.com/..." },
    { "platform": "LinkedIn", "url": "https://..." }
  ]
}
```

### 연락 폼

```
POST /api/v1/contacts
```
연락 메시지 제출.

요청:
```json
{
  "name": "홍길동",
  "email": "hong@example.com",
  "message": "안녕하세요, 연락드립니다."
}
```

응답 (200):
```json
{
  "message": "메시지가 성공적으로 전송되었습니다."
}
```

rate limit: IP당 시간당 5회

### 헬스 체크

```
GET /api/v1/health
```
서버, DB, Redis 상태 반환.

```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "services": {
    "database": "ok",
    "redis": "ok"
  }
}
```

---

## 관리자 API

### 인증

```
POST /api/v1/admin/auth/login
```
관리자 로그인.

요청:
```json
{
  "email": "admin@taebinkim.com",
  "password": "password"
}
```

응답:
```json
{
  "accessToken": "jwt_token",
  "expiresIn": 3600
}
```

rate limit: 이메일당 5회 실패 시 15분 잠금

```
POST /api/v1/admin/auth/logout
```
로그아웃 (토큰 무효화 준비 구조).

### 프로젝트 관리

```
GET /api/v1/admin/projects
```
전체 프로젝트 목록 (비공개 포함).

```
POST /api/v1/admin/projects
```
새 프로젝트 생성.

```
PUT /api/v1/admin/projects/:id
```
프로젝트 전체 수정.

```
PATCH /api/v1/admin/projects/:id
```
프로젝트 부분 수정.

```
DELETE /api/v1/admin/projects/:id
```
프로젝트 소프트 삭제.

```
PATCH /api/v1/admin/projects/:id/publish
```
공개 상태 전환.

```
PATCH /api/v1/admin/projects/reorder
```
Featured 프로젝트 순서 변경.

요청:
```json
{
  "orderedIds": ["uuid1", "uuid2", "uuid3"]
}
```

### 미디어 관리

```
GET /api/v1/admin/projects/:projectId/media
```
프로젝트 미디어 목록.

```
POST /api/v1/admin/projects/:projectId/media
```
미디어 추가 (파일 업로드 또는 플레이스홀더 메타데이터).

요청 (플레이스홀더):
```json
{
  "type": "VIDEO_PLACEHOLDER",
  "placeholderLabel": "데모 영상 준비 중입니다",
  "order": 1
}
```

요청 (이미지 업로드): multipart/form-data

```
PUT /api/v1/admin/projects/:projectId/media/:mediaId
```
미디어 수정 (플레이스홀더를 실제 파일로 교체 포함).

```
DELETE /api/v1/admin/projects/:projectId/media/:mediaId
```
미디어 삭제.

```
PATCH /api/v1/admin/projects/:projectId/media/reorder
```
미디어 순서 변경.

### 문서 관리

```
GET/POST/PUT/DELETE /api/v1/admin/projects/:projectId/documents
```
문서 CRUD. 미디어 관리와 동일한 패턴 적용.

### 링크 관리

```
GET/POST/PUT/DELETE /api/v1/admin/projects/:projectId/links
```
링크 CRUD.

### 연락 메시지 관리

```
GET /api/v1/admin/contacts
```
수신된 메시지 목록.

```
PATCH /api/v1/admin/contacts/:id/read
```
읽음 상태로 변경.

```
DELETE /api/v1/admin/contacts/:id
```
메시지 삭제.

### 프로필 관리

```
GET /api/v1/admin/profile
```
프로필 정보 조회.

```
PUT /api/v1/admin/profile
```
프로필 정보 전체 수정.

```
POST/PUT/DELETE /api/v1/admin/profile/social-links
```
소셜 링크 관리.
