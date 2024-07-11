-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('map', 'female', 'other');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('parent', 'child', 'admin');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "lastName" VARCHAR(20) NOT NULL,
    "email" VARCHAR(40) NOT NULL,
    "password" VARCHAR(20) NOT NULL,
    "gender" "Gender" NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
