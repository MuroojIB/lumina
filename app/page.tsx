import { Hero } from '@/components/landing/hero'
import { CategoryMarquee } from '@/components/landing/category-marquee'
import { Features } from '@/components/landing/features'
import { CategoryGrid } from '@/components/landing/category-grid'
import { UpcomingActivities } from '@/components/landing/upcoming-activities'
import { ClosingCta } from '@/components/landing/closing-cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryMarquee />
      <Features />
      <CategoryGrid />
      <UpcomingActivities />
      <ClosingCta />
    </>
  )
}
