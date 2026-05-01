import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { RedisService } from '../../common/redis/redis.service'
import type { CreateContactDto } from './dto/create-contact.dto'

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_TTL = 3600 // 1시간

@Injectable()
export class ContactsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateContactDto, ip: string) {
    await this.checkRateLimit(ip)

    await this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
        ipAddress: ip,
      },
    })

    return { message: '메시지가 성공적으로 전송되었습니다.' }
  }

  private async checkRateLimit(ip: string) {
    const key = `rate_limit:contact:${ip}`
    const current = await this.redis.incr(key)

    if (current === 1) {
      await this.redis.expire(key, RATE_LIMIT_TTL)
    }

    if (current > RATE_LIMIT_MAX) {
      throw new HttpException(
        '요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.',
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }
  }
}
