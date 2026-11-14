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
  /** @minLength 1 @maxLength 80 */
  name: string;
  /** @maxLength 500 */
  description?: string | null;
  color?: CategoryColor;
  /** Lucide icon key used by the frontend. */
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
