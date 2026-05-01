# 08. 배포 및 운영 설계

## 환경 구성

### 환경 종류

local (로컬 개발)
- docker compose up으로 전체 스택 실행
- 코드 변경 시 hot reload
- 테스트 데이터 사용

staging (스테이징)
- CI/CD 자동 배포
- 프로덕션과 동일한 Docker 구성
- 테스트 데이터 또는 스테이징 데이터

production (프로덕션)
- 안정 버전만 배포
- 실제 데이터
- 마이그레이션 수동 확인 후 적용

---

## 환경 변수 구조

### apps/api/.env.example

```env
# 서버
NODE_ENV=development
PORT=4000

# 데이터베이스
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=3600

# 파일 업로드
UPLOAD_DEST=./uploads
MAX_FILE_SIZE=10485760

# CORS
CORS_ORIGIN=http://localhost:3000

# 로깅
LOG_LEVEL=debug
```

### apps/web/.env.example

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# 사이트 URL (SEO)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 분석 (선택)
# NEXT_PUBLIC_GA_ID=

# 기능 플래그
NEXT_PUBLIC_ENABLE_3D=true
```

---

## Docker 전략

### 서비스 구성

```yaml
# docker-compose.yml (로컬 개발)
services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./apps/web:/app/apps/web
      - /app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
    depends_on:
      - api

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile.dev
    ports:
      - "4000:4000"
    volumes:
      - ./apps/api:/app/apps/api
      - /app/node_modules
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/portfolio_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=portfolio_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Dockerfile (API, 개발용)

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable pnpm

FROM base AS dev
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/
RUN pnpm install
COPY apps/api ./apps/api
EXPOSE 4000
CMD ["pnpm", "--filter", "api", "run", "start:dev"]
```

### Dockerfile (API, 프로덕션)

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable pnpm

FROM base AS builder
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile
COPY apps/api ./apps/api
RUN pnpm --filter api run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/main"]
```

---

## 로컬 개발 실행 구조

전제 조건:
- Node.js 20+
- pnpm 8+
- Docker Desktop

실행 순서:
```bash
# 의존성 설치
pnpm install

# 환경변수 설정
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Docker 스택 실행 (DB, Redis)
docker compose up db redis -d

# 마이그레이션 실행
pnpm --filter api run db:migrate

# 개발 서버 실행
pnpm dev
```

또는 전체 Docker 실행:
```bash
docker compose up
```

---

## 프로덕션 배포 전략

provider-agnostic 원칙: 특정 클라우드 서비스에 종속되지 않는다.

권장 배포 환경:
- Web: Vercel (Next.js 최적화) 또는 Docker 컨테이너
- API: Railway, Fly.io, AWS ECS, 또는 VPS
- DB: Supabase, Railway PostgreSQL, 또는 자체 호스팅
- Redis: Upstash, Railway Redis, 또는 자체 호스팅

Docker 기반 VPS 배포:
```bash
# 프로덕션 빌드
docker compose -f docker-compose.prod.yml build

# 마이그레이션 확인 후 실행
docker compose -f docker-compose.prod.yml run --rm api pnpm db:migrate:deploy

# 서비스 시작
docker compose -f docker-compose.prod.yml up -d
```

---

## 마이그레이션 전략

개발 환경:
```bash
# 새 마이그레이션 생성
pnpm --filter api run db:migrate:dev --name migration_name

# 마이그레이션 적용 (개발)
pnpm --filter api run db:migrate
```

프로덕션 환경:
```bash
# 마이그레이션 적용 (프로덕션, 롤백 불가)
pnpm --filter api run db:migrate:deploy
```

규칙:
- 프로덕션 마이그레이션 적용 전 반드시 백업
- 파괴적 변경(컬럼 삭제, 타입 변경)은 단계별 마이그레이션으로 처리
- 마이그레이션 파일은 절대 수정하지 않음

---

## CI/CD 파이프라인

### GitHub Actions 구성

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
```

---

## 로깅 전략

### 구조화 로그 형식

```json
{
  "timestamp": "2025-01-01T00:00:00.000Z",
  "level": "info",
  "context": "ProjectsService",
  "message": "Project created",
  "metadata": {
    "projectId": "uuid",
    "adminId": "uuid"
  }
}
```

로그 레벨:
- debug: 개발 환경 상세 정보
- info: 중요 이벤트 (요청, 응답, 주요 작업)
- warn: 잠재적 문제 (rate limit 근접, 비정상 요청)
- error: 처리 가능한 오류
- fatal: 서비스 중단 오류

---

## 헬스 체크

```
GET /api/v1/health
```

응답 (모두 정상):
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 3600,
  "services": {
    "database": "ok",
    "redis": "ok"
  }
}
```

응답 (일부 장애):
```json
{
  "status": "degraded",
  "services": {
    "database": "ok",
    "redis": "error"
  }
}
```

Docker Compose healthcheck:
```yaml
healthcheck:
  test: ["CMD", "wget", "-q", "-O", "-", "http://localhost:4000/api/v1/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```
