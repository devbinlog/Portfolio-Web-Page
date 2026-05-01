import { IsOptional, IsBoolean, IsString, IsInt, Min, Max } from 'class-validator'
import { Transform } from 'class-transformer'

export class ProjectsQueryDto {
  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20
}
