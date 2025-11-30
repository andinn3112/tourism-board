/*
  Warnings:

  - You are about to drop the column `kategoriId` on the `Destinasi` table. All the data in the column will be lost.
  - Added the required column `kategoriSlug` to the `Destinasi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Destinasi" DROP CONSTRAINT "Destinasi_kategoriId_fkey";

-- AlterTable
ALTER TABLE "Destinasi" DROP COLUMN "kategoriId",
ADD COLUMN     "kategoriSlug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Destinasi" ADD CONSTRAINT "Destinasi_kategoriSlug_fkey" FOREIGN KEY ("kategoriSlug") REFERENCES "Kategori"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
