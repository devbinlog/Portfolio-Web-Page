import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsArray,
  MinLength,
  Min,
  Max,
} from 'class-validator'

export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  title: string

  @IsString()
  @MinLength(1)
  slug: string

  @IsString()
  @MinLength(1)
  summary: string

  @IsString()
  @MinLength(1)
  description: string

  @IsString()
  categoryId: string

  @IsOptional()
  @IsString()
  secondaryCategoryId?: string

  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number

  @IsString()
  role: string

  @IsString()
  contribution: string

  @IsArray()
  @IsString({ each: true })
  techStack: string[]

  @IsString()
  keyLearnings: string

  @IsOptional()
  @IsString()
  workingApproach?: string

  @IsOptional()
  @IsString()
  thumbnailUrl?: string

  @IsOptional()
  @IsString()
  heroImageUrl?: string

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean

  @IsOptional()
  @IsInt()
  featuredOrder?: number

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[]
}
