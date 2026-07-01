import { notFound } from 'next/navigation'
import Link from 'next/link'
import NextDynamic from 'next/dynamic'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const TipTapRenderer = NextDynamic(() => import('@/components/blog/TipTapRenderer'), { ssr: false })

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImageUrl: string | null
  content: object
  publishedAt: string | null
  createdAt: string
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/v1/blog/${slug}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  const json = await res.json()
  return json.data ?? null
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: post.coverImageUrl ? { images: [post.coverImageUrl] } : undefined,
  }
}

export default async function DevLogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
    <div className="min-h-dvh pt-24 pb-16 px-6 md:px-10 max-w-3xl mx-auto">
      <Link
        href="/devlog"
        className="inline-block mb-8 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        ← DevLog
      </Link>

      {post.coverImageUrl && (
        <div className="mb-8 overflow-hidden rounded-xl aspect-video bg-surface-elevated">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <header className="mb-10">
        <time className="text-xs text-text-disabled">
          {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1 className="mt-2 text-3xl font-bold text-text-primary">{post.title}</h1>
        {post.excerpt && (
          <p className="mt-3 text-text-secondary text-base">{post.excerpt}</p>
        )}
      </header>

      <article>
        <TipTapRenderer content={post.content} />
      </article>
    </div>
  )
}
