import { todayRepository, type TodayRepository } from "./today.repository";
import type { TodayResponse } from "./today.types";

function currentDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export class TodayService {
  constructor(private readonly repository: TodayRepository) {}

  async get(email: string): Promise<TodayResponse> {
    const date = currentDateKey();
    const plans = await this.repository.listForUser(email, date);

    return {
      data: {
        date,
        plans,
        summary: {
          planCount: plans.length,
          plannedMinutes: plans.reduce(
            (total, commitment) =>
              total + (commitment.dailyCommitmentMinutes ?? 0),
            0,
          ),
        },
      },
    };
  }
}

export const todayService = new TodayService(todayRepository);
