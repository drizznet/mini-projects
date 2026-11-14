CREATE TABLE "lockedin_commitments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "categoryId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'active',
    "targetHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetDate" TEXT,
    "startDate" TEXT,
    "commitmentPeriod" TEXT,
    "dailyCommitmentMinutes" INTEGER,
    "scheduledCheckInEnabled" BOOLEAN NOT NULL DEFAULT false,
    "scheduledCheckInTime" TEXT,
    "strictCheckIn" BOOLEAN NOT NULL DEFAULT false,
    "workFocusMode" TEXT NOT NULL DEFAULT 'flexible',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "lockedin_commitments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "lockedin_commitments_userId_status_idx"
    ON "lockedin_commitments"("userId", "status");

CREATE INDEX "lockedin_commitments_userId_created_at_idx"
    ON "lockedin_commitments"("userId", "created_at" DESC);

ALTER TABLE "lockedin_commitments"
    ADD CONSTRAINT "lockedin_commitments_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
