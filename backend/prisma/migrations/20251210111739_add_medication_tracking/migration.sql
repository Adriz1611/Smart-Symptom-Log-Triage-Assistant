-- CreateEnum
CREATE TYPE "MedicationStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "MedicationLogStatus" AS ENUM ('PENDING', 'TAKEN', 'MISSED', 'SKIPPED');

-- CreateTable
CREATE TABLE "medications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "time_slots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "purpose" TEXT,
    "prescribed_by" TEXT,
    "side_effects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "reminder_enabled" BOOLEAN NOT NULL DEFAULT true,
    "status" "MedicationStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_logs" (
    "id" TEXT NOT NULL,
    "medication_id" TEXT NOT NULL,
    "scheduled_time" TIMESTAMP(3) NOT NULL,
    "taken_at" TIMESTAMP(3),
    "status" "MedicationLogStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "effectiveness" INTEGER,
    "side_effects_noted" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medication_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medications_user_id_status_idx" ON "medications"("user_id", "status");

-- CreateIndex
CREATE INDEX "medication_logs_medication_id_scheduled_time_idx" ON "medication_logs"("medication_id", "scheduled_time");

-- AddForeignKey
ALTER TABLE "medication_logs" ADD CONSTRAINT "medication_logs_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
