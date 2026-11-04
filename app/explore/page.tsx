import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ExploreView } from '@/components/explore/explore-view'

export const metadata: Metadata = {
  title: 'استكشف الأنشطة | رِفقة',
  description: 'ابحث عن أنشطة محلية حسب الفئة وانضم إليها.',
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreView />
    </Suspense>
  )
}
