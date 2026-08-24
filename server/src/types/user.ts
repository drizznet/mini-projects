/**
 * User row as returned by repositories (ISO date strings).
 * Table: `users` in `prisma/schema.prisma`.
 * Never send `password` in HTTP responses — strip it in the mapper.
 */
export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
