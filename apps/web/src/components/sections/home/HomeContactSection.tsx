import { SiGithub } from 'react-icons/si'

export function HomeContactSection() {
  return (
    <section
      id="contact"
      className="min-h-[60vh] bg-surface-base flex flex-col justify-center px-6 md:px-10 lg:px-16 py-24 border-t border-border-default"
      aria-labelledby="home-contact-heading"
    >
      <div className="max-w-5xl mx-auto w-full">

        {/* 섹션 라벨 */}
        <p className="text-xs font-mono text-text-disabled uppercase tracking-[0.2em] mb-10">
          Contact
        </p>

        {/* 메인 CTA */}
        <div className="mb-14">
          <h2
            id="home-contact-heading"
            className="text-display-lg md:text-display-xl font-extrabold text-text-primary leading-none tracking-tight mb-4"
          >
            Coffee Chat
          </h2>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            아이디어를 구조로 만들고 실제 동작하는 시스템으로 구현하는 개발을 하고 있습니다.<br />
            같이 고민해보고 싶은 주제가 있다면 편하게 이야기 나누고 싶습니다.
          </p>
        </div>

        {/* 링크 버튼 */}
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:devbinlog8@gmail.com"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-text-primary text-surface-base text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            devbinlog8@gmail.com
          </a>

          <a
            href="https://github.com/devbinlog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-border-default text-sm text-text-primary hover:border-border-strong hover:bg-surface-elevated transition-colors"
          >
            <SiGithub size={16} />
            GitHub
          </a>
        </div>

        {/* 푸터 */}
        <p className="text-xs font-mono text-text-disabled mt-16">
          © {new Date().getFullYear()} Taebin Kim
        </p>
      </div>
    </section>
  )
}
