-- AlterTable
ALTER TABLE "admin_users" ADD COLUMN "loginFailCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "admin_users" ADD COLUMN "loginLockedUntil" TIMESTAMP(3);
