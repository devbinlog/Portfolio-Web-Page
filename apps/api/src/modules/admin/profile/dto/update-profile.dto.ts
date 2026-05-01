import { IsString, IsOptional, IsUrl } from 'class-validator'

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  roleTitle?: string

  @IsOptional()
  @IsString()
  tagline?: string

  @IsOptional()
  @IsString()
  bio?: string

  @IsOptional()
  @IsString()
  workingMethod?: string

  @IsOptional()
  @IsUrl()
  avatarUrl?: string

  @IsOptional()
  @IsUrl()
  resumeUrl?: string

  @IsOptional()
  @IsString()
  location?: string
}
