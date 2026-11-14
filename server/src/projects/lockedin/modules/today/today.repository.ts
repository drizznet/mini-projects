import {
  CommitmentRepository,
} from "../commitments/commitment.repository";
import type { Commitment } from "../commitments/commitment.types";

export class TodayRepository {
  private readonly commitments = new CommitmentRepository();

  async listForUser(email: string, date: string): Promise<Commitment[]> {
    const commitments = await this.commitments.listForUser(email, {
      status: "ongoing",
    });

    return commitments.filter((commitment) => {
      const startsTodayOrEarlier =
        !commitment.startDate || commitment.startDate <= date;
      const endsTodayOrLater =
        !commitment.targetDate || commitment.targetDate >= date;
      return startsTodayOrEarlier && endsTodayOrLater;
    });
  }
}

export const todayRepository = new TodayRepository();
