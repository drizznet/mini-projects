import type { ExpenseClaim } from "./claim.types";

const seed: ExpenseClaim[] = [
  {
    id: "exp_1842",
    employee: "A. Okonkwo",
    amount: 420.5,
    currency: "USD",
    category: "Travel",
    status: "pending_approval",
    submittedAt: "2026-07-12T10:20:00.000Z",
    notes: "Client site visit",
  },
  {
    id: "exp_1843",
    employee: "J. Mensah",
    amount: 86.0,
    currency: "USD",
    category: "Meals",
    status: "approved",
    submittedAt: "2026-07-10T14:05:00.000Z",
  },
  {
    id: "exp_1844",
    employee: "S. Adeyemi",
    amount: 1250,
    currency: "USD",
    category: "Software",
    status: "pending_approval",
    submittedAt: "2026-07-18T09:00:00.000Z",
  },
];

/** In-memory store until a `claims` table exists. */
export class ClaimsStore {
  readonly items: ExpenseClaim[] = [...seed];
  private seq = 1845;

  nextId(): string {
    const id = `exp_${this.seq}`;
    this.seq += 1;
    return id;
  }
}

export const claimsStore = new ClaimsStore();
