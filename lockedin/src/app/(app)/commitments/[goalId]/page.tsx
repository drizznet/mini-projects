import type { Metadata } from "next";

import { CommitmentDetailPage } from "@/components/commitments/commitment-detail-page";

export const metadata: Metadata = { title: "Plan" };

export default async function PlanRoute({
  params,
}: {
  params: Promise<{ goalId: string }>;
}) {
  const { goalId } = await params;
  return <CommitmentDetailPage goalId={goalId} />;
}
