import { Module } from '@nestjs/common'
import { AdminContactsController } from './admin-contacts.controller'
import { AdminContactsService } from './admin-contacts.service'

@Module({
  controllers: [AdminContactsController],
  providers: [AdminContactsService],
})
export class AdminContactsModule {}
