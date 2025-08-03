-- CreateEnum
CREATE TYPE "PrimaryGoal" AS ENUM ('CALM_DOWN', 'PRODUCTIVITY', 'BETTER_SLEEP', 'STRESS_RELIEF', 'MINDFULNESS');

-- CreateEnum
CREATE TYPE "InteractionFrequency" AS ENUM ('DAILY', 'SOMETIMES', 'WEEKLY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "interactionFreq" "InteractionFrequency",
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "primaryGoal" "PrimaryGoal",
ADD COLUMN     "privacyConsent" BOOLEAN NOT NULL DEFAULT false;
