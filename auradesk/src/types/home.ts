export interface WhyChooseUsItem {
  id: string
  title: string
  description: string
  icon: 'design' | 'quality' | 'support' | 'delivery'
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  rating: number
  initials: string
}
