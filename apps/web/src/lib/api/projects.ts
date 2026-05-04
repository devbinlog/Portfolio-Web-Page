import type { ProjectSummary, ProjectDetail } from '@portfolio/types'
import { prisma } from '@/lib/server/prisma'

const PROJECT_INCLUDE = {
  category: true,
  secondaryCategory: true,
  tags: { include: { tag: true } },
} as const

const PROJECT_ORDER = [
  { isFeatured: 'desc' as const },
  { featuredOrder: 'asc' as const },
  { year: 'desc' as const },
]

const BASE_WHERE = { isPublished: true, deletedAt: null }

function mapTags<T extends { tags: { tag: unknown }[] }>(p: T) {
  return { ...p, tags: p.tags.map((pt) => pt.tag) }
}

export async function getFeaturedProjects(): Promise<ProjectSummary[]> {
  try {
    const data = await prisma.project.findMany({
      where: { ...BASE_WHERE, isFeatured: true },
      orderBy: PROJECT_ORDER,
      include: PROJECT_INCLUDE,
    })
    return data.map(mapTags) as unknown as ProjectSummary[]
  } catch {
    return []
  }
}

export async function getAllProjects(): Promise<ProjectSummary[]> {
  try {
    const data = await prisma.project.findMany({
      where: BASE_WHERE,
      orderBy: PROJECT_ORDER,
      include: PROJECT_INCLUDE,
    })
    return data.map(mapTags) as unknown as ProjectSummary[]
  } catch {
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  try {
    const project = await prisma.project.findFirst({
      where: { ...BASE_WHERE, slug },
      include: {
        ...PROJECT_INCLUDE,
        media: { orderBy: { order: 'asc' } },
        documents: { orderBy: { order: 'asc' } },
        links: { orderBy: { order: 'asc' } },
      },
    })
    if (!project) return null
    return mapTags(project) as unknown as ProjectDetail
  } catch {
    return null
  }
}

export async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const projects = await prisma.project.findMany({
      where: BASE_WHERE,
      select: { slug: true },
    })
    return projects.map((p) => p.slug)
  } catch {
    return []
  }
}
