/**
 * API route paths — single source of truth.
 * Client calls go through lib/api/client.ts; server can import these too.
 */
export const endpoints = {
  products: {
    list: '/api/products',
    byId: (id: string) => `/api/products/${id}`,
  },
  assets: {
    list: '/api/assets',
    upload: '/api/assets/upload',
  },
} as const
