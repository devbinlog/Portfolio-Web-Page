import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { ProjectsModule } from './modules/projects/projects.module'
import { MediaModule } from './modules/media/media.module'
import { DocumentsModule } from './modules/documents/documents.module'
import { LinksModule } from './modules/links/links.module'
import { ContactsModule } from './modules/contacts/contacts.module'
import { ProfileModule } from './modules/profile/profile.module'
import { HealthModule } from './modules/health/health.module'
import { PrismaModule } from './common/prisma/prisma.module'
import { RedisModule } from './common/redis/redis.module'
import { AdminProjectsModule } from './modules/admin/projects/admin-projects.module'
import { AdminContactsModule } from './modules/admin/contacts/admin-contacts.module'
import { AdminProfileModule } from './modules/admin/profile/admin-profile.module'
import { CategoriesModule } from './modules/admin/categories/categories.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    ProjectsModule,
    MediaModule,
    DocumentsModule,
    LinksModule,
    ContactsModule,
    ProfileModule,
    HealthModule,
    AdminProjectsModule,
    AdminContactsModule,
    AdminProfileModule,
    CategoriesModule,
  ],
})
export class AppModule {}
