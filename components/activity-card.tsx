import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock, MapPin } from 'lucide-react'
import { CATEGORY_MAP, PEOPLE, getImage, getStatus, type Activity } from '@/lib/activities'
import { formatShortDate, formatTime } from '@/lib/format'
import { pill } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { CategoryBadge, StatusBadge } from './badges'
import { PersonAvatar } from './person-avatar'
import { SeatsMeter } from './seats-meter'

export function ActivityCard({ activity, footer }: { activity: Activity; footer?: React.ReactNode }) {
  const host = PEOPLE[activity.hostId]
  const status = getStatus(activity)
  const cat = CATEGORY_MAP[activity.category]
  const dimmed = status === 'cancelled' || status === 'completed'

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-3xl border border-foreground/10 transition-transform hover:-translate-y-1',
        cat.bg,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-card">
        <Image
          src={getImage(activity) || '/placeholder.svg'}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={cn('object-cover transition-transform duration-500 group-hover:scale-105', dimmed && 'grayscale')}
        />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <CategoryBadge category={activity.category} className="bg-card/95" />
          {status !== 'open' && <StatusBadge status={status} className="shadow-sm" />}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="text-lg font-semibold leading-snug">{activity.title}</h3>

        <ul className="flex flex-col gap-2 text-sm text-foreground/80">
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
            <span>{formatShortDate(activity.date)}</span>
            <span aria-hidden="true" className="text-foreground/40">•</span>
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            <span>{formatTime(activity.time)}</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{activity.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <PersonAvatar person={host} className="size-6 text-[10px] ring-0" />
            <span>
              بتنظيم <span className="font-semibold text-foreground">{host.id === 'me' ? 'أنت' : host.name}</span>
            </span>
          </li>
        </ul>

        <SeatsMeter filled={activity.participantIds.length} max={activity.maxMembers} className="mt-auto" />

        {footer ?? (
          <Link href={`/activities/${activity.id}`} className={cn(pill({ variant: 'ink', size: 'sm' }), 'w-full')}>
            عرض التفاصيل
            <ArrowLeft aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
          </Link>
        )}
      </div>
    </article>
  )
}
