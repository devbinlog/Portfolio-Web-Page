import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// adminAuthStore 모킹
vi.mock('@/stores/adminAuthStore', () => ({
  useAdminAuthStore: {
    getState: () => ({ accessToken: 'test-token' }),
  },
}))

// fetch 모킹
const mockFetch = vi.fn()
global.fetch = mockFetch

// adminApi를 동적으로 임포트 (모킹 후)
describe('adminApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('stats 요청 시 Authorization 헤더 포함', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: 3, published: 2, featured: 3, unreadMessages: 1 }),
    })

    const { adminApi } = await import('@/lib/api/admin')
    const result = await adminApi.stats()

    expect(mockFetch).toHaveBeenCalledOnce()
    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect((options.headers as Record<string, string>)['Authorization']).toBe('Bearer test-token')
    expect(result.total).toBe(3)
  })

  it('응답 실패 시 Error throw', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: '인증이 필요합니다.' }),
    })

    const { adminApi } = await import('@/lib/api/admin')

    await expect(adminApi.stats()).rejects.toThrow('인증이 필요합니다.')
  })
})
