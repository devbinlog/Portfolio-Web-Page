import { Controller, Get } from '@nestjs/common'
import { CategoriesService } from './categories.service'

// 공개 카테고리 API (인증 불필요)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll()
  }
}
