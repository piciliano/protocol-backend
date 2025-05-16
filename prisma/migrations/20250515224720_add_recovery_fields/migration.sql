-- AlterTable
ALTER TABLE "User" ADD COLUMN     "recoveryCodeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "recoveryCodeHash" TEXT;
