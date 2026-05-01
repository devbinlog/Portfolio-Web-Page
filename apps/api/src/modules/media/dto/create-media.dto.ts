import { IsEnum, IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator'

enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO_PLACEHOLDER = 'VIDEO_PLACEHOLDER',
  VIDEO_EMBED = 'VIDEO_EMBED',
}

export class CreateMediaDto {
  @IsEnum(MediaType)
  type: MediaType

  @IsOptional()
  @IsString()
  url?: string

  @IsOptional()
  @IsString()
  placeholderLabel?: string

  @IsOptional()
  @IsString()
  embedId?: string

  @IsOptional()
  @IsString()
  altText?: string

  @IsOptional()
  @IsString()
  caption?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number

  @IsOptional()
  @IsBoolean()
  isPlaceholder?: boolean
}
