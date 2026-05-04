function resolveApiUrl(): string {
  if (typeof window === 'undefined') {
    // 서버 컴포넌트: absolute URL 필요
    // VERCEL_URL은 Vercel이 자동으로 주입 (https:// 없이 제공됨)
    const base =
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000'
    return `${base}/api/v1`
  }
  return '/api/v1'
}

interface FetchOptions extends RequestInit {
  token?: string
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${resolveApiUrl()}${path}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json() as Promise<T>
}
