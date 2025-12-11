-- AlterTable
ALTER TABLE "triage_assessments" ADD COLUMN     "ai_insights" TEXT,
ADD COLUMN     "pattern_analysis" TEXT;

-- CreateTable
CREATE TABLE "health_insights" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "insight_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "related_symptoms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_insights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "health_insights_user_id_created_at_idx" ON "health_insights"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "health_insights_insight_type_idx" ON "health_insights"("insight_type");

-- AddForeignKey
ALTER TABLE "health_insights" ADD CONSTRAINT "health_insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
