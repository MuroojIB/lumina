'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getStatus } from '@/lib/activities'
import { pill } from '@/lib/ui'
import { useActivities } from '../activity-store'
import { ActivityCard } from '../activity-card'

export function UpcomingActivities() {
  const { activities } = useActivities()
  const upcoming = activities
    .filter((a) => getStatus(a) === 'open' && a.hostId !== 'me')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold md:text-4xl">أنشطة قريبة تنتظرك</h2>
          <p className="text-muted-foreground">مقاعد محدودة، احجز مكانك قبل أن تكتمل.</p>
        </div>
        <Link href="/explore" className={pill({ variant: 'outline', size: 'sm' })}>
          عرض الكل
          <ArrowLeft aria-hidden="true" />
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((a) => (
          <ActivityCard key={a.id} activity={a} />
        ))}
      </div>
    </section>
  )
}
