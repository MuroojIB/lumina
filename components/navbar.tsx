'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, House, LayoutGrid, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { pill } from '@/lib/ui'
import { CURRENT_USER_ID, PEOPLE } from '@/lib/activities'
import { Logo } from './logo'
import { PersonAvatar } from './person-avatar'

const LINKS = [
  { href: '/', label: 'الرئيسية', icon: House },
  { href: '/explore', label: 'استكشف', icon: Compass },
  { href: '/my-activities', label: 'مساحتي', icon: LayoutGrid },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  if (href === '/explore') return pathname.startsWith('/explore') || pathname.startsWith('/activities')
  return pathname.startsWith(href)
}

export function Navbar() {
  const pathname = usePathname()
  const me = PEOPLE[CURRENT_USER_ID]

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
          <Logo />

          <nav aria-label="التنقل الرئيسي" className="hidden md:block">
            <ul className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
              {LINKS.map((link) => {
                const active = isActive(pathname, link.href)
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'block rounded-full px-5 py-2 text-sm font-medium transition-colors',
                        active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/create" className={cn(pill({ size: 'sm' }), 'hidden md:inline-flex')}>
              <Plus aria-hidden="true" />
              أنشئ نشاطاً
            </Link>
            <Link href="/my-activities" aria-label={`حسابي: ${me.name}`} className="rounded-full">
              <PersonAvatar person={me} size="md" />
            </Link>
          </div>
        </div>
      </header>

      <nav
        aria-label="التنقل السفلي"
        className="fixed inset-x-3 bottom-3 z-40 rounded-full border border-border bg-card/95 shadow-lg shadow-foreground/5 backdrop-blur md:hidden"
      >
        <ul className="grid grid-cols-4 items-center p-1.5">
          {[LINKS[0], LINKS[1], { href: '/create', label: 'أنشئ', icon: Plus }, LINKS[2]].map((link) => {
            const active = isActive(pathname, link.href)
            const Icon = link.icon
            const isCreate = link.href === '/create'
            return (
              <li key={link.href} className="flex justify-center">
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors',
                    isCreate
                      ? 'bg-primary text-primary-foreground'
                      : active
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
