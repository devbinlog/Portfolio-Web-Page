import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Taebin Kim',
    default: 'Taebin Kim — Frontend Developer',
  },
  description:
    'Building imagination through structure and interaction. Interactive web, 3D experience, and structured product thinking.',
  keywords: ['Frontend Developer', 'React', 'Next.js', '3D', 'Interactive Web', 'Taebin Kim'],
  authors: [{ name: 'Taebin Kim' }],
  creator: 'Taebin Kim',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Taebin Kim Portfolio',
    title: 'Taebin Kim — Frontend Developer',
    description: 'Building imagination through structure and interaction.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taebin Kim — Frontend Developer',
    description: 'Building imagination through structure and interaction.',
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
