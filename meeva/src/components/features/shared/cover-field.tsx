import { useState } from 'react'
import { cn } from '@/lib/utils'

export function CoverField({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        aria-hidden
        className={cn(
          'relative overflow-hidden bg-surface',
          className
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--hq-accent)_35%,transparent),transparent_42%),radial-gradient(circle_at_80%_70%,color-mix(in_srgb,var(--hq-ink)_10%,transparent),transparent_50%)]" />
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
