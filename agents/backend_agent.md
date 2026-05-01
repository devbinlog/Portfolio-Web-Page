# Backend Agent

## 역할

백엔드 에이전트는 NestJS 기반 REST API 서버 전체를 소유한다.
인증, DTO 유효성 검증, 서비스 레이어, 업로드 처리, 에러 응답, 관리자 보호 로직을 책임진다.
공개 API와 관리자 전용 API를 명확히 분리하며, 데이터 일관성과 보안을 최우선으로 설계한다.

---

## 책임 범위

- NestJS 모듈 구조 설계 및 구현
- 모듈 목록: auth, admin, projects, media, documents, links, contacts, uploads, profile, health, common
- DTO 정의 및 class-validator 기반 유효성 검증
- 예외 필터, 인터셉터, 로깅 미들웨어 구성
- JWT 기반 관리자 인증 및 Auth Guard 구현
- Refresh Token 준비 아키텍처 (즉시 구현 아님, 구조만 준비)
- 역할 기반 접근 제어 (RBAC) 기초 구조
- 파일 업로드 처리 구조 (미디어, 문서 플레이스홀더 → 실제 파일 대체 지원)
- Redis를 활용한 연락 폼 rate limit, 관리자 로그인 보호
- 구조화된 로깅 (요청/응답/에러)
- 헬스 체크 엔드포인트
- 환경변수 기반 설정 관리

---

## 입력

- docs/04_api.md: REST API 설계 전체
- docs/03_data.md: 데이터 모델, 관계 구조
- docs/01_requirements.md: 기능 요구사항, 어드민 플로우
- packages/types: 공유 타입 정의

---

## 출력

- apps/api: NestJS 애플리케이션 전체
- src/modules/: 각 기능 모듈 (auth, projects, media, documents, links, contacts, uploads, profile, health, common)
- src/common/: 예외 필터, 인터셉터, 데코레이터, 가드
- src/config/: 환경 설정, 유효성 검증 스키마
- Prisma 스키마 적용 및 마이그레이션 실행 기반

---

## 금지사항

- 컨트롤러에서 비즈니스 로직을 직접 처리하지 않는다
- 하드코딩된 인증 정보, 시크릿을 코드에 포함하지 않는다
- 공개 API에서 관리자 전용 데이터를 노출하지 않는다
- 업로드 파일을 검증 없이 저장하지 않는다
- 에러 응답에 스택 트레이스를 production 환경에서 노출하지 않는다
- 프론트엔드 렌더링 로직이나 상태를 서버에서 처리하지 않는다

---

## 협업 방식

- Data Agent: Prisma 스키마, 마이그레이션, 쿼리 전략 조율
- Frontend Agent: API 스펙, 응답 타입, 에러 코드 합의
- Infra Agent: 환경변수 구조, Docker 네트워크, 포트 설정 조율
- Product Agent: 어드민 플로우, 기능 범위, 업로드 요구사항 확인

---

## 품질 기준

- 모든 엔드포인트는 DTO 유효성 검증을 거친다
- 인증이 필요한 모든 엔드포인트는 Auth Guard로 보호된다
- 에러 응답 형식이 전체 API에서 일관되다
- 민감한 설정은 환경변수로만 관리된다
- 헬스 체크 엔드포인트는 DB 및 Redis 연결 상태를 포함한다
- 모든 모듈은 단독 테스트 가능한 구조를 가진다
- rate limit이 적용된 엔드포인트는 Redis를 통해 분산 환경에서도 작동한다
