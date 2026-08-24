export type ProductStatus = 'Live' | 'Coming soon'

export type Product = {
  slug: string
  name: string
  byline: string
  category: string
  status: ProductStatus
  summary: string
  details: string
  landingUrl?: string
  accessUrl?: string
  image?: string
  beats?: readonly [string, string][]
}

export const siteConfig = {
  name: 'meeva',
  legalName: 'Meeva',
  kind: 'Software company',
  tagline: 'Software, made to be used.',
  description:
    'Meeva designs and ships products for everyday work and life. Some are new. Some replace something you already use. All of them are meant to stay.',
  manifesto:
    'This is the house for that work — a store for what is live, and a list for what is next.',
  productPattern: 'Product by meeva',
  routes: {
    home: '/',
    marketplace: '/marketplace',
    soon: '/soon',
  },
  nav: [
    { label: 'Marketplace', to: '/marketplace' as const },
    { label: 'Coming soon', to: '/soon' as const },
  ],
} as const

/** Dummy catalog for layout. Replace when real products are ready. */
export const products: Product[] = [
  {
    slug: 'lumen',
    name: 'Lumen',
    byline: 'by meeva',
    category: 'Writing',
    status: 'Live',
    summary: 'A quiet place to draft, keep, and return to your notes.',
    details:
      'Lumen is a notes app for people who write in short bursts. Capture a thought, group it later, and open it on any device.\n\nThis listing is dummy data so the marketplace can be reviewed.',
    landingUrl: 'https://example.com/lumen',
    accessUrl: 'https://example.com/lumen/app',
    beats: [
      ['Capture', 'Fast inbox'],
      ['Keep', 'Simple folders'],
      ['Return', 'Search that works'],
    ],
  },
  {
    slug: 'relay',
    name: 'Relay',
    byline: 'by meeva',
    category: 'Inbox',
    status: 'Live',
    summary: 'One inbox for the messages you actually need to answer.',
    details:
      'Relay pulls a few accounts into a single list, then lets you snooze, pin, or close a thread without living in email all day.\n\nThis listing is dummy data so the marketplace can be reviewed.',
    landingUrl: 'https://example.com/relay',
    accessUrl: 'https://example.com/relay/app',
    beats: [
      ['Unify', 'A few accounts'],
      ['Triage', 'Pin or snooze'],
      ['Close', 'Done means done'],
    ],
  },
  {
    slug: 'north',
    name: 'North',
    byline: 'by meeva',
    category: 'Planning',
    status: 'Coming soon',
    summary: 'A weekly plan that stays small enough to finish.',
    details:
      'North is a planning tool for a week at a time. You pick a few outcomes, block the hours, and see what slipped without turning it into a second job.\n\nThis listing is dummy data so the coming-soon page can be reviewed.',
    landingUrl: 'https://example.com/north',
    beats: [
      ['Week', 'One horizon'],
      ['Hours', 'Honest blocks'],
      ['Review', 'What slipped'],
    ],
  },
  {
    slug: 'kindling',
    name: 'Kindling',
    byline: 'by meeva',
    category: 'Journal',
    status: 'Coming soon',
    summary: 'A private journal with a short prompt, not a streak to protect.',
    details:
      'Kindling is a journal you can open for two minutes. A prompt if you want one, a blank page if you do not, and nothing that punishes a missed day.\n\nThis listing is dummy data so the coming-soon page can be reviewed.',
    beats: [
      ['Prompt', 'Optional'],
      ['Write', 'Two minutes'],
      ['Keep', 'Private by default'],
    ],
  },
]
