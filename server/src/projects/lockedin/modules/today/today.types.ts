import type { Commitment } from "../commitments/commitment.types";

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
