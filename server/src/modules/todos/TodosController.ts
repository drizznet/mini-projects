/**
 * Feature-module CRUD template (controller → service → repository → SQL).
 *
 * Copy `src/modules/todos/` when adding a new resource:
 * 1. HTTP DTOs (`*.types.ts`)
 * 2. repository (Prisma → Postgres)
 * 3. service (rules)
 * 4. *Controller.ts (TSOA HTTP) — globbed by tsoa.json
 *
 * Controllers return Promises because DB I/O is async — TSOA awaits them.
 *
 * @example
 * GET    /api/todos?completed=false&q=ship&page=1&limit=20
 * POST   /api/todos
 * GET    /api/todos/{id}
 * PATCH  /api/todos/{id}
 * DELETE /api/todos/{id}
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Patch,
  Post,
  Query,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import { todoService } from "./todo.service";
import type {
  CreateTodoBody,
  TodoListResponse,
  TodoResponse,
  UpdateTodoBody,
} from "./todo.types";

@Route("api/todos")
@Tags("Todos")
export class TodosController extends Controller {
  /**
   * List todos with optional filter, search, and pagination.
   */
  @Get()
  public listTodos(
    @Query() completed?: boolean,
    @Query() q?: string,
    @Query() page?: number,
    @Query() limit?: number,
  ): Promise<TodoListResponse> {
    return todoService.list({ completed, q, page, limit });
  }

  @Get("{id}")
  public getTodo(@Path() id: string): Promise<TodoResponse> {
    return todoService.getById(id);
  }

  @Post()
  @SuccessResponse(201, "Created")
  public async createTodo(@Body() body: CreateTodoBody): Promise<TodoResponse> {
    this.setStatus(201);
    return todoService.create(body);
  }

  @Patch("{id}")
  public updateTodo(
    @Path() id: string,
    @Body() body: UpdateTodoBody,
  ): Promise<TodoResponse> {
    return todoService.update(id, body);
  }

  @Delete("{id}")
  @SuccessResponse(204, "No Content")
  public async deleteTodo(@Path() id: string): Promise<void> {
    await todoService.delete(id);
    this.setStatus(204);
  }
}
