import { IsEnum, IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator'

enum DocumentType {
  REPORT = 'REPORT',
  PRESENTATION = 'PRESENTATION',
  MARKDOWN = 'MARKDOWN',
  OTHER = 'OTHER',
}

export class CreateDocumentDto {
  @IsEnum(DocumentType)
  type: DocumentType

  @IsString()
  title: string

  @IsOptional()
  @IsString()
  url?: string

  @IsOptional()
  @IsString()
  placeholderLabel?: string

  @IsOptional()
  @IsBoolean()
  isPlaceholder?: boolean

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number
}
