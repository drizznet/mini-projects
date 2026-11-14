export type DemoRecommendation = {
  id: string;
  itemName: string;
  goalTitle: string;
  categoryName: string;
  suggestedMinutes: number;
  reason: string;
};

export const DEMO_RECOMMENDATIONS: DemoRecommendation[] = [
  {
    id: "rec-1",
    itemName: "Ship API integration",
    goalTitle: "lockIn mobile sync",
    categoryName: "Product",
    suggestedMinutes: 45,
    reason: "1.2h left in today's budget for this item",
  },
  {
    id: "rec-2",
    itemName: "Review commitments UI",
    goalTitle: "Design polish",
    categoryName: "Product",
    suggestedMinutes: 30,
    reason: "High priority",
  },
];

export const DEMO_STATS = {
  focusedHours: 1.25,
  remainingHours: 2.5,
  activeCommitments: 3,
  interruptions: 1,
};
