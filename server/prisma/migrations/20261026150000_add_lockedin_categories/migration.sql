CREATE TABLE "lockedin_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT 'chart-1',
    "icon" TEXT NOT NULL DEFAULT 'circle',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "lockedin_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "lockedin_categories_userId_name_key"
    ON "lockedin_categories"("userId", "name");

CREATE INDEX "lockedin_categories_userId_created_at_idx"
    ON "lockedin_categories"("userId", "created_at" DESC);

ALTER TABLE "lockedin_categories"
    ADD CONSTRAINT "lockedin_categories_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "lockedin_commitments"
    ALTER COLUMN "categoryId" TYPE UUID
    USING CASE
      WHEN "categoryId" ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      THEN "categoryId"::uuid
      ELSE NULL
    END;

CREATE INDEX "lockedin_commitments_categoryId_idx"
    ON "lockedin_commitments"("categoryId");

ALTER TABLE "lockedin_commitments"
    ADD CONSTRAINT "lockedin_commitments_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "lockedin_categories"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
