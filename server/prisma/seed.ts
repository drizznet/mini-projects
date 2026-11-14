import "dotenv/config";
import argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  CommitmentPeriod,
  PrismaClient,
} from "../src/generated/prisma/client";
import { configureDatabaseUrl } from "../src/config/database";

if (
  (process.env.ENVIRONMENT ?? process.env.NODE_ENV)?.toLowerCase() ===
    "production" &&
  process.env.SEED_ALLOW_PRODUCTION !== "true"
) {
  throw new Error(
    "Refusing to seed production. Set SEED_ALLOW_PRODUCTION=true only if this is intentional.",
  );
}

const adapter = new PrismaPg({ connectionString: configureDatabaseUrl() });
const prisma = new PrismaClient({ adapter });

const email = (
  process.env.SEED_USER_EMAIL ??
  process.env.ADMIN_EMAIL ??
  "admin@drizznet.local"
).trim().toLowerCase();
const password = process.env.SEED_USER_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "drizznet";

const categories = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    name: "Work",
    description: "Professional and focused work commitments.",
    color: "chart-1",
    icon: "briefcase",
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    name: "Relationships",
    description: "Time and attention for important relationships.",
    color: "chart-2",
    icon: "heart",
  },
] as const;

const commitments = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Focused Work Sprint",
    description: "Work consistently for three days with four focused hours each day.",
    priority: "high",
    status: "ongoing",
    targetHours: 12,
    categoryId: "00000000-0000-4000-8000-000000000101",
    startDate: "2026-10-26",
    targetDate: "2026-10-28",
    commitmentPeriod: CommitmentPeriod.THREE_D,
    dailyCommitmentMinutes: 240,
    scheduledCheckInEnabled: true,
    scheduledCheckInTime: "09:00",
    strictCheckIn: false,
    workFocusMode: "flexible",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    title: "Talk to Babe",
    description: "Have a meaningful conversation with Babe every day for one week.",
    priority: "medium",
    status: "ongoing",
    targetHours: 3.5,
    categoryId: "00000000-0000-4000-8000-000000000102",
    startDate: "2026-10-26",
    targetDate: "2026-11-01",
    commitmentPeriod: CommitmentPeriod.ONE_W,
    dailyCommitmentMinutes: 30,
    scheduledCheckInEnabled: false,
    scheduledCheckInTime: null,
    strictCheckIn: false,
    workFocusMode: "flexible",
  },
] as const;

async function main() {
  const passwordHarsh = await argon2.hash(password, { type: argon2.argon2id });
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHarsh,
      profile: { create: { displayName: "Seed User" } },
    },
    select: { id: true, email: true },
  });

  for (const category of categories) {
    const { id, ...data } = category;
    await prisma.category.upsert({
      where: { id },
      update: { ...data, userId: user.id },
      create: { ...data, id, userId: user.id },
    });
  }

  for (const commitment of commitments) {
    const { id, ...data } = commitment;
    await prisma.commitment.upsert({
      where: { id },
      update: { ...data, userId: user.id },
      create: { ...data, id, userId: user.id },
    });
  }

  console.log(`Seeded ${commitments.length} commitments for ${user.email}`);
}

main()
  .catch((error) => {
    console.error("[db:seed] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
