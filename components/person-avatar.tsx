import { CATEGORY_MAP, PEOPLE, type Person } from '@/lib/activities'
import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-lg',
}

export function PersonAvatar({
  person,
  size = 'sm',
  className,
}: {
  person: Person
  size?: keyof typeof SIZES
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-foreground ring-2 ring-background',
        CATEGORY_MAP[person.tone].bg,
        SIZES[size],
        className,
      )}
    >
      {initials(person.name)}
    </span>
  )
}

export function AvatarStack({ ids, max = 4 }: { ids: string[]; max?: number }) {
  const visible = ids.slice(0, max)
  const extra = ids.length - visible.length
  if (ids.length === 0) return null
  return (
    <div className="flex items-center -space-x-2 space-x-reverse" aria-label={`${ids.length} مشارك`}>
      {visible.map((id) => (
        <PersonAvatar key={id} person={PEOPLE[id]} />
      ))}
      {extra > 0 && (
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background ring-2 ring-background">
          +{extra}
        </span>
      )}
    </div>
  )
}
