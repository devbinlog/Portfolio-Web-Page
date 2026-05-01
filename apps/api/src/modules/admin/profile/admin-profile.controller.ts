import { Controller, Get, Put, Post, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { AdminProfileService, CreateSocialLinkDto, UpdateSocialLinkDto } from './admin-profile.service'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Controller('admin/profile')
@UseGuards(JwtAuthGuard)
export class AdminProfileController {
  constructor(private readonly profileService: AdminProfileService) {}

  @Get()
  find() {
    return this.profileService.find()
  }

  @Put()
  upsert(@Body() dto: UpdateProfileDto) {
    return this.profileService.upsert(dto)
  }

  @Post('social-links')
  addSocialLink(@Body() dto: CreateSocialLinkDto) {
    return this.profileService.addSocialLink(dto)
  }

  @Patch('social-links/:id')
  updateSocialLink(@Param('id') id: string, @Body() dto: UpdateSocialLinkDto) {
    return this.profileService.updateSocialLink(id, dto)
  }

  @Delete('social-links/:id')
  removeSocialLink(@Param('id') id: string) {
    return this.profileService.removeSocialLink(id)
  }
}
