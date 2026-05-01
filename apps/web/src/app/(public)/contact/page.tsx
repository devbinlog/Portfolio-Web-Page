import type { Metadata } from 'next'
import { MainNav } from '@/components/layout/MainNav'
import { ContactForm } from '@/components/sections/ContactForm'
import { getProfile } from '@/lib/api/profile'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Taebin Kim에게 연락하기. LLM 시스템 협업, 채용 문의, 프로젝트 제안 환영합니다.',
}

export default async function ContactPage() {
  const profile = await getProfile()

  return (
    <div className="min-h-dvh bg-surface-base">
      <MainNav profile={profile} />
      <div className="max-w-container-narrow mx-auto px-6 pt-32 pb-24">
        <header className="mb-12">
          <p className="text-xs font-mono text-text-disabled uppercase tracking-[0.2em] mb-4">Contact</p>
          <h1 className="text-display-md font-bold text-text-primary mb-3">Coffee Chat</h1>
          <p className="text-text-secondary leading-relaxed">
            아이디어를 구조로 만들고 실제 동작하는 시스템으로 구현하는 개발을 하고 있습니다.<br />
            같이 고민해보고 싶은 주제가 있다면 편하게 이야기 나누고 싶습니다.
          </p>
        </header>

        {/* 직접 링크 버튼 */}
        <div className="flex flex-wrap gap-3 mb-16">
          <a
            href="mailto:devbinlog8@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border-default bg-surface-elevated text-sm text-text-primary hover:border-border-strong hover:bg-surface-input transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            devbinlog8@gmail.com
          </a>

          <a
            href="https://github.com/devbinlog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border-default bg-surface-elevated text-sm text-text-primary hover:border-border-strong hover:bg-surface-input transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            GitHub
          </a>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-border-default" />
          <p className="text-xs font-mono text-text-disabled uppercase tracking-widest">또는 폼으로 전송</p>
          <div className="flex-1 h-px bg-border-default" />
        </div>

        <ContactForm />
      </div>
    </div>
  )
}
