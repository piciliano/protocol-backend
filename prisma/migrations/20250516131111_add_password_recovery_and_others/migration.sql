-- AlterTable
ALTER TABLE "PasswordRecovery" ADD COLUMN     "isValidated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "validatedAt" TIMESTAMP(3);
