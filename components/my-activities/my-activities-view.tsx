'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Ban, Eye, LogOut, Plus } from 'lucide-react'
import { CURRENT_USER_ID, PEOPLE, getStatus, type Activity } from '@/lib/activities'
import { pill } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { useActivities } from '../activity-store'
import { ActivityCard } from '../activity-card'
import { PersonAvatar } from '../person-avatar'

type Tab = 'created' | 'joined'

export function MyActivitiesView() {
  const { activities, cancel, leave } = useActivities()
  const [tab, setTab] = useState<Tab>('created')
  const [confirming, setConfirming] = useState<string | null>(null)
  const me = PEOPLE[CURRENT_USER_ID]

  const created = activities.filter((a) => a.hostId === CURRENT_USER_ID)
  const joined = activities.filter((a) => a.participantIds.includes(CURRENT_USER_ID))
  const list = tab === 'created' ? created : joined

  const stats = [
    { label: 'أنشأتها', value: created.length, bg: 'bg-cat-arts' },
    { label: 'انضممت إليها', value: joined.length, bg: 'bg-cat-sports' },
    { label: 'أشخاص التقيت بهم', value: new Set(joined.flatMap((a) => [a.hostId, ...a.participantIds])).size - 1, bg: 'bg-cat-games' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <PersonAvatar person={me} size="lg" />
          <div>
            <p className="text-sm text-muted-foreground">أهلاً بعودتك،</p>
            <h1 className="text-3xl font-bold md:text-4xl">مساحتي</h1>
          </div>
        </div>
        <ul className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <li key={s.label} className={cn('rounded-2xl border border-foreground/10 px-4 py-3', s.bg)}>
              <p className="font-display text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium text-foreground/70">{s.label}</p>
            </li>
          ))}
        </ul>
      </header>

      <div role="tablist" aria-label="أنشطتي" className="mb-8 inline-flex rounded-full border border-border bg-card p-1">
        {(
          [
            { id: 'created', label: 'الأنشطة التي أنشأتها', count: created.length },
            { id: 'joined', label: 'الأنشطة التي انضممت إليها', count: joined.length },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="tab-panel"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors md:px-5',
              tab === t.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
            <span className={cn('rounded-full px-2 text-xs', tab === t.id ? 'bg-background/20' : 'bg-muted')}>{t.count}</span>
          </button>
        ))}
      </div>

      <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-foreground/20 bg-card px-6 py-16 text-center">
            <h2 className="text-xl font-semibold">{tab === 'created' ? 'لم تنشئ أي نشاط بعد' : 'لم تنضم لأي نشاط بعد'}</h2>
            <Link href={tab === 'created' ? '/create' : '/explore'} className={pill()}>
              {tab === 'created' ? 'أنشئ نشاطك الأول' : 'استكشف الأنشطة'}
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tab === 'created' && (
              <Link
                href="/create"
                className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-foreground/20 bg-card text-center transition-colors hover:border-primary hover:bg-accent/30"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Plus className="size-6" aria-hidden="true" />
                </span>
                <span className="font-display text-lg font-semibold">نشاط جديد</span>
              </Link>
            )}
            {list.map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                footer={
                  <ManageActions
                    activity={a}
                    mode={tab}
                    confirming={confirming === a.id}
                    onAsk={() => setConfirming(a.id)}
                    onDismiss={() => setConfirming(null)}
                    onConfirm={() => {
                      if (tab === 'created') cancel(a.id)
                      else leave(a.id)
                      setConfirming(null)
                    }}
                  />
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ManageActions({
  activity,
  mode,
  confirming,
  onAsk,
  onDismiss,
  onConfirm,
}: {
  activity: Activity
  mode: Tab
  confirming: boolean
  onAsk: () => void
  onDismiss: () => void
  onConfirm: () => void
}) {
  const status = getStatus(activity)
  const actionable = status === 'open' || status === 'full'
  const view = (
    <Link href={`/activities/${activity.id}`} className={cn(pill({ variant: 'ink', size: 'sm' }), 'flex-1')}>
      <Eye aria-hidden="true" />
      عرض
    </Link>
  )

  if (!actionable) return <div className="flex gap-2">{view}</div>

  if (confirming) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl bg-card p-3" role="alertdialog" aria-label="تأكيد الإجراء">
        <p className="text-sm font-medium">
          {mode === 'created' ? 'إلغاء النشاط سيُبلغ جميع المشاركين. متأكد؟' : 'هل تريد مغادرة هذا النشاط؟'}
        </p>
        <div className="flex gap-2">
          <button onClick={onConfirm} className={cn(pill({ size: 'sm' }), 'flex-1 bg-destructive hover:bg-destructive/90')}>
            نعم، تأكيد
          </button>
          <button onClick={onDismiss} className={cn(pill({ variant: 'outline', size: 'sm' }), 'flex-1')}>
            تراجع
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {view}
      <button onClick={onAsk} className={cn(pill({ variant: 'danger', size: 'sm' }), 'flex-1')}>
        {mode === 'created' ? <Ban aria-hidden="true" /> : <LogOut aria-hidden="true" />}
        {mode === 'created' ? 'إلغاء النشاط' : 'مغادرة'}
      </button>
    </div>
  )
}
