'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BlogPostForm, { type BlogPostFormData } from '@/components/blog/BlogPostForm'
import { useAdminAuthStore } from '@/stores/adminAuthStore'

export default function AdminBlogNewPage() {
  const router = useRouter()
  const { accessToken: token } = useAdminAuthStore()

  async function handleSubmit(data: BlogPostFormData) {
    const res = await fetch('/api/v1/admin/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? '저장 실패')

    router.push('/admin/blog')
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/blog" className="text-text-secondary hover:text-text-primary text-sm">
          ← DevLog
        </Link>
        <h1 className="text-xl font-semibold text-text-primary">새 포스트 작성</h1>
      </div>
      <BlogPostForm onSubmit={handleSubmit} submitLabel="저장" />
    </div>
  )
}
