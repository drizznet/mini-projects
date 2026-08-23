import type { Testimonial, WhyChooseUsItem } from '@/types/home'

export const whyChooseUsItems: WhyChooseUsItem[] = [
  {
    id: 'curated',
    title: 'Curated for remote work',
    description:
      'Every product is selected for ergonomics, aesthetics, and durability — not mass-market filler.',
    icon: 'design',
  },
  {
    id: 'quality',
    title: 'Built to last',
    description:
      'Premium materials, solid warranties, and maker partnerships you can trust for daily use.',
    icon: 'quality',
  },
  {
    id: 'support',
    title: 'Workspace specialists',
    description:
      'Real guidance on desks, seating, and lighting — so your setup works as hard as you do.',
    icon: 'support',
  },
  {
    id: 'delivery',
    title: 'Fast, careful delivery',
    description:
      'White-glove shipping on furniture, tracked delivery on gear, and hassle-free returns.',
    icon: 'delivery',
  },
]

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      'The standing desk and monitor light completely changed my home office. Everything feels intentional now.',
    name: 'Sarah Chen',
    role: 'Product Designer, Remote',
    rating: 5,
    initials: 'SC',
  },
  {
    id: '2',
    quote:
      'Finally a store that understands developers. The keyboard and desk pad are daily drivers — zero regrets.',
    name: 'Marcus Okonkwo',
    role: 'Staff Engineer',
    rating: 5,
    initials: 'MO',
  },
  {
    id: '3',
    quote:
      'The ergo chair saved my back during long sprint weeks. AuraDesk curation is genuinely next-level.',
    name: 'Elena Vasquez',
    role: 'Founder, Studio Nine',
    rating: 5,
    initials: 'EV',
  },
]
