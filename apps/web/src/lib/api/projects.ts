import type { ProjectSummary, ProjectDetail, PaginatedResponse } from '@portfolio/types'
import { apiFetch } from './client'

export async function getFeaturedProjects(): Promise<ProjectSummary[]> {
  try {
    const res = await apiFetch<PaginatedResponse<ProjectSummary>>(
      '/projects?featured=true',
      { cache: 'no-store' },
    )
    return res.data
  } catch {
    return []
  }
}

export async function getAllProjects(): Promise<ProjectSummary[]> {
  const res = await apiFetch<PaginatedResponse<ProjectSummary>>(
    '/projects',
    { cache: 'no-store' },
  )
  return res.data
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  try {
    return await apiFetch<ProjectDetail>(`/projects/${slug}`, {
      cache: 'no-store',
    })
  } catch {
    return null
  }
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await getAllProjects()
  return projects.map((p) => p.slug)
}
