import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../common/prisma/prisma.service'

@Injectable()
export class AdminContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(unread?: boolean) {
    const where = unread === true ? { isRead: false } : {}
    const messages = await this.prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    return messages
  }

  async markRead(id: string) {
    await this.assertExists(id)
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    })
  }

  async remove(id: string) {
    await this.assertExists(id)
    await this.prisma.contactMessage.delete({ where: { id } })
    return { message: '메시지가 삭제되었습니다.' }
  }

  private async assertExists(id: string) {
    const msg = await this.prisma.contactMessage.findUnique({ where: { id } })
    if (!msg) throw new NotFoundException('메시지를 찾을 수 없습니다.')
  }
}
