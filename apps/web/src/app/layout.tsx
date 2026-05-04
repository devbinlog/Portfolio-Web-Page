import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'

export const metadata: Metadata = {
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
    siteName: 'binlog Portfolio',
    title: 'binlog — AI / LLM Engineer & Frontend Developer',
    description: 'Designing systems that transform unstructured input into structured user experiences.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'binlog — AI / LLM Engineer & Frontend Developer',
    description: 'Designing systems that transform unstructured input into structured user experiences.',
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
