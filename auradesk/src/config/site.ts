export const siteConfig = {
  name: 'AuraDesk',
  description:
    'Aesthetic desks, lighting, gadgets, and furniture for remote workers and developers.',
  themeStorageKey: 'auradesk-theme',
  wishlistStorageKey: 'auradesk-wishlist',
  cdnHost: 'cdn.auradesk.com',
  routes: {
    home: '/',
    shop: '/shop',
    checkout: '/checkout',
    admin: '/admin',
    adminAssets: '/admin/assets',
  },
} as const

export type SiteConfig = typeof siteConfig
