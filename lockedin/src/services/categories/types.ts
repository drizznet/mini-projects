export type CategoryColor =
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5"
  | "chart-6";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  color: CategoryColor;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryBody {
  name: string;
  description?: string | null;
  color?: CategoryColor;
  icon?: string;
}

export type UpdateCategoryBody = Partial<CreateCategoryBody>;

export interface CategoryResponse {
  data: Category;
}

export interface CategoryListResponse {
  data: Category[];
  meta: { total: number };
}
