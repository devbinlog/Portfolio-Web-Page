import { Controller, Get, Patch, Delete, Param, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { AdminContactsService } from './admin-contacts.service'

@Controller('admin/contacts')
@UseGuards(JwtAuthGuard)
export class AdminContactsController {
  constructor(private readonly contactsService: AdminContactsService) {}

  @Get()
  findAll(@Query('unread') unread?: string) {
    return this.contactsService.findAll(unread === 'true')
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.contactsService.markRead(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id)
  }
}
