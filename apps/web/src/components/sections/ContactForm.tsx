'use client'

import { useState } from 'react'
import type { ContactFormPayload } from '@portfolio/types'

export function ContactForm() {
  const [form, setForm] = useState<ContactFormPayload>({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contacts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || '전송에 실패했습니다.')
      }

      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : '전송에 실패했습니다.')
    }
  }

  if (status === 'success') {
    return (
      <div className="p-6 rounded-lg border border-border-default bg-surface-elevated">
        <p className="text-text-primary font-medium">메시지가 전송되었습니다.</p>
        <p className="text-text-secondary text-sm mt-1">곧 연락드리겠습니다.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <div>
        <label htmlFor="name" className="block text-sm text-text-secondary mb-1.5">
          이름
        </label>
        <input
          id="name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full h-10 px-3 rounded bg-surface-input border border-border-default text-text-primary text-sm focus:outline-none focus:border-border-focus"
          placeholder="홍길동"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-text-secondary mb-1.5">
          이메일
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full h-10 px-3 rounded bg-surface-input border border-border-default text-text-primary text-sm focus:outline-none focus:border-border-focus"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-text-secondary mb-1.5">
          메시지
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="w-full px-3 py-2.5 rounded bg-surface-input border border-border-default text-text-primary text-sm focus:outline-none focus:border-border-focus resize-none"
          placeholder="안녕하세요, ..."
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-feedback-error">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="h-10 px-5 rounded bg-accent-primary text-text-inverse text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {status === 'loading' ? '전송 중...' : '메시지 보내기'}
      </button>
    </form>
  )
}
