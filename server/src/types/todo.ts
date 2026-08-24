/**
 * Todo row as returned by repositories (ISO date strings).
 * Table: `todos` in `prisma/schema.prisma`.
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  /** Set when completed flips to true; cleared when reopened. */
  completedAt?: string | null;
}
