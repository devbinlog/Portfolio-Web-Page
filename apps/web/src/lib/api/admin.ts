import { useAdminAuthStore } from '@/stores/adminAuthStore'
import type { ProjectDetail, ProjectSummary } from '@portfolio/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

function getToken() {
  return useAdminAuthStore.getState().accessToken
}

async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: '요청에 실패했습니다.' }))
    throw new Error(err.message || '요청에 실패했습니다.')
  }

  return res.json() as Promise<T>
}

export interface DashboardStats {
  total: number
  published: number
  featured: number
  unreadMessages: number
}

export const adminApi = {
  stats: () => adminFetch<DashboardStats>('/admin/projects/stats'),

  projects: {
    list: () => adminFetch<ProjectSummary[]>('/admin/projects'),
    get: (id: string) => adminFetch<ProjectDetail>(`/admin/projects/${id}`),
    create: (data: Record<string, unknown>) =>
      adminFetch<ProjectDetail>('/admin/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Record<string, unknown>) =>
      adminFetch<ProjectDetail>(`/admin/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      adminFetch<{ message: string }>(`/admin/projects/${id}`, { method: 'DELETE' }),
    togglePublish: (id: string) =>
      adminFetch<ProjectDetail>(`/admin/projects/${id}/publish`, { method: 'PATCH' }),
    reorder: (orderedIds: string[]) =>
      adminFetch('/admin/projects/reorder', {
        method: 'PATCH',
        body: JSON.stringify({ orderedIds }),
      }),
  },

  media: {
    list: (projectId: string) =>
      adminFetch(`/admin/projects/${projectId}/media`),
    create: (projectId: string, data: Record<string, unknown>) =>
      adminFetch(`/admin/projects/${projectId}/media`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (projectId: string, mediaId: string, data: Record<string, unknown>) =>
      adminFetch(`/admin/projects/${projectId}/media/${mediaId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (projectId: string, mediaId: string) =>
      adminFetch(`/admin/projects/${projectId}/media/${mediaId}`, { method: 'DELETE' }),
  },

  documents: {
    list: (projectId: string) =>
      adminFetch(`/admin/projects/${projectId}/documents`),
    create: (projectId: string, data: Record<string, unknown>) =>
      adminFetch(`/admin/projects/${projectId}/documents`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (projectId: string, docId: string, data: Record<string, unknown>) =>
      adminFetch(`/admin/projects/${projectId}/documents/${docId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (projectId: string, docId: string) =>
      adminFetch(`/admin/projects/${projectId}/documents/${docId}`, {
        method: 'DELETE',
      }),
  },

  links: {
    list: (projectId: string) =>
      adminFetch(`/admin/projects/${projectId}/links`),
    create: (projectId: string, data: Record<string, unknown>) =>
      adminFetch(`/admin/projects/${projectId}/links`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (projectId: string, linkId: string, data: Record<string, unknown>) =>
      adminFetch(`/admin/projects/${projectId}/links/${linkId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (projectId: string, linkId: string) =>
      adminFetch(`/admin/projects/${projectId}/links/${linkId}`, {
        method: 'DELETE',
      }),
  },

  contacts: {
    list: (unread?: boolean) =>
      adminFetch(`/admin/contacts${unread ? '?unread=true' : ''}`),
    markRead: (id: string) =>
      adminFetch(`/admin/contacts/${id}/read`, { method: 'PATCH' }),
    delete: (id: string) =>
      adminFetch(`/admin/contacts/${id}`, { method: 'DELETE' }),
  },

  profile: {
    get: () => adminFetch('/admin/profile'),
    update: (data: Record<string, unknown>) =>
      adminFetch('/admin/profile', { method: 'PUT', body: JSON.stringify(data) }),
    addSocialLink: (data: { platform: string; url: string; order?: number }) =>
      adminFetch('/admin/profile/social-links', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateSocialLink: (id: string, data: Record<string, unknown>) =>
      adminFetch(`/admin/profile/social-links/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    removeSocialLink: (id: string) =>
      adminFetch(`/admin/profile/social-links/${id}`, { method: 'DELETE' }),
  },
}
