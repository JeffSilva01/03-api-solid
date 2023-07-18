-- CreateEnum
CREATE TYPE "Rule" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Rule" NOT NULL DEFAULT 'MEMBER';
