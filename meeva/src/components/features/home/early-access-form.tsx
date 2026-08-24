import { useState } from 'react'
import type { Product } from '@/config/site'

const storageKey = (slug: string) => `meeva:early-access:${slug}`

export function EarlyAccessForm({ product }: { product: Product }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [interest, setInterest] = useState<'access' | 'notify'>('access')
  const [done, setDone] = useState(() =>
    typeof window === 'undefined'
      ? false
      : Boolean(window.localStorage.getItem(storageKey(product.slug)))
  )

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.localStorage.setItem(storageKey(product.slug), interest)
    setDone(true)
  }

  if (done) {
    return (
      <p
        role="status"
        className="rounded-md border border-line bg-raised px-4 py-4 text-sm leading-6 text-muted"
      >
        You’re on the list for {product.name}. We’ll write when there’s
        something to use.
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <fieldset className="grid gap-2 text-sm">
        <legend className="mb-1 text-xs text-faint">What do you want?</legend>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="interest"
            checked={interest === 'access'}
            onChange={() => setInterest('access')}
          />
          Early access
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="interest"
            checked={interest === 'notify'}
            onChange={() => setInterest('notify')}
          />
          Notify me when it launches
        </label>
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-faint">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@email.com"
            className="mt-1.5 w-full rounded-md border border-line bg-canvas px-3 py-2.5 text-sm text-ink outline-none placeholder:text-faint focus:border-accent"
          />
        </label>
        <label className="block text-xs text-faint">
          Name <span>(optional)</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            placeholder="Your name"
            className="mt-1.5 w-full rounded-md border border-line bg-canvas px-3 py-2.5 text-sm text-ink outline-none placeholder:text-faint focus:border-accent"
          />
        </label>
      </div>
      <button
        type="submit"
        className="justify-self-start rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-canvas"
      >
        {interest === 'access' ? 'Request early access' : 'Notify me'}
      </button>
    </form>
  )
}
