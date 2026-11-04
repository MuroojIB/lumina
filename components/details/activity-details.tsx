'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Check, Clock, MapPin, Share2, UserPlus, Users } from 'lucide-react'
import { CATEGORY_MAP, CURRENT_USER_ID, PEOPLE, getImage, getStatus } from '@/lib/activities'
import { formatLongDate, formatTime } from '@/lib/format'
import { pill } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { useActivities } from '../activity-store'
import { CategoryBadge, StatusBadge } from '../badges'
import { PersonAvatar } from '../person-avatar'
import { SeatsMeter } from '../seats-meter'

export function ActivityDetails({ id }: { id: string }) {
  const { getActivity, join, leave } = useActivities()
  const activity = getActivity(id)

  if (!activity) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">لم نجد هذا النشاط</h1>
        <p className="text-muted-foreground">ربما حُذف أو أن الرابط غير صحيح.</p>
        <Link href="/explore" className={pill()}>
          العودة للاستكشاف
        </Link>
      </div>
    )
  }

  const host = PEOPLE[activity.hostId]
  const status = getStatus(activity)
  const cat = CATEGORY_MAP[activity.category]
  const isHost = activity.hostId === CURRENT_USER_ID
  const joined = activity.participantIds.includes(CURRENT_USER_ID)
  const remaining = activity.maxMembers - activity.participantIds.length
  const emptySlots = Math.min(remaining, 6)

  const action = (() => {
    if (status === 'cancelled') return <button disabled className={cn(pill({ variant: 'outline', size: 'lg' }), 'w-full')}>تم إلغاء النشاط</button>
    if (status === 'completed') return <button disabled className={cn(pill({ variant: 'outline', size: 'lg' }), 'w-full')}>انتهى النشاط</button>
    if (isHost)
      return (
        <Link href="/my-activities" className={cn(pill({ variant: 'ink', size: 'lg' }), 'w-full')}>
          إدارة نشاطك
        </Link>
      )
    if (joined)
      return (
        <div className="flex flex-col gap-2">
          <button disabled className={cn(pill({ variant: 'soft', size: 'lg' }), 'w-full disabled:opacity-100')}>
            <Check aria-hidden="true" />
            انضممت للنشاط
          </button>
          <button onClick={() => leave(activity.id)} className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-destructive hover:underline">
            مغادرة النشاط
          </button>
        </div>
      )
    if (status === 'full') return <button disabled className={cn(pill({ variant: 'outline', size: 'lg' }), 'w-full')}>النشاط مكتمل</button>
    return (
      <button onClick={() => join(activity.id)} className={cn(pill({ size: 'lg' }), 'w-full')}>
        <UserPlus aria-hidden="true" />
        انضم للنشاط
      </button>
    )
  })()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <Link href="/explore" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowRight className="size-4" aria-hidden="true" />
        العودة للأنشطة
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-8">
          <div className={cn('relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-foreground/10', cat.bg)}>
            <Image
              src={getImage(activity) || '/placeholder.svg'}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 700px, 100vw"
              className={cn('object-cover', (status === 'cancelled' || status === 'completed') && 'grayscale')}
            />
          </div>

          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={activity.category} />
              <StatusBadge status={status} />
            </div>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl md:leading-tight">{activity.title}</h1>
          </header>

          <section aria-labelledby="about-heading" className="flex flex-col gap-3">
            <h2 id="about-heading" className="text-xl font-semibold">عن النشاط</h2>
            <p className="text-pretty text-lg leading-loose text-foreground/80">{activity.description}</p>
          </section>

          <section aria-labelledby="host-heading" className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
            <PersonAvatar person={host} size="lg" />
            <div className="flex-1">
              <h2 id="host-heading" className="text-xs font-semibold text-muted-foreground">المنظّم</h2>
              <p className="font-display text-lg font-semibold">{isHost ? `${host.name} (أنت)` : host.name}</p>
              {host.bio && <p className="text-sm text-muted-foreground">{host.bio}</p>}
            </div>
          </section>

          <section aria-labelledby="participants-heading" className="flex flex-col gap-4">
            <h2 id="participants-heading" className="flex items-center gap-2 text-xl font-semibold">
              <Users className="size-5" aria-hidden="true" />
              المشاركون ({activity.participantIds.length})
            </h2>
            <ul className="flex flex-wrap gap-3">
              {activity.participantIds.map((pid) => {
                const p = PEOPLE[pid]
                return (
                  <li key={pid} className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-4 pr-1 animate-in fade-in zoom-in-95">
                    <PersonAvatar person={p} className="ring-0" />
                    <span className="text-sm font-medium">{pid === CURRENT_USER_ID ? 'أنت' : p.name}</span>
                  </li>
                )
              })}
              {status === 'open' &&
                Array.from({ length: emptySlots }).map((_, i) => (
                  <li key={`empty-${i}`} aria-hidden="true" className="flex items-center gap-2 rounded-full border border-dashed border-foreground/25 py-1 pl-4 pr-1 text-sm text-muted-foreground">
                    <span className="size-8 rounded-full border border-dashed border-foreground/25" />
                    مقعد متاح
                  </li>
                ))}
              {activity.participantIds.length === 0 && status !== 'open' && (
                <li className="text-muted-foreground">لا يوجد مشاركون.</li>
              )}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className={cn('flex flex-col gap-6 rounded-[2rem] border border-foreground/10 p-6', cat.bg)}>
            <dl className="flex flex-col gap-4">
              <InfoRow icon={CalendarDays} label="التاريخ" value={formatLongDate(activity.date)} />
              <InfoRow icon={Clock} label="الوقت" value={formatTime(activity.time)} />
              <InfoRow icon={MapPin} label="الموقع" value={activity.location} detail={activity.locationDetail} />
            </dl>

            <div className="rounded-2xl bg-card p-4">
              <SeatsMeter filled={activity.participantIds.length} max={activity.maxMembers} />
            </div>

            <div aria-live="polite">{action}</div>

            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className={cn(pill({ variant: 'ghost', size: 'sm' }), 'self-center')}
            >
              <Share2 aria-hidden="true" />
              نسخ رابط النشاط
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  detail?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <dt className="text-xs font-semibold text-foreground/60">{label}</dt>
        <dd className="font-semibold">{value}</dd>
        {detail && <dd className="text-sm text-foreground/70">{detail}</dd>}
      </div>
    </div>
  )
}
