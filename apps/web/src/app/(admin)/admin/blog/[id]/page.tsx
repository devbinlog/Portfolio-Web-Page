'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import BlogPostForm, { type BlogPostFormData } from '@/components/blog/BlogPostForm'
import { useAdminAuthStore } from '@/stores/adminAuthStore'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImageUrl: string | null
  content: object
  isPublished: boolean
}

export default function AdminBlogEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken: token } = useAdminAuthStore()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/v1/admin/blog/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => setPost(json.data))
      .finally(() => setLoading(false))
  }, [id, token])

  async function handleSubmit(data: BlogPostFormData) {
    const res = await fetch(`/api/v1/admin/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const json = await res.json()
    if (!res.ok) throw new Error(json.message ?? '수정 실패')

    router.push('/admin/blog')
  }

  if (loading) {
    return <div className="h-96 bg-surface-elevated rounded-lg animate-pulse" />
  }

  if (!post) {
    return <p className="text-feedback-error text-sm">포스트를 불러올 수 없습니다.</p>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/blog" className="text-text-secondary hover:text-text-primary text-sm">
          ← DevLog
        </Link>
        <h1 className="text-xl font-semibold text-text-primary">포스트 편집</h1>
        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
          post.isPublished
            ? 'bg-feedback-success/20 text-feedback-success'
            : 'bg-surface-elevated text-text-secondary'
        }`}>
          {post.isPublished ? '게시됨' : '비공개'}
        </span>
      </div>

      <BlogPostForm
        initialData={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? '',
          coverImageUrl: post.coverImageUrl ?? '',
          content: post.content,
        }}
        onSubmit={handleSubmit}
        submitLabel="수정 저장"
      />
    </div>
  )
}
