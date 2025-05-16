/*
  Warnings:

  - Added the required column `protocol` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "protocol" TEXT NOT NULL,
ALTER COLUMN "city" DROP DEFAULT,
ALTER COLUMN "state" DROP DEFAULT,
ALTER COLUMN "zipcode" DROP DEFAULT;
