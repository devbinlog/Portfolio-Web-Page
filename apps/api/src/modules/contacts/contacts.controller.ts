import { Controller, Post, Body, Req } from '@nestjs/common'
import { ContactsService } from './contacts.service'
import { CreateContactDto } from './dto/create-contact.dto'
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(@Body() dto: CreateContactDto, @Req() req: any) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown'
    return this.contactsService.create(dto, ip)
  }
}
