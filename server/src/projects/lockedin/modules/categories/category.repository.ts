import type { Category as PrismaCategory } from "../../../../generated/prisma/client";
import { prisma } from "../../../../db/prisma";
import type { Category } from "./category.types";

type CategoryInput = Omit<Category, "id" | "createdAt" | "updatedAt">;

function mapCategory(row: PrismaCategory): Category {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    color: row.color as Category["color"],
    icon: row.icon,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export class CategoryRepository {
  private async userIdForEmail(email: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return user?.id ?? null;
  }

  async listForUser(email: string): Promise<Category[]> {
    const userId = await this.userIdForEmail(email);
    if (!userId) return [];
    const rows = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(mapCategory);
  }

  async findForUser(email: string, id: string): Promise<Category | null> {
    const userId = await this.userIdForEmail(email);
    if (!userId) return null;
    const row = await prisma.category.findFirst({ where: { id, userId } });
    return row ? mapCategory(row) : null;
  }

  async findByNameForUser(email: string, name: string): Promise<Category | null> {
    const userId = await this.userIdForEmail(email);
    if (!userId) return null;
    const row = await prisma.category.findUnique({
      where: { userId_name: { userId, name } },
    });
    return row ? mapCategory(row) : null;
  }

  async createForUser(email: string, input: CategoryInput): Promise<Category> {
    const userId = await this.userIdForEmail(email);
    if (!userId) throw new Error("Authenticated user not found");
    const row = await prisma.category.create({ data: { ...input, userId } });
    return mapCategory(row);
  }

  async updateForUser(
    email: string,
    id: string,
    input: Partial<CategoryInput>,
  ): Promise<Category | null> {
    const userId = await this.userIdForEmail(email);
    if (!userId) return null;
    const existing = await prisma.category.findFirst({ where: { id, userId } });
    if (!existing) return null;
    const row = await prisma.category.update({ where: { id }, data: input });
    return mapCategory(row);
  }

  async deleteForUser(email: string, id: string): Promise<boolean> {
    const userId = await this.userIdForEmail(email);
    if (!userId) return false;
    const result = await prisma.category.deleteMany({ where: { id, userId } });
    return result.count === 1;
  }
}

export const categoryRepository = new CategoryRepository();
