-- AlterEnum
ALTER TYPE "ActionStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "test_exercises" ADD COLUMN     "actualDuration" DECIMAL(65,30),
ADD COLUMN     "actualEndTime" TIMESTAMP(3),
ADD COLUMN     "actualStartTime" TIMESTAMP(3),
ADD COLUMN     "executionLog" JSONB,
ADD COLUMN     "objectives" JSONB,
ADD COLUMN     "planId" TEXT,
ADD COLUMN     "reportUrl" TEXT,
ADD COLUMN     "result" "ExerciseResult",
ADD COLUMN     "scenario" JSONB;

-- AddForeignKey
ALTER TABLE "test_exercises" ADD CONSTRAINT "test_exercises_planId_fkey" FOREIGN KEY ("planId") REFERENCES "continuity_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
