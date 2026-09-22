/**
 * Todo persistence — Prisma Client → Postgres.
 * Services call `todoRepository`; do not import prisma from controllers/services.
 */
import type { Todo as PrismaTodo } from "@prisma/client";
import { prisma } from "../../db/prisma";
import type { Todo } from "./todo.types";

export type TodoCreateInput = {
  title: string;
  description?: string;
};

export type TodoUpdateInput = {
  title?: string;
  description?: string;
  completed?: boolean;
  completedAt?: string | null;
};

export type TodoListFilter = {
  completed?: boolean;
  q?: string;
};

function mapTodo(row: PrismaTodo): Todo {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    completed: row.completed,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
  };
}

export class TodoRepository {
  async list(filter: TodoListFilter = {}): Promise<Todo[]> {
    const q = filter.q?.trim();

    const rows = await prisma.todo.findMany({
      where: {
        ...(typeof filter.completed === "boolean"
          ? { completed: filter.completed }
          : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map(mapTodo);
  }

  async findById(id: string): Promise<Todo | null> {
    const row = await prisma.todo.findUnique({ where: { id } });
    return row ? mapTodo(row) : null;
  }

  async create(input: TodoCreateInput): Promise<Todo> {
    const row = await prisma.todo.create({
      data: {
        title: input.title,
        description: input.description,
      },
    });
    return mapTodo(row);
  }

  async update(id: string, input: TodoUpdateInput): Promise<Todo | null> {
    try {
      const row = await prisma.todo.update({
        where: { id },
        data: {
          ...(input.title !== undefined ? { title: input.title } : {}),
          ...(input.description !== undefined
            ? { description: input.description }
            : {}),
          ...(input.completed !== undefined
            ? { completed: input.completed }
            : {}),
          ...(input.completedAt !== undefined
            ? {
                completedAt: input.completedAt
                  ? new Date(input.completedAt)
                  : null,
              }
            : {}),
        },
      });
      return mapTodo(row);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.todo.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export const todoRepository = new TodoRepository();
