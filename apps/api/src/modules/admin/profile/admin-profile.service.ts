import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../common/prisma/prisma.service'
import { UpdateProfileDto } from './dto/update-profile.dto'

export interface CreateSocialLinkDto {
  platform: string
  url: string
  order?: number
}

export interface UpdateSocialLinkDto {
  platform?: string
  url?: string
  order?: number
}

@Injectable()
export class AdminProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async find() {
    return this.prisma.profile.findFirst({
      include: { socialLinks: { orderBy: { order: 'asc' } } },
    })
  }

  async upsert(dto: UpdateProfileDto) {
    const existing = await this.prisma.profile.findFirst()

    if (existing) {
      return this.prisma.profile.update({
        where: { id: existing.id },
        data: dto,
        include: { socialLinks: { orderBy: { order: 'asc' } } },
      })
    }

    return this.prisma.profile.create({
      data: {
        name: dto.name ?? 'Taebin Kim',
        roleTitle: dto.roleTitle ?? 'Frontend Developer',
        tagline: dto.tagline ?? '',
        bio: dto.bio ?? '',
        workingMethod: dto.workingMethod ?? '',
        avatarUrl: dto.avatarUrl,
        resumeUrl: dto.resumeUrl,
        location: dto.location,
      },
      include: { socialLinks: { orderBy: { order: 'asc' } } },
    })
  }

  async addSocialLink(dto: CreateSocialLinkDto) {
    const profile = await this.prisma.profile.findFirst()
    if (!profile) throw new NotFoundException('프로필이 없습니다.')

    const maxOrder = await this.prisma.socialLink.aggregate({
      where: { profileId: profile.id },
      _max: { order: true },
    })

    return this.prisma.socialLink.create({
      data: {
        profileId: profile.id,
        platform: dto.platform,
        url: dto.url,
        order: dto.order ?? (maxOrder._max.order ?? -1) + 1,
      },
    })
  }

  async updateSocialLink(id: string, dto: UpdateSocialLinkDto) {
    await this.assertSocialLinkExists(id)
    return this.prisma.socialLink.update({ where: { id }, data: dto })
  }

  async removeSocialLink(id: string) {
    await this.assertSocialLinkExists(id)
    await this.prisma.socialLink.delete({ where: { id } })
    return { message: '소셜 링크가 삭제되었습니다.' }
  }

  private async assertSocialLinkExists(id: string) {
    const link = await this.prisma.socialLink.findUnique({ where: { id } })
    if (!link) throw new NotFoundException('소셜 링크를 찾을 수 없습니다.')
  }
}
