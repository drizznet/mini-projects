UPDATE "lockedin_commitments"
SET "status" = 'ongoing'
WHERE "status" = 'active';

ALTER TABLE "lockedin_commitments"
    ALTER COLUMN "status" SET DEFAULT 'ongoing';
