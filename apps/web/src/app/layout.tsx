import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from 'next-themes'
import { LoadingScreen } from '@/components/LoadingScreen'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://binlog-devbinlog.vercel.app'),
  title: {
    template: '%s | binlog',
    default: 'binlog — AI / LLM Engineer & Frontend Developer',
  },
  description:
    'Designing systems that transform unstructured input into structured user experiences.',
  keywords: ['Frontend Developer', 'AI Engineer', 'LLM', 'React', 'Next.js', '3D', 'binlog'],
  authors: [{ name: 'binlog' }],
  creator: 'binlog',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'devbinlog - Portfolio',
    title: 'devbinlog - Portfolio',
    description: '여기를 눌러 링크를 확인하세요.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'devbinlog Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'devbinlog - Portfolio',
    description: '여기를 눌러 링크를 확인하세요.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-surface-base text-text-primary antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingScreen />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
