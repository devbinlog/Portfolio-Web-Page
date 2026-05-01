import { IsEnum, IsString, IsUrl, IsOptional, IsInt, Min } from 'class-validator'

enum LinkType {
  GITHUB = 'GITHUB',
  DEMO = 'DEMO',
  DOCS = 'DOCS',
  EXTERNAL = 'EXTERNAL',
}

export class CreateLinkDto {
  @IsEnum(LinkType)
  type: LinkType

  @IsString()
  label: string

  @IsUrl()
  url: string

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number
}
