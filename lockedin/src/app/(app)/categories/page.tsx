import { redirect } from "next/navigation";

/** Legacy route — categories live under Settings now. */
export default function CategoriesPage() {
  redirect("/settings#categories");
}
