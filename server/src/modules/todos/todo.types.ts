/**
 * Todo HTTP DTOs. Row type: `src/types/todo.ts`.
 */
import type { Todo } from "../../types/todo";

export type { Todo };

export interface CreateTodoBody {
  /**
   * @minLength 1
   * @maxLength 200
   */
  title: string;
  /**
   * @maxLength 2000
   */
  description?: string;
}

export interface UpdateTodoBody {
  /**
   * @minLength 1
   * @maxLength 200
   */
  title?: string;
  /**
   * @maxLength 2000
   */
  description?: string;
  completed?: boolean;
}

export interface ListTodosQuery {
  /** Filter by completion state. */
  completed?: boolean;
  /** Case-insensitive search on title + description. */
  q?: string;
  /**
   * @isInt
   * @minimum 1
   * @default 1
   */
  page?: number;
  /**
   * @isInt
   * @minimum 1
   * @maximum 100
   * @default 20
   */
  limit?: number;
}

export interface TodoResponse {
  data: Todo;
}

export interface TodoListResponse {
  data: Todo[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
