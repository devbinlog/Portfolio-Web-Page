import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic() {
    const profile = await this.prisma.profile.findFirst({
      include: {
        socialLinks: { orderBy: { order: 'asc' } },
      },
    })

    if (!profile) {
      return {
        name: 'Taebin Kim',
        roleTitle: 'Frontend Developer',
        tagline: 'Building imagination through structure and interaction.',
        bio: '',
        workingMethod: '',
        avatarUrl: null,
        resumeUrl: null,
        location: null,
        socialLinks: [],
      }
    }

    return profile
  }
}
