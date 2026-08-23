'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, CheckCircle2, CreditCard, MapPin, User } from 'lucide-react'
import { useCart } from '@/components/features/cart/cart-context'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const inputClassName =
  'w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary'

const SHIPPING_FEE = 29

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
  cardNumber: string
  expiry: string
  cvc: string
}

const initialForm: CheckoutForm = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
}

export default function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart } = useCart()
  const [form, setForm] = useState<CheckoutForm>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const shipping = subtotal >= 500 ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1200))

    setOrderId(`AD-${Date.now().toString().slice(-8)}`)
    clearCart()
    setIsSubmitting(false)
  }

  if (orderId) {
    return (
      <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Order confirmed
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you for your purchase. Your workspace gear is on its way.
          </p>
          <p className="mt-4 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground">
            Order #{orderId}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            A confirmation email will be sent to {form.email}.
          </p>
          <Link href="/shop" className={cn(buttonVariants({ size: 'lg' }), 'mt-8')}>
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Nothing to checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your cart is empty. Add items from the shop before checking out.
          </p>
          <Link href="/shop" className={cn(buttonVariants({ size: 'lg' }), 'mt-8')}>
            Browse Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-border/40 pb-6 text-left">
          <Link
            href="/shop"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to shop
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete your order — {itemCount} item{itemCount === 1 ? '' : 's'} in cart.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-7">
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">Contact</h2>
              </div>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Email</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@example.com"
                  className={inputClassName}
                />
              </label>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">Shipping address</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">First name</span>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">Last name</span>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className="block space-y-1.5 sm:col-span-2">
                  <span className="text-xs font-semibold text-muted-foreground">Address</span>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">City</span>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">State</span>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">ZIP code</span>
                  <input
                    type="text"
                    required
                    value={form.zip}
                    onChange={(e) => updateField('zip', e.target.value)}
                    className={inputClassName}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">Payment</h2>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">
                Payment processing is simulated for now — no card will be charged.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">Card number</span>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    value={form.cardNumber}
                    onChange={(e) => updateField('cardNumber', e.target.value)}
                    className={inputClassName}
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">Expiry</span>
                    <input
                      type="text"
                      required
                      placeholder="MM / YY"
                      value={form.expiry}
                      onChange={(e) => updateField('expiry', e.target.value)}
                      className={inputClassName}
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">CVC</span>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      placeholder="123"
                      value={form.cvc}
                      onChange={(e) => updateField('cvc', e.target.value)}
                      className={inputClassName}
                    />
                  </label>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="border-b border-border/40 pb-3 text-sm font-bold text-foreground">
                Order summary
              </h2>
              <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-accent">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {quantity}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-foreground">
                      ${(product.price * quantity).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2 border-t border-border/40 pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    Free shipping on orders over $500
                  </p>
                )}
                <div className="flex justify-between border-t border-border/40 pt-2 text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <Button type="submit" className="mt-5 w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Processing…' : `Place order — $${total.toLocaleString()}`}
              </Button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}
