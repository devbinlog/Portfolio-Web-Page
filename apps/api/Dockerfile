FROM node:20-alpine AS base
RUN npm install -g pnpm

# ── 의존성 설치 ──────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile

# ── 빌드 ──────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .

RUN pnpm --filter=api build
# Prisma Client 생성
RUN cd apps/api && npx prisma generate

# ── 프로덕션 런타임 ──────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# 빌드 결과물 복사
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nestjs
EXPOSE 4000

# 마이그레이션 후 서버 시작
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
