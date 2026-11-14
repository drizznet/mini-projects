CREATE TYPE "CommitmentPeriod" AS ENUM ('3d', '1w', '1m');

ALTER TABLE "lockedin_commitments"
    ALTER COLUMN "commitmentPeriod" TYPE "CommitmentPeriod"
    USING "commitmentPeriod"::text::"CommitmentPeriod";
