'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, SearchX, X } from 'lucide-react'
import { CATEGORIES, getStatus, type CategoryId } from '@/lib/activities'
import { pill } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { useActivities } from '../activity-store'
import { ActivityCard } from '../activity-card'

export function ExploreView() {
  const { activities } = useActivities()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const categoryParam = params.get('category') as CategoryId | null
  const category = CATEGORIES.some((c) => c.id === categoryParam) ? categoryParam : null
  const [query, setQuery] = useState('')

  const setCategory = (id: CategoryId | null) => {
    const next = new URLSearchParams(params)
    if (id) next.set('category', id)
    else next.delete('category')
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return activities
      .filter((a) => {
        const s = getStatus(a)
        return s === 'open' || s === 'full'
      })
      .filter((a) => !category || a.category === category)
      .filter((a) => !q || `${a.title} ${a.location} ${a.description}`.toLowerCase().includes(q))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [activities, category, query])

  return (
    <>
      <section className="bg-grid-paper border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-6 md:py-14">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold md:text-5xl">استكشف الأنشطة</h1>
            <p className="text-muted-foreground">جد شيئاً تحبه، وأشخاصاً يحبونه أيضاً.</p>
          </div>

          <form role="search" onSubmit={(e) => e.preventDefault()} className="relative max-w-2xl">
            <label htmlFor="activity-search" className="sr-only">
              ابحث عن نشاط
            </label>
            <Search className="pointer-events-none absolute right-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="activity-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو المكان... مثلاً: قهوة، الرياض"
              className="h-14 w-full rounded-full border border-foreground/20 bg-card pl-14 pr-13 text-base shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="مسح البحث"
                className="absolute left-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </form>

          <div
            role="group"
            aria-label="تصفية حسب الفئة"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
          >
            <FilterPill active={!category} onClick={() => setCategory(null)}>
              الكل
            </FilterPill>
            {CATEGORIES.map((c) => (
              <FilterPill key={c.id} active={category === c.id} onClick={() => setCategory(c.id)} swatch={c.bg}>
                {c.label}
              </FilterPill>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6" aria-live="polite">
        <p className="mb-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{visible.length}</span> نشاط متاح
        </p>

        {visible.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-foreground/20 bg-card px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-cat-learning">
              <SearchX className="size-6" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold">لا توجد أنشطة مطابقة</h2>
            <p className="max-w-sm text-muted-foreground">جرّب كلمة بحث أخرى أو فئة مختلفة، أو كن أول من ينشئ هذا النشاط.</p>
            <Link href="/create" className={pill()}>
              أنشئ نشاطاً
            </Link>
          </div>
        )}
      </section>
    </>
  )
}

function FilterPill({
  active,
  onClick,
  swatch,
  children,
}: {
  active: boolean
  onClick: () => void
  swatch?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active ? 'border-foreground bg-foreground text-background' : 'border-foreground/15 bg-card hover:border-foreground/40',
      )}
    >
      {swatch && <span aria-hidden="true" className={cn('size-2.5 rounded-full border border-foreground/20', swatch)} />}
      {children}
    </button>
  )
}
