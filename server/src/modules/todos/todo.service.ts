/**
 * Todo use-cases / business rules.
 * Controllers stay thin; persistence goes through `todoRepository` only.
 */
import { AppError } from "../../errors";
import { todoRepository, type TodoRepository } from "./todo.repository";
import type {
  CreateTodoBody,
  ListTodosQuery,
  TodoListResponse,
  TodoResponse,
  UpdateTodoBody,
} from "./todo.types";

function normalizeTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new AppError(400, "Title is required");
  }
  return trimmed;
}

export class TodoService {
  constructor(private readonly todos: TodoRepository) {}

  async list(query: ListTodosQuery = {}): Promise<TodoListResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const all = await this.todos.list({
      completed: query.completed,
      q: query.q,
    });

    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);

    return {
      data,
      meta: { page, limit, total, totalPages },
    };
  }

  async getById(id: string): Promise<TodoResponse> {
    const todo = await this.todos.findById(id);
    if (!todo) {
      throw new AppError(404, "Todo not found");
    }
    return { data: todo };
  }

  async create(body: CreateTodoBody): Promise<TodoResponse> {
    const todo = await this.todos.create({
      title: normalizeTitle(body.title),
      description: body.description?.trim() || undefined,
    });
    return { data: todo };
  }

  async update(id: string, body: UpdateTodoBody): Promise<TodoResponse> {
    const existing = await this.todos.findById(id);
    if (!existing) {
      throw new AppError(404, "Todo not found");
    }

    if (
      body.title === undefined &&
      body.description === undefined &&
      body.completed === undefined
    ) {
      throw new AppError(400, "At least one field is required to update");
    }

    let completedAt = existing.completedAt ?? null;
    if (typeof body.completed === "boolean") {
      if (body.completed && !existing.completed) {
        completedAt = new Date().toISOString();
      } else if (!body.completed && existing.completed) {
        completedAt = null;
      }
    }

    const todo = await this.todos.update(id, {
      title:
        body.title !== undefined ? normalizeTitle(body.title) : undefined,
      description:
        body.description !== undefined
          ? body.description.trim() || undefined
          : undefined,
      completed: body.completed,
      completedAt,
    });

    if (!todo) {
      throw new AppError(404, "Todo not found");
    }

    return { data: todo };
  }

  async delete(id: string): Promise<void> {
    const removed = await this.todos.delete(id);
    if (!removed) {
      throw new AppError(404, "Todo not found");
    }
  }
}

export const todoService = new TodoService(todoRepository);
