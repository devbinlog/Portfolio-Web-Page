# 09. 테스트 계획

## 테스트 범위

이 프로젝트에서 테스트가 보장해야 하는 핵심 영역:

1. 퍼블릭 경험: 랜딩, 3D 월드 렌더링, 프로젝트 탐색, 상세 보기
2. 어드민 기능: 로그인, 프로젝트 CRUD, 미디어/문서 관리
3. 플레이스홀더: 미디어/문서 없는 상태에서의 UI 처리
4. 성능/접근성: 모션 감소, 모바일 fallback, 테마 전환
5. API 통합: 엔드포인트 응답, 에러 처리, rate limit

---

## 테스트 도구

단위/통합 테스트: Vitest
e2e 테스트: Playwright
API 테스트: Vitest (NestJS 모듈 테스트) + supertest

---

## 핵심 사용자 시나리오

### 시나리오 1: 랜딩 페이지 로드

조건: 데스크톱 브라우저, WebGL 지원
단계:
1. 루트 URL 접속
2. 페이지 로드 완료 확인
3. "Taebin Kim" 텍스트 표시 확인
4. "Frontend Developer" 텍스트 표시 확인
5. 3D 씬 로딩 완료 확인 (또는 로딩 중 상태 확인)

### 시나리오 2: 월드 렌더링 Fallback

조건: WebGL 미지원 브라우저 (mocked)
단계:
1. WebGL 미지원 상태 시뮬레이션
2. 2D fallback UI 표시 확인
3. 프로젝트 목록이 카드 형식으로 표시 확인
4. 모든 프로젝트 콘텐츠 접근 가능 확인

### 시나리오 3: 프로젝트 탐색

단계:
1. 랜딩 페이지에서 프로젝트 오브젝트 (또는 fallback 카드) 클릭
2. overlay 열림 확인
3. 프로젝트 제목 표시 확인
4. 기술 스택 태그 표시 확인
5. 링크 버튼 표시 확인
6. ESC 키로 overlay 닫힘 확인
7. 닫기 버튼으로 overlay 닫힘 확인

### 시나리오 4: 프로젝트 상세 페이지

단계:
1. /projects/bandstage 직접 접속
2. 페이지 제목 "BandStage" 표시 확인
3. 상세 설명 표시 확인
4. 갤러리 이미지 표시 (있는 경우) 확인
5. 영상 플레이스홀더 섹션 표시 확인 (isPlaceholder=true)
6. 문서 플레이스홀더 섹션 표시 확인 (isPlaceholder=true)
7. GitHub 링크 버튼 표시 확인

### 시나리오 5: 연락 폼 제출

단계:
1. 연락처 페이지 접속
2. 이름, 이메일, 메시지 입력
3. 제출 버튼 클릭
4. 성공 메시지 표시 확인
5. 잘못된 이메일 입력 시 오류 메시지 확인

### 시나리오 6: 다크/라이트 테마 전환

단계:
1. 다크 모드에서 페이지 로드
2. 테마 토글 버튼 클릭
3. 라이트 모드로 전환 확인 (flash 없이)
4. 모든 텍스트 가독성 유지 확인
5. 3D 씬 조명 변화 확인 (가능한 경우)
6. 새로고침 후 라이트 모드 유지 확인

---

## 관리자 시나리오

### 시나리오 7: 관리자 로그인

단계:
1. /admin/login 접속
2. 올바른 이메일/패스워드 입력
3. 대시보드 리디렉션 확인
4. 잘못된 패스워드 입력 시 오류 메시지 확인
5. 5회 실패 후 잠금 확인

### 시나리오 8: 프로젝트 생성

단계:
1. 관리자 대시보드에서 프로젝트 생성 클릭
2. 제목, 슬러그, 요약, 설명 입력
3. 카테고리 선택
4. 저장 클릭
5. 프로젝트 목록에 새 항목 표시 확인

### 시나리오 9: 미디어 플레이스홀더 관리

단계:
1. 관리자에서 프로젝트 편집 접근
2. 미디어 섹션에서 "영상 플레이스홀더 추가" 클릭
3. placeholderLabel 입력: "데모 영상 준비 중입니다"
4. 저장 후 공개 페이지에서 플레이스홀더 표시 확인

---

## 상세/미디어/문서 플레이스홀더 시나리오

### 시나리오 10: 플레이스홀더 렌더링

단계:
1. isPlaceholder=true인 미디어 항목이 있는 프로젝트 접속
2. 영상 플레이스홀더 섹션에서 "준비 중" 상태 UI 표시 확인
3. 실제 영상 플레이어가 표시되지 않음 확인
4. placeholderLabel 텍스트 정확히 표시 확인

### 시나리오 11: 플레이스홀더 → 실제 파일 전환

단계:
1. 관리자에서 플레이스홀더 항목 편집
2. isPlaceholder=false로 변경, url 추가
3. 공개 페이지에서 실제 콘텐츠 표시 확인

---

## Fallback/성능 시나리오

### 시나리오 12: 감소된 모션 모드

단계:
1. prefers-reduced-motion: reduce 설정 (Playwright 지원)
2. 3D 오브젝트 부유 애니메이션 비활성화 확인
3. 페이지 로드 및 콘텐츠 접근 정상 확인

### 시나리오 13: 모바일 fallback

단계:
1. 모바일 viewport (375px) 설정
2. 3D 씬 비로딩 확인
3. 2D 프로젝트 카드 표시 확인
4. 내비게이션 메뉴 정상 작동 확인

---

## 백엔드 모듈 테스트

### 프로젝트 서비스 테스트

- findAll(): 공개된 프로젝트 목록 반환
- findAll({ featured: true }): 대표 프로젝트만 반환
- findBySlug(slug): 올바른 프로젝트 반환
- findBySlug('invalid'): NotFoundException 발생
- create(dto): 새 프로젝트 생성
- create(dto): 중복 슬러그 시 ConflictException 발생

### 연락 서비스 테스트

- create(dto): 정상 메시지 저장
- create(dto): rate limit 초과 시 TooManyRequestsException 발생

### 인증 서비스 테스트

- login(dto): 올바른 자격증명 → JWT 반환
- login(dto): 잘못된 패스워드 → UnauthorizedException
- login(dto): 계정 잠금 상태 → UnauthorizedException

---

## API 통합 테스트

테스트 환경: 별도 테스트 DB 사용

주요 테스트 케이스:
- GET /api/v1/projects → 200, 프로젝트 배열 반환
- GET /api/v1/projects?featured=true → 200, featured 프로젝트만
- GET /api/v1/projects/bandstage → 200, 프로젝트 상세
- GET /api/v1/projects/invalid → 404
- POST /api/v1/contacts → 200, 메시지 저장
- POST /api/v1/contacts (잘못된 이메일) → 400
- POST /api/v1/admin/auth/login → 200, accessToken
- POST /api/v1/admin/auth/login (잘못된 패스워드) → 401
- GET /api/v1/admin/projects (토큰 없음) → 401
- GET /api/v1/admin/projects (유효한 토큰) → 200
- GET /api/v1/health → 200, 서비스 상태
