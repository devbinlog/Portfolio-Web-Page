import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis

  constructor(private config: ConfigService) {
    this.client = new Redis(config.get<string>('REDIS_URL') || 'redis://localhost:6379')
  }

  async onModuleDestroy() {
    await this.client.quit()
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key)
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value)
    } else {
      await this.client.set(key, value)
    }
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key)
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds)
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }

  async ping(): Promise<boolean> {
    try {
      const res = await this.client.ping()
      return res === 'PONG'
    } catch {
      return false
    }
  }
}
