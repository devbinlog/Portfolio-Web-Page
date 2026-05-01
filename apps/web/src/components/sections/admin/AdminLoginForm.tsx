'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuthStore } from '@/stores/adminAuthStore'

export function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAdminAuthStore((s) => s.login)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || '로그인에 실패했습니다.')
      }

      const data = await res.json()
      login(data.accessToken)
      router.replace('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm text-text-secondary mb-1.5">
          이메일
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 px-3 rounded bg-surface-input border border-border-default text-text-primary text-sm focus:outline-none focus:border-border-focus"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm text-text-secondary mb-1.5">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 px-3 rounded bg-surface-input border border-border-default text-text-primary text-sm focus:outline-none focus:border-border-focus"
        />
      </div>

      {error && <p className="text-sm text-feedback-error">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 rounded bg-accent-primary text-text-inverse text-sm font-medium disabled:opacity-50"
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}
