'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CURRENT_USER_ID, SEED_ACTIVITIES, type Activity } from '@/lib/activities'

export type NewActivityInput = Omit<Activity, 'id' | 'hostId' | 'participantIds' | 'cancelled' | 'completed'>

type ActivityStore = {
  activities: Activity[]
  getActivity: (id: string) => Activity | undefined
  join: (id: string) => void
  leave: (id: string) => void
  cancel: (id: string) => void
  create: (input: NewActivityInput) => string
}

const ActivityContext = createContext<ActivityStore | null>(null)

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES)

  const update = useCallback((id: string, fn: (a: Activity) => Activity) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? fn(a) : a)))
  }, [])

  const join = useCallback(
    (id: string) =>
      update(id, (a) =>
        a.participantIds.includes(CURRENT_USER_ID) || a.participantIds.length >= a.maxMembers || a.cancelled
          ? a
          : { ...a, participantIds: [...a.participantIds, CURRENT_USER_ID] },
      ),
    [update],
  )

  const leave = useCallback(
    (id: string) => update(id, (a) => ({ ...a, participantIds: a.participantIds.filter((p) => p !== CURRENT_USER_ID) })),
    [update],
  )

  const cancel = useCallback((id: string) => update(id, (a) => ({ ...a, cancelled: true })), [update])

  const create = useCallback((input: NewActivityInput) => {
    const id = `act-${Date.now().toString(36)}`
    setActivities((prev) => [{ ...input, id, hostId: CURRENT_USER_ID, participantIds: [] }, ...prev])
    return id
  }, [])

  const value = useMemo<ActivityStore>(
    () => ({
      activities,
      getActivity: (id) => activities.find((a) => a.id === id),
      join,
      leave,
      cancel,
      create,
    }),
    [activities, join, leave, cancel, create],
  )

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}

export function useActivities() {
  const ctx = useContext(ActivityContext)
  if (!ctx) throw new Error('useActivities must be used within ActivityProvider')
  return ctx
}
