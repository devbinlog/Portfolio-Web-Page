import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../common/prisma/prisma.service'
import { RedisService } from '../../common/redis/redis.service'
import type { LoginDto } from './dto/login.dto'

const LOGIN_FAIL_MAX = 5
const LOGIN_LOCK_TTL = 900 // 15분

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
  ) {}

  async login(dto: LoginDto) {
    await this.checkLoginLock(dto.email)

    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    })

    if (!admin || !admin.isActive) {
      await this.incrementLoginFail(dto.email)
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.')
    }

    const isValid = await bcrypt.compare(dto.password, admin.passwordHash)
    if (!isValid) {
      await this.incrementLoginFail(dto.email)
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.')
    }

    // 로그인 성공 시 실패 카운터 초기화
    await this.redis.del(`rate_limit:login:${dto.email}`)

    // 마지막 로그인 시간 업데이트
    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    })

    const payload = { sub: admin.id, email: admin.email, role: admin.role }
    const accessToken = this.jwt.sign(payload)

    return {
      accessToken,
      expiresIn: 3600,
    }
  }

  private async checkLoginLock(email: string) {
    const key = `rate_limit:login:${email}`
    const count = await this.redis.get(key)
    if (count && parseInt(count, 10) >= LOGIN_FAIL_MAX) {
      throw new UnauthorizedException(
        '로그인 시도가 너무 많습니다. 15분 후 다시 시도해 주세요.',
      )
    }
  }

  private async incrementLoginFail(email: string) {
    const key = `rate_limit:login:${email}`
    const count = await this.redis.incr(key)
    if (count === 1) {
      await this.redis.expire(key, LOGIN_LOCK_TTL)
    }
  }
}
