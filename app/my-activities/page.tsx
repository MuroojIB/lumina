import type { Metadata } from 'next'
import { MyActivitiesView } from '@/components/my-activities/my-activities-view'

export const metadata: Metadata = {
  title: 'مساحتي | رِفقة',
  description: 'أدِر الأنشطة التي أنشأتها والتي انضممت إليها.',
}

export default function MyActivitiesPage() {
  return <MyActivitiesView />
}
