import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Noto_Sans_Arabic, Readex_Pro } from 'next/font/google'
import { ActivityProvider } from '@/components/activity-store'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const heading = Readex_Pro({ subsets: ['arabic', 'latin'], variable: '--font-heading', weight: ['400', '500', '600', '700'] })
const body = Noto_Sans_Arabic({ subsets: ['arabic', 'latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'رِفقة | RIFQAH - كل تجربة أحلى برفقة',
  description: 'اكتشف الأنشطة المحلية من حولك، انضم إليها، أو أنشئ نشاطك الخاص وابنِ رفقة جديدة.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f2e8',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${heading.variable} ${body.variable} bg-background`}>
      <body className="antialiased">
        <ActivityProvider>
          <Navbar />
          <main className="min-h-[70vh] pb-24 md:pb-0">{children}</main>
          <SiteFooter />
        </ActivityProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
