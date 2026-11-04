'use client'

import { useId, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronDown, ImagePlus, Minus, Plus, Send, Trash2 } from 'lucide-react'
import { CATEGORIES, type CategoryId } from '@/lib/activities'
import { pill } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { useActivities } from '../activity-store'

const fieldClass =
  'h-12 w-full rounded-2xl border border-input bg-card px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 aria-invalid:border-destructive'

type Errors = Partial<Record<'title' | 'description' | 'category' | 'date' | 'time' | 'location', string>>

export function CreateActivityForm() {
  const router = useRouter()
  const { create } = useActivities()
  const fileRef = useRef<HTMLInputElement>(null)
  const [maxMembers, setMaxMembers] = useState(6)
  const [image, setImage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  const onImage = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const value = (k: string) => String(data.get(k) ?? '').trim()
    const next: Errors = {}
    if (value('title').length < 4) next.title = 'اكتب عنواناً من ٤ أحرف على الأقل'
    if (value('description').length < 10) next.description = 'أضف وصفاً قصيراً (١٠ أحرف على الأقل)'
    if (!value('category')) next.category = 'اختر فئة النشاط'
    if (!value('date')) next.date = 'حدد التاريخ'
    if (!value('time')) next.time = 'حدد الوقت'
    if (!value('location')) next.location = 'أضف الموقع'
    setErrors(next)
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0]
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setSubmitting(true)
    const id = create({
      title: value('title'),
      description: value('description'),
      category: value('category') as CategoryId,
      date: value('date'),
      time: value('time'),
      location: value('location'),
      maxMembers,
      image: image ?? undefined,
    })
    router.push(`/activities/${id}`)
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6 rounded-[2rem] border border-border bg-card p-5 shadow-sm md:p-8">
      <Field label="عنوان النشاط" name="title" error={errors.title}>
        {(props) => <input {...props} type="text" maxLength={80} placeholder="مثلاً: جلسة قهوة وتعارف" className={fieldClass} />}
      </Field>

      <Field label="الوصف" name="description" error={errors.description}>
        {(props) => (
          <textarea
            {...props}
            rows={4}
            maxLength={600}
            placeholder="ماذا ستفعلون؟ ولمن يناسب هذا النشاط؟"
            className={cn(fieldClass, 'h-auto resize-y py-3 leading-relaxed')}
          />
        )}
      </Field>

      <Field label="الفئة" name="category" error={errors.category}>
        {(props) => (
          <div className="relative">
            <select {...props} defaultValue="" className={cn(fieldClass, 'appearance-none pl-10')}>
              <option value="" disabled>
                اختر الفئة
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="التاريخ" name="date" error={errors.date}>
          {(props) => <input {...props} type="date" min="2026-04-11" className={cn(fieldClass, 'text-right')} />}
        </Field>
        <Field label="الوقت" name="time" error={errors.time}>
          {(props) => <input {...props} type="time" className={cn(fieldClass, 'text-right')} />}
        </Field>
      </div>

      <Field label="الموقع" name="location" error={errors.location}>
        {(props) => <input {...props} type="text" placeholder="اسم المكان والمدينة" className={fieldClass} />}
      </Field>

      <div className="flex flex-col gap-2">
        <label htmlFor="maxMembers" className="text-sm font-semibold">
          الحد الأقصى للمشاركين
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMaxMembers((n) => Math.max(2, n - 1))}
            aria-label="إنقاص العدد"
            className="flex size-12 items-center justify-center rounded-2xl border border-input bg-card hover:bg-muted"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <input
            id="maxMembers"
            name="maxMembers"
            type="number"
            inputMode="numeric"
            min={2}
            max={50}
            value={maxMembers}
            onChange={(e) => setMaxMembers(Math.min(50, Math.max(2, Number(e.target.value) || 2)))}
            className={cn(fieldClass, 'w-24 text-center font-display text-lg font-semibold')}
          />
          <button
            type="button"
            onClick={() => setMaxMembers((n) => Math.min(50, n + 1))}
            aria-label="زيادة العدد"
            className="flex size-12 items-center justify-center rounded-2xl border border-input bg-card hover:bg-muted"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
          <span className="text-sm text-muted-foreground">من ٢ إلى ٥٠ شخصاً</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">
          صورة النشاط <span className="font-normal text-muted-foreground">(اختياري)</span>
        </span>
        {image ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border">
            <Image src={image || '/placeholder.svg'} alt="معاينة صورة النشاط" fill unoptimized className="object-cover" />
            <button
              type="button"
              onClick={() => {
                setImage(null)
                if (fileRef.current) fileRef.current.value = ''
              }}
              className={cn(pill({ variant: 'danger', size: 'sm' }), 'absolute left-3 top-3')}
            >
              <Trash2 aria-hidden="true" />
              إزالة
            </button>
          </div>
        ) : (
          <label
            htmlFor="image"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              onImage(e.dataTransfer.files[0])
            }}
            className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-foreground/20 bg-muted/50 px-6 py-10 text-center transition-colors hover:border-primary hover:bg-accent/40 has-[:focus-visible]:border-primary"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-cat-learning">
              <ImagePlus className="size-5" aria-hidden="true" />
            </span>
            <span className="font-semibold">اسحب صورة هنا أو اضغط للرفع</span>
            <span className="text-sm text-muted-foreground">PNG أو JPG. إذا لم ترفع صورة سنستخدم رسمة الفئة.</span>
            <input ref={fileRef} id="image" type="file" accept="image/*" className="sr-only" onChange={(e) => onImage(e.target.files?.[0])} />
          </label>
        )}
      </div>

      <button type="submit" disabled={submitting} className={cn(pill({ size: 'lg' }), 'mt-2 w-full sm:w-auto sm:self-start')}>
        <Send aria-hidden="true" className="-scale-x-100" />
        نشر النشاط
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string
  name: string
  error?: string
  children: (props: { id: string; name: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }) => React.ReactNode
}) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children({ id, name, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? errorId : undefined })}
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
