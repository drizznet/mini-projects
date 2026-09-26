import type { Metadata } from "next";

import { GoalDetailPage } from "@/components/goals/goal-detail-page";

export const metadata: Metadata = { title: "Goal" };

export default async function GoalRoute({
  params,
}: {
  params: Promise<{ goalId: string }>;
}) {
  const { goalId } = await params;
  return <GoalDetailPage goalId={goalId} />;
}
