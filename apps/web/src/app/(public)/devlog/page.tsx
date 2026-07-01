import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImageUrl: string | null
  publishedAt: string | null
  createdAt: string
}

async function getPosts(): Promise<BlogPostSummary[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/v1/blog?limit=50`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) return []

  const json = await res.json()
  return json.data ?? []
}

export const metadata = {
  title: 'DevLog',
  description: '개발 일지 및 학습 로그',
}

export default async function DevLogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-dvh pt-24 pb-16 px-6 md:px-10 max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-text-primary mb-2">DevLog</h1>
        <p className="text-text-secondary text-sm">개발 일지 · 학습 기록 · 회고</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-text-secondary text-sm">아직 작성된 포스트가 없습니다.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/devlog/${post.slug}`} className="group block">
                {post.coverImageUrl && (
                  <div className="mb-4 overflow-hidden rounded-lg aspect-video bg-surface-elevated">
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <time className="text-xs text-text-disabled">
                  {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h2 className="mt-1 text-lg font-semibold text-text-primary group-hover:text-accent-hover transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-1 text-sm text-text-secondary line-clamp-2">{post.excerpt}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
