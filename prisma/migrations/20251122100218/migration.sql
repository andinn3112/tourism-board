/*
  Warnings:

  - You are about to drop the column `location` on the `Destination` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "location",
ADD COLUMN     "address" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "coordinate" DROP NOT NULL;
