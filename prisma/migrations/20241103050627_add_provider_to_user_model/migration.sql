-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('Google', 'General');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "Provider" NOT NULL DEFAULT 'General';
