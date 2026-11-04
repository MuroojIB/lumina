import type { Metadata } from 'next'
import { CreateActivityForm } from '@/components/create/create-activity-form'

export const metadata: Metadata = {
  title: 'أنشئ نشاطاً | رِفقة',
  description: 'أنشئ نشاطك وادعُ الآخرين للانضمام إليك.',
}

export default function CreatePage() {
  return (
    <div className="bg-grid-paper">
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold md:text-5xl">أنشئ نشاطاً جديداً</h1>
          <p className="text-muted-foreground">شاركنا التفاصيل، وسنساعدك في إيجاد رفقتك.</p>
        </div>
        <CreateActivityForm />
      </div>
    </div>
  )
}
