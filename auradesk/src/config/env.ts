/**
 * Central place for environment variables.
 * Add validation (e.g. zod) when wiring real APIs.
 */
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
  isDev: process.env.NODE_ENV === 'development',
} as const
