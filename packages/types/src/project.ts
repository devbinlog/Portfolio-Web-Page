export type CategorySlug = 'music_projects' | 'ai_projects' | 'design_projects'

export type ObjectFamily = 'signal_orb' | 'data_crystal' | 'layered_device' | 'fragment_cluster' | 'monolith_capsule'

export type MediaType = 'IMAGE' | 'VIDEO_PLACEHOLDER' | 'VIDEO_EMBED'

export type DocumentType = 'REPORT' | 'PRESENTATION' | 'MARKDOWN' | 'OTHER'

export type LinkType = 'GITHUB' | 'DEMO' | 'DOCS' | 'EXTERNAL'

export interface Category {
  id: string
  name: string
  slug: CategorySlug
  objectFamily: ObjectFamily
  order: number
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface ProjectMedia {
  id: string
  projectId: string
  type: MediaType
  url: string | null
  placeholderLabel: string | null
  embedId: string | null
  altText: string | null
  caption: string | null
  order: number
  isPlaceholder: boolean
  createdAt: string
}

export interface ProjectDocument {
  id: string
  projectId: string
  type: DocumentType
  title: string
  url: string | null
  placeholderLabel: string | null
  isPlaceholder: boolean
  order: number
  createdAt: string
}

export interface ProjectLink {
  id: string
  projectId: string
  type: LinkType
  label: string
  url: string
  order: number
}

export interface ProjectSummary {
  id: string
  title: string
  slug: string
  summary: string
  category: Category
  secondaryCategory: Category | null
  year: number
  thumbnailUrl: string | null
  isFeatured: boolean
  featuredOrder: number | null
  tags: Tag[]
}

export interface CodeSnippet {
  title: string
  language: string
  code: string
  explanation: string
}

export interface ProjectDetail extends ProjectSummary {
  description: string
  heroImageUrl: string | null
  role: string
  contribution: string
  techStack: string[]
  keyLearnings: string
  workingApproach: string | null
  codeSnippets: CodeSnippet[] | null
  media: ProjectMedia[]
  documents: ProjectDocument[]
  links: ProjectLink[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
}
