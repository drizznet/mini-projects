import { useState } from 'react'
import { cn } from '@/lib/utils'

export function CoverField({
  src,
  alt,
  label,
  className,
}: {
  src: string
  alt: string
  label?: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        aria-hidden
        className={cn('relative overflow-hidden bg-surface', className)}
      >
        <div className="absolute inset-0 flex flex-col bg-surface">
          <div className="flex items-center gap-1.5 border-b border-line px-2.5 py-2">
            <span className="size-1.5 rounded-full bg-line-strong/30" />
            <span className="size-1.5 rounded-full bg-line-strong/30" />
            <span className="size-1.5 rounded-full bg-line-strong/30" />
          </div>
          <div className="flex flex-1 flex-col justify-end p-3">
            {label ? (
              <p className="text-[11px] font-medium tracking-wide text-faint uppercase">
                {label}
              </p>
            ) : null}
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 w-3/4 bg-line" />
              <div className="h-1.5 w-1/2 bg-line" />
              <div className="h-16 w-full bg-line/80" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  )
}
