import { apiFetch } from "@/services/api";

export type Commitment = {
  id: string;
  title: string;
  description?: string | null;
  status: "ongoing" | "paused" | "completed";
  priority: string;
  targetHours: number;
  dailyCommitmentMinutes?: number | null;
};

export type CommitmentListResponse = {
  data: Commitment[];
  meta: { total: number };
};

export function listCommitments() {
  return apiFetch<CommitmentListResponse>("/api/lockedin/commitments");
}
