import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '../modules/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../common/prisma/prisma.service'
import { RedisService } from '../common/redis/redis.service'
import * as bcrypt from 'bcrypt'

// Prisma 모킹
const mockPrisma = {
  adminUser: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
} as unknown as PrismaService

// Redis 모킹
const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
} as unknown as RedisService

// JWT 모킹
const mockJwt = {
  sign: vi.fn().mockReturnValue('mock.jwt.token'),
} as unknown as JwtService

describe('AuthService', () => {
  let service: AuthService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new AuthService(mockPrisma, mockJwt, mockRedis)
  })

  it('정상 로그인 시 JWT 반환', async () => {
    const hashedPw = await bcrypt.hash('password123', 10)
    ;(mockPrisma.adminUser.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'user-1',
      email: 'admin@test.com',
      password: hashedPw,
      role: 'ADMIN',
      isActive: true,
    })
    ;(mockRedis.get as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(mockPrisma.adminUser.update as ReturnType<typeof vi.fn>).mockResolvedValue({})

    const result = await service.login({ email: 'admin@test.com', password: 'password123' })

    expect(result).toHaveProperty('accessToken')
    expect(result.accessToken).toBe('mock.jwt.token')
  })

  it('존재하지 않는 이메일 → UnauthorizedException', async () => {
    ;(mockPrisma.adminUser.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(mockRedis.get as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    await expect(
      service.login({ email: 'none@test.com', password: 'pw' }),
    ).rejects.toThrow()
  })

  it('잘못된 비밀번호 → UnauthorizedException', async () => {
    const hashedPw = await bcrypt.hash('correct', 10)
    ;(mockPrisma.adminUser.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'user-1',
      email: 'admin@test.com',
      password: hashedPw,
      role: 'ADMIN',
      isActive: true,
    })
    ;(mockRedis.get as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    await expect(
      service.login({ email: 'admin@test.com', password: 'wrong' }),
    ).rejects.toThrow()
  })
})
