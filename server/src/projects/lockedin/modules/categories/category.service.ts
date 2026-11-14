import { AppError } from "../../../../errors";
import {
  categoryRepository,
  type CategoryRepository,
} from "./category.repository";
import type {
  Category,
  CategoryListResponse,
  CategoryResponse,
  CreateCategoryBody,
  UpdateCategoryBody,
} from "./category.types";

function normalizeInput(
  body: CreateCategoryBody,
): Omit<Category, "id" | "createdAt" | "updatedAt"> {
  const name = body.name.trim();
  if (!name) throw new AppError(400, "Category name is required");

  return {
    name,
    description: body.description?.trim() || null,
    color: body.color ?? "chart-1",
    icon: body.icon?.trim() || "circle",
  };
}

export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async list(email: string): Promise<CategoryListResponse> {
    const data = await this.repository.listForUser(email);
    return { data, meta: { total: data.length } };
  }

  async get(email: string, id: string): Promise<CategoryResponse> {
    const data = await this.repository.findForUser(email, id);
    if (!data) throw new AppError(404, "Category not found");
    return { data };
  }

  async create(email: string, body: CreateCategoryBody): Promise<CategoryResponse> {
    const input = normalizeInput(body);
    const duplicate = await this.repository.findByNameForUser(email, input.name);
    if (duplicate) throw new AppError(409, "A category with this name already exists");
    return { data: await this.repository.createForUser(email, input) };
  }

  async update(email: string, id: string, body: UpdateCategoryBody): Promise<CategoryResponse> {
    const existing = await this.repository.findForUser(email, id);
    if (!existing) throw new AppError(404, "Category not found");

    const input = normalizeInput({ ...existing, ...body });
    const duplicate = await this.repository.findByNameForUser(email, input.name);
    if (duplicate && duplicate.id !== id) {
      throw new AppError(409, "A category with this name already exists");
    }

    const data = await this.repository.updateForUser(email, id, input);
    if (!data) throw new AppError(404, "Category not found");
    return { data };
  }

  async delete(email: string, id: string): Promise<void> {
    if (!(await this.repository.deleteForUser(email, id))) {
      throw new AppError(404, "Category not found");
    }
  }
}

export const categoryService = new CategoryService(categoryRepository);
