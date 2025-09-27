-- AlterTable
ALTER TABLE "exercises" ADD COLUMN     "actualEndTime" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_planId_fkey" FOREIGN KEY ("planId") REFERENCES "continuity_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
