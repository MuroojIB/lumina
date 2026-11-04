import Link from 'next/link'
import { Logo } from './logo'

export function SiteFooter() {
  return (
    <footer className="mt-20 hidden border-t border-border bg-card md:block">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-muted-foreground">«كل تجربة أحلى برفقة.»</p>
        </div>
        <ul className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <li><Link href="/explore" className="hover:text-foreground">استكشف الأنشطة</Link></li>
          <li><Link href="/create" className="hover:text-foreground">أنشئ نشاطاً</Link></li>
          <li><Link href="/my-activities" className="hover:text-foreground">مساحتي</Link></li>
        </ul>
        <p className="text-xs text-muted-foreground">© 2026 رِفقة. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  )
}
