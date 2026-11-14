import type { Commitment } from "@/services/commitments/types";

export interface TodayResponse {
  data: {
    date: string;
    plans: Commitment[];
    summary: {
      planCount: number;
      plannedMinutes: number;
    };
  };
}
